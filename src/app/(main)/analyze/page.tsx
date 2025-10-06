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
import { Quote, Sparkles, Wand2 } from "lucide-react";

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
  
  const getViralScoreColor = (score: number) => {
    if (score >= 8) return "text-primary";
    if (score >= 5) return "text-amber-500";
    return "text-muted-foreground";
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Video Analysis"
        description="Analyze any YouTube video to find viral moments and key insights."
      />
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Analyze a YouTube Video</CardTitle>
          <CardDescription>
            Enter a YouTube video URL to get started. The magic will happen in seconds.
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
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading && <Loader className="mr-2" />}
                Analyze Video
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-10 w-10 mb-4" />
          <p className="text-muted-foreground">Analyzing video, this may take a moment...</p>
        </div>
      )}

      {result && (
        <div className="space-y-10 animate-in fade-in-50">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              <Sparkles className="inline-block h-7 w-7 mr-2 text-primary" />
              Viral Moments
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.viralMoments.map((moment, index) => (
                <Card key={index} className="flex flex-col group hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Moment {index + 1}</CardTitle>
                      <Badge variant={getViralScoreBadgeVariant(moment.viralScore)} className="flex items-center gap-1.5">
                        <Sparkles className={`h-3 w-3 ${getViralScoreColor(moment.viralScore)}`} />
                        <span>{moment.viralScore}/10</span>
                      </Badge>
                    </div>
                    <CardDescription>
                      {moment.timestamp} ({moment.duration}s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <p className="font-semibold mb-1 text-sm">Description:</p>
                      <p className="text-muted-foreground text-sm">{moment.description}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">Hook Reason:</p>
                      <p className="text-muted-foreground text-sm">{moment.hookReason}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button asChild className="w-full transition-transform group-hover:scale-105">
                       <Link href={`/script?videoUrl=${encodeURIComponent(form.getValues('videoUrl'))}&startTime=${encodeURIComponent(moment.timestamp.split(' - ')[0])}&duration=${encodeURIComponent(moment.duration)}`}>
                         <Wand2 className="mr-2 h-4 w-4"/>
                         Generate Script
                       </Link>
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
                <CardDescription>Memorable soundbites from the video.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.keyQuotes.map((quote, index) => (
                  <blockquote key={index} className="flex items-start gap-4 border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg">
                    <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <p className="italic text-muted-foreground">{quote}</p>
                  </blockquote>
                ))}
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>Insights on who this content is for.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                  <h4 className="font-semibold text-sm">Demographic</h4>
                  <p className="text-muted-foreground">{result.targetAudience.demographic}</p>
                </div>
                 <div>
                  <h4 className="font-semibold text-sm">Recommended Duration</h4>
                  <p className="text-muted-foreground">{result.targetAudience.recommendedDuration}</p>
                </div>
                 <div>
                  <h4 className="font-semibold text-sm">Hashtags</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
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
