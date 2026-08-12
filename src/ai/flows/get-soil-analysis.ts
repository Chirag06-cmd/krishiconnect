'use server';
/**
 * @fileOverview An AI agent for soil analysis and crop recommendation.
 *
 * - getSoilAnalysis - Analyzes soil image and provides recommendations.
 * - GetSoilAnalysisInput - The input type for the getSoilAnalysis function.
 * - GetSoilAnalysisOutput - The return type for the getSoilAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSoilAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a soil sample, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().describe('The geographical location (e.g., city, state) where the soil was sampled.'),
  season: z.string().describe('The current farming season (e.g., Kharif, Rabi, Zaid).'),
  locale: z.string().optional().describe('The language locale.'),
});
export type GetSoilAnalysisInput = z.infer<typeof GetSoilAnalysisInputSchema>;

const NutrientLevelSchema = z.object({
    name: z.string().describe('Name of the nutrient (e.g., Nitrogen, Phosphorus, Potassium).'),
    value: z.string().describe('The level of the nutrient (e.g., "Low", "Medium", "High").'),
});

const RecommendedCropSchema = z.object({
    name: z.string().describe('Name of the recommended crop.'),
    reason: z.string().describe('Reason for recommending this crop based on soil and climate.'),
});

const GetSoilAnalysisOutputSchema = z.object({
  soilType: z.string().describe('The identified type of soil (e.g., "Sandy Loam", "Clay").'),
  phLevel: z.number().describe('The estimated pH level of the soil.'),
  organicMatterPercentage: z.number().describe('The estimated percentage of organic matter in the soil.'),
  nutrientLevels: z.array(NutrientLevelSchema).describe('Analysis of key nutrient levels.'),
  recommendedCrops: z.array(RecommendedCropSchema).describe('Crops recommended for this soil, location, and season.'),
  soilImprovementTips: z.array(z.string()).describe('Tips for improving soil health.'),
});
export type GetSoilAnalysisOutput = z.infer<typeof GetSoilAnalysisOutputSchema>;

export async function getSoilAnalysis(
  input: GetSoilAnalysisInput
): Promise<GetSoilAnalysisOutput> {
  return soilAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soilAnalysisPrompt',
  model: 'googleai/gemini-3.5-flash-lite',
  input: {schema: GetSoilAnalysisInputSchema},
  output: {schema: GetSoilAnalysisOutputSchema},
  prompt: `You are an expert soil scientist and agronomist. Your task is to analyze the provided image of a soil sample and give a detailed report.

Analyze the image to determine the soil type, estimate pH, and organic matter content.
Based on the soil properties, the location ({{location}}), and the season ({{season}}), recommend suitable crops.
Also, provide actionable tips for soil improvement.

Soil Image: {{media url=photoDataUri}}

Return a structured analysis including soil type, pH level, organic matter percentage, key nutrient levels (Nitrogen, Phosphorus, Potassium), recommended crops with reasons, and soil improvement tips.

IMPORTANT: You MUST write all the output strings, descriptions, reasons, names, and tips in the requested language/locale: "{{locale}}" (if locale is "hi" write in Hindi, if "ml" write in Malayalam, if "desi" write in a friendly, conversational Hinglish/Desi style using English/Latin characters mixed with Hindi phrases, e.g. "Mitti me nitrogen kam hai, isme urea ka upyog karein", if "en" or undefined write in English).
  `,
});

const soilAnalysisFlow = ai.defineFlow(
  {
    name: 'soilAnalysisFlow',
    inputSchema: GetSoilAnalysisInputSchema,
    outputSchema: GetSoilAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
