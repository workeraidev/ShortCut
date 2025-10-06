"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  enhanceShortAccessibility,
  type EnhanceShortAccessibilityOutput,
} from "@/ai/flows/enhance-short-accessibility";
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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  shortContent: z
    .string()
    .min(10, "Please enter the script or content of your short video."),
});

export default function AccessibilityPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<EnhanceShortAccessibilityOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shortContent: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await enhanceShortAccessibility(values);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance accessibility. Please try again.",
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
        title="Accessibility & Localization"
        description="Enhance your shorts for maximum reach with captions and localization."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Enhance Your Short</CardTitle>
          <CardDescription>
            Enter your short's script or content below to generate accessibility improvements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="shortContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Video Content / Script</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the script or a description of your short video here..."
                        rows={8}
                        className="bg-background/50 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading && <Loader className="mr-2" />}
                Enhance Accessibility
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-12 w-12 mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Analyzing and enhancing your content...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in-50">
          <Card className="shadow-xl border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Accessibility Score</CardTitle>
              <CardDescription>
                An estimation of how accessible your content is. Higher is better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={result.accessibilityScore} className="w-[60%] h-4" />
                <span className="font-bold text-2xl text-primary">{result.accessibilityScore}/100</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generated Captions</CardTitle>
              <CardDescription>
                Timed captions to make your video understandable without audio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-background/30">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Start</TableHead>
                      <TableHead className="w-[120px]">End</TableHead>
                      <TableHead>Text</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.captions.map((caption, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{caption.startTime}</TableCell>
                        <TableCell className="font-mono text-sm">{caption.endTime}</TableCell>
                        <TableCell className="text-base">{caption.text}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Expand your reach to a global audience.</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="mb-4 font-semibold text-lg">Recommended Target Languages:</h3>
                <div className="flex flex-wrap gap-3">
                  {result.targetLanguages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-md px-4 py-2">{lang}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Improvement Recommendations</CardTitle>
                <CardDescription>Actionable steps to improve accessibility.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-3 pl-5 text-base text-muted-foreground">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}><span className="text-foreground">{rec}</span></li>
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
