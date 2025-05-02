import { GoogleGenerativeAI } from "@google/generative-ai";

// Init model
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export async function sendTravelQuery(input: any) {
  const result = await chatSession.sendMessage(input);

  const candidates = result.response?.candidates;
  if (!candidates) return;

  candidates.forEach((candidate, candidateIndex) => {
    candidate.content.parts.forEach((part, partIndex) => {
      if (part.text) {
        // Try extracting JSON from Markdown-style ```json blocks
        const match = part.text.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonContent = match ? match[1] : part.text;

        // Convert text to blob and trigger download
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `travel_plan_${candidateIndex}_${partIndex}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Handle inlineData (e.g., images) if provided by Gemini (rare case)
      if (part.inlineData) {
        const byteArray = Uint8Array.from(atob(part.inlineData.data), (c) =>
          c.charCodeAt(0)
        );
        const blob = new Blob([byteArray], { type: part.inlineData.mimeType });

        const extension = part.inlineData.mimeType.split("/")[1] || "bin";
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `output_${candidateIndex}_${partIndex}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  });
}
