'use server';

/**
 * @fileOverview An AI-powered onboarding experience that generates tailored recommendations for data sources and configurations.
 *
 * - initialSetup - A function that handles the initial setup process.
 * - InitialSetupInput - The input type for the initialSetup function.
 * - InitialSetupOutput - The return type for the initialSetup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialSetupInputSchema = z.object({
  farmDescription: z
    .string()
    .describe("A description of the user's farm, including the types of crops grown and the farm's location."),
});
export type InitialSetupInput = z.infer<typeof InitialSetupInputSchema>;

const InitialSetupOutputSchema = z.object({
  dataSourceRecommendations: z
    .array(z.string())
    .describe('A list of recommended data sources for the user.'),
  configurationRecommendations: z
    .array(z.string())
    .describe('A list of recommended configurations for the user.'),
});
export type InitialSetupOutput = z.infer<typeof InitialSetupOutputSchema>;

export async function initialSetup(input: InitialSetupInput): Promise<InitialSetupOutput> {
  return initialSetupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialSetupPrompt',
  input: {schema: InitialSetupInputSchema},
  output: {schema: InitialSetupOutputSchema},
  prompt: `You are an expert in agricultural technology and data analysis. Based on the following description of a farm, provide recommendations for data sources and configurations that would be helpful for monitoring crop health and optimizing farming practices.

Farm Description: {{{farmDescription}}}

Data Source Recommendations: A list of data sources that would be helpful for this farm.
Configuration Recommendations: A list of configurations that would be helpful for this farm.`,
});

const initialSetupFlow = ai.defineFlow(
  {
    name: 'initialSetupFlow',
    inputSchema: InitialSetupInputSchema,
    outputSchema: InitialSetupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
