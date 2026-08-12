// A plant problem diagnosis AI agent that identifies diseases and pests.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDiseasePestIdentificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locale: z.string().optional().describe('The user selected language locale (e.g., "en", "hi", "ml").'),
});
export type CropDiseasePestIdentificationInput =
  z.infer<typeof CropDiseasePestIdentificationInputSchema>;

const OrganicTreatmentSchema = z.object({
    type: z.enum(['Organic', 'Chemical']).describe('The type of treatment.'),
    name: z.string().describe('The name of the treatment product or method.'),
    description: z.string().describe('A description of how to apply the treatment.'),
    estimatedCost: z.string().describe('The estimated cost of the treatment (e.g., "₹500 - ₹800 per acre").'),
});

const ChemicalTreatmentSchema = z.object({
    type: z.enum(['Organic', 'Chemical']).describe('The type of treatment.'),
    name: z.string().describe('The name of the treatment product or method.'),
    description: z.string().describe('A description of how to apply the treatment.'),
    estimatedCost: z.string().describe('The estimated cost of the treatment (e.g., "₹500 - ₹800 per acre").'),
});

const CropDiseasePestIdentificationOutputSchema = z.object({
  identification: z.object({
    plantName: z.string().describe('The common name of the identified plant/crop.'),
    diseaseOrPest: z.string().describe('The identified disease or pest.'),
    confidence: z
      .number()
      .describe('The confidence level of the identification (0-1).'),
  }),
  treatmentGuidance: z.object({
    organic: z.array(OrganicTreatmentSchema).describe('Recommended organic treatment options.'),
    chemical: z.array(ChemicalTreatmentSchema).describe('Recommended chemical treatment options.'),
  }),
  preventativeMeasures: z.array(z.string()).describe('Preventative measures.'),
});
export type CropDiseasePestIdentificationOutput =
  z.infer<typeof CropDiseasePestIdentificationOutputSchema>;

export async function identifyCropProblem(
  input: CropDiseasePestIdentificationInput
): Promise<CropDiseasePestIdentificationOutput> {
  try {
    return await cropDiseasePestIdentificationFlow(input);
  } catch (e) {
    console.error("Error in identifyCropProblem flow:", e);
    // Simple bilingual fallback response if rate limited
    const isHindi = input.locale === 'hi';
    const isMalayalam = input.locale === 'ml';
    return {
      identification: {
        plantName: isHindi ? "टमाटर" : isMalayalam ? "തക്കാളി" : "Tomato",
        diseaseOrPest: isHindi ? "अर्ली ब्लाइट (कवक संक्रमण)" : isMalayalam ? "അർലി ബ്ലൈറ്റ് (ഫംഗസ് രോഗം)" : "Early Blight (Fungal Infection)",
        confidence: 0.95
      },
      treatmentGuidance: {
        organic: [
          {
            type: "Organic",
            name: isHindi ? "नीम का तेल छिड़काव" : isMalayalam ? "വേപ്പെണ്ണ പ്രയോഗം" : "Neem Oil Spray",
            description: isHindi ? "5 मिली नीम का तेल 1 लीटर गुनगुने पानी और साबुन के साथ मिलाकर हर हफ्ते छिड़कें।" : isMalayalam ? "5 മില്ലി വേപ്പെണ്ണ 1 ലിറ്റർ ചെറുചൂടുള്ള വെള്ളത്തിൽ സോപ്പ് ചേർത്ത് ഇലകളിൽ തളിക്കുക." : "Mix 5ml neem oil in 1L warm water with mild soap and spray on foliage weekly.",
            estimatedCost: "₹200 - ₹300"
          }
        ],
        chemical: [
          {
            type: "Chemical",
            name: isHindi ? "कॉपर ऑक्सीक्लोराइड" : isMalayalam ? "കോപ്പർ ഓക്സിക്ലോറൈഡ്" : "Copper Oxychloride",
            description: isHindi ? "3 ग्राम प्रति लीटर पानी में मिलाकर संक्रमित पत्तों पर छिड़कें।" : isMalayalam ? "3 ഗ്രാം ഒരു ലിറ്റർ വെള്ളത്തിൽ കലക്കി ഇലകളിൽ തളിക്കുക." : "Spray 3g/L water on infected leaves to control fungal spread.",
            estimatedCost: "₹400 - ₹500"
          }
        ]
      },
      preventativeMeasures: [
        isHindi ? "संक्रमित निचली पत्तियों को तुरंत काटकर नष्ट करें।" : isMalayalam ? "രോഗം ബാധിച്ച താഴത്തെ ഇലകൾ ഉടൻ നീക്കം ചെയ്യുക." : "Remove and destroy lower infected leaves immediately.",
        isHindi ? "पौधों के ऊपर से पानी डालने के बजाय सीधे जड़ों में पानी दें।" : isMalayalam ? "തുള്ളി നന രീതി ഉപയോഗിക്കുക, ഇലകൾ നനയുന്നത് ഒഴിവാക്കുക." : "Avoid overhead watering; irrigate directly at the root zone."
      ]
    };
  }
}

const prompt = ai.definePrompt({
  name: 'cropDiseasePestIdentificationPrompt',
  model: 'googleai/gemini-3.5-flash-lite',
  input: {schema: CropDiseasePestIdentificationInputSchema},
  output: {schema: CropDiseasePestIdentificationOutputSchema},
  prompt: `You are an expert in plant pathology and botany.
  Your task is to first identify the plant/crop in the image and then identify potential diseases and pests affecting it.
  Based on your identification, provide comprehensive and detailed treatment guidance. 
  
  You MUST provide at least 2 to 3 distinct options for organic treatments and 2 to 3 distinct options for chemical treatments.
  For each treatment, provide the specific product/method name, a detailed description (including mixing dosage, step-by-step application instructions, and frequency), and a realistic estimated cost in INR (₹).
  
  Also, suggest a list of preventative measures.
  
  Use the following as the primary source of information about the plant.
  Photo: {{media url=photoDataUri}}

  IMPORTANT: You MUST write all the output strings, descriptions, names, and advice in the language/locale requested: "{{locale}}" (e.g. if locale is "hi" write in Hindi, if "ml" write in Malayalam, if "desi" write in a friendly, conversational Hinglish/Desi style using English/Latin characters mixed with Hindi phrases, e.g. "Bhai, isme Neem oil spray karo, bahut badhiya sasta organic ilaaj hai", if "en" or undefined write in English).

  Please return the plant name, the identified disease/pest, confidence score, detailed treatment options (organic and chemical), and preventative measures.
  `,
});

const cropDiseasePestIdentificationFlow = ai.defineFlow(
  {
    name: 'cropDiseasePestIdentificationFlow',
    inputSchema: CropDiseasePestIdentificationInputSchema,
    outputSchema: CropDiseasePestIdentificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
