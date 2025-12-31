
export enum Role {
  Student = 'student',
  Professional = 'professional',
  Other = 'other',
}

export enum Goal {
  CareerClarity = 'career clarity',
  LearningFocus = 'learning focus',
  DecisionConfidence = 'decision confidence',
}

export enum TimeHorizon {
  Short = 'short-term (<1 year)',
  Medium = 'medium-term (1-3 years)',
  Long = 'long-term (3+ years)',
}

export interface UserSession {
  sessionId: string;
  name: string;
  role: Role;
  goal: Goal;
  timeHorizon: TimeHorizon;
}

export interface DecisionStructure {
  objective: string;
  constraints: string[];
  variables: string[];
  successCriteria: string[];
}

export enum AssumptionReliability {
  Strong = 'Strong',
  Medium = 'Medium',
  Weak = 'Weak',
}

export interface Assumption {
  assumption: string;
  reliability: AssumptionReliability;
  isRisky: boolean;
}

export interface Scenario {
  title: 'Best Case' | 'Base Case' | 'Failure Case';
  outcome: string;
  timeImpact: string;
  effortCost: string;
  recoveryStrategy: string;
}

export interface Recommendation {
  primaryRecommendation: string;
  confidenceScore: number;
  confidenceReasoning: string;
  changeFactors: string[];
  reevaluationTimeline: string;
}

export interface DecisionAnalysis {
  decision: string;
  structure: DecisionStructure | null;
  assumptions: Assumption[] | null;
  scenarios: Scenario[] | null;
  recommendation: Recommendation | null;
}
