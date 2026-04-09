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
