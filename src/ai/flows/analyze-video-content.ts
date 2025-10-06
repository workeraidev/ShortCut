'use server';

/**
 * @fileOverview Analyzes a YouTube video to extract key moments for creating engaging shorts.
 *
 * - analyzeVideoContent - A function that handles the video content analysis process.
 * - AnalyzeVideoContentInput - The input type for the analyzeVideoContent function.
 * - AnalyzeVideoContentOutput - The return type for the analyzeVideoContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoContentInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the YouTube video to analyze.'),
});
export type AnalyzeVideoContentInput = z.infer<typeof AnalyzeVideoContentInputSchema>;

const AnalyzeVideoContentOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the video content.'),
  viralMoments: z
    .array(
      z.object({
        timestamp: z.string().describe('The timestamp of the viral moment.'),
        duration: z.string().describe('The duration of the viral moment.'),
        description: z.string().describe('A description of the viral moment.'),
        hookReason: z.string().describe('The reason why this moment is engaging.'),
        viralScore: z.number().describe('A score indicating the viral potential (1-10).'),
      })
    )
    .describe('List of potential viral moments with timestamps and descriptions.'),
  keyQuotes: z.array(z.string()).describe('Memorable quotes extracted from the video.'),
  visualHighlights: z
    .array(
      z.object({
        timestamp: z.string().describe('The timestamp of the visual highlight.'),
        description: z.string().describe('A description of the visual highlight.'),
      })
    )
    .describe('Visually striking moments identified in the video.'),
  targetAudience: z
    .object({
      demographic: z.string().describe('The primary demographic of the target audience.'),
      recommendedDuration: z.string().describe('The ideal short duration (15s, 30s, 60s).'),
      hashtags: z.array(z.string()).describe('Recommended hashtags for the short.'),
    })
    .describe('Details about the target audience.'),
});
export type AnalyzeVideoContentOutput = z.infer<typeof AnalyzeVideoContentOutputSchema>;

export async function analyzeVideoContent(input: AnalyzeVideoContentInput): Promise<AnalyzeVideoContentOutput> {
  return analyzeVideoContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoContentPrompt',
  input: {schema: AnalyzeVideoContentInputSchema},
  output: {schema: AnalyzeVideoContentOutputSchema},
  prompt: `Analyze this YouTube video and extract key information for creating engaging shorts:

1. CONTENT SUMMARY:
   - Provide a compelling 2-3 sentence summary of the main topic
   - Identify the video's niche/category (tech, lifestyle, education, etc.)
   - Extract the emotional tone (inspirational, educational, entertaining, etc.)

2. VIRAL MOMENTS IDENTIFICATION:
   - List 5-7 potential "hook" moments with timestamps that would work as shorts
   - For each moment, explain why it's engaging (surprising fact, emotional peak, visual appeal, etc.)
   - Rate each moment's viral potential (1-10)

3. KEY QUOTES & SOUNDBITES:
   - Extract 3-5 memorable quotes that could standalone
   - Identify any catchphrases or repeating themes
   - Note any background music or sound effects that enhance the moment

4. VISUAL HIGHLIGHTS:
   - Describe visually striking moments (animations, demonstrations, reactions)
   - Identify scenes with high visual variety
   - Note any text overlays or graphics already present

5. TARGET AUDIENCE:
   - Define the primary demographic (age, interests)
   - Suggest ideal short duration (15s, 30s, 60s)
   - Recommend posting time and hashtags

Video URL: {{{videoUrl}}}

Please provide this analysis in structured JSON format.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const analyzeVideoContentFlow = ai.defineFlow(
  {
    name: 'analyzeVideoContentFlow',
    inputSchema: AnalyzeVideoContentInputSchema,
    outputSchema: AnalyzeVideoContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
