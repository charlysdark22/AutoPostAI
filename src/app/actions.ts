'use server';

import { z } from 'zod';
import { generateFacebookPost } from '@/ai/flows/generate-facebook-post';
import { reasonAboutPostEnhancement } from '@/ai/flows/reason-about-post-enhancement';
import { enhanceGeneratedPost } from '@/ai/flows/enhance-generated-post';

const generatePostSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
});

const enhancePostSchema = z.object({
  postContent: z.string().min(10, 'Post content is too short to enhance.'),
});

export async function handleGeneratePost(prevState: any, formData: FormData) {
  try {
    const validatedFields = generatePostSchema.safeParse({
      topic: formData.get('topic'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation error.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const result = await generateFacebookPost({ topic: validatedFields.data.topic });
    return {
      message: 'success',
      post: result.post,
    };
  } catch (error) {
    return {
      message: 'An error occurred while generating the post. Please try again.',
      post: '',
    };
  }
}

export async function handleReasonAboutEnhancement(prevState: any, formData: FormData) {
   try {
    const validatedFields = enhancePostSchema.safeParse({
      postContent: formData.get('postContent'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation error.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const result = await reasonAboutPostEnhancement({ postText: validatedFields.data.postContent });
    return {
      message: 'success',
      ...result,
    };
  } catch (error) {
    return {
      message: 'An error occurred during analysis. Please try again.',
    };
  }
}

export async function handleEnhancePost(prevState: any, formData: FormData) {
  try {
    const validatedFields = enhancePostSchema.safeParse({
      postContent: formData.get('postContent'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation error.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    // Note: The prompt asks to use a reasoning tool first. 
    // The `enhanceGeneratedPost` flow itself does not internally use `reasonAboutPostEnhancement`.
    // The UI should call `handleReasonAboutEnhancement` first, then conditionally call this.
    // For this action, we directly call the enhancement flow.
    const result = await enhanceGeneratedPost({ postContent: validatedFields.data.postContent });
    return {
      message: 'success',
      enhancedPostContent: result.enhancedPostContent,
    };
  } catch (error) {
    return {
      message: 'An error occurred while enhancing the post. Please try again.',
    };
  }
}
