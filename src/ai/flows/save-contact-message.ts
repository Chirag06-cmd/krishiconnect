'use server';

/**
 * @fileOverview A flow to save a contact message to Firestore.
 */

import {z} from 'genkit';
import {ai} from '@/ai/genkit';
import {db} from '@/lib/firebase-admin';

export const SaveContactMessageInputSchema = z.object({
  name: z.string().describe('The full name of the person sending the message.'),
  email: z.string().email().describe('The email address of the person.'),
  subject: z.string().describe('The subject of the message.'),
  message: z.string().describe('The content of the message.'),
});

export type SaveContactMessageInput = z.infer<typeof SaveContactMessageInputSchema>;

export const saveContactMessageFlow = ai.defineFlow(
  {
    name: 'saveContactMessageFlow',
    inputSchema: SaveContactMessageInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      messageId: z.string().optional(),
    }),
  },
  async (input) => {
    try {
      const messagesCollection = db.collection('contact-messages');
      const docRef = await messagesCollection.add({
        ...input,
        createdAt: new Date().toISOString(),
        read: false, // To track if the message has been read
      });

      console.log('Message saved with ID: ', docRef.id);
      return {
        success: true,
        messageId: docRef.id,
      };
    } catch (error) {
      console.error('Error saving message to Firestore:', error);
      return {
        success: false,
      };
    }
  }
);

export async function saveContactMessage(
  input: SaveContactMessageInput
): Promise<{ success: boolean; messageId?: string }> {
  return saveContactMessageFlow(input);
}
