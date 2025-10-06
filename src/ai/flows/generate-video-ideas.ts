'use server';

/**
 * @fileOverview A flow to generate creative video ideas for content creators.
 *
 * - generateVideoIdeas - A function that brainstorms video ideas based on a topic, audience, and style.
 */

import {ai} from '@/ai/genkit';
import { GenerateVideoIdeasInputSchema, GenerateVideoIdeasOutputSchema, type GenerateVideoIdeasInput, type GenerateVideoIdeasOutput } from '@/ai/schemas/generate-video-ideas-schemas';

export async function generateVideoIdeas(input: GenerateVideoIdeasInput): Promise<GenerateVideoIdeasOutput> {
  return generateVideoIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoIdeasPrompt',
  input: {schema: GenerateVideoIdeasInputSchema},
  output: {schema: GenerateVideoIdeasOutputSchema},
  prompt: `You are a world-class viral video producer and content strategist.
Your task is to brainstorm 5 unique, engaging, and high-potential YouTube Short ideas based on the provided criteria.

Topic: {{{topic}}}
Target Audience: {{{targetAudience}}}
Video Style: {{{style}}}

For each idea, provide the following:
1.  **Title:** A highly clickable and SEO-friendly title.
2.  **Concept:** A one or two-sentence summary of the video idea. It should be clear and compelling.
3.  **Hook:** A powerful opening line or visual concept for the first 3 seconds to maximize viewer retention.
4.  **Viral Potential (1-10):** Your expert assessment of its likelihood to go viral.
5.  **Suitability Score (1-10):** How well the idea fits the requested audience and style.

Think outside the box. Aim for ideas that are original, emotionally resonant, or provide exceptional value. Present the 5 ideas in a structured format.`,
});

const generateVideoIdeasFlow = ai.defineFlow(
  {
    name: 'generateVideoIdeasFlow',
    inputSchema: GenerateVideoIdeasInputSchema,
    outputSchema: GenerateVideoIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
