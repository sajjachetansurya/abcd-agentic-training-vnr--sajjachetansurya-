
import { GoogleGenAI } from "@google/genai";
import { College } from "../types";

// Fixed: Corrected the type of chatHistory to be an array of Content objects to match the usage in Dashboard.tsx
export const generateChatResponse = async (
  question: string,
  college: College | null,
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const model = 'gemini-3-flash-preview';
    
    let collegeContext = `The user has not selected a specific college yet. You can answer general questions about engineering in Telangana.`;
    if (college) {
        collegeContext = `The user is specifically asking about ${college.name}. 
        Details:
        - Ranking: ${college.ranking}
        - Admission: ${college.admissionProcess}
        - Cutoffs: ${college.cutoffs}
        - Syllabus: ${college.syllabus.join(', ')}
        - Campus: ${college.campusLife}`;
        
        if (college.placements) {
            collegeContext += `\n- Placements: ${college.placements.placementRate} rate, Avg package ${college.placements.averagePackage}, Top recruiters: ${college.placements.topRecruiters.join(', ')}.`;
        }
    }

    const systemInstruction = `You are an expert AI college counselor for engineering colleges in Telangana, India. 
    Use the following context to provide helpful, accurate, and detailed responses.
    Context: ${collegeContext}`;

    // Fixed: Updated contents to correctly spread the chatHistory array (Content[]) and append the new user message
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: question }] }
      ],
      config: { 
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Fixed: Accessed .text as a property of the GenerateContentResponse object
    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble accessing my knowledge base. Please check your connection and try again.";
  }
};
