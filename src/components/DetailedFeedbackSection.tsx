import React, { useState } from "react";
import {
  Key,
  Cpu,
  Bookmark,
  BookOpen,
  LayoutTemplate,
  CheckCircle,
  FileText,
  AlertCircle,
  Zap,
  Tag,
  Dumbbell
} from "lucide-react";
import { ResumeAnalysisResult } from "../types";

interface DetailedFeedbackSectionProps {
  result: ResumeAnalysisResult;
}

type TabType =
  | "keywords"
  | "skills"
  | "experience"
  | "readability"
  | "formatting"
  | "grammar"
  | "actionVerbs"
  | "quantifiable";

export default function DetailedFeedbackSection({ result }: DetailedFeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("keywords");

  const {
    keywordMatching,
    skillIdentification,
    experienceRelevance,
    readabilityScore,
    formattingAndStructure,
    grammarAndSpelling,
    actionVerbUsage,
    quantifiableAchievements,
  } = result;

  const tabItems: { id: TabType; label: string; icon: React.ComponentType<any>; score: number }[] = [
    { id: "keywords", label: "Keyword Match", icon: Key, score: keywordMatching.score },
    { id: "skills", label: "Skill Inventory", icon: Cpu, score: skillIdentification.score },
    { id: "experience", label: "Role Relevance", icon: Bookmark, score: experienceRelevance.score },
    { id: "readability", label: "Readability", icon: BookOpen, score: readabilityScore.score },
    { id: "formatting", label: "Format & Structure", icon: LayoutTemplate, score: formattingAndStructure.score },
    { id: "grammar", label: "Grammar & Spelling", icon: AlertCircle, score: grammarAndSpelling.score },
    { id: "actionVerbs", label: "Action Verbs", icon: Zap, score: actionVerbUsage.score },
    { id: "quantifiable", label: "Metrics & Data", icon: Dumbbell, score: quantifiableAchievements.score },
  ];

  // Helper to get score badge colors
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-500";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-500";
    return "text-rose-700 bg-rose-50 border-rose-500";
  };

  return (
    <div className="bg-white border-2 border-slate-900 brutalist-shadow-lg overflow-hidden" id="detailed-feedback">
      {/* Scrollable Tab header */}
      <div className="border-b-2 border-slate-900 bg-slate-100 p-3 overflow-x-auto flex gap-2 scrollbar-thin">
        {tabItems.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeClass = getScoreBadgeColor(tab.score);
          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-2 border-slate-900 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-slate-950 brutalist-shadow"
                  : "bg-slate-105 border-slate-900 text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <IconComp className={`w-4 h-4 stroke-[2.5] ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 font-mono text-[10px] font-black border border-slate-900 bg-white ${badgeClass}`}>
                {tab.score}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6 md:p-8 min-h-[400px]">
        {/* KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div className="space-y-6 animate-fade-in" id="content-keywords">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <Key className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Keyword Matching Analysis.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Evaluates target vocabulary density against vacancy criteria or direct standard benchmarks.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(keywordMatching.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Keywords Index</span>
                <span className="text-lg font-black">{keywordMatching.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {keywordMatching.feedback}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Matched */}
              <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#10B981] font-black mb-4 flex items-center gap-1.5 border-b border-dashed border-slate-350 pb-2">
                    <span className="w-2.5 h-2.5 bg-[#10B981] border border-slate-900" />
                    FOUND KEYWORDS ({keywordMatching.matchedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {keywordMatching.matchedKeywords.map((tag, i) => (
                      <span key={i} className="text-[11px] font-mono font-bold px-2.5 py-1 border border-slate-900 bg-emerald-50 text-emerald-950 flex items-center gap-1">
                        ✓ {tag}
                      </span>
                    ))}
                    {keywordMatching.matchedKeywords.length === 0 && (
                      <span className="text-xs text-slate-400 italic font-mono">No matching industry keywords found in core sections.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing */}
              <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-rose-600 font-black mb-4 flex items-center gap-1.5 border-b border-dashed border-slate-350 pb-2">
                    <span className="w-2.5 h-2.5 bg-rose-500 border border-slate-900" />
                    MISSING KEYWORDS ({keywordMatching.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {keywordMatching.missingKeywords.map((tag, i) => (
                      <span key={i} className="text-[11px] font-mono font-bold px-2.5 py-1 border border-slate-900 bg-rose-50 text-rose-950 flex items-center gap-1">
                        + {tag}
                      </span>
                    ))}
                    {keywordMatching.missingKeywords.length === 0 && (
                      <span className="text-xs font-mono font-bold text-[#10B981]">Great! All critical target keywords were match-identified.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Standard benchmarks */}
            <div className="bg-[#F8F9FA] border-2 border-slate-900 p-5 mt-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-black mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                EXPECTED STANDARD VOCABULARY SETUP
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {keywordMatching.industryStandardKeywords.map((tag, i) => (
                  <span key={i} className="text-[11px] font-mono font-bold px-2 py-0.5 border border-slate-900 bg-white text-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-6 animate-fade-in" id="content-skills">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <Cpu className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Skill Inventory Audit.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Extracts core capabilities and sorts them into professional technical vs soft classifications.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(skillIdentification.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Inventory Index</span>
                <span className="text-lg font-black">{skillIdentification.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {skillIdentification.feedback}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Technical / Hard skills */}
              <div className="md:col-span-2 bg-white border-2 border-slate-900 p-5 brutalist-shadow space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-black flex items-center gap-1.5 border-b-2 border-slate-900 pb-2.5">
                  <Cpu className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
                  HARD SKILLS & CORE COMPETENCY CATEGORIZATION
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from(new Set(skillIdentification.technicalSkills.map(s => s.category))).map((cat, rootIdx) => (
                    <div key={rootIdx} className="space-y-2 border border-slate-350 p-3 bg-[#F8F9FA]">
                      <span className="text-[10px] font-black text-slate-900 uppercase font-mono block border-b border-slate-300 pb-1">
                        👉 {cat || "General Tools"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skillIdentification.technicalSkills
                          .filter(s => s.category === cat)
                          .map((skill, skIdx) => (
                            <span key={skIdx} className="text-xs font-mono font-black px-2 py-0.5 border border-slate-900 bg-white text-slate-900">
                              {skill.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                  {skillIdentification.technicalSkills.length === 0 && (
                    <p className="text-xs font-mono text-slate-400 italic">No categorical technical competencies parsed.</p>
                  )}
                </div>
              </div>

              {/* soft skills */}
              <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-black flex items-center gap-1.5 border-b-2 border-slate-900 pb-2.5">
                  <Bookmark className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
                  SOFT / BEHAVIORAL QUALITIES
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillIdentification.softSkills.map((soft, i) => (
                    <span key={i} className="text-xs font-mono font-black px-2.5 py-1 border border-slate-900 bg-indigo-50 text-indigo-950">
                      {soft}
                    </span>
                  ))}
                  {skillIdentification.softSkills.length === 0 && (
                    <p className="text-xs font-mono text-slate-400 italic">No behavioral qualities extracted cleanly.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div className="space-y-6 animate-fade-in" id="content-experience">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <Bookmark className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Experience Alignment Audit.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Correlates historic progression steps with professional industry expected responsibilities.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(experienceRelevance.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Experience Index</span>
                <span className="text-lg font-black">{experienceRelevance.score}/100</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 border-2 border-slate-900 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Target Role Alignment Level:</span>
              <span className={`px-2.5 py-1 border font-black text-[10px] ${
                experienceRelevance.jobAlignmentRating === "High"
                  ? "bg-emerald-500 text-slate-950 border-slate-950"
                  : experienceRelevance.jobAlignmentRating === "Medium"
                  ? "bg-amber-500 text-slate-950 border-slate-950"
                  : "bg-rose-500 text-white border-white"
              }`}>
                {experienceRelevance.jobAlignmentRating} Alignment
              </span>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {experienceRelevance.feedback}
            </p>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-extrabold pb-2 border-b-2 border-slate-900">
                POSITION-BY-POSITION DETAILED ALIGNMENT COMMENTS:
              </h4>

              <div className="divide-y-2 divide-slate-900 border-2 border-slate-900 bg-white brutalist-shadow">
                {experienceRelevance.roleByRoleFeedback.map((role, idx) => (
                  <div key={idx} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <span className="font-display font-black text-slate-950 text-base uppercase tracking-tight">{role.roleTitle}</span>
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 border border-slate-900 px-2.5 py-0.5 text-slate-900">{role.company}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-2.5 pl-3 border-l-4 border-slate-900">
                      {role.comments}
                    </p>
                  </div>
                ))}
                {experienceRelevance.roleByRoleFeedback.length === 0 && (
                  <p className="p-4 text-xs font-mono text-slate-400 italic">Could not extract distinct history items clearly.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* READABILITY TAB */}
        {activeTab === "readability" && (
          <div className="space-y-6 animate-fade-in" id="content-readability">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <BookOpen className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Language Readability Assessment.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Studies vocabulary density, passive vs active phrasing, and linguistic clarity trends.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(readabilityScore.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Readability Index</span>
                <span className="text-lg font-black">{readabilityScore.score}/100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-1 bg-white border-2 border-slate-900 p-5 brutalist-shadow text-center flex flex-col justify-center">
                <span className="text-[11px] font-mono tracking-widest text-slate-950 uppercase font-black">PARSED CLARITY LEVEL</span>
                <span className="text-3xl font-display font-black text-indigo-700 mt-2.5 uppercase">
                  {readabilityScore.clarity}
                </span>
                <p className="text-xs text-slate-600 mt-3 font-medium leading-relaxed">
                  Reflects formatting spacing, sentence length, and structured density that recruiters scan.
                </p>
              </div>

              <div className="md:col-span-2 bg-white border-2 border-slate-900 p-5 brutalist-shadow flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-black mb-3 pb-1 border-b border-slate-300">
                    Linguistic & Flow Review
                  </h4>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {readabilityScore.feedback}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FORMATTING & STRUCTURE TAB */}
        {activeTab === "formatting" && (
          <div className="space-y-6 animate-fade-in" id="content-formatting">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <LayoutTemplate className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Formatting & Design Structure Audit.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Checks overall resume alignment consistency, visual layout, and sectional design balance.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(formattingAndStructure.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Format Index</span>
                <span className="text-lg font-black">{formattingAndStructure.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {formattingAndStructure.feedback}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-extrabold pb-2 border-b-2 border-slate-900">
                LAYOUT ANOMALIES OR CONSISTENCY CRITIQUES DETECTED:
              </h4>
              <div className="space-y-3.5">
                {formattingAndStructure.issues.map((issue, i) => (
                  <div key={i} className="flex gap-3 items-center p-4 border-2 border-slate-900 bg-amber-50 text-xs font-medium text-slate-800 brutalist-shadow">
                    <span className="text-xs font-mono font-black text-slate-900 bg-amber-300 border border-slate-900 px-1.5 py-0.5 shrink-0">ANOMALY</span>
                    <span>{issue}</span>
                  </div>
                ))}
                {formattingAndStructure.issues.length === 0 && (
                  <div className="flex gap-3 items-center p-4 border-2 border-slate-900 bg-emerald-50 text-xs font-mono font-black uppercase tracking-wider text-emerald-950 brutalist-shadow">
                    ✔ No structural style inconsistencies parsed. Excellent layout parameters!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GRAMMAR & SPELLING TAB */}
        {activeTab === "grammar" && (
          <div className="space-y-6 animate-fade-in" id="content-grammar">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <AlertCircle className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Grammar, Spelling & Typo Patrol.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Guarantees clean output without confusing spacing mistakes or mechanical spelling errors.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(grammarAndSpelling.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Linguistic Index</span>
                <span className="text-lg font-black">{grammarAndSpelling.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {grammarAndSpelling.feedback}
            </p>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-extrabold pb-2 border-b-2 border-slate-900">
                ERRORS IDENTIFIED & ACTIONABLE FIXES:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {grammarAndSpelling.errorsFound.map((err, idx) => (
                  <div key={idx} className="border-2 border-slate-900 bg-white flex flex-col justify-between brutalist-shadow">
                    <div className="p-4 bg-slate-50 border-b-2 border-slate-900">
                      <span className="text-[10px] font-black font-mono text-red-600 uppercase tracking-wider">Original Mistake Text:</span>
                      <p className="text-xs line-through text-slate-500 italic mt-1 font-mono">
                        "{err.errorText}"
                      </p>
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-black font-mono text-emerald-700 uppercase tracking-wider">Corrected Formulation:</span>
                      <p className="text-xs font-mono font-black text-emerald-950 bg-emerald-50 p-2 border border-slate-900">
                        {err.suggestedCorrection}
                      </p>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">
                        {err.description}
                      </p>
                    </div>
                  </div>
                ))}
                {grammarAndSpelling.errorsFound.length === 0 && (
                  <div className="md:col-span-2 flex gap-3 items-center p-4 border-2 border-slate-900 bg-emerald-50 text-xs font-mono font-black uppercase tracking-wider text-emerald-950 brutalist-shadow">
                    ✔ No grammatical errors, typos, or awkward spellings were detected. Brilliant typing!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTION VERBS TAB */}
        {activeTab === "actionVerbs" && (
          <div className="space-y-6 animate-fade-in" id="content-verbs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <Zap className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Action Verb Audit.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Eliminate generic phrases (e.g. "Responsible for", "Helped with") and replace them with high-impact verbiage.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(actionVerbUsage.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Action Verb Index</span>
                <span className="text-lg font-black">{actionVerbUsage.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {actionVerbUsage.feedback}
            </p>

            <div className="space-y-5 pt-2">
              {/* well used */}
              <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-extrabold mb-4 pb-2 border-b-2 border-slate-900">
                  STRONG ACTIVE VERBS PRESENT
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {actionVerbUsage.wellUsedVerbs.map((verb, i) => (
                    <span key={i} className="text-xs font-mono font-black px-2.5 py-1 border border-slate-900 bg-emerald-50 text-emerald-950">
                      ✔ {verb}
                    </span>
                  ))}
                  {actionVerbUsage.wellUsedVerbs.length === 0 && (
                    <span className="text-xs font-mono text-slate-400 italic">No strong active verbs found. Most bullet points begin with weak helper-verbs.</span>
                  )}
                </div>
              </div>

              {/* suggested re-write */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-extrabold pb-2 border-b-2 border-slate-900">
                  RECOMMENDED WORDING REFACTOR BLUEPRINTS:
                </h4>

                <div className="space-y-4">
                  {actionVerbUsage.weakBulletPoints.map((item, idx) => (
                    <div key={idx} className="border-2 border-slate-900 bg-white grid grid-cols-1 md:grid-cols-2 brutalist-shadow">
                      <div className="p-4 bg-slate-50 border-b-2 md:border-b-0 md:border-r-2 border-slate-900">
                        <span className="text-[10px] font-black text-rose-600 uppercase font-mono block mb-1">WEAK WORDING:</span>
                        <p className="text-xs text-slate-700 italic">
                          "{item.originalText}"
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50/20">
                        <span className="text-[10px] font-black text-indigo-700 uppercase font-mono block mb-1">RECOMMENDED REWRITE (HIGH IMPACT):</span>
                        <p className="text-xs font-bold text-slate-950">
                          "{item.suggestedRewrite}"
                        </p>
                      </div>
                    </div>
                  ))}
                  {actionVerbUsage.weakBulletPoints.length === 0 && (
                    <div className="flex gap-3 items-center p-4 border-2 border-slate-900 bg-emerald-50 text-xs font-mono font-black uppercase tracking-wider text-emerald-950 brutalist-shadow">
                      ✔ Brilliant! All achievements begin with high-impact action verbs.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUANTIFIABLE TAB */}
        {activeTab === "quantifiable" && (
          <div className="space-y-6 animate-fade-in" id="content-quantify">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
                  <Dumbbell className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                  Metrics & Quantified Accomplishments Search.
                </h3>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Highlights soft qualitative claims and models specific metric-formulas to substantiate your statements.
                </p>
              </div>
              <div className={`px-4 py-2 border-2 border-slate-900 brutalist-shadow text-center font-mono self-start md:self-auto ${getScoreBadgeColor(quantifiableAchievements.score)}`}>
                <span className="text-[10px] block text-slate-900 uppercase font-black tracking-wider">Metrics Index</span>
                <span className="text-lg font-black">{quantifiableAchievements.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8F9FA] p-5 border-2 border-slate-900 brutalist-shadow">
              {quantifiableAchievements.feedback}
            </p>

            <div className="bg-slate-900 text-white p-4 border-2 border-slate-900 inline-flex items-center gap-3 text-xs uppercase font-mono font-bold brutalist-shadow">
              <span className="font-mono text-slate-950 font-black text-xs bg-amber-400 border border-slate-950 px-2 py-0.5">
                {quantifiableAchievements.strongPointCount} STATS
              </span>
              <span>Statements currently backed by quantitative metrics.</span>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-extrabold pb-2 border-b-2 border-slate-900">
                SOFT CLAIMS DETECTED & METRIC ENRICHMENT Blueprints:
              </h4>

              <div className="space-y-4.5">
                {quantifiableAchievements.weakPointsToQuantify.map((item, idx) => (
                  <div key={idx} className="border-2 border-slate-900 bg-white brutalist-shadow">
                    <div className="p-4 bg-[#F8F9FA] border-b-2 border-slate-900">
                      <span className="text-[10px] font-black text-slate-650 uppercase font-mono block">Unquantified Claim:</span>
                      <p className="text-xs text-slate-700 italic mt-1 font-mono">
                        "{item.originalText}"
                      </p>
                    </div>
                    <div className="p-4 bg-white">
                      <span className="text-[10px] font-black text-indigo-700 uppercase font-mono block mb-1">
                        How to enrich this with metrics:
                      </span>
                      <p className="text-xs text-slate-900 font-bold leading-relaxed">
                        {item.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
                {quantifiableAchievements.weakPointsToQuantify.length === 0 && (
                  <div className="flex gap-3 items-center p-4 border-2 border-slate-900 bg-emerald-50 text-xs font-mono font-black uppercase tracking-wider text-emerald-950 brutalist-shadow">
                    ✔ Incredible work! You have backed every single main accomplishment with numbers/rates.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
