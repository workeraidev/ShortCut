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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  competitorUrls: z.array(z.object({ value: z.string().url("Please enter a valid URL.") })),
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analyze Competitors</CardTitle>
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
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Competitor Video URLs</FormLabel>
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`competitorUrls.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mt-2">
                           <FormControl>
                            <Input {...field} placeholder="https://www.youtube.com/watch?v=..."/>
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
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

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2" />}
                Analyze
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
            <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{rec.category}</h4>
                    <Badge variant={getPriorityBadgeVariant(rec.priority)}>{rec.priority}</Badge>
                  </div>
                  <p className="text-muted-foreground">{rec.suggestion}</p>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Content Gaps</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.contentGaps.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Success Patterns</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.successPatterns.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Unique Angles</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.uniqueAngles.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Audience Insights</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.audienceInsights.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
