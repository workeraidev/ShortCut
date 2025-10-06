'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating YouTube Shorts scripts based on a selected video segment.
 *
 * The flow takes video context and script requirements as input and returns a structured script with a hook, main content, visual directions, audio notes, call-to-action, and engagement elements.
 *
 * - generateShortScript - A function that handles the script generation process.
 * - GenerateShortScriptInput - The input type for the generateShortScript function.
 * - GenerateShortScriptOutput - The return type for the generateShortScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShortScriptInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the original YouTube video.'),
  startTime: z.string().describe('The start timestamp of the video segment (e.g., 0:15).'),
  endTime: z.string().describe('The end timestamp of the video segment (e.g., 0:30).'),
  category: z.string().describe('The category of the video (e.g., tech, lifestyle, education).'),
  duration: z.string().describe('The target duration of the short in seconds (e.g., 15, 30, 60).'),
});
export type GenerateShortScriptInput = z.infer<typeof GenerateShortScriptInputSchema>;

const GenerateShortScriptOutputSchema = z.object({
  title: z.string().describe('The title of the short.'),
  description: z.string().describe('A brief description of the short.'),
  hook: z.string().describe('An attention-grabbing opening line for the short.'),
  script: z.array(
    z.object({
      timestamp: z.string().describe('The timestamp in the short (e.g., 0:00).'),
      narration: z.string().describe('The narration for this timestamp.'),
      textOverlay: z.string().describe('The text overlay to display at this timestamp.'),
      visualDirection: z.string().describe('Visual direction for this timestamp (e.g., zoom in, transition).'),
      audioNote: z.string().describe('Audio notes for this timestamp (e.g., background music, sound effect).'),
    })
  ).describe('A second-by-second breakdown of the short script.'),
  callToAction: z.string().describe('An engaging end screen text for the short.'),
  engagementQuestions: z.array(z.string()).describe('Questions to drive engagement in the comments.'),
  suggestedMusic: z.string().describe('Suggested background music style (e.g., trending, upbeat, dramatic).'),
  estimatedViews: z.string().describe('Estimated view count.'),
});
export type GenerateShortScriptOutput = z.infer<typeof GenerateShortScriptOutputSchema>;

export async function generateShortScript(input: GenerateShortScriptInput): Promise<GenerateShortScriptOutput> {
  return generateShortScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShortScriptPrompt',
  input: {schema: GenerateShortScriptInputSchema},
  output: {schema: GenerateShortScriptOutputSchema},
  prompt: `Create an engaging YouTube Shorts script based on this video segment:\n\nVIDEO CONTEXT:\n- Original video URL: {{{videoUrl}}}\n- Selected timestamp: {{{startTime}}} to {{{endTime}}}\n- Video category: {{{category}}}\n- Target duration: {{{duration}}} seconds\n\nSCRIPT REQUIREMENTS:\n\n1. HOOK (First 3 seconds):\n   - Create an attention-grabbing opening line\n   - Use curiosity gaps, bold statements, or questions\n   - Make viewers want to keep watching\n\n2. MAIN CONTENT:\n   - Adapt the video segment for vertical format\n   - Add context if needed for standalone viewing\n   - Keep language punchy and concise\n   - Include call-outs for key moments\n\n3. VISUAL DIRECTIONS:\n   - Suggest text overlays and their timing\n   - Recommend zoom-ins or emphasis points\n   - Note transitions between scenes\n   - Suggest emoji or graphic placements\n\n4. AUDIO NOTES:\n   - Identify background music style (trending, upbeat, dramatic)\n   - Note sound effect opportunities\n   - Mark places for audio emphasis\n\n5. CALL-TO-ACTION:\n   - Create engaging end screen text\n   - Suggest follow-up prompts\n   - Include hook for next video\n\n6. ENGAGEMENT ELEMENTS:\n   - Add 2-3 questions in comments to drive engagement\n   - Suggest controversial/discussion-worthy angles\n   - Include shareability factors\n\nOUTPUT FORMAT: Provide a second-by-second breakdown with all elements.`,
});

const generateShortScriptFlow = ai.defineFlow(
  {
    name: 'generateShortScriptFlow',
    inputSchema: GenerateShortScriptInputSchema,
    outputSchema: GenerateShortScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
