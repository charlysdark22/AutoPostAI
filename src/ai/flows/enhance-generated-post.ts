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

const EnhanceGeneratedPostInputSchema = z.object({
  postContent: z.string().describe('The content of the Facebook post to enhance.'),
});
export type EnhanceGeneratedPostInput = z.infer<typeof EnhanceGeneratedPostInputSchema>;

const EnhanceGeneratedPostOutputSchema = z.object({
  enhancedPostContent: z
    .string()
    .describe('The enhanced content of the Facebook post.'),
  shouldEnhance: z
    .boolean()
    .describe(
      'Whether the post content should be enhanced, as determined by the AI.'
    ),
  reasoning: z
    .string()
    .describe('The AI reasoning for whether the post should be enhanced.'),
});
export type EnhanceGeneratedPostOutput = z.infer<typeof EnhanceGeneratedPostOutputSchema>;

export async function enhanceGeneratedPost(
  input: EnhanceGeneratedPostInput
): Promise<EnhanceGeneratedPostOutput> {
  return enhanceGeneratedPostFlow(input);
}

const shouldEnhancePostTool = ai.defineTool({
  name: 'shouldEnhancePost',
  description:
    'Determines whether a given post content should be enhanced to improve grammar, readability, and engagement.',
  inputSchema: z.object({
    postContent: z.string().describe('The content of the Facebook post.'),
  }),
  outputSchema: z.object({
    shouldEnhance: z.boolean().describe('Whether the post should be enhanced.'),
    reasoning: z.string().describe('The reasoning for the decision.'),
  }),
  async (input) => {
    // Implement the logic to determine if the post should be enhanced here.
    // This is a placeholder; replace it with actual AI-driven logic.
    // For now, let's just return a dummy response.
    return {
      shouldEnhance: Math.random() > 0.5, // Simulate a 50/50 chance
      reasoning: 'This is a placeholder reasoning. Implement real AI logic here.',
    };
  },
});

const enhancePostPrompt = ai.definePrompt({
  name: 'enhancePostPrompt',
  input: {schema: EnhanceGeneratedPostInputSchema},
  output: {schema: EnhanceGeneratedPostOutputSchema},
  prompt: `You are an AI expert in improving Facebook posts.

  Your goal is to enhance the provided Facebook post content to improve grammar, readability, and engagement.

  Original Post Content: {{{postContent}}}

  Enhanced Post Content:`,
  tools: [shouldEnhancePostTool],
  system: `You must first decide if you need to enhance a post with the shouldEnhancePost tool. If it does not need to be enhanced, return the original post content.`, // Instruction to use the tool.
});

const enhanceGeneratedPostFlow = ai.defineFlow(
  {
    name: 'enhanceGeneratedPostFlow',
    inputSchema: EnhanceGeneratedPostInputSchema,
    outputSchema: EnhanceGeneratedPostOutputSchema,
  },
  async input => {
    const shouldEnhanceResult = await shouldEnhancePostTool({
      postContent: input.postContent,
    });

    if (!shouldEnhanceResult.shouldEnhance) {
      return {
        enhancedPostContent: input.postContent,
        shouldEnhance: false,
        reasoning: shouldEnhanceResult.reasoning,
      };
    }

    const {output} = await enhancePostPrompt(input);
    return {
      enhancedPostContent: output?.enhancedPostContent ?? input.postContent,
      shouldEnhance: true,
      reasoning: shouldEnhanceResult.reasoning,
    };
  }
);
