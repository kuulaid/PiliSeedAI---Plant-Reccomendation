export function computeMatchScore(sensor, plant) {
  if (!plant) return 0;

  let score = 0;

  // Temperature
  const tempMid = (plant.min_temp + plant.max_temp) / 2;
  const tempDiff = Math.abs(sensor.temperature - tempMid);
  score += Math.max(0, 25 - tempDiff * 2);

  // Humidity
  const humidityDiff = Math.abs(sensor.humidity - plant.humidity);
  score += Math.max(0, 25 - humidityDiff * 0.5);

  // Light
  const lightDiff = Math.abs(sensor.light - plant.light * 1000) / 1000;
  score += Math.max(0, 25 - lightDiff);

  // Moisture
  const moistDiff = Math.abs(sensor.moisture - plant.soil_moisture);
  score += Math.max(0, 25 - moistDiff * 0.5);

  return Math.min(score, 100);
}
