import React, { useState, useEffect, useRef } from "react";
import { Sparkles, FileText, CheckCircle, RefreshCw, AlertCircle, FileWarning, ArrowUpRight, Github, Code, ExternalLink } from "lucide-react";
import ResumeUploader from "./components/ResumeUploader";
import DashboardOverview from "./components/DashboardOverview";
import DetailedFeedbackSection from "./components/DetailedFeedbackSection";
import LearningPanel from "./components/LearningPanel";
import { ResumeAnalysisResult, LearningDirective } from "./types";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorObj, setErrorObj] = useState<{ message: string; details?: string } | null>(null);
  const [directives, setDirectives] = useState<LearningDirective[]>([]);

  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Fetch continuous learning directives on mount
  const fetchDirectives = async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        setDirectives(data);
      }
    } catch (e) {
      console.error("Failed to load learning directives:", e);
    }
  };

  useEffect(() => {
    fetchDirectives();
  }, []);

  // Trigger main analysis endpoint
  const handleAnalyzeResume = async (payload: {
    resumeText: string;
    fileData?: string;
    fileName?: string;
    mimeType?: string;
    jobDescription: string;
  }) => {
    setIsLoading(true);
    setResult(null);
    setErrorObj(null);

    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Resume analysis request failed");
      }

      setResult(data);

      // Smooth scroll to results once completed
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);

    } catch (err: any) {
      console.error(err);
      setErrorObj({
        message: err.message || "Failed to communicate with AI server",
        details: err.details || "Check server log logs or ensure GEMINI_API_KEY environment variable is declared in secrets."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" id="app-root">
      {/* Top Professional Header */}
      <header className="border-b-2 border-slate-900 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-2xl tracking-tighter text-slate-900 uppercase">
              ResumAI<span className="text-indigo-600">.</span>
            </span>
            <span className="bg-slate-900 text-white text-[9px] font-mono font-black tracking-widest uppercase px-2 py-1">
              PRO ATS AUDITOR
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-slate-900 hover:text-indigo-600 font-mono tracking-tight transition-colors flex items-center gap-1 uppercase"
            >
              Google AI Studio
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-16">
        {/* Core Hero section with extreme bold print typography */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex bg-white px-3 py-1 border-2 border-slate-900 text-[10px] uppercase font-mono font-black text-slate-900 brutalist-shadow">
            ⚡ Powered by Gemini 3.5 Flash & Dynamic Learning
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tighter text-slate-950 uppercase leading-none">
            HIREABLE<br className="hidden sm:inline" /> BY DESIGN.
          </h2>
          <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xl mx-auto">
            A comprehensive, rigorous ATS simulation evaluation. We scan keyword match indices, extract skill categories, audit verb weights, and identify metric-quantified benchmarks.
          </p>
        </div>

        {/* Input section */}
        <div className="max-w-4xl mx-auto">
          <ResumeUploader onAnalyze={handleAnalyzeResume} isLoading={isLoading} />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 animate-spin">
              <RefreshCw className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-800 text-lg">
                Conducting High-Precision ATS Grading...
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Gemini is categorizing competencies, looking for action verbs, grading readability, and cross-matching your resume metrics. This will take about 5-8 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Error messaging block */}
        {errorObj && (
          <div className="max-w-4xl mx-auto bg-rose-50/50 border border-rose-150 rounded-2xl p-6 md:p-8 space-y-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-1">
              <FileWarning className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-bold text-slate-800 font-display">
                Resume Audit Interrupted
              </h3>
              <p className="text-sm text-slate-700 font-medium">
                {errorObj.message}
              </p>
              {errorObj.details && (
                <div className="p-3 bg-white border border-rose-100 rounded-lg text-xs font-mono text-slate-500 max-w-2xl leading-relaxed">
                  {errorObj.details}
                </div>
              )}
              {errorObj.message.includes("Gemini API Key") && (
                <div className="pt-2">
                  <p className="text-xs text-slate-500">
                    💡 <strong>Where is my API Key?</strong> In Google AI Studio, open the <strong>Settings &gt; Secrets</strong> menu on the top right to declare / manage your credentials, then simply re-trigger the resume analysis!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audit Results section */}
        {result && (
          <div ref={resultsSectionRef} className="space-y-10 pt-6 border-t-2 border-slate-900 animate-fade-in" id="audit-results">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tighter text-slate-950 uppercase leading-none">
                  Feedback Report.
                </h2>
                <p className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase mt-2">
                  Actionable insights based on modern professional recruitment guidelines
                </p>
              </div>
              <button
                id="reset-audit-btn"
                onClick={() => {
                  setResult(null);
                  setErrorObj(null);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="text-xs font-black px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-50 border-2 border-slate-900 brutalist-shadow-interactive transition-all cursor-pointer self-start sm:self-auto uppercase tracking-wider"
              >
                Reset Audit
              </button>
            </div>

            {/* Dashboard counters */}
            <DashboardOverview result={result} />

            {/* Tabular feedback report */}
            <DetailedFeedbackSection result={result} />
          </div>
        )}

        {/* Continuous learning panel */}
        <div className="pt-10 border-t border-slate-150">
          <div className="max-w-4xl mx-auto">
            <LearningPanel directives={directives} onRefresh={fetchDirectives} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-16 font-mono text-[10px] text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>© 2026 AI Resume Analyzer • Structured Applicant Tracking Assessment.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Enterprise recruitment standards calibration active.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
