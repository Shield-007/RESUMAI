// Custom interface definitions for the AI Resume Analyzer

export interface TechnicalSkill {
  name: string;
  category: string;
}

export interface KeywordMatching {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  industryStandardKeywords: string[];
  feedback: string;
}

export interface SkillIdentification {
  score: number;
  technicalSkills: TechnicalSkill[];
  softSkills: string[];
  feedback: string;
}

export interface RoleFeedback {
  roleTitle: string;
  company: string;
  comments: string;
}

export interface ExperienceRelevance {
  score: number;
  feedback: string;
  jobAlignmentRating: string; // High, Medium, Low, N/A
  roleByRoleFeedback: RoleFeedback[];
}

export interface ReadabilityScore {
  score: number;
  clarity: string; // Excellent, Good, Needs Improvement, etc.
  feedback: string;
}

export interface FormattingAndStructure {
  score: number;
  feedback: string;
  issues: string[];
}

export interface GrammarError {
  errorText: string;
  suggestedCorrection: string;
  description: string;
}

export interface GrammarAndSpelling {
  score: number;
  feedback: string;
  errorsFound: GrammarError[];
}

export interface ActionVerbBullet {
  originalText: string;
  suggestedRewrite: string;
}

export interface ActionVerbUsage {
  score: number;
  feedback: string;
  wellUsedVerbs: string[];
  weakBulletPoints: ActionVerbBullet[];
}

export interface WeakBulletPointQuantify {
  originalText: string;
  suggestion: string;
}

export interface QuantifiableAchievements {
  score: number;
  feedback: string;
  strongPointCount: number;
  weakPointsToQuantify: WeakBulletPointQuantify[];
}

export interface ResumeAnalysisResult {
  overallScore: number;
  summaryFeedback: string;
  highHighlights: string[];
  topRecommendations: string[];
  keywordMatching: KeywordMatching;
  skillIdentification: SkillIdentification;
  experienceRelevance: ExperienceRelevance;
  readabilityScore: ReadabilityScore;
  formattingAndStructure: FormattingAndStructure;
  grammarAndSpelling: GrammarAndSpelling;
  actionVerbUsage: ActionVerbUsage;
  quantifiableAchievements: QuantifiableAchievements;
}

export interface LearningDirective {
  id: string;
  timestamp: string;
  category: string;
  userFeedback: string;
  adjustmentRule: string;
}
