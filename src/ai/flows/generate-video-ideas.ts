'use server';

/**
 * @fileOverview A flow to generate creative video ideas for content creators.
 *
 * - generateVideoIdeas - A function that brainstorms video ideas based on a topic, audience, and style.
 * - GenerateVideoIdeasInput - The input type for the generateVideoIdeas function.
 * - GenerateVideoIdeasOutput - The return type for the generateVideoIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateVideoIdeasInputSchema = z.object({
  topic: z.string().describe('The main topic or keyword for the video ideas.'),
  targetAudience: z.string().describe('The specific audience you want to reach.'),
  style: z.string().describe('The desired style of the video (e.g., educational, comedy, vlog, documentary).'),
});
export type GenerateVideoIdeasInput = z.infer<typeof GenerateVideoIdeasInputSchema>;

export const GenerateVideoIdeasOutputSchema = z.object({
  ideas: z.array(z.object({
    title: z.string().describe('A catchy, viral-potential title for the video.'),
    concept: z.string().describe('A brief but compelling concept for the video.'),
    hook: z.string().describe('A strong opening hook to grab viewer attention in the first 3 seconds.'),
    viralPotential: z.number().min(1).max(10).describe('A score from 1-10 indicating the viral potential.'),
    suitabilityScore: z.number().min(1).max(10).describe('A score from 1-10 indicating how well it matches the requested style and audience.'),
  })).describe('An array of creative video ideas.'),
});
export type GenerateVideoIdeasOutput = z.infer<typeof GenerateVideoIdeasOutputSchema>;

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

Think outside the box. Aim for ideas that are original, emotionally resonant, or provide exceptional value. Avoid generic or overdone concepts. Present the 5 ideas in a structured format.`,
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
