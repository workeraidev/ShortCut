'use server';

/**
 * @fileOverview A flow to optimize a YouTube Short for maximum viral potential using current trends.
 *
 * - optimizeShortForTrends - A function that optimizes a short for trends.
 * - OptimizeShortForTrendsInput - The input type for the optimizeShortForTrends function.
 * - OptimizeShortForTrendsOutput - The return type for the optimizeShortForTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeShortForTrendsInputSchema = z.object({
  shortDetails: z.string().describe('Details of the short to optimize.'),
  category: z.string().describe('The category of the short.'),
});
export type OptimizeShortForTrendsInput = z.infer<
  typeof OptimizeShortForTrendsInputSchema
>;

const OptimizeShortForTrendsOutputSchema = z.object({
  trendingTopics: z.array(z.string()).describe('Top trending topics in the short category.'),
  optimizedTitles: z.array(z.string()).describe('Attention-grabbing titles for the short.'),
  thumbnailText: z.array(z.string()).describe('Bold text for the thumbnail.'),
  description: z.string().describe('SEO-optimized description for the short.'),
  hashtags: z.array(z.string()).describe('Relevant hashtags for the short.'),
  postingTime: z.string().describe('Best time to post the short.'),
  trendingMusic: z.array(z.string()).describe('Trending audio tracks for shorts.'),
  uniqueAngles: z.array(z.string()).describe('Unique angles for the short.'),
});
export type OptimizeShortForTrendsOutput = z.infer<
  typeof OptimizeShortForTrendsOutputSchema
>;

export async function optimizeShortForTrends(
  input: OptimizeShortForTrendsInput
): Promise<OptimizeShortForTrendsOutput> {
  return optimizeShortForTrendsFlow(input);
}

const optimizeShortForTrendsPrompt = ai.definePrompt({
  name: 'optimizeShortForTrendsPrompt',
  input: {schema: OptimizeShortForTrendsInputSchema},
  output: {schema: OptimizeShortForTrendsOutputSchema},
  prompt: `Optimize this YouTube Short for maximum viral potential using current trends:

SHORT DETAILS:
{{{shortDetails}}}

OPTIMIZATION TASKS:

1. TRENDING RESEARCH (Use Google Search grounding):
   - What are the top trending topics in {{{category}}} right now?
   - What YouTube Shorts formats are currently viral?
   - What audio tracks are trending for shorts?
   - What hashtags are gaining traction in this niche?

2. TITLE OPTIMIZATION:
   - Create 5 attention-grabbing titles
   - Use trending keywords naturally
   - Include power words (shocking, secret, mistake, hack, etc.)
   - Optimize for YouTube search and recommendations

3. THUMBNAIL TEXT:
   - Suggest 3-5 words of bold text for thumbnail
   - Use high-contrast, readable fonts
   - Include emoji suggestions

4. DESCRIPTION OPTIMIZATION:
   - Write SEO-optimized description (first 100 chars crucial)
   - Include 15-20 relevant hashtags
   - Add timestamps if applicable
   - Include strategic keyword placement

5. POSTING STRATEGY:
   - Best time to post based on audience timezone
   - Cross-platform sharing strategy (TikTok, Instagram Reels)
   - Series potential (can this be part 1 of multiple shorts?)

6. COMPETITION ANALYSIS:
   - Compare with similar successful shorts
   - Identify gaps in current content
   - Suggest unique angles

Provide actionable recommendations with data-backed reasoning.`,
});

const optimizeShortForTrendsFlow = ai.defineFlow(
  {
    name: 'optimizeShortForTrendsFlow',
    inputSchema: OptimizeShortForTrendsInputSchema,
    outputSchema: OptimizeShortForTrendsOutputSchema,
  },
  async input => {
    const {output} = await optimizeShortForTrendsPrompt(input);
    return output!;
  }
);
