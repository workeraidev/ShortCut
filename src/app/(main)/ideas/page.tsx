"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateVideoIdeas,
  type GenerateVideoIdeasOutput,
} from "@/ai/flows/generate-video-ideas";
import { GenerateVideoIdeasInputSchema } from "@/ai/schemas/generate-video-ideas-schemas";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/app/page-header";
import { Loader } from "@/components/app/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IdeasPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<GenerateVideoIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof GenerateVideoIdeasInputSchema>>({
    resolver: zodResolver(GenerateVideoIdeasInputSchema),
    defaultValues: {
      topic: "",
      targetAudience: "",
      style: "Educational",
    },
  });

  async function onSubmit(values: z.infer<typeof GenerateVideoIdeasInputSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateVideoIdeas(values);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-primary";
    if (score >= 5) return "text-amber-500";
    return "text-muted-foreground";
  };
  
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 5) return "secondary";
    return "outline";
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="AI Idea Generator"
        description="Never run out of content ideas again. Let AI brainstorm for you."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Brainstorm New Ideas</CardTitle>
          <CardDescription>
            Fill in the details below and our AI will generate unique video ideas for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic / Keyword</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Productivity hacks'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'College students'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a video style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Comedy">Comedy</SelectItem>
                        <SelectItem value="Vlog">Vlog</SelectItem>
                        <SelectItem value="Documentary">Documentary</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Tech Review">Tech Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading && <Loader className="mr-2" />}
                Generate Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-12 w-12 mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Generating creative ideas...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in-50">
           <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              Generated Ideas
            </h2>
          {result.ideas.map((idea, index) => (
            <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <CardTitle className="text-xl">{idea.title}</CardTitle>
                  <div className="flex items-center gap-4 flex-shrink-0">
                     <Badge variant={getScoreBadgeVariant(idea.viralPotential)} className="flex items-center gap-1.5 text-sm px-3 py-1">
                        <Sparkles className={`h-4 w-4 ${getScoreColor(idea.viralPotential)}`} />
                        <span>Viral: {idea.viralPotential}/10</span>
                      </Badge>
                      <Badge variant={getScoreBadgeVariant(idea.suitabilityScore)} className="flex items-center gap-1.5 text-sm px-3 py-1">
                        <span>Fit: {idea.suitabilityScore}/10</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Concept:</h4>
                  <p className="text-muted-foreground">{idea.concept}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Hook:</h4>
                  <p className="text-muted-foreground italic">"{idea.hook}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
