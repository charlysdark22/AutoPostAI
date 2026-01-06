'use server';

/**
 * @fileOverview Enhances a generated Facebook post using AI to improve grammar, readability, and engagement.
 *
 * - enhanceGeneratedPost - A function that enhances the generated post.
 * - EnhanceGeneratedPostInput - The input type for the enhanceGeneratedPost function.
 * - EnhanceGeneratedPostOutput - The return type for the enhanceGeneratedPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { reasonAboutPostEnhancement } from './reason-about-post-enhancement';

const EnhanceGeneratedPostInputSchema = z.object({
  postContent: z.string().describe('The content of the Facebook post to enhance.'),
});
export type EnhanceGeneratedPostInput = z.infer<typeof EnhanceGeneratedPostInputSchema>;

const EnhanceGeneratedPostOutputSchema = z.object({
  enhancedPostContent: z
    .string()
    .describe('The enhanced content of the Facebook post.'),
});
export type EnhanceGeneratedPostOutput = z.infer<typeof EnhanceGeneratedPostOutputSchema>;

export async function enhanceGeneratedPost(
  input: EnhanceGeneratedPostInput
): Promise<EnhanceGeneratedPostOutput> {
  return enhanceGeneratedPostFlow(input);
}

const enhancePostPrompt = ai.definePrompt({
  name: 'enhancePostPrompt',
  input: {schema: EnhanceGeneratedPostInputSchema},
  output: {schema: EnhanceGeneratedPostOutputSchema},
  prompt: `You are an AI expert in improving Facebook posts.

  Your goal is to enhance the provided Facebook post content to improve grammar, readability, and engagement.

  Original Post Content: {{{postContent}}}

  Enhanced Post Content:`,
});

const enhanceGeneratedPostFlow = ai.defineFlow(
  {
    name: 'enhanceGeneratedPostFlow',
    inputSchema: EnhanceGeneratedPostInputSchema,
    outputSchema: z.object({ // The flow can return more than the prompt output
        enhancedPostContent: z.string(),
        shouldEnhance: z.boolean(),
        reasoning: z.string(),
    }),
  },
  async input => {
    const { shouldEnhance, reasoning } = await reasonAboutPostEnhancement({ postText: input.postContent });

    if (!shouldEnhance) {
      return {
        enhancedPostContent: input.postContent,
        shouldEnhance: false,
        reasoning: reasoning,
      };
    }

    const {output} = await enhancePostPrompt(input);
    return {
      enhancedPostContent: output?.enhancedPostContent ?? input.postContent,
      shouldEnhance: true,
      reasoning: reasoning,
    };
  }
);
