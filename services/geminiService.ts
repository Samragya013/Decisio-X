
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { UserSession, DecisionStructure, Assumption, Scenario, Recommendation, AssumptionReliability } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for environments where the key is not set.
  // In the target environment, this variable is expected to be present.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
  process.env.API_KEY = "YOUR_API_KEY"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-3-flash-preview';

const generate = async (prompt: string, responseSchema: any): Promise<any> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.5,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI. Please try again.");
  }
};


export const generateDecisionStructure = async (decision: string, user: UserSession): Promise<DecisionStructure> => {
  const prompt = `
    Based on the following user context and decision, structure the decision-making process.
    User Context:
    - Role: ${user.role}
    - Primary Goal: ${user.goal}
    - Time Horizon: ${user.timeHorizon}

    Decision: "${decision}"

    Structure this decision by defining a clear objective, identifying key constraints (what must be avoided or preserved), listing the main variables (factors that can be changed or chosen), and establishing success criteria (how to measure a successful outcome). Be concise and analytical.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      objective: { type: Type.STRING, description: "A single, clear sentence defining the primary goal of the decision." },
      constraints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of limitations or boundaries." },
      variables: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key factors or choices to be made." },
      successCriteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of measurable outcomes for success." },
    },
    required: ["objective", "constraints", "variables", "successCriteria"],
  };

  return generate(prompt, schema);
};

export const generateAssumptions = async (decisionStructure: DecisionStructure, user: UserSession): Promise<Assumption[]> => {
    const prompt = `
    Given the following decision structure and user context, identify the key implicit assumptions being made.
    User Context:
    - Role: ${user.role}
    - Goal: ${user.goal}
    - Time Horizon: ${user.timeHorizon}

    Decision Structure:
    - Objective: ${decisionStructure.objective}
    - Constraints: ${decisionStructure.constraints.join(', ')}
    - Variables: ${decisionStructure.variables.join(', ')}
    - Success Criteria: ${decisionStructure.successCriteria.join(', ')}

    For each assumption, rate its reliability as 'Strong', 'Medium', or 'Weak'. An assumption is weak if it is unproven, highly uncertain, or dependent on many external factors. Also, identify if the assumption is risky (isRisky: true) meaning the entire decision fails if this assumption is wrong.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        assumption: { type: Type.STRING, description: "The implicit assumption being made." },
        reliability: { type: Type.STRING, enum: [AssumptionReliability.Strong, AssumptionReliability.Medium, AssumptionReliability.Weak], description: "The reliability of the assumption." },
        isRisky: { type: Type.BOOLEAN, description: "True if the decision's success hinges critically on this assumption." },
      },
      required: ["assumption", "reliability", "isRisky"],
    },
  };

  return generate(prompt, schema);
};


export const generateScenarios = async (decisionStructure: DecisionStructure, assumptions: Assumption[], user: UserSession): Promise<Scenario[]> => {
  const prompt = `
    Based on the decision structure and identified assumptions, simulate three scenarios: Best Case, Base Case, and Failure Case.
    User Context:
    - Role: ${user.role}
    - Goal: ${user.goal}

    Decision Structure:
    - Objective: ${decisionStructure.objective}

    Key Assumptions (especially risky/weak ones):
    ${assumptions.map(a => `- ${a.assumption} (Reliability: ${a.reliability}, Risky: ${a.isRisky})`).join('\n')}

    For each case (Best, Base, Failure), provide a concise description of the outcome, the time impact, the effort/opportunity cost, and a potential recovery strategy for the failure case.
  `;

  const scenarioSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, enum: ['Best Case', 'Base Case', 'Failure Case'] },
      outcome: { type: Type.STRING, description: "A concise description of the final outcome in this scenario." },
      timeImpact: { type: Type.STRING, description: "The likely impact on the timeline." },
      effortCost: { type: Type.STRING, description: "The effort or opportunity cost involved." },
      recoveryStrategy: { type: Type.STRING, description: "A brief recovery strategy (most relevant for Failure Case, can be 'N/A' for others)." },
    },
    required: ["title", "outcome", "timeImpact", "effortCost", "recoveryStrategy"],
  };

  const schema = {
      type: Type.ARRAY,
      items: scenarioSchema,
  };

  return generate(prompt, schema);
};


export const generateRecommendation = async (structure: DecisionStructure, assumptions: Assumption[], scenarios: Scenario[], user: UserSession): Promise<Recommendation> => {
  const prompt = `
    Synthesize all the provided information to generate a final recommendation for the user. Be analytical, calm, and practical.
    User Context:
    - Name: ${user.name}
    - Role: ${user.role}
    - Goal: ${user.goal}
    - Time Horizon: ${user.timeHorizon}

    Decision Structure:
    - Objective: ${structure.objective}

    Key Assumptions:
    ${assumptions.filter(a => a.isRisky || a.reliability === AssumptionReliability.Weak).map(a => `- ${a.assumption} (Reliability: ${a.reliability})`).join('\n')}

    Simulated Scenarios:
    - Best Case: ${scenarios.find(s => s.title === 'Best Case')?.outcome}
    - Base Case: ${scenarios.find(s => s.title === 'Base Case')?.outcome}
    - Failure Case: ${scenarios.find(s => s.title === 'Failure Case')?.outcome}

    Based on this analysis, provide:
    1. A primary, actionable recommendation.
    2. A confidence score (0-100) for this recommendation.
    3. A brief explanation for the confidence score, referencing key assumptions or scenarios.
    4. A list of key factors that could change this recommendation.
    5. A suggested timeline for when to re-evaluate this decision.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      primaryRecommendation: { type: Type.STRING, description: "The main, actionable advice." },
      confidenceScore: { type: Type.INTEGER, description: "A confidence score from 0 to 100." },
      confidenceReasoning: { type: Type.STRING, description: "Why this level of confidence exists." },
      changeFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What could change the decision." },
      reevaluationTimeline: { type: Type.STRING, description: "When to reconsider this decision." },
    },
    required: ["primaryRecommendation", "confidenceScore", "confidenceReasoning", "changeFactors", "reevaluationTimeline"],
  };

  return generate(prompt, schema);
};
