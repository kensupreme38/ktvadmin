'use server';
/**
 * @fileOverview An AI agent that optimizes the image gallery for each KTV profile.
 *
 * - optimizeKtvImageGallery - A function that handles the image gallery optimization process.
 * - OptimizeKtvImageGalleryInput - The input type for the optimizeKtvImageGallery function.
 * - OptimizeKtvImageGalleryOutput - The return type for the optimizeKtvImageGallery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeKtvImageGalleryInputSchema = z.object({
  ktvName: z.string().describe('The name of the KTV.'),
  images: z
    .array(z.string())
    .describe(
      'An array of image data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type OptimizeKtvImageGalleryInput = z.infer<
  typeof OptimizeKtvImageGalleryInputSchema
>;

const OptimizeKtvImageGalleryOutputSchema = z.object({
  optimizedImages: z
    .array(z.string())
    .describe(
      'An array of optimized image data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  report: z.string().describe('A report summarizing the optimization process.'),
});
export type OptimizeKtvImageGalleryOutput = z.infer<
  typeof OptimizeKtvImageGalleryOutputSchema
>;

export async function optimizeKtvImageGallery(
  input: OptimizeKtvImageGalleryInput
): Promise<OptimizeKtvImageGalleryOutput> {
  return optimizeKtvImageGalleryFlow(input);
}

const optimizeKtvImageGalleryPrompt = ai.definePrompt({
  name: 'optimizeKtvImageGalleryPrompt',
  input: {schema: OptimizeKtvImageGalleryInputSchema},
  output: {schema: OptimizeKtvImageGalleryOutputSchema},
  prompt: `You are an AI assistant that optimizes image galleries for KTV profiles. 

  You will receive a list of images for a KTV and optimize them to enhance the visual appeal and user experience.
  For each image, you should:
  1. Check if the image is relevant to the KTV profile (e.g., interior, services, atmosphere).
  2. Check the quality of the image.
  3. Generate an optimized version of the image.

  KTV Name: {{{ktvName}}}
  Images: {{#each images}} {{media url=this}} {{/each}}

  Output the optimized images and a report summarizing the optimization process.
  `,
});

const optimizeKtvImageGalleryFlow = ai.defineFlow(
  {
    name: 'optimizeKtvImageGalleryFlow',
    inputSchema: OptimizeKtvImageGalleryInputSchema,
    outputSchema: OptimizeKtvImageGalleryOutputSchema,
  },
  async input => {
    const {output} = await optimizeKtvImageGalleryPrompt(input);
    return output!;
  }
);
