export type LikertScore = 1 | 2 | 3 | 4 | 5;
export type Answers = Record<number, LikertScore>;
export type QuizMode = "complete" | "personality" | "learning";
export type ClassifyLevel = "high" | "moderate" | "low";

export interface QuizItem {
  id: number;
  text: string;
  domain: string;
  subscale: string;
  reverse: boolean;
}

export interface SubscaleScore {
  score: number;
  level: ClassifyLevel;
  items: number[];
}

export interface DimensionScore {
  name: string;
  score: number;
  facets: FacetScore[];
}

export interface FacetScore {
  name: string;
  score: number;
}

export interface SavedReport {
  id: string;
  name: string;
  date: string;
  results: TestResults;
}

export interface TestResults {
  dimensions?: DimensionScore[];
  studyProfile?: StudyProfile;
  learnerProfile?: LearnerProfile;
  quizMode?: QuizMode;
}

export interface LearnerProfile {
  grit: { perseverance: SubscaleScore; consistency: SubscaleScore; overall: SubscaleScore };
  focus: { concentration: SubscaleScore; procrastination: SubscaleScore };
  energy: { vitality: SubscaleScore; depletion: SubscaleScore; netEnergy: SubscaleScore };
  subjectFit: {
    maths: { passion: number; confidence: number; alignment: string };
    english: { passion: number; confidence: number; alignment: string };
    science: { passion: number; confidence: number; alignment: string };
  };
  teacherPreference: {
    structure: number; warmth: number; profile: string;
    carrot: number; stick: number; responseType: string;
  };
  examBarriers: {
    preparation: number; external: number; anxiety: number;
    timeManagement: number; primaryBarrier: string;
  };
}

export interface StudyProfile {
  studyApproaches: { deep: SubscaleScore; strategic: SubscaleScore; surface: SubscaleScore };
  motivation: {
    intrinsic: SubscaleScore; identified: SubscaleScore;
    external: SubscaleScore; amotivation: SubscaleScore; sdi: number;
  };
  selfRegulation: {
    selfEfficacy: SubscaleScore; planning: SubscaleScore;
    effortRegulation: SubscaleScore; testAnxiety: SubscaleScore;
    helpSeeking: SubscaleScore;
  };
  dominantApproach: "deep" | "strategic" | "surface";
  motivationProfile: "self-determined" | "moderate" | "controlled" | "amotivated";
  regulationStrength: ClassifyLevel;
}
