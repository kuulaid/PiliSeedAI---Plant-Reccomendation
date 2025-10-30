import axios from "axios";

const TREFLE_API = "https://trefle.io/api/v1/plants/search";

export async function getPHPlants(query = "") {
  try {
    const res = await axios.get(TREFLE_API, {
      params: {
        token: process.env.TREFLE_API_KEY,
        q: query
      }
    });

    const plants = res.data.data;

    // pilipins onli
    return plants.filter(p => {
      const dist = p.distribution || {};
      const native = dist.native || [];
      const introduced = dist.introduced || [];
      return [...native, ...introduced].some(c =>
        c.toLowerCase().includes("philippines")
      );
    });
  } catch (err) {
    console.error("Trefle error:", err.message);
    return [];
  }
}
