import {z} from 'genkit';

export const GenerateVideoIdeasInputSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters long.").describe('The main topic or keyword for the video ideas.'),
  targetAudience: z.string().min(2, "Target audience must be at least 2 characters long.").describe('The specific audience you want to reach.'),
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
