import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface ResearchResult {
  topic: string;
  summary: string;
  sources: { title: string; uri: string }[];
  timestamp: string;
}

export interface AnalysisResult {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketTrends: string[];
  competitiveLandscape: string;
}

export interface FinalReport {
  title: string;
  executiveSummary: string;
  detailedAnalysis: string;
  recommendations: string[];
}

export interface GuardrailResult {
  safe: boolean;
  reason?: string;
  suggestedTopic?: string;
}

export interface ValidationResult {
  valid: boolean;
  score: number;
  feedback: string;
}

/**
 * GUARDRAIL AGENT
 * Ensures the topic is safe, professional, and within scope.
 */
export async function runGuardrailAgent(topic: string): Promise<GuardrailResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Evaluate the following market research topic for safety, professionalism, and feasibility. 
    Topic: "${topic}"
    
    Rules:
    1. Reject topics related to illegal activities, hate speech, or explicit content.
    2. Reject topics that are too vague (e.g., "money").
    3. If safe, suggest a more specific professional phrasing if needed.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          safe: { type: Type.BOOLEAN },
          reason: { type: Type.STRING },
          suggestedTopic: { type: Type.STRING },
        },
        required: ["safe"],
      },
    },
  });

  return JSON.parse(response.text || '{"safe":false}') as GuardrailResult;
}

/**
 * RESEARCHER AGENT
 * Uses Google Search Tool to gather real-time data.
 */
export async function runResearchAgent(topic: string): Promise<ResearchResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Conduct comprehensive market research on the following topic: ${topic}. Focus on current state, key players, and recent news.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No research data found.";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .filter((c) => c.web)
    .map((c) => ({
      title: c.web?.title || "Source",
      uri: c.web?.uri || "",
    }));

  return {
    topic,
    summary: text,
    sources,
    timestamp: new Date().toISOString(),
  };
}

export async function runAnalystAgent(researchData: ResearchResult): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze the following market research data and provide a SWOT analysis and market trends:
    
    RESEARCH DATA:
    ${researchData.summary}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"],
          },
          marketTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
          competitiveLandscape: { type: Type.STRING },
        },
        required: ["swot", "marketTrends", "competitiveLandscape"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse analyst output", e);
    throw new Error("Analyst agent failed to generate structured data.");
  }
}

export async function runEditorAgent(topic: string, research: ResearchResult, analysis: AnalysisResult): Promise<FinalReport> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Act as a Senior Business Consultant. Create a professional market intelligence report based on the following data:
    
    TOPIC: ${topic}
    RESEARCH: ${research.summary}
    ANALYSIS: ${JSON.stringify(analysis)}
    
    Format the report with a clear title, executive summary, detailed analysis section, and strategic recommendations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          detailedAnalysis: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "executiveSummary", "detailedAnalysis", "recommendations"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as FinalReport;
  } catch (e) {
    console.error("Failed to parse editor output", e);
    throw new Error("Editor agent failed to generate structured report.");
  }
}

/**
 * VALIDATOR AGENT (GUARDRAIL)
 * Checks the final report for quality and consistency.
 */
export async function runValidationAgent(report: FinalReport): Promise<ValidationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Review the following market intelligence report for quality, professional tone, and logical consistency.
    
    REPORT:
    ${JSON.stringify(report)}
    
    Provide a quality score (1-10) and feedback.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          valid: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
        },
        required: ["valid", "score", "feedback"],
      },
    },
  });

  return JSON.parse(response.text || '{"valid":false}') as ValidationResult;
}

/**
 * ORCHESTRATOR (HANDOFFS)
 * Manages the flow between agents and enforces guardrails.
 */
export async function runMarketAnalysisOrchestrator(
  topic: string,
  onStatusUpdate: (status: string) => void
): Promise<{ research: ResearchResult; analysis: AnalysisResult; report: FinalReport; validation: ValidationResult }> {
  
  // 1. Guardrail Check
  onStatusUpdate("Validating topic...");
  const guardrail = await runGuardrailAgent(topic);
  if (!guardrail.safe) {
    throw new Error(`Guardrail Rejected: ${guardrail.reason}`);
  }
  const activeTopic = guardrail.suggestedTopic || topic;

  // 2. Handoff to Researcher
  onStatusUpdate("Researching market data...");
  const research = await runResearchAgent(activeTopic);

  // 3. Handoff to Analyst
  onStatusUpdate("Analyzing trends and SWOT...");
  const analysis = await runAnalystAgent(research);

  // 4. Handoff to Editor
  onStatusUpdate("Synthesizing final report...");
  const report = await runEditorAgent(activeTopic, research, analysis);

  // 5. Final Validation Guardrail
  onStatusUpdate("Performing quality check...");
  const validation = await runValidationAgent(report);
  
  if (validation.score < 5) {
    throw new Error(`Quality Check Failed: ${validation.feedback}`);
  }

  return { research, analysis, report, validation };
}
