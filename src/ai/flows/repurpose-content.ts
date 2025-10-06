'use server';

/**
 * @fileOverview A flow to repurpose existing content (like a blog post) into ideas for short-form videos.
 *
 * - repurposeContent - A function that takes a URL or text and generates short video ideas.
 */

import {ai} from '@/ai/genkit';
import {
  RepurposeContentInputSchema,
  RepurposeContentOutputSchema,
  type RepurposeContentInput,
} from '@/ai/schemas/repurpose-content-schemas';

export async function repurposeContent(input: RepurposeContentInput): Promise<RepurposeContentOutput> {
  return repurposeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'repurposeContentPrompt',
  input: {schema: RepurposeContentInputSchema},
  output: {schema: RepurposeContentOutputSchema},
  prompt: `You are an expert content strategist specializing in repurposing long-form content for short-form video platforms like YouTube Shorts, TikTok, and Reels.

Your task is to analyze the following content and generate a list of compelling short video ideas.

Content Source:
{{#if contentUrl}}
URL: {{{contentUrl}}}
{{/if}}
{{#if contentText}}
Text:
{{{contentText}}}
{{/if}}

First, identify the key takeaways from the content.

Then, for each video idea, provide:
1.  **Title:** A viral-worthy title.
2.  **Format:** The best format for the video (e.g., "Talking Head with Text Overlay", "Quick Tutorial", "Listicle", "Myth Busting", "Story Time").
3.  **Hook:** A powerful opening for the first 3 seconds.
4.  **Content Angle:** The specific part of the original content to focus on.

Generate at least 3-5 distinct video ideas. Focus on creating value and sparking curiosity.`,
});

const repurposeContentFlow = ai.defineFlow(
  {
    name: 'repurposeContentFlow',
    inputSchema: RepurposeContentInputSchema,
    outputSchema: RepurposeContentOutputSchema,
  },
  async input => {
    if (!input.contentUrl && !input.contentText) {
      throw new Error('Either contentUrl or contentText must be provided.');
    }
    const {output} = await prompt(input);
    return output!;
  }
);
