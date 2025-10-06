"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  analyzeCompetitorContent,
  type AnalyzeCompetitorContentOutput,
} from "@/ai/flows/analyze-competitor-content";
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
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  myVideoUrl: z.string().url("Please enter a valid URL for your video."),
  competitorUrls: z.array(z.object({ value: z.string().url("Please enter a valid URL.") })).min(1, 'Please add at least one competitor.'),
});

export default function CompetitorsPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<AnalyzeCompetitorContentOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      myVideoUrl: "",
      competitorUrls: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "competitorUrls",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await analyzeCompetitorContent({
        ...values,
        competitorUrls: values.competitorUrls.map(url => url.value)
      });
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze competitors. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Competitive Analysis"
        description="Analyze competitor content to find your unique advantage."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Analyze Competitors</CardTitle>
          <CardDescription>
            Enter your video URL and at least one competitor's to get strategic insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="myVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="bg-background/50 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Competitor Video URLs</FormLabel>
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`competitorUrls.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                           <FormControl>
                            <Input {...field} placeholder="https://www.youtube.com/watch?v=..." className="bg-background/50 text-base"/>
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                 <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ value: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Competitor
                </Button>
              </div>

              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading && <Loader className="mr-2" />}
                Analyze
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-12 w-12 mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Scouting the competition...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in-50">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Actionable Recommendations</CardTitle>
              <CardDescription>The most important takeaways from the analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card-foreground/5">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h4 className="font-semibold text-lg">{rec.category}</h4>
                    <Badge variant={getPriorityBadgeVariant(rec.priority)} className="capitalize text-sm px-3 py-1 whitespace-nowrap">{rec.priority} Priority</Badge>
                  </div>
                  <p className="text-muted-foreground text-base">{rec.suggestion}</p>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Content Gaps</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
                  {result.contentGaps.map((item, i) => <li key={i}><span className="text-foreground">{item}</span></li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Success Patterns</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
                  {result.successPatterns.map((item, i) => <li key={i}><span className="text-foreground">{item}</span></li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Unique Angles</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
                  {result.uniqueAngles.map((item, i) => <li key={i}><span className="text-foreground">{item}</span></li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Audience Insights</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
                  {result.audienceInsights.map((item, i) => <li key={i}><span className="text-foreground">{item}</span></li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
