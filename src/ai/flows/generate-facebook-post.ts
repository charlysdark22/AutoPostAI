'use server';

/**
 * @fileOverview Flow for generating Facebook posts from a topic.
 *
 * - generateFacebookPost - A function that generates a Facebook post.
 * - GenerateFacebookPostInput - The input type for the generateFacebookPost function.
 * - GenerateFacebookPostOutput - The return type for the generateFacebookPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFacebookPostInputSchema = z.object({
  topic: z.string().describe('The topic to generate a Facebook post about.'),
});
export type GenerateFacebookPostInput = z.infer<typeof GenerateFacebookPostInputSchema>;

const GenerateFacebookPostOutputSchema = z.object({
  post: z.string().describe('The generated Facebook post.'),
});
export type GenerateFacebookPostOutput = z.infer<typeof GenerateFacebookPostOutputSchema>;

export async function generateFacebookPost(input: GenerateFacebookPostInput): Promise<GenerateFacebookPostOutput> {
  return generateFacebookPostFlow(input);
}

const generateFacebookPostPrompt = ai.definePrompt({
  name: 'generateFacebookPostPrompt',
  input: {schema: GenerateFacebookPostInputSchema},
  output: {schema: GenerateFacebookPostOutputSchema},
  prompt: `You are an expert social media content creator. Generate a engaging Facebook post about the following topic: {{{topic}}}`,
});

const generateFacebookPostFlow = ai.defineFlow(
  {
    name: 'generateFacebookPostFlow',
    inputSchema: GenerateFacebookPostInputSchema,
    outputSchema: GenerateFacebookPostOutputSchema,
  },
  async input => {
    const {output} = await generateFacebookPostPrompt(input);
    return output!;
  }
);
