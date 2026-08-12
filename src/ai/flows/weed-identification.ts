'use server';
/**
 * @fileOverview An AI agent that identifies weeds from images.
 *
 * - identifyWeed - A function that identifies weeds and suggests control methods.
 * - WeedIdentificationInput - The input type for the identifyWeed function.
 * - WeedIdentificationOutput - The return type for the identifyWeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeedIdentificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the weed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locale: z.string().optional().describe('The language locale.'),
});
export type WeedIdentificationInput = z.infer<typeof WeedIdentificationInputSchema>;

const ControlMethodSchema = z.object({
    type: z.enum(['Manual', 'Organic', 'Chemical']).describe('The type of control method.'),
    name: z.string().describe('The name of the control method or product.'),
    description: z.string().describe('A detailed description of how to apply the method.'),
});

const WeedIdentificationOutputSchema = z.object({
  identification: z.object({
    weedName: z.string().describe('The common name of the identified weed.'),
    scientificName: z.string().describe('The scientific name of the weed.'),
    confidence: z.number().describe('The confidence level of the identification (0-1).'),
    description: z.string().describe('A brief description of the weed and its impact.'),
  }),
  controlMethods: z.array(ControlMethodSchema).describe('Recommended control methods.'),
});
export type WeedIdentificationOutput = z.infer<typeof WeedIdentificationOutputSchema>;

export async function identifyWeed(
  input: WeedIdentificationInput
): Promise<WeedIdentificationOutput> {
  return weedIdentificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weedIdentificationPrompt',
  model: 'googleai/gemini-3.5-flash-lite',
  input: {schema: WeedIdentificationInputSchema},
  output: {schema: WeedIdentificationOutputSchema},
  prompt: `You are an expert botanist specializing in weed identification and control in an agricultural context.
  Your task is to identify the weed in the provided image.

  Based on your identification, provide:
  1. The common and scientific name of the weed.
  2. A confidence score for your identification.
  3. A brief description of the weed and why it is a problem for crops.
  4. Detailed control methods, including Manual, Organic, and Chemical options. For each, give a name and a clear description of the process.

  Weed Image: {{media url=photoDataUri}}

  IMPORTANT: You MUST write all the output strings, descriptions, names, and control methods in the requested language/locale: "{{locale}}" (if locale is "hi" write in Hindi, if "ml" write in Malayalam, if "desi" write in a friendly, conversational Hinglish/Desi style using English/Latin characters mixed with Hindi phrases, e.g. "Bhai, is weed/kachra ko nikalne ke liye ye method use karo", if "en" or undefined write in English).
  `,
});

const weedIdentificationFlow = ai.defineFlow(
  {
    name: 'weedIdentificationFlow',
    inputSchema: WeedIdentificationInputSchema,
    outputSchema: WeedIdentificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
