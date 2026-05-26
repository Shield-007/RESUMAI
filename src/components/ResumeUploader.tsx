import React, { useState, useRef } from "react";
import { Upload, FileText, Sparkles, Clipboard, CheckCircle, RefreshCw } from "lucide-react";
import { SAMPLES } from "../data/samples";

interface ResumeUploaderProps {
  onAnalyze: (payload: {
    resumeText: string;
    fileData?: string;
    fileName?: string;
    mimeType?: string;
    jobDescription: string;
  }) => void;
  isLoading: boolean;
}

export default function ResumeUploader({ onAnalyze, isLoading }: ResumeUploaderProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load a sample
  const handleSelectSample = (sampleIndex: number) => {
    const sample = SAMPLES[sampleIndex];
    setResumeText(sample.resumeText);
    setJobDescription(sample.jobDescription);
    setFile(null);
    setFileBase64("");
    setActiveTab("paste");
    setFeedbackMsg(`Loaded sample resume: ${sample.name}`);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  // Convert uploaded file (expect PDF or TXT)
  const processFile = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".txt")) {
      alert("Please upload a PDF file or a plain .txt file. For DOCX, you can paste its text content directly.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    if (selectedFile.type === "application/pdf") {
      reader.onload = () => {
        const result = reader.result as string;
        // Strip out metadata scheme (data:application/pdf;base64,)
        const base64Content = result.split(",")[1];
        setFileBase64(base64Content);
        setResumeText(""); // Prefer sending PDF base64
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Text file
      reader.onload = () => {
        const text = reader.result as string;
        setResumeText(text);
        setFileBase64("");
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileBase64("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "paste" && !resumeText.trim()) {
      alert("Please paste your resume text content before submitting.");
      return;
    }
    if (activeTab === "upload" && !file) {
      alert("Please drag & drop or click to upload a PDF/TXT resume.");
      return;
    }

    onAnalyze({
      resumeText: activeTab === "paste" ? resumeText : "",
      fileData: activeTab === "upload" ? fileBase64 : undefined,
      fileName: file ? file.name : undefined,
      mimeType: file ? file.type : undefined,
      jobDescription,
    });
  };

  return (
    <div className="bg-white border-2 border-slate-900 brutalist-shadow-lg overflow-hidden" id="uploader-container">
      {/* Samples Selector bar */}
      <div className="bg-slate-50 border-b-2 border-slate-900 px-6 py-4">
        <h3 className="text-xs font-mono tracking-widest text-slate-900 uppercase font-black mb-3">
          ⚡ Try with a high-fidelity preset
        </h3>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              id={`sample-btn-${idx}`}
              type="button"
              onClick={() => handleSelectSample(idx)}
              className="text-[11px] font-black uppercase tracking-wider px-3.5 py-2 border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-50 hover:translate-y-[-1px] transition-all brutalist-shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {sample.name.split(" ")[0]} ({sample.role.split(" - ")[0]})
            </button>
          ))}
        </div>
        {feedbackMsg && (
          <p className="mt-3 text-xs font-mono font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in uppercase">
            <CheckCircle className="w-3.5 h-3.5" />
            {feedbackMsg}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Input Format Tabs */}
        <div>
          <div className="flex border-2 border-slate-900 mb-6 h-12 bg-slate-100">
            <button
              id="tab-paste"
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`flex-1 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "paste"
                  ? "bg-white text-slate-950 border-r-2 border-slate-900 h-full"
                  : "bg-slate-100 text-slate-500 hover:text-slate-800 border-r-2 border-slate-900 h-full"
              }`}
            >
              <Clipboard className="w-4 h-4 stroke-[2.5]" />
              Paste Raw Resume Content
            </button>
            <button
              id="tab-upload"
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex-1 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "upload"
                  ? "bg-white text-slate-950 h-full"
                  : "bg-slate-100 text-slate-500 hover:text-slate-800 h-full"
              }`}
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              Upload PDF or TXT
            </button>
          </div>

          {activeTab === "paste" ? (
            <div className="space-y-2">
              <label htmlFor="resume-textarea" className="block text-xs font-mono font-black uppercase tracking-wider text-slate-900">
                Resume Content <span className="text-slate-400 font-normal">(Paste full parsed details/history/skills)</span>
              </label>
              <textarea
                id="resume-textarea"
                rows={10}
                required={activeTab === "paste"}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full, raw text of your resume here..."
                className="w-full border-2 border-slate-900 p-4 text-sm font-mono placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none transition-all font-medium text-slate-900"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-xs font-mono font-black uppercase tracking-wider text-slate-900">
                Upload Resume File
              </label>
              <div
                id="dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-indigo-600 bg-indigo-50/50"
                    : file
                    ? "border-emerald-600 bg-emerald-50/10"
                    : "border-slate-900 hover:bg-slate-100 bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,text/plain"
                  className="hidden"
                />

                {!file ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-indigo-100 flex items-center justify-center mx-auto text-slate-900">
                      <Upload className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Drag and drop your resume file here
                      </p>
                      <p className="text-xs font-mono text-slate-500 mt-1 uppercase">
                        Supports PDF or TXT up to 10MB
                      </p>
                    </div>
                    <button
                      id="browse-btn"
                      type="button"
                      className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 transition-all pointer-events-none"
                    >
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-emerald-100 flex items-center justify-center mx-auto text-slate-900">
                      <FileText className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 truncate max-w-xs mx-auto">
                        {file.name}
                      </p>
                      <p className="text-xs font-mono text-slate-500 mt-1 uppercase">
                        {(file.size / 1024).toFixed(1)} KB • PDF Direct Feed
                      </p>
                    </div>
                    <button
                      id="remove-file-btn"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-red-900 bg-red-100 text-red-900 hover:bg-red-200 transition-all cursor-pointer"
                    >
                      Remove File
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Target Job Description Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="jd-textarea" className="block text-xs font-mono font-black uppercase tracking-wider text-slate-900">
              Target Job Description <span className="text-slate-400 font-normal font-sans tracking-tight leading-none lowercase">(Highly Recommended)</span>
            </label>
            {jobDescription && (
              <button
                id="clear-jd-btn"
                type="button"
                onClick={() => setJobDescription("")}
                className="text-xs text-red-600 hover:underline font-bold uppercase font-mono tracking-wider transition-colors"
              >
                [ Clear JD ]
              </button>
            )}
          </div>
          <textarea
            id="jd-textarea"
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description or requirements list here. The AI will cross-match skills, identify keyword gaps, and score experience depth relative to this role."
            className="w-full border-2 border-slate-900 p-4 text-sm font-sans placeholder:text-slate-405 bg-slate-50 focus:bg-white focus:outline-none transition-all font-medium text-slate-900"
          />
        </div>

        {/* Submit action */}
        <div className="pt-2">
          <button
            id="analyze-submit-btn"
            type="submit"
            disabled={isLoading || (activeTab === "paste" && !resumeText.trim()) || (activeTab === "upload" && !file)}
            className="w-full bg-slate-900 border-2 border-slate-900 hover:bg-indigo-600 hover:border-slate-900 text-white font-black py-4 px-6 transition-all brutalist-shadow uppercase tracking-widest text-xs flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white mr-1" />
                <span>AI is Conducting Advanced ATS Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5 text-indigo-200 group-hover:scale-110 transition-transform" />
                <span>Initiate Professional Resume Audit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
