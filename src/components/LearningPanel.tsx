import React, { useState, useEffect } from "react";
import { Sliders, Plus, Trash2, HelpCircle, Check, Play } from "lucide-react";
import { LearningDirective } from "../types";

interface LearningPanelProps {
  directives: LearningDirective[];
  onRefresh: () => void;
}

export default function LearningPanel({ directives, onRefresh }: LearningPanelProps) {
  const [category, setCategory] = useState<string>("Keyword Matching");
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [adjustmentRule, setAdjustmentRule] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const categories = [
    "Keyword Matching",
    "Skill Identification",
    "Experience Relevance",
    "Readability & Copy",
    "Formatting & Layout",
    "Grammar & Typos",
    "Action Verbs",
    "Metrics & Quantifying",
    "General Strategy"
  ];

  // Helper template rules based on category choice to make it easy for users to write rules
  useEffect(() => {
    if (category === "Keyword Matching") {
      setAdjustmentRule("Ensure that modern container technologies like Docker and Kubernetes are marked as high priority missing keywords in modern frontend roles, even if the JD omits them.");
    } else if (category === "Skill Identification") {
      setAdjustmentRule("Always evaluate 'React' and 'TypeScript' as high priority technical skills to extract, never confuse them with Soft skills.");
    } else if (category === "Action Verbs") {
      setAdjustmentRule("Deem any bullet starting with 'Responsible for', 'Worked on', or 'Helped' as critical flaws, flagging them as weak verb usage immediately.");
    } else if (category === "Metrics & Quantifying") {
      setAdjustmentRule("Be extremely stringent with quantifiable metrics for sales and marketing roles. Grade them harder if they lack conversion figures.");
    } else {
      setAdjustmentRule("");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFeedback.trim() || !adjustmentRule.trim()) {
      alert("Please fill in both the user problem and the precise AI instruction tweak.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, userFeedback, adjustmentRule }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserFeedback("");
        setFeedbackMsg("Saved direction! The AI model has learned this adjustment and will apply it.");
        onRefresh();
        setTimeout(() => setFeedbackMsg(""), 4000);
      } else {
        alert(data.error || "Failed to submit continuous learning directive");
      }
    } catch (e) {
      alert("Error sending feedback: " + String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this AI adjustment rule?")) return;
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to delete directive");
      }
    } catch (e) {
      alert("Error deleting: " + String(e));
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden" id="learning-panel">
      <div className="border-b border-slate-100 p-6 md:p-8 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-800 text-base">
              Continuous Model Learning & Tuning
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Teach and fine-tune the AI's grading rules dynamically as hiring standards evolve or you identify grading errors.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form to submit direction */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Integrate Tuning Directive
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-xl border border-slate-150 bg-slate-25/20">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase font-mono mb-1.5">
                Evaluation Metric Category
              </label>
              <select
                id="learning-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase font-mono mb-1.5 flex items-center gap-1">
                User Feedback or Correction Observation
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" title="State what was evaluated incorrectly or how expectations changed." />
              </label>
              <textarea
                id="learning-user-feedback"
                rows={2}
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                placeholder="Example: 'The model evaluated JavaScript as a soft skill in softSkills, which is a programming language.'"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase font-mono mb-1.5">
                Dynamic Instruction Modification to Teach AI
              </label>
              <textarea
                id="learning-adjustment-rule"
                rows={3}
                value={adjustmentRule}
                onChange={(e) => setAdjustmentRule(e.target.value)}
                placeholder="Example: 'For the skills identification aspect, if you find JavaScript always move it strictly into technicalSkills under Web/Frontend category. Never place programming languages in softSkills.'"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-sans line-clamp-3 bg-white"
              />
            </div>

            <button
              id="submit-tuning-btn"
              type="submit"
              disabled={isSubmitting || !userFeedback.trim()}
              className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "Memorizing..." : "Inject Learning Directive"}</span>
            </button>

            {feedbackMsg && (
              <p className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-center animate-fade-in">
                {feedbackMsg}
              </p>
            )}
          </form>
        </div>

        {/* List of current directions */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            Active Continuous Learning Directives ({directives.length})
          </h4>

          <div className="space-y-3.5 select-none max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {directives.map((dir) => (
              <div key={dir.id} className="p-4 rounded-xl border border-slate-150 bg-white hover:border-slate-250 transition-all flex justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-mono text-indigo-700 font-bold">
                      {dir.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(dir.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 italic truncate" title={dir.userFeedback}>
                    "Ref: {dir.userFeedback}"
                  </div>
                  <div className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-indigo-600 block uppercase font-mono mb-1">Applied Rule Modification:</span>
                    {dir.adjustmentRule}
                  </div>
                </div>

                <button
                  id={`delete-directive-${dir.id}`}
                  onClick={() => handleDelete(dir.id)}
                  type="button"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                  title="Remove instruction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {directives.length === 0 && (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-25/50 space-y-2">
                <p className="text-xs text-slate-500">
                  No custom calibration directions configured yet.
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Use the tuning form on the left to calibrate expectations (e.g. adjust criteria, classify languages explicitly, enforce score stringent levels).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
