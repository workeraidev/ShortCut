'use server';

/**
 * @fileOverview A flow that analyzes a long-form video and creates a strategic multi-short series plan.
 *
 * - planMultiShortSeries - A function that handles the multi-short series planning process.
 * - PlanMultiShortSeriesInput - The input type for the planMultiShortSeries function.
 * - PlanMultiShortSeriesOutput - The return type for the planMultiShortSeries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlanMultiShortSeriesInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the long-form video to analyze.'),
  duration: z.string().describe('The duration of the video.'),
});
export type PlanMultiShortSeriesInput = z.infer<typeof PlanMultiShortSeriesInputSchema>;

const PlanMultiShortSeriesOutputSchema = z.object({
  seriesTitle: z.string().describe('The title of the multi-short series.'),
  shorts: z.array(
    z.object({
      episodeNumber: z.number().describe('The episode number in the series.'),
      title: z.string().describe('The title of the short.'),
      startTime: z.string().describe('The start time of the short in the original video.'),
      endTime: z.string().describe('The end time of the short in the original video.'),
      hook: z.string().describe('A compelling hook for the short.'),
      mainPoint: z.string().describe('The main point of the short.'),
      cliffhanger: z.string().describe('A cliffhanger to drive viewers to the next video.'),
      postingDateTime: z.string().describe('The recommended date and time to post the short.'),
    })
  ).describe('An array of short plans for the series.'),
  brandingElements: z.object({
    colorScheme: z.string().describe('The color scheme for the series branding.'),
    fontStyle: z.string().describe('The font style for the series branding.'),
    introStyle: z.string().describe('The intro style for the series branding.'),
  }).describe('The branding elements for the series.'),
  engagementTactics: z.array(z.string()).describe('An array of engagement tactics for the series.'),
});
export type PlanMultiShortSeriesOutput = z.infer<typeof PlanMultiShortSeriesOutputSchema>;

export async function planMultiShortSeries(input: PlanMultiShortSeriesInput): Promise<PlanMultiShortSeriesOutput> {
  return planMultiShortSeriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'planMultiShortSeriesPrompt',
  input: {schema: PlanMultiShortSeriesInputSchema},
  output: {schema: PlanMultiShortSeriesOutputSchema},
  prompt: `Analyze this long-form video and create a strategic multi-short series plan:

VIDEO URL: {{{videoUrl}}}
VIDEO DURATION: {{{duration}}}

SERIES PLANNING:

1. CONTENT BREAKDOWN:
   - Divide video into 5-10 shorts with natural flow
   - Create narrative arc across shorts (build anticipation)
   - Ensure each short can standalone but creates desire for next

2. HOOKS & CLIFFHANGERS:
   - Design compelling hooks for each short
   - Add cliffhangers to drive viewers to next video
   - Create callback references between shorts

3. PROGRESSIVE VALUE:
   - Structure information from basic to advanced
   - Tease advanced content in early shorts
   - Build on previous shorts' concepts

4. POSTING SCHEDULE:
   - Recommend optimal posting frequency
   - Suggest days/times for each short
   - Create urgency with limited-time angles

5. CROSS-PROMOTION:
   - Design end screens that promote next video
   - Create consistent visual branding
   - Build series identity (title format, intro style)

6. ENGAGEMENT STRATEGY:
   - Polls and questions across series
   - Community posts between shorts
   - Behind-the-scenes content ideas

Output should be a complete content calendar in JSON format.`, // Ensure output is valid JSON.
});

const planMultiShortSeriesFlow = ai.defineFlow(
  {
    name: 'planMultiShortSeriesFlow',
    inputSchema: PlanMultiShortSeriesInputSchema,
    outputSchema: PlanMultiShortSeriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
