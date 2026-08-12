'use server';
/**
 * @fileOverview An AI agent that generates a spectral health map from a farm image.
 *
 * - generateSpectralMap - A function that creates a spectral map.
 * - GenerateSpectralMapInput - The input type for the function.
 * - GenerateSpectralMapOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpectralMapInputSchema = z.object({
  farmImageUri: z
    .string()
    .describe(
      "A satellite or drone image of a farm field, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateSpectralMapInput = z.infer<typeof GenerateSpectralMapInputSchema>;

const GenerateSpectralMapOutputSchema = z.object({
  spectralMapUri: z.string().describe('The generated spectral map image as a data URI.'),
  analysis: z.string().describe('A brief analysis of the spectral map, highlighting areas of concern.'),
});
export type GenerateSpectralMapOutput = z.infer<typeof GenerateSpectralMapOutputSchema>;

export async function generateSpectralMap(
  input: GenerateSpectralMapInput
): Promise<GenerateSpectralMapOutput> {
  return generateSpectralMapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spectralMapPrompt',
  input: {schema: GenerateSpectralMapInputSchema},
  output: {schema: GenerateSpectralMapOutputSchema},
  prompt: `You are an expert in agricultural remote sensing. Your task is to generate a spectral health map (like an NDVI or NDRE map) from the provided farm image.

The generated map should use a color scale:
- Red: Indicates stressed or unhealthy vegetation.
- Yellow: Indicates moderately healthy vegetation.
- Green: Indicates very healthy vegetation.

Analyze the provided image and create a new image that is a spectral heat map overlay. The output should be a data URI of the generated map.

Also provide a brief, one-paragraph analysis of the map, pointing out any areas of potential concern (e.g., "The map reveals stress in the northern corner of the field, which could indicate a pest issue or lack of water. The southern and central areas appear healthy.").

Farm Image: {{media url=farmImageUri}}
`,
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
   model: 'googleai/gemini-3.5-flash-lite',
});

const generateSpectralMapFlow = ai.defineFlow(
  {
    name: 'generateSpectralMapFlow',
    inputSchema: GenerateSpectralMapInputSchema,
    outputSchema: GenerateSpectralMapOutputSchema,
  },
  async input => {
    const response = await ai.generate({
        model: 'googleai/gemini-3.5-flash-lite',
        prompt: [
            {
                text: `You are an expert in agricultural remote sensing. Your task is to generate a spectral health map (like an NDVI or NDRE map) from the provided farm image.

The generated map should use a color scale:
- Red: Indicates stressed or unhealthy vegetation.
- Yellow: Indicates moderately healthy vegetation.
- Green: Indicates very healthy vegetation.

Analyze the provided image and create a new image that is a spectral heat map overlay. The output should be a data URI of the generated map.

Also provide a brief, one-paragraph analysis of the map, pointing out any areas of potential concern (e.g., "The map reveals stress in the northern corner of the field, which could indicate a pest issue or lack of water. The southern and central areas appear healthy.").
`
            },
            {media: {url: input.farmImageUri}},
        ],
        output: {
            schema: GenerateSpectralMapOutputSchema,
        },
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const output = response.output;
    if (!output || !output.spectralMapUri) {
        // The model might return the image in the media part instead of the structured output.
        const mediaPart = response.media;
        if (mediaPart && mediaPart.url) {
            return {
                spectralMapUri: mediaPart.url,
                analysis: output?.analysis || 'AI analysis could not be generated. Please check the map for visual cues.'
            };
        }
      throw new Error('Failed to generate spectral map.');
    }
    return output;
  }
);
