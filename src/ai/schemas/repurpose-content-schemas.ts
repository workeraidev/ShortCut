import {z} from 'genkit';

export const RepurposeContentInputSchema = z.object({
  contentUrl: z
    .string()
    .url()
    .optional()
    .describe('The URL of the article or blog post to repurpose.'),
  contentText: z
    .string()
    .optional()
    .describe('The raw text of the content to repurpose.'),
});
export type RepurposeContentInput = z.infer<typeof RepurposeContentInputSchema>;

export const RepurposeContentOutputSchema = z.object({
  keyTakeaways: z
    .array(z.string())
    .describe('The most important points extracted from the content.'),
  videoIdeas: z
    .array(
      z.object({
        title: z.string().describe('A catchy title for the short video.'),
        format: z
          .string()
          .describe(
            'The suggested format (e.g., Talking Head, Tutorial, Listicle, Myth Busting).'
          ),
        hook: z.string().describe('A strong opening hook for the video.'),
        contentAngle: z
          .string()
          .describe(
            'The specific angle or snippet from the original content to focus on.'
          ),
      })
    )
    .describe('An array of short-form video ideas based on the content.'),
});
export type RepurposeContentOutput = z.infer<
  typeof RepurposeContentOutputSchema
>;
