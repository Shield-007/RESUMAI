import express from "express";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const FEEDBACK_FILE = path.join(process.cwd(), "feedback.json");

// Helper to read feedback / learning directives
async function readFeedback(): Promise<any[]> {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to save feedback / learning directives
async function writeFeedback(feedbackList: any[]): Promise<void> {
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackList, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set high limits for base64 file uploads (PDF resumes)
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Ensure feedback file exists on start
  try {
    const data = await readFeedback();
    if (data.length === 0) {
      await writeFeedback([]);
    }
  } catch (e) {
    await writeFeedback([]);
  }

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // GET current learning directives
  app.get("/api/feedback", async (req, res) => {
    try {
      const data = await readFeedback();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to read learning data", details: e.message });
    }
  });

  // POST a new learning directive / adjustment
  app.post("/api/feedback", async (req, res) => {
    try {
      const { category, userFeedback, adjustmentRule } = req.body;
      if (!category || !userFeedback || !adjustmentRule) {
        res.status(400).json({ error: "Missing required feedback details (category, userFeedback, adjustmentRule)" });
        return;
      }

      const currentList = await readFeedback();
      const newItem = {
        id: "f_" + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        category,
        userFeedback,
        adjustmentRule,
      };
      currentList.push(newItem);
      await writeFeedback(currentList);

      res.json({ success: true, item: newItem });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to save learning directive", details: e.message });
    }
  });

  // API endpoint to delete feedback / reset continuous learning
  app.delete("/api/feedback/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let list = await readFeedback();
      list = list.filter((item) => item.id !== id);
      await writeFeedback(list);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to delete learning directive", details: e.message });
    }
  });

  // POST analyze resume
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        res.status(400).json({
          error: "Missing Gemini API Key",
          details: "Please configure your GEMINI_API_KEY inside the 'Settings > Secrets' panel in Google AI Studio."
        });
        return;
      }

      const { resumeText, fileData, mimeType, jobDescription } = req.body;

      if (!resumeText && !fileData) {
        res.status(400).json({ error: "Please provide either the resume raw text or upload a PDF file." });
        return;
      }

      // Load continuous learning rules to append to evaluation system/prompt.
      const feedbackList = await readFeedback();
      let learningGuidelines = "";
      if (feedbackList.length > 0) {
        learningGuidelines = "\n\n--- DYNAMIC AI CONTINUOUS LEARNING & ADJUSTMENT DIRECTIVES ---\n" +
          "Apply the following evaluations tweaks requested through user feedback & recruiting trends adjustments:\n" +
          feedbackList.map((f, idx) => `Adjustment ${idx + 1} (${f.category}): "${f.adjustmentRule}" (User feedback source: "${f.userFeedback}")`).join("\n") +
          "\n---------------------------------------------------------";
      }

      // Initialize @google/genai
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Content payload structure
      const contents: any[] = [];

      // Prompt instructions detailing the grading guidelines
      const promptText = `
You are an expert ATS (Applicant Tracking System), recruiter, and copywriter.
Analyze the provided resume against modern professional recruitment trends and best practices.

Job Description Context:
${jobDescription ? "The user provided a target job description: " + jobDescription : "No specific target job description was provided. Evaluate the resume against general professional guidelines and expected modern standards based on the resume content's implied industry."}

${learningGuidelines}

Conduct a comprehensive review covering all these elements and output the result in the exact JSON schema defined.

Required Assessments:
1. Overall Score: Composite rating out of 100 based on modern resume practices, clarity, skills match, strength of description.
2. Keyword Matching: Match the skills and keywords in the resume against standard industry keywords (or the job description if provided).
3. Skill Identification: Categorize technical and soft skills clearly.
4. Experience Relevance: Gauge work history alignment with target or implied roles. Provide specific role-by-role evaluations.
5. Readability Score: Cleanliness of wording, readability, density, and formatting.
6. Formatting & Structure: Layout recommendations, font/section structure reviews, consistency checks.
7. Grammar & Spelling: Spot typos or awkward structure phrasing and offer fixes.
8. Action Verb Usage: Audit strong verbs, detect weak/passive verbs, suggest stronger alternatives.
9. Quantifiable Achievements: Identify weak statements that lack data/KPI, and suggest dynamic metric-oriented revisions.

Generate helpful, insightful, professional constructive feedback with clear actionable items. Maintain a positive, empowering recruitment expert tone. Ensure correct formatting.
`;

      contents.push({ text: promptText });

      if (fileData && mimeType === "application/pdf") {
        // Pass the raw base64 PDF directly to Gemini
        contents.push({
          inlineData: {
            mimeType: "application/pdf",
            data: fileData,
          }
        });
      } else if (resumeText) {
        // Pass copy-pasted or text-extracted string
        contents.push({ text: `--- START OF RESUME TEXT CONTENT ---\n${resumeText}\n--- END OF RESUME TEXT CONTENT ---` });
      } else {
        res.status(400).json({ error: "Unsupported raw file format. Please paste resume text, or upload a PDF file." });
        return;
      }

      // Call Gemini 3.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are a professional ATS grader, expert recruiter, and resume proofreader. You must respond ONLY with a single JSON structure matching the requested schema. Ensure all fields are filled, never output markdown wrapper tags other than raw JSON response.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "overallScore",
              "summaryFeedback",
              "highHighlights",
              "topRecommendations",
              "keywordMatching",
              "skillIdentification",
              "experienceRelevance",
              "readabilityScore",
              "formattingAndStructure",
              "grammarAndSpelling",
              "actionVerbUsage",
              "quantifiableAchievements"
            ],
            properties: {
              overallScore: {
                type: Type.INTEGER,
                description: "A composite rating for the entire resume between 0 and 100."
              },
              summaryFeedback: {
                type: Type.STRING,
                description: "High-level summary of the analysis findings and professional resume assessment."
              },
              highHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-4 strong points or standouts discovered in this resume."
              },
              topRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of top, high-priority improvements the user should tackle first."
              },
              keywordMatching: {
                type: Type.OBJECT,
                required: ["score", "matchedKeywords", "missingKeywords", "industryStandardKeywords", "feedback"],
                properties: {
                  score: { type: Type.INTEGER },
                  matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Import keywords from the job description or standard terms that are missing in the resume."
                  },
                  industryStandardKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "General keywords expected for the resume implied sector/role."
                  },
                  feedback: { type: Type.STRING }
                }
              },
              skillIdentification: {
                type: Type.OBJECT,
                required: ["score", "technicalSkills", "softSkills", "feedback"],
                properties: {
                  score: { type: Type.INTEGER },
                  technicalSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["name", "category"],
                      properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING, description: "Category like Programming, Frontend, DevOps, Accounting, Sales Tools, etc." }
                      }
                    }
                  },
                  softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  feedback: { type: Type.STRING }
                }
              },
              experienceRelevance: {
                type: Type.OBJECT,
                required: ["score", "feedback", "jobAlignmentRating", "roleByRoleFeedback"],
                properties: {
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  jobAlignmentRating: { type: Type.STRING, description: "High, Medium, Low, or N/A (if no job description supplied)." },
                  roleByRoleFeedback: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["roleTitle", "company", "comments"],
                      properties: {
                        roleTitle: { type: Type.STRING },
                        company: { type: Type.STRING },
                        comments: { type: Type.STRING, description: "Brief notes on how well this role lists achievements aligning with industry or Job Description." }
                      }
                    }
                  }
                }
              },
              readabilityScore: {
                type: Type.OBJECT,
                required: ["score", "clarity", "feedback"],
                properties: {
                  score: { type: Type.INTEGER },
                  clarity: { type: Type.STRING, description: "Excellent, Good, Solid, or Needs Improvement." },
                  feedback: { type: Type.STRING }
                }
              },
              formattingAndStructure: {
                type: Type.OBJECT,
                required: ["score", "feedback", "issues"],
                properties: {
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  issues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific consistency, layout, font, length, or structural critique items." }
                }
              },
              grammarAndSpelling: {
                type: Type.OBJECT,
                required: ["score", "feedback", "errorsFound"],
                properties: {
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  errorsFound: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["errorText", "suggestedCorrection", "description"],
                      properties: {
                        errorText: { type: Type.STRING },
                        suggestedCorrection: { type: Type.STRING },
                        description: { type: Type.STRING, description: "Explanation of why this correction should be applied." }
                      }
                    }
                  }
                }
              },
              actionVerbUsage: {
                type: Type.OBJECT,
                required: ["score", "feedback", "wellUsedVerbs", "weakBulletPoints"],
                properties: {
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  wellUsedVerbs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weakBulletPoints: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["originalText", "suggestedRewrite"],
                      properties: {
                        originalText: { type: Type.STRING, description: "The bullet point or line showing passive/weak action verbs." },
                        suggestedRewrite: { type: Type.STRING, description: "Rewritten line introducing dynamic and active verbs." }
                      }
                    }
                  }
                }
              },
              quantifiableAchievements: {
                type: Type.OBJECT,
                required: ["score", "feedback", "strongPointCount", "weakPointsToQuantify"],
                properties: {
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  strongPointCount: { type: Type.INTEGER, description: "Number of successfully quantified metrics/KPIs found." },
                  weakPointsToQuantify: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["originalText", "suggestion"],
                      properties: {
                        originalText: { type: Type.STRING, description: "The line mentioning an accomplishment without data/metrics." },
                        suggestion: { type: Type.STRING, description: "Example model of what metrics or data they could inject (e.g. 'By what % did conversion grow? Mention size of team managed.')" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const parsedResponseObj = JSON.parse(response.text || "{}");
      res.json(parsedResponseObj);

    } catch (e: any) {
      console.error("Gemini Generation Error:", e);
      res.status(500).json({ error: "AI Resume Analysis Failed", details: e.message || String(e) });
    }
  });

  // Vite middleware development setup or PRODUCTION build server static serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully booted on port ${PORT}`);
  });
}

startServer();
