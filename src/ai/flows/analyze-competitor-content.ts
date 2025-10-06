'use server';
/**
 * @fileOverview Analyzes competitor content to provide strategic advantages.
 *
 * - analyzeCompetitorContent - A function that analyzes competitor URLs and provides strategic advantages.
 * - AnalyzeCompetitorContentInput - The input type for the analyzeCompetitorContent function.
 * - AnalyzeCompetitorContentOutput - The return type for the analyzeCompetitorContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCompetitorContentInputSchema = z.object({
  competitorUrls: z.array(z.string().url()).describe('URLs of competitor content to analyze.'),
  myVideoUrl: z.string().url().describe('URL of the user\u0027s video.'),
});
export type AnalyzeCompetitorContentInput = z.infer<typeof AnalyzeCompetitorContentInputSchema>;

const AnalyzeCompetitorContentOutputSchema = z.object({
  contentGaps: z.array(z.string()).describe('Identified content gaps in competitor content.'),
  successPatterns: z.array(z.string()).describe('Identified success patterns in competitor content.'),
  uniqueAngles: z.array(z.string()).describe('Unique angles to differentiate content.'),
  audienceInsights: z.array(z.string()).describe('Audience insights derived from competitor content.'),
  recommendations: z.array(z.object({
    category: z.string().describe('Category of recommendation.'),
    suggestion: z.string().describe('Specific suggestion for improvement.'),
    priority: z.string().describe('Priority level of the suggestion.'),
  })).describe('Actionable recommendations for improvement.'),
});
export type AnalyzeCompetitorContentOutput = z.infer<typeof AnalyzeCompetitorContentOutputSchema>;

export async function analyzeCompetitorContent(input: AnalyzeCompetitorContentInput): Promise<AnalyzeCompetitorContentOutput> {
  return analyzeCompetitorContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompetitorContentPrompt',
  input: {schema: AnalyzeCompetitorContentInputSchema},
  output: {schema: AnalyzeCompetitorContentOutputSchema},
  prompt: `Analyze competing content and provide strategic advantages:\n\nCOMPETITOR URLS:\n{{{competitorUrls}}}\n\nMY VIDEO:\n{{{myVideoUrl}}}\n\nANALYSIS REQUIREMENTS:\n\n1. CONTENT GAPS:\n   - What are competitors missing?\n   - What angles are underexplored?\n   - What questions are left unanswered?\n\n2. PERFORMANCE METRICS:\n   - Analyze video styles that perform best\n   - Identify common elements in top performers\n   - Note what differentiates viral content\n\n3. UNIQUE POSITIONING:\n   - How can we stand out?\n   - What's our unique value proposition?\n   - What format innovations can we try?\n\n4. AUDIENCE INSIGHTS:\n   - What do comments reveal about audience wants?\n   - What complaints appear frequently?\n   - What requests are unfulfilled?\n\n5. IMPROVEMENT OPPORTUNITIES:\n   - Better production quality tactics\n   - More engaging editing techniques\n   - Stronger hooks and storytelling\n\nProvide actionable competitive advantages.`, //tslint:disable-line
  tools: [{
    name: 'urlContext',
  }],
});

const analyzeCompetitorContentFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorContentFlow',
    inputSchema: AnalyzeCompetitorContentInputSchema,
    outputSchema: AnalyzeCompetitorContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
