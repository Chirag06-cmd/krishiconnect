'use server';
/**
 * @fileOverview An AI agent that creates a smart irrigation schedule.
 *
 * - getIrrigationSchedule - Generates a 7-day watering plan.
 * - IrrigationScheduleInput - Input for the schedule function.
 * - IrrigationScheduleOutput - Output for the schedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IrrigationScheduleInputSchema = z.object({
  location: z.string().describe('The geographical location (e.g., city, state).'),
  cropType: z.string().describe('The type of crop being grown.'),
  weatherForecast: z.string().describe('A 7-day weather forecast summary, including temperature, rain chance, and humidity.'),
  locale: z.string().optional().describe('The language locale.'),
});
export type IrrigationScheduleInput = z.infer<typeof IrrigationScheduleInputSchema>;

const DailyScheduleSchema = z.object({
    day: z.string().describe('The day of the week (e.g., "Monday", "Today").'),
    wateringRecommendation: z.string().describe('The watering recommendation for the day (e.g., "Water in the morning", "No watering needed").'),
    reason: z.string().describe('The reason for the recommendation, citing weather conditions.'),
    estimatedAmount: z.string().describe('Estimated water amount if watering is needed (e.g., "1-2 inches").'),
});

const IrrigationScheduleOutputSchema = z.object({
  schedule: z.array(DailyScheduleSchema).describe('A 7-day irrigation schedule.'),
  summary: z.string().describe('A brief summary of the week\'s irrigation plan and water-saving tips.'),
});
export type IrrigationScheduleOutput = z.infer<typeof IrrigationScheduleOutputSchema>;

export async function getIrrigationSchedule(
  input: IrrigationScheduleInput
): Promise<IrrigationScheduleOutput> {
  return irrigationScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'irrigationSchedulePrompt',
  model: 'googleai/gemini-3.5-flash-lite',
  input: {schema: IrrigationScheduleInputSchema},
  output: {schema: IrrigationScheduleOutputSchema},
  prompt: `You are a precision agriculture specialist. Your task is to create a 7-day smart irrigation schedule for a farmer.

Farmer's details:
- Location: {{location}}
- Crop: {{cropType}}
- 7-Day Weather Forecast: {{weatherForecast}}

Based on the crop's water needs and the weather forecast, generate a daily watering recommendation for the next 7 days.
For each day, specify the recommendation (e.g., "Water", "No watering"), the reason, and the estimated amount of water if applicable.

Finally, provide a summary of the weekly plan with water-saving tips.

IMPORTANT: You MUST write all the output strings, daily recommendations, reasons, and summaries in the requested language/locale: "{{locale}}" (if locale is "hi" write in Hindi, if "ml" write in Malayalam, if "desi" write in a friendly, conversational Hinglish/Desi style using English/Latin characters mixed with Hindi phrases, e.g. "Bhai, aaj barish hone ke pure chances hain toh paani mat do", if "en" or undefined write in English).
  `,
});

const irrigationScheduleFlow = ai.defineFlow(
  {
    name: 'irrigationScheduleFlow',
    inputSchema: IrrigationScheduleInputSchema,
    outputSchema: IrrigationScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
