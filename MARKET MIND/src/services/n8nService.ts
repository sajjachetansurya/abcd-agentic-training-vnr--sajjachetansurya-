import { ResearchResult, AnalysisResult, FinalReport } from "./geminiService";

export interface N8NResponse {
  research: ResearchResult;
  analysis: AnalysisResult;
  report: FinalReport;
}

export async function triggerN8NWorkflow(topic: string, webhookUrl: string): Promise<N8NResponse> {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      topic,
      timestamp: new Date().toISOString()
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`n8n Workflow Error: ${response.status} - ${errorText || 'Failed to trigger workflow'}`);
  }

  const data = await response.json();
  
  // Validate that n8n returned the expected structure
  if (!data.research || !data.analysis || !data.report) {
    console.warn("n8n response missing expected fields, attempting to adapt...", data);
    // If n8n returns a flat object or different structure, we might need to map it here
    // For now, we assume the user configured n8n to match our internal types
  }

  return data as N8NResponse;
}
