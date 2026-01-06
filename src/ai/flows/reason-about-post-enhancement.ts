'use server';
/**
 * @fileOverview This file contains a Genkit flow that determines whether a given post will benefit from AI enhancement.
 *
 * - reasonAboutPostEnhancement - A function that analyzes a post and decides if it needs enhancement.
 * - ReasonAboutPostEnhancementInput - The input type for the reasonAboutPostEnhancement function.
 * - ReasonAboutPostEnhancementOutput - The return type for the reasonAboutPostEnhancement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReasonAboutPostEnhancementInputSchema = z.object({
  postText: z.string().describe('The text content of the post to be analyzed.'),
});
export type ReasonAboutPostEnhancementInput = z.infer<typeof ReasonAboutPostEnhancementInputSchema>;

const ReasonAboutPostEnhancementOutputSchema = z.object({
  shouldEnhance: z
    .boolean()
    .describe(
      'A boolean value indicating whether the post should be enhanced by AI. True if enhancement is recommended, false otherwise.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why the AI recommends enhancing the post or not. Include suggestions of how to make the post better.'
    ),
});
export type ReasonAboutPostEnhancementOutput = z.infer<typeof ReasonAboutPostEnhancementOutputSchema>;

export async function reasonAboutPostEnhancement(
  input: ReasonAboutPostEnhancementInput
): Promise<ReasonAboutPostEnhancementOutput> {
  return reasonAboutPostEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reasonAboutPostEnhancementPrompt',
  input: {schema: ReasonAboutPostEnhancementInputSchema},
  output: {schema: ReasonAboutPostEnhancementOutputSchema},
  prompt: `You are an AI assistant that reviews social media posts and determines if they would benefit from AI enhancement.

  Analyze the following post and determine if it needs enhancement. Consider grammar, clarity, engagement, and overall impact.

  Post: {{{postText}}}

  Based on your analysis, set the 'shouldEnhance' output field to true if you recommend enhancement, and false otherwise.
  In the 'reasoning' output field, explain your decision, and include specific suggestions for improvement if enhancement is recommended.
  If the post already looks good, explain what is good about it, and why no changes are necessary.
  Consider the tone of the post.
  Make sure to mention what could be changed and why.
  Be specific and give advice for the user to consider when posting.
  `,
});

const reasonAboutPostEnhancementFlow = ai.defineFlow(
  {
    name: 'reasonAboutPostEnhancementFlow',
    inputSchema: ReasonAboutPostEnhancementInputSchema,
    outputSchema: ReasonAboutPostEnhancementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
