"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  optimizeShortForTrends,
  type OptimizeShortForTrendsOutput,
} from "@/ai/flows/optimize-short-for-trends";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/app/page-header";
import { Loader } from "@/components/app/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  shortDetails: z
    .string()
    .min(10, "Please describe your short video."),
  category: z.string().min(2, "Please enter a category."),
});

export default function OptimizePage() {
  const { toast } = useToast();
  const [result, setResult] = useState<OptimizeShortForTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shortDetails: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await optimizeShortForTrends(values);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize short. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Trend-Aware Optimization"
        description="Optimize your shorts with trending topics, titles, and music."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Optimize Your Short</CardTitle>
          <CardDescription>Describe your short and its category to get trend-based optimizations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="shortDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your short video, its topic, and main points..."
                        rows={6}
                        className="bg-background/50 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tech, Lifestyle, Education" {...field} className="bg-background/50 text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading && <Loader className="mr-2" />}
                Optimize for Trends
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-12 w-12 mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Catching the next wave of trends...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in-50">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Optimized Titles</CardTitle>
              <CardDescription>Attention-grabbing titles designed to get clicks.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal space-y-3 pl-5 text-lg">
                {result.optimizedTitles.map((title, i) => <li key={i} className="font-semibold text-foreground/90">{title}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>SEO-Optimized Description</CardTitle>
              <CardDescription>A description crafted to improve search visibility.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg text-base">{result.description}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Trending Topics</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.trendingTopics.map(topic => <Badge key={topic} className="text-sm px-3 py-1">{topic}</Badge>)}
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Hashtags</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.hashtags.map(tag => <Badge variant="secondary" key={tag} className="text-sm px-3 py-1">{tag}</Badge>)}
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader><CardTitle>Best Posting Time</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{result.postingTime}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Thumbnail Text Ideas</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base">
                    {result.thumbnailText.map((text, i) => <li key={i}>{text}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Trending Music Suggestions</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base">
                    {result.trendingMusic.map((music, i) => <li key={i}>{music}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
