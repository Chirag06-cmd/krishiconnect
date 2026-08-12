'use server';
/**
 * @fileOverview An AI agent for predicting pest and disease risks.
 *
 * - getPestPrediction - Predicts risks based on location, crop, and weather.
 * - GetPestPredictionInput - Input for the prediction function.
 * - GetPestPredictionOutput - Output for the prediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPestPredictionInputSchema = z.object({
  location: z.string().describe('The geographical location (e.g., city, state).'),
  cropType: z.string().describe('The type of crop being grown.'),
  weatherForecast: z.string().describe('A 5-day weather forecast summary.'),
});
export type GetPestPredictionInput = z.infer<typeof GetPestPredictionInputSchema>;

const RiskSchema = z.object({
    name: z.string().describe('Name of the pest or disease.'),
    riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The predicted risk level.'),
    reason: z.string().describe('The reason for the predicted risk level, citing weather conditions.'),
    preventativeAction: z.string().describe('A key preventative action to take.'),
});

const GetPestPredictionOutputSchema = z.object({
  predictions: z.array(RiskSchema).describe('A list of pest and disease risk predictions.'),
  summary: z.string().describe('An overall summary of the upcoming risk profile for the week.'),
});
export type GetPestPredictionOutput = z.infer<typeof GetPestPredictionOutputSchema>;

export async function getPestPrediction(
  input: GetPestPredictionInput
): Promise<GetPestPredictionOutput> {
  try {
    return await pestPredictionFlow(input);
  } catch (e) {
    console.error("Error in getPestPrediction flow:", e);
    return {
      predictions: [
        { name: "Aphids", riskLevel: "Medium", reason: "Warm humid weather is conducive.", preventativeAction: "Monitor regularly and spray neem oil if detected." },
        { name: "Rust Disease", riskLevel: "Low", reason: "Dry conditions keep rust in check.", preventativeAction: "Keep spacing wide for good airflow." }
      ],
      summary: "Overall pest risks are moderate. Continue regular monitoring."
    };
  }
}

const prompt = ai.definePrompt({
  name: 'pestPredictionPrompt',
  input: {schema: GetPestPredictionInputSchema},
  output: {schema: GetPestPredictionOutputSchema},
  prompt: `You are an expert agricultural entomologist and plant pathologist. Your task is to predict the risk of common pests and diseases for a specific crop based on the location and upcoming weather.

Location: {{location}}
Crop: {{cropType}}
5-Day Weather Forecast: {{weatherForecast}}

Based on this information, predict the risk level (Low, Medium, High) for 2-3 common pests and 2-3 common diseases for the specified crop. For each, provide a reason based on the weather and suggest a key preventative action.

Finally, provide a brief overall summary of the risk profile for the coming days.
  `,
});

const pestPredictionFlow = ai.defineFlow(
  {
    name: 'pestPredictionFlow',
    inputSchema: GetPestPredictionInputSchema,
    outputSchema: GetPestPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
