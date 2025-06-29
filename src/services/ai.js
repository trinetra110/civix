import { InferenceClient } from "@huggingface/inference";
import conf from "../conf/conf";

export const aiService = {
  async formatGrievance(description) {
    try {
      const client = new InferenceClient(conf.huggingFaceApiKey);
      const input = "Convert this grievance to formal complaint format. Only give the final content, nothing else. And only use the info given. Grievance:\n" + description;

      const result = await client.chatCompletion({
        provider: "cohere",
        model: "CohereLabs/c4ai-command-r-plus",
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
      });

      return result.choices[0].message.content || description;
    } catch (error) {
      console.error("AI API Error:", error);
  
      return `FORMAL COMPLAINT

Description: ${description}

I hereby formally submit this complaint for your consideration and request appropriate action to resolve this matter.`;
    }
  }
};