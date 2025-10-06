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
  duration: z.string().min(1, "Please enter the video duration."),
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plan Your Series</CardTitle>
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
                    <FormLabel>Video Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 25:47" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2" />}
                Plan Series
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
              <CardTitle>Series Plan: {result.seriesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {result.shorts.map((short) => (
                  <AccordionItem
                    value={`item-${short.episodeNumber}`}
                    key={short.episodeNumber}
                  >
                    <AccordionTrigger>
                      <div className="flex w-full items-center justify-between pr-4">
                        <span>
                          Episode {short.episodeNumber}: {short.title}
                        </span>
                        <Badge variant="outline">{short.startTime} - {short.endTime}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold">Hook:</h4>
                        <p className="text-muted-foreground">{short.hook}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Main Point:</h4>
                        <p className="text-muted-foreground">{short.mainPoint}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Cliffhanger:</h4>
                        <p className="text-muted-foreground">{short.cliffhanger}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold">Recommended Posting Time:</h4>
                        <p className="text-muted-foreground">{short.postingDateTime}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Branding Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 <p><span className="font-semibold">Color Scheme:</span> {result.brandingElements.colorScheme}</p>
                 <p><span className="font-semibold">Font Style:</span> {result.brandingElements.fontStyle}</p>
                 <p><span className="font-semibold">Intro Style:</span> {result.brandingElements.introStyle}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Engagement Tactics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.engagementTactics.map((tactic, i) => (
                    <li key={i}>{tactic}</li>
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
