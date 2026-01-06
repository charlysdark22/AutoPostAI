'use server';

/**
 * @fileOverview Flow for generating Facebook posts from a topic and an optional image.
 *
 * - generateFacebookPost - A function that generates a Facebook post.
 * - GenerateFacebookPostInput - The input type for the generateFacebookPost function.
 * - GenerateFacebookPostOutput - The return type for the generateFacebookPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFacebookPostInputSchema = z.object({
  topic: z.string().describe('The topic to generate a Facebook post about.'),
  photoDataUri: z.string().optional().describe(
    "An optional photo for the post, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
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
  prompt: `You are an expert social media content creator. 
  
  Generate an engaging Facebook post about the following topic: {{{topic}}}
  
  {{#if photoDataUri}}
  The user has provided an image. Use the content of the image as additional context to make the post more relevant and engaging.
  Image: {{media url=photoDataUri}}
  {{/if}}

  The post should be engaging, include relevant hashtags, and encourage interaction.
  `,
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
