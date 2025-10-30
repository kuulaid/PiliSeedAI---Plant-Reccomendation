import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function getRecommendation({ stage, conditions, treflePlants }) {
  let prompt;

  if (stage === "search") {
    // Step 1: Gemini generates keywords for Trefle search
    prompt = `
    You are a Filipino agricultural expert.
    Given these environmental conditions:
    ${JSON.stringify(conditions, null, 2)}

    Suggest up to 5 short keywords or plant types that fit this climate for the Philippines.
    Respond ONLY in JSON:
    { "suggested_keywords": ["keyword1", "keyword2", ...] }
    `;
  } else {
    // Step 2: Gemini refines recommendations
    prompt = `
    Given these current field conditions:
    ${JSON.stringify(conditions, null, 2)}

    And these plant candidates from Trefle:
    ${JSON.stringify(treflePlants.slice(0, 10), null, 2)}

    Recommend the 3 most suitable crops to grow.
    Respond only in JSON:
    {
      "recommended_plants": [
        { "name": "Plant", "confidence": 0.0, "reason": "short reason" }
      ],
      "summary": "short explanation"
    }
    `;
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
