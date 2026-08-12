'use server';
/**
 * @fileOverview An AI agent that provides crop recommendations.
 *
 * - getCropAdvice - A function that suggests profitable crops.
 * - CropAdvisorInput - The input type for the getCropAdvice function.
 * - CropAdvisorOutput - The return type for the getCropAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropAdvisorInputSchema = z.object({
  location: z.string().describe('The geographical location (e.g., city, state).'),
  soilType: z.string().describe('The type of soil in the field (e.g., Sandy, Clay, Loamy).'),
  budget: z.number().describe('The farmer\'s budget per acre in INR.'),
  farmSize: z.number().describe('The size of the farm in acres.'),
  locale: z.string().optional().describe('The language locale.'),
});
export type CropAdvisorInput = z.infer<typeof CropAdvisorInputSchema>;

const RecommendedCropSchema = z.object({
    name: z.string().describe('The name of the recommended crop.'),
    reason: z.string().describe('A brief reason why this crop is recommended, considering soil, climate, and market demand.'),
    estimatedProfit: z.string().describe('The estimated profit per acre in INR (e.g., "₹30,000 - ₹40,000").'),
    sowingTime: z.string().describe('The ideal sowing time or season for the crop.'),
});

const CropAdvisorOutputSchema = z.object({
  recommendations: z.array(RecommendedCropSchema).describe('A list of up to 3 recommended crops.'),
  summary: z.string().describe('A brief summary explaining the overall strategy for the recommendations.'),
});
export type CropAdvisorOutput = z.infer<typeof CropAdvisorOutputSchema>;

export async function getCropAdvice(
  input: CropAdvisorInput
): Promise<CropAdvisorOutput> {
  return cropAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropAdvisorPrompt',
  model: 'googleai/gemini-3.5-flash-lite',
  input: {schema: CropAdvisorInputSchema},
  output: {schema: CropAdvisorOutputSchema},
  prompt: `You are an expert agricultural economist and agronomist for Indian farming conditions.
Your task is to recommend the most profitable and suitable crops for a farmer.

Farmer's details:
- Location: {{location}}
- Soil Type: {{soilType}}
- Budget per Acre: ₹{{budget}}
- Farm Size: {{farmSize}} acres

Based on this information, current market trends, and typical climate for the location, provide a list of up to 3 crop recommendations. For each crop, include the reason, estimated profit per acre, and ideal sowing time.

Also, provide a brief summary of your recommendation strategy.

IMPORTANT: You MUST write all the output strings, descriptions, reasons, names, and summaries in the requested language/locale: "{{locale}}" (if locale is "hi" write in Hindi, if "ml" write in Malayalam, if "desi" write in a friendly, conversational Hinglish/Desi style using English/Latin characters mixed with Hindi phrases, e.g. "Bhai, is location ke liye ye crop sabse best rahega aur profit bhi achha milega", if "en" or undefined write in English).
  `,
});

const cropAdvisorFlow = ai.defineFlow(
  {
    name: 'cropAdvisorFlow',
    inputSchema: CropAdvisorInputSchema,
    outputSchema: CropAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
