"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  analyzeVideoContent,
  type AnalyzeVideoContentOutput,
} from "@/ai/flows/analyze-video-content";
import { useToast } from "@/hooks/use-toast";

import { PageHeader } from "@/components/app/page-header";
import { Loader } from "@/components/app/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL."),
});

export default function AnalyzePage() {
  const { toast } = useToast();
  const [result, setResult] = useState<AnalyzeVideoContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeVideoContent(values);
      setResult(analysisResult);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze video. Please check the URL and try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getViralScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 5) return "secondary";
    return "outline";
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Video Analysis"
        description="Analyze any YouTube video to find viral moments and key insights."
      />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analyze a YouTube Video</CardTitle>
          <CardDescription>
            Enter a YouTube video URL to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2" />}
                Analyze Video
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader className="h-8 w-8" />
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.summary}</p>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Viral Moments</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.viralMoments.map((moment, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Moment {index + 1}</CardTitle>
                      <Badge variant={getViralScoreBadgeVariant(moment.viralScore)}>
                        Score: {moment.viralScore}/10
                      </Badge>
                    </div>
                    <CardDescription>
                      {moment.timestamp} ({moment.duration}s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="font-semibold mb-2">Description:</p>
                    <p className="text-muted-foreground mb-4">{moment.description}</p>
                    <p className="font-semibold mb-2">Hook Reason:</p>
                    <p className="text-muted-foreground">{moment.hookReason}</p>
                  </CardContent>
                  <CardFooter>
                     <Button asChild variant="secondary" className="w-full">
                       <Link href={`/script?videoUrl=${form.getValues('videoUrl')}&startTime=${moment.timestamp.split(' - ')[0]}&duration=${moment.duration}`}>Generate Script</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Quotes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.keyQuotes.map((quote, index) => (
                  <blockquote key={index} className="flex items-start gap-4 border-l-4 border-primary pl-4">
                    <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <p className="italic text-muted-foreground">{quote}</p>
                  </blockquote>
                ))}
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                  <h4 className="font-semibold">Demographic</h4>
                  <p className="text-muted-foreground">{result.targetAudience.demographic}</p>
                </div>
                 <div>
                  <h4 className="font-semibold">Recommended Duration</h4>
                  <p className="text-muted-foreground">{result.targetAudience.recommendedDuration}</p>
                </div>
                 <div>
                  <h4 className="font-semibold">Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                  {result.targetAudience.hashtags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
