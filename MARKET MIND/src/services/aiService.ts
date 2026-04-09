import * as geminiService from './geminiService';
import * as ollamaService from './ollamaService';

const provider = import.meta.env.VITE_AI_PROVIDER === 'ollama' ? 'ollama' : 'gemini';

export type ResearchResult = geminiService.ResearchResult;
export type AnalysisResult = geminiService.AnalysisResult;
export type FinalReport = geminiService.FinalReport;

export const runResearchAgent = provider === 'ollama'
  ? ollamaService.runResearchAgent
  : geminiService.runResearchAgent;

export const runAnalystAgent = provider === 'ollama'
  ? ollamaService.runAnalystAgent
  : geminiService.runAnalystAgent;

export const runEditorAgent = provider === 'ollama'
  ? ollamaService.runEditorAgent
  : geminiService.runEditorAgent;
