'use server';

/**
 * @fileOverview This flow enhances a short for maximum reach through accessibility and localization.
 *
 * - enhanceShortAccessibility - A function that enhances the short for accessibility.
 * - EnhanceShortAccessibilityInput - The input type for the enhanceShortAccessibility function.
 * - EnhanceShortAccessibilityOutput - The return type for the enhanceShortAccessibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceShortAccessibilityInputSchema = z.object({
  shortContent: z.string().describe('The content of the short video.'),
});

export type EnhanceShortAccessibilityInput = z.infer<
  typeof EnhanceShortAccessibilityInputSchema
>;

const CaptionSchema = z.object({
  startTime: z.string().describe('The start time of the caption.'),
  endTime: z.string().describe('The end time of the caption.'),
  text: z.string().describe('The caption text.'),
});

const EnhanceShortAccessibilityOutputSchema = z.object({
  captions: z.array(CaptionSchema).describe('Generated captions for the short.'),
  targetLanguages: z.array(z.string()).describe('Key target languages based on content.'),
  accessibilityScore: z.number().describe('Score representing the accessibility of the short.'),
  recommendations: z
    .array(z.string())
    .describe('Recommendations for improving accessibility.'),
});

export type EnhanceShortAccessibilityOutput = z.infer<
  typeof EnhanceShortAccessibilityOutputSchema
>;

export async function enhanceShortAccessibility(
  input: EnhanceShortAccessibilityInput
): Promise<EnhanceShortAccessibilityOutput> {
  return enhanceShortAccessibilityFlow(input);
}

const enhanceShortAccessibilityPrompt = ai.definePrompt({
  name: 'enhanceShortAccessibilityPrompt',
  input: {schema: EnhanceShortAccessibilityInputSchema},
  output: {schema: EnhanceShortAccessibilityOutputSchema},
  prompt: `Enhance this short for maximum reach through accessibility and localization:

SHORT CONTENT: {{{shortContent}}}

ENHANCEMENT TASKS:

1. CAPTION GENERATION:
   - Create accurate, properly timed captions
   - Add sound effect descriptions [music playing], [laughter]
   - Include speaker labels if multiple people

2. TRANSLATION OPTIMIZATION:
   - Identify key target languages based on content
   - Adapt jokes/references for cultural relevance
   - Suggest localized hashtags

3. VISUAL ACCESSIBILITY:
   - Ensure text contrast meets WCAG standards
   - Suggest alternative descriptions for visual elements
   - Recommend timing for text readability

4. INCLUSIVE LANGUAGE:
   - Review for potentially exclusive terminology
   - Suggest more inclusive alternatives
   - Ensure broad appeal across demographics

5. GLOBAL APPEAL:
   - Identify culturally universal elements
   - Suggest adaptations for international markets
   - Recommend region-specific posting strategies

Prioritize authenticity while maximizing reach. Output the captions as a JSON array of objects with startTime, endTime, and text fields.  Output the targetLanguages as a JSON array of strings.  Output recommendations as a JSON array of strings.  Output accessibilityScore as a single number.
`,
});

const enhanceShortAccessibilityFlow = ai.defineFlow(
  {
    name: 'enhanceShortAccessibilityFlow',
    inputSchema: EnhanceShortAccessibilityInputSchema,
    outputSchema: EnhanceShortAccessibilityOutputSchema,
  },
  async input => {
    const {output} = await enhanceShortAccessibilityPrompt(input);
    return output!;
  }
);
