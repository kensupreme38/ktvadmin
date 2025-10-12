'use server';
/**
 * @fileOverview An AI agent that optimizes a single image.
 *
 * - optimizeImage - A function that handles the image optimization process.
 * - OptimizeImageInput - The input type for the optimizeImage function.
 * - OptimizeImageOutput - The return type for the optimizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeImageInputSchema = z.object({
  image: z
    .string()
    .describe(
      "The image data URI to optimize. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OptimizeImageInput = z.infer<typeof OptimizeImageInputSchema>;

const OptimizeImageOutputSchema = z.object({
  optimizedImage: z
    .string()
    .describe(
      'The optimized image as a data URI. Must include a MIME type and use Base64 encoding.'
    ),
  description: z.string().describe('A brief, descriptive caption for the image.'),
});
export type OptimizeImageOutput = z.infer<typeof OptimizeImageOutputSchema>;

export async function optimizeImage(
  input: OptimizeImageInput
): Promise<OptimizeImageOutput> {
  return optimizeImageFlow(input);
}

const optimizeImagePrompt = ai.definePrompt({
  name: 'optimizeImagePrompt',
  input: {schema: OptimizeImageInputSchema},
  output: {schema: OptimizeImageOutputSchema},
  prompt: `You are an expert photo editor. You will receive an image and your task is to optimize it for a web gallery.
  - Analyze the image and generate a brief, descriptive caption for it.
  - Enhance the image quality (e.g., adjust brightness, contrast, and saturation) to make it more visually appealing.
  - Return the enhanced image as a data URI.

  Image: {{media url=image}}
  `,
});

const optimizeImageFlow = ai.defineFlow(
  {
    name: 'optimizeImageFlow',
    inputSchema: OptimizeImageInputSchema,
    outputSchema: OptimizeImageOutputSchema,
  },
  async input => {
    const {output} = await optimizeImagePrompt(input);
    return output!;
  }
);
