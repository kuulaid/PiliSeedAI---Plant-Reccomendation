import express from "express";
import dotenv from "dotenv";
import { getPHPlants } from "./services/trefleService.js";
import { getGeminiRecommendation } from "./services/geminiService.js";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/recommend", async (req, res) => {
  try {
    const { soil_moisture, temperature, humidity, light_intensity } = req.body;

    // Plant List from Trefle filtered PH only
    const treflePlants = await getPHPlants();

    // Gemini
    const geminiOutput = await getGeminiRecommendation(
      { soil_moisture, temperature, humidity, light_intensity },
      treflePlants
    );

    res.json(geminiOutput);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`🌾 API running at http://localhost:${process.env.PORT}`)
);
