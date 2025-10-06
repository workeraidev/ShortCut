"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  planMultiShortSeries,
  type PlanMultiShortSeriesOutput,
} from "@/ai/flows/plan-multi-short-series";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL."),
  duration: z.string().min(1, "Please enter the video duration, e.g., 25:47").regex(/^\d+:\d{2}$/, "Use m:ss format"),
});

export default function SeriesPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<PlanMultiShortSeriesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      duration: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await planMultiShortSeries(values);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to plan series. Please try again.",
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
        title="Multi-Short Series Planner"
        description="Turn one long video into a strategic, binge-worthy series of shorts."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Plan Your Series</CardTitle>
          <CardDescription>
            Provide your long-form video details to generate a complete series plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long-form Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        className="bg-background/50 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Duration (m:ss)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 25:47" {...field} className="bg-background/50 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading && <Loader className="mr-2" />}
                Plan Series
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-12 w-12 mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Mapping out your video series...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in-50">
          <Card className="shadow-xl border-primary/20 bg-card">
            <CardHeader>
              <CardTitle className="text-3xl">Series Plan: "{result.seriesTitle}"</CardTitle>
              <CardDescription className="text-base">A breakdown of your new short-form series.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                {result.shorts.map((short) => (
                  <AccordionItem
                    value={`item-${short.episodeNumber}`}
                    key={short.episodeNumber}
                  >
                    <AccordionTrigger className="hover:no-underline text-left">
                      <div className="flex w-full items-center justify-between pr-4 gap-4">
                        <span className="text-lg font-semibold">
                          Ep {short.episodeNumber}: {short.title}
                        </span>
                        <Badge variant="outline" className="text-sm px-3 py-1 whitespace-nowrap">{short.startTime} - {short.endTime}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 bg-muted/20 p-6 rounded-b-lg text-base">
                      <div>
                        <h4 className="font-semibold text-md">Hook:</h4>
                        <p className="text-muted-foreground">{short.hook}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-md">Main Point:</h4>
                        <p className="text-muted-foreground">{short.mainPoint}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-md">Cliffhanger:</h4>
                        <p className="text-muted-foreground">{short.cliffhanger}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-md">Recommended Posting Time:</h4>
                        <p className="text-muted-foreground font-medium">{short.postingDateTime}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Branding Elements</CardTitle>
                <CardDescription>Consistent styling for your series.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                 <p><span className="font-semibold">Color Scheme:</span> {result.brandingElements.colorScheme}</p>
                 <p><span className="font-semibold">Font Style:</span> {result.brandingElements.fontStyle}</p>
                 <p><span className="font-semibold">Intro Style:</span> {result.brandingElements.introStyle}</p>
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Engagement Tactics</CardTitle>
                <CardDescription>Keep your audience coming back for more.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
                  {result.engagementTactics.map((tactic, i) => (
                    <li key={i}><span className="text-foreground">{tactic}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
