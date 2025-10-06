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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Optimize Your Short</CardTitle>
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
                        rows={5}
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
                      <Input placeholder="e.g., Tech, Lifestyle, Education" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2" />}
                Optimize for Trends
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
              <CardTitle>Optimized Titles</CardTitle>
              <CardDescription>Attention-grabbing titles for your short.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal space-y-2 pl-5">
                {result.optimizedTitles.map((title, i) => <li key={i}>{title}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO-Optimized Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.description}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Trending Topics</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.trendingTopics.map(topic => <Badge key={topic}>{topic}</Badge>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hashtags</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.hashtags.map(tag => <Badge variant="secondary" key={tag}>{tag}</Badge>)}
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle>Posting Time</CardTitle></CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{result.postingTime}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Thumbnail Text</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {result.thumbnailText.map((text, i) => <li key={i}>{text}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Trending Music</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
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
