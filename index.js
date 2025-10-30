import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

app.post("/recommend", async (req, res) => {
  try {
    const { moisture, temperature, humidity, light_intensity } = req.body;

    
    const prompt = `
You are an agricultural expert specializing in tropical and Philippine-based crops.

Given these environmental conditions:
- Soil Moisture: ${moisture}%
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Light Intensity: ${light_intensity} lux

Recommend **3 to 5 plants or crops commonly grown in the Philippines** 
that are suitable for these conditions.

Return your response strictly in this JSON format:

{
  "recommended_plants": [
    { "name": "PlantName", "confidence": 0.0 },
    ...
  ],
  "reasoning": "Short explanation why these plants fit well the given environment"
}
`;

    // Gemini Response
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // parse JSON
    let output;
    try {
      output = JSON.parse(text);
    } catch (err) {
      // Fallback: wrap plain text
      output = { message: text };
    }

    res.json(output);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`🌱 Smart Farm AI API running at http://localhost:${PORT}`)
);
