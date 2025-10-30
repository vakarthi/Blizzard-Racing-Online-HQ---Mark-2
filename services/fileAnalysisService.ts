import { DesignParameters } from '../types';

/**
 * Simulates extracting design parameters from a STEP file's name.
 * In a real-world scenario, this would involve parsing the geometry.
 * Here, we use keyword analysis to generate plausible values.
 * @param fileName The name of the uploaded file.
 * @returns A DesignParameters object, excluding the carName.
 */
export const extractParametersFromFileName = (fileName: string): Omit<DesignParameters, 'carName'> => {
  const lowerCaseName = fileName.toLowerCase();

  // Start with baseline parameters
  const params = {
    totalLength: 195,
    totalWidth: 85,
    totalWeight: 65,
    frontWingSpan: 70,
    frontWingChord: 25,
    rearWingSpan: 80,
    rearWingHeight: 40,
  };

  // Modify based on keywords
  if (lowerCaseName.includes('low-drag')) {
    params.frontWingChord -= 5; // Smaller chord for less drag
    params.rearWingHeight -= 3;
    params.totalWidth -= 2;
  }
  if (lowerCaseName.includes('high-downforce') || lowerCaseName.includes('hdf')) {
    params.frontWingSpan += 5;
    params.frontWingChord += 3;
    params.rearWingSpan += 5;
    params.rearWingHeight += 4;
  }
  if (lowerCaseName.includes('lightweight')) {
    params.totalWeight -= 5;
  }
  if (lowerCaseName.includes('stable') || lowerCaseName.includes('balance')) {
      params.rearWingSpan += 4;
      params.frontWingSpan -= 2;
  }
  if (lowerCaseName.includes('short-wheelbase') || lowerCaseName.includes('swb')){
      params.totalLength -= 10;
  }
  
  // Add slight randomization to make results feel unique for each file
  Object.keys(params).forEach(key => {
      const k = key as keyof typeof params;
      params[k] *= (1 + (Math.random() - 0.5) * 0.05); // +/- 5% variance
      // round to 2 decimal places
      params[k] = parseFloat(params[k].toFixed(2));
  });

  return params;
};
