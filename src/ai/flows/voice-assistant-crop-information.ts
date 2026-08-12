'use server';

/**
 * @fileOverview An AI voice assistant for farmers to get information about crop health, weather, and actions.
 *
 * - voiceAssistantCropInformation - A function that processes farmer's questions and provides information.
 * - VoiceAssistantCropInformationInput - The input type for the voiceAssistantCropInformation function.
 * - VoiceAssistantCropInformationOutput - The return type for the voiceAssistantCropInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAssistantCropInformationInputSchema = z.object({
  query: z.string().describe('The farmer’s question about crop health, weather, or recommended actions.'),
  locale: z.string().optional().describe('The language locale.'),
});
export type VoiceAssistantCropInformationInput = z.infer<typeof VoiceAssistantCropInformationInputSchema>;

const VoiceAssistantCropInformationOutputSchema = z.object({
  response: z.string().describe('The voice assistant’s response to the farmer’s question.'),
});
export type VoiceAssistantCropInformationOutput = z.infer<typeof VoiceAssistantCropInformationOutputSchema>;

export async function voiceAssistantCropInformation(input: VoiceAssistantCropInformationInput): Promise<VoiceAssistantCropInformationOutput> {
  return voiceAssistantCropInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAssistantCropInformationPrompt',
  model: 'googleai/gemini-3.5-flash-lite',
  input: {schema: VoiceAssistantCropInformationInputSchema},
  output: {schema: VoiceAssistantCropInformationOutputSchema},
  prompt: `You are a helpful and knowledgeable agricultural voice assistant for farmers in India. 
  You can answer questions about crop health, weather conditions, Mandi prices, and recommended farming actions.

  Farmer's Question: {{{query}}}
  
  IMPORTANT: You MUST write the response in the requested language/locale: "{{locale}}" (if locale is "hi" write in Hindi, if "ml" write in Malayalam, if "desi" write in a friendly, conversational Hinglish/Desi style using English/Latin characters mixed with Hindi phrases, e.g. "Bhai, aapki fasal me khet me pani do...", if "en" or undefined write in English).
  Response: `,
});

const voiceAssistantCropInformationFlow = ai.defineFlow(
  {
    name: 'voiceAssistantCropInformationFlow',
    inputSchema: VoiceAssistantCropInformationInputSchema,
    outputSchema: VoiceAssistantCropInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
