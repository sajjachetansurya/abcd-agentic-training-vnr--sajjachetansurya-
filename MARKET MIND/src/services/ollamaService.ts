import { webSearch, formatSearchResultsForPrompt } from './searchService';

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

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.2:latest';

async function ollamaComplete(prompt: string, model = DEFAULT_MODEL): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  return (
    json.completion ||
    json.text ||
    json.choices?.[0]?.text ||
    json.choices?.[0]?.message?.content ||
    json.choices?.[0]?.delta?.content ||
    ''
  );
}

function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function runResearchAgent(topic: string): Promise<ResearchResult> {
  // Fetch web search results
  let searchResults = await webSearch(`${topic} market research 2025`);
  const formattedResults = formatSearchResultsForPrompt(searchResults);
  
  const prompt = `RESPOND WITH ONLY VALID JSON. NO OTHER TEXT.

You are a market research expert. Use the following search results to create a comprehensive market summary for: ${topic}

SEARCH RESULTS:
${formattedResults}

Respond ONLY with this JSON structure:
{
  "topic": "${topic}",
  "summary": "A detailed 3-4 sentence summary based on the search results about the ${topic} market, key players, trends, and insights",
  "sources": [
    {"title": "Search Result 1", "uri": "https://example.com"}
  ],
  "timestamp": "${new Date().toISOString()}"
}`;
  
  const text = await ollamaComplete(prompt);
  const parsed = extractJSON(text);
  
  if (parsed && typeof parsed === 'object') {
    return {
      topic: parsed.topic || topic,
      summary: parsed.summary || `Market research on ${topic} completed`,
      sources: Array.isArray(parsed.sources) 
        ? parsed.sources 
        : searchResults.map(r => ({ title: r.title, uri: r.link })),
      timestamp: parsed.timestamp || new Date().toISOString(),
    };
  }
  
  // Fallback: use search results directly
  return {
    topic,
    summary: searchResults
      .map(r => r.snippet)
      .join(' ')
      .substring(0, 500) || `Market analysis of ${topic}`,
    sources: searchResults.map(r => ({ title: r.title, uri: r.link })),
    timestamp: new Date().toISOString(),
  };
}

export async function runAnalystAgent(researchData: ResearchResult): Promise<AnalysisResult> {
  const prompt = `RESPOND WITH ONLY VALID JSON. NO OTHER TEXT.\n\nAnalyze: "${researchData.summary}"\n\nRespond ONLY with this JSON structure:\n{\n  "swot": {\n    "strengths": ["Strength 1", "Strength 2"],\n    "weaknesses": ["Weakness 1", "Weakness 2"],\n    "opportunities": ["Opportunity 1", "Opportunity 2"],\n    "threats": ["Threat 1", "Threat 2"]\n  },\n  "marketTrends": ["Trend 1", "Trend 2"],\n  "competitiveLandscape": "Description of competitive landscape"\n}`;
  
  const text = await ollamaComplete(prompt);
  const parsed = extractJSON(text);
  
  if (parsed && typeof parsed === 'object') {
    return {
      swot: {
        strengths: Array.isArray(parsed.swot?.strengths) ? parsed.swot.strengths : ["Market presence"],
        weaknesses: Array.isArray(parsed.swot?.weaknesses) ? parsed.swot.weaknesses : ["Limited data"],
        opportunities: Array.isArray(parsed.swot?.opportunities) ? parsed.swot.opportunities : ["Growth potential"],
        threats: Array.isArray(parsed.swot?.threats) ? parsed.swot.threats : ["Competition"],
      },
      marketTrends: Array.isArray(parsed.marketTrends) ? parsed.marketTrends : ["Emerging trends"],
      competitiveLandscape: parsed.competitiveLandscape || "Competitive market",
    };
  }
  
  return {
    swot: {
      strengths: ["Strong market potential"],
      weaknesses: ["Emerging market"],
      opportunities: ["Growth opportunity"],
      threats: ["Market competition"],
    },
    marketTrends: ["Market evolution"],
    competitiveLandscape: text.substring(0, 200) || "Competitive landscape pending",
  };
}

export async function runEditorAgent(topic: string, research: ResearchResult, analysis: AnalysisResult): Promise<FinalReport> {
  const prompt = `RESPOND WITH ONLY VALID JSON. NO OTHER TEXT.\n\nCreate report for: ${topic}\n\nRespond ONLY with this JSON structure:\n{\n  "title": "Market Intelligence Report on ${topic}",\n  "executiveSummary": "Professional 2-3 sentence executive summary",\n  "detailedAnalysis": "Detailed analysis paragraph",\n  "recommendations": ["Recommendation 1", "Recommendation 2"]\n}`;
  
  const text = await ollamaComplete(prompt);
  const parsed = extractJSON(text);
  
  if (parsed && typeof parsed === 'object') {
    return {
      title: parsed.title || `Market Intelligence Report on ${topic}`,
      executiveSummary: parsed.executiveSummary || "Market analysis summary",
      detailedAnalysis: parsed.detailedAnalysis || "Detailed market analysis",
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Continue market monitoring"],
    };
  }
  
  return {
    title: `Market Intelligence Report on ${topic}`,
    executiveSummary: "Market analysis completed successfully",
    detailedAnalysis: text.substring(0, 300) || "Market analysis report",
    recommendations: ["Monitor market trends", "Implement recommendations"],
  };
}
