'use server';

/**
 * @fileOverview Summarizes KTV reviews using AI.
 *
 * - summarizeKtvReviews - A function that summarizes KTV reviews.
 * - SummarizeKtvReviewsInput - The input type for the summarizeKtvReviews function.
 * - SummarizeKtvReviewsOutput - The return type for the summarizeKtvReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeKtvReviewsInputSchema = z.object({
  reviews: z.string().describe('The reviews to summarize.'),
});
export type SummarizeKtvReviewsInput = z.infer<typeof SummarizeKtvReviewsInputSchema>;

const SummarizeKtvReviewsOutputSchema = z.object({
  summary: z.string().describe('The summary of the reviews.'),
});
export type SummarizeKtvReviewsOutput = z.infer<typeof SummarizeKtvReviewsOutputSchema>;

export async function summarizeKtvReviews(input: SummarizeKtvReviewsInput): Promise<SummarizeKtvReviewsOutput> {
  return summarizeKtvReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeKtvReviewsPrompt',
  input: {schema: SummarizeKtvReviewsInputSchema},
  output: {schema: SummarizeKtvReviewsOutputSchema},
  prompt: `Summarize the following KTV reviews. Highlight key points and overall sentiment.\n\nReviews: {{{reviews}}}`,
});

const summarizeKtvReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeKtvReviewsFlow',
    inputSchema: SummarizeKtvReviewsInputSchema,
    outputSchema: SummarizeKtvReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
