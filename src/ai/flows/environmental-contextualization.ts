'use server';

/**
 * @fileOverview A flow to contextualize disease and pest predictions using local environmental data.
 *
 * - environmentalContextualization - A function that handles the contextualization process.
 * - EnvironmentalContextualizationInput - The input type for the environmentalContextualization function.
 * - EnvironmentalContextualizationOutput - The return type for the environmentalContextualization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvironmentalContextualizationInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown.'),
  location: z.string().describe('The geographical location of the farm.'),
  diseaseOrPest: z.string().describe('The disease or pest to contextualize.'),
  soilCompositionDataUri: z
    .string()
    .describe(
      "A photo of a soil composition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  typicalWeatherPatterns: z.string().describe('Typical weather patterns for the location.'),
});
export type EnvironmentalContextualizationInput = z.infer<typeof EnvironmentalContextualizationInputSchema>;

const EnvironmentalContextualizationOutputSchema = z.object({
  contextualizedPrediction: z.string().describe('A contextualized prediction of the disease or pest impact based on the environmental data.'),
  recommendedSolutions: z.string().describe('Recommended solutions based on the contextualized prediction.'),
});
export type EnvironmentalContextualizationOutput = z.infer<typeof EnvironmentalContextualizationOutputSchema>;

export async function environmentalContextualization(
  input: EnvironmentalContextualizationInput
): Promise<EnvironmentalContextualizationOutput> {
  return environmentalContextualizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'environmentalContextualizationPrompt',
  input: {schema: EnvironmentalContextualizationInputSchema},
  output: {schema: EnvironmentalContextualizationOutputSchema},
  prompt: `You are an expert agricultural advisor. A farmer is growing {{cropType}} in {{location}}.
They are concerned about {{diseaseOrPest}}. Here is data about the soil composition: {{media url=soilCompositionDataUri}}. The typical weather patterns are: {{typicalWeatherPatterns}}.

Based on this information, provide a contextualized prediction of the disease or pest impact, and recommend solutions.

Contextualized Prediction: `,
});

const environmentalContextualizationFlow = ai.defineFlow(
  {
    name: 'environmentalContextualizationFlow',
    inputSchema: EnvironmentalContextualizationInputSchema,
    outputSchema: EnvironmentalContextualizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
