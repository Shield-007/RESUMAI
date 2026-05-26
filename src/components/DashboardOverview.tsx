import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { ResumeAnalysisResult } from "../types";

interface DashboardOverviewProps {
  result: ResumeAnalysisResult;
}

export default function DashboardOverview({ result }: DashboardOverviewProps) {
  const { overallScore, summaryFeedback, highHighlights, topRecommendations } = result;

  // Determine score color classes
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const scoreTextColor = getScoreColorClass(overallScore);
  const scoreBar = getScoreBarColor(overallScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-overview">
      {/* Score and Executive Summary Card with Brutalist Outline and Shadow */}
      <div className="lg:col-span-1 bg-white border-2 border-slate-900 p-6 md:p-8 flex flex-col justify-between brutalist-shadow">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-900 font-black block border-b-2 border-slate-900 pb-2">
            OVERALL STRENGTH SCORE
          </span>
          <div className="mt-5 flex items-baseline gap-1">
            <span className={`text-7xl sm:text-8xl font-display font-black tracking-tighter ${scoreTextColor}`}>
              {overallScore}
            </span>
            <span className="text-slate-900 font-mono font-black text-xl">/100</span>
          </div>

          {/* Bar indicator as a thick technical gauge */}
          <div className="w-full border-2 border-slate-900 bg-slate-100 h-5 mt-4 overflow-hidden">
            <div className={`h-full ${scoreBar} border-r-2 border-slate-900`} style={{ width: `${overallScore}%` }} />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase">
            <span>Critical (0-59)</span>
            <span>Needs Work</span>
            <span>Optimal (80+)</span>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-slate-900 pt-6">
          <h4 className="text-xs font-mono font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-1.5 bg-slate-150 py-1.5 px-2 border border-slate-900 w-fit">
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            Executive Verdict
          </h4>
          <p className="text-sm font-medium text-slate-800 leading-relaxed font-sans mt-3">
            {summaryFeedback}
          </p>
        </div>
      </div>

      {/* High Highlights and Recommendations Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong points with bold layouts */}
        <div className="bg-white border-2 border-slate-900 p-6 flex flex-col h-full justify-between brutalist-shadow">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3 mb-4">
              <div className="w-8 h-8 border-2 border-slate-900 bg-emerald-100 flex items-center justify-center text-slate-950">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-display font-black text-slate-950 uppercase text-sm tracking-tight">
                Standouts & Strengths.
              </h3>
            </div>
            <p className="text-xs font-mono font-bold text-slate-400 mb-4 uppercase tracking-wide">
              Sections showing excellent execution in ATS copy:
            </p>
            <ul className="space-y-3">
              {highHighlights.map((hl, k) => (
                <li key={k} className="flex gap-2.5 items-start text-xs font-medium text-slate-800 leading-relaxed">
                  <span className="w-2 h-2 bg-emerald-500 border border-slate-900 mt-1 shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
              {highHighlights.length === 0 && (
                <li className="text-xs font-mono font-bold text-slate-400 italic">No significant standout features detected yet.</li>
              )}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-slate-900 text-xs font-mono text-slate-900 font-extrabold bg-emerald-50 border border-emerald-300 -mx-6 -mb-6 p-4">
            Keep reinforcing these as core differentiators.
          </div>
        </div>

        {/* Priority items to improve with bold styles */}
        <div className="bg-white border-2 border-slate-900 p-6 flex flex-col h-full justify-between brutalist-shadow">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3 mb-4">
              <div className="w-8 h-8 border-2 border-slate-900 bg-amber-100 flex items-center justify-center text-slate-950">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-display font-black text-slate-950 uppercase text-sm tracking-tight">
                Priority Fixes.
              </h3>
            </div>
            <p className="text-xs font-mono font-bold text-slate-400 mb-4 uppercase tracking-wide">
              Priority actions to raise ATS score:
            </p>
            <ul className="space-y-3">
              {topRecommendations.map((rec, k) => (
                <li key={k} className="flex gap-2.5 items-start text-xs font-medium text-slate-800 leading-relaxed">
                  <span className="w-2 h-2 bg-amber-500 border border-slate-900 mt-1 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
              {topRecommendations.length === 0 && (
                <li className="text-xs text-emerald-600 font-mono font-bold uppercase tracking-wider">
                  Fantastic! No urgent structural or wording fixes required.
                </li>
              )}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-slate-900 text-xs font-mono text-slate-900 font-extrabold bg-amber-50 border border-amber-300 -mx-6 -mb-6 p-4">
            Addressing these will raise score approx 10-15 pts.
          </div>
        </div>
      </div>
    </div>
  );
}

