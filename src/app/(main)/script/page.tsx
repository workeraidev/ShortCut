"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateShortScript,
  type GenerateShortScriptOutput,
} from "@/ai/flows/generate-short-scripts";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL."),
  startTime: z.string().min(1, "Start time is required.").regex(/^\d{1,2}:\d{2}$/, "Use m:ss or mm:ss format"),
  endTime: z.string().min(1, "End time is required.").regex(/^\d{1,2}:\d{2}$/, "Use m:ss or mm:ss format"),
  category: z.string().min(2, "Category is required."),
  duration: z.string().min(1, "Duration is required"),
});

function ScriptGenerator() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [result, setResult] = useState<GenerateShortScriptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      startTime: "0:00",
      endTime: "0:15",
      category: "",
      duration: "15",
    },
  });

  useEffect(() => {
    const videoUrl = searchParams.get('videoUrl');
    const startTime = searchParams.get('startTime');
    const duration = searchParams.get('duration');
    const category = searchParams.get('category');
    
    if (videoUrl) {
      form.setValue('videoUrl', decodeURIComponent(videoUrl));
    }
    if (startTime) {
       const decodedStartTime = decodeURIComponent(startTime);
       const timeMatch = decodedStartTime.match(/(\d{1,2}):(\d{2})/);
       if (timeMatch) {
         form.setValue('startTime', `${timeMatch[1]}:${timeMatch[2]}`);

         if (duration) {
           try {
              const [min, sec] = decodedStartTime.split(':').map(Number);
              const totalSeconds = min * 60 + sec + parseInt(decodeURIComponent(duration));
              const endMin = Math.floor(totalSeconds / 60);
              const endSec = totalSeconds % 60;
              form.setValue('endTime', `${endMin}:${endSec.toString().padStart(2, '0')}`);
           } catch (e) {
              // ignore if time format is unexpected
              form.setValue('endTime', `0:15`);
           }
        }
      }
    }
     if (duration) {
       form.setValue('duration', decodeURIComponent(duration));
     }
     if (category) {
        form.setValue('category', decodeURIComponent(category));
     }
  }, [searchParams, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateShortScript(values);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
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
        title="Short Script Generation"
        description="Generate an engaging script from any video segment."
      />

      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Generate a Script</CardTitle>
          <CardDescription>
            Fill in the details from your video to generate a custom script for a short.
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
                    <FormLabel>YouTube Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (m:ss)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1:23" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time (m:ss)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1:38" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tech, Lifestyle" {...field} className="bg-background/50" />
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
                      <FormLabel>Target Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading && <Loader className="mr-2" />}
                Generate Script
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-10 w-10 mb-4" />
          <p className="text-muted-foreground">Writing your viral script...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in-50">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
                <CardTitle>{result.title}</CardTitle>
                <CardDescription>{result.description}</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="font-semibold text-lg mb-2">Hook: <span className="italic font-normal text-muted-foreground">{result.hook}</span></p>
                 <Badge>Estimated Views: {result.estimatedViews}</Badge>
             </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle>Script Breakdown</CardTitle>
                <CardDescription>A second-by-second guide for your short.</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Timestamp</TableHead>
                                <TableHead>Narration</TableHead>
                                <TableHead>Text Overlay</TableHead>
                                <TableHead>Visuals</TableHead>
                                <TableHead>Audio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.script.map((line, i) => (
                                 <TableRow key={i}>
                                    <TableCell className="font-mono">{line.timestamp}</TableCell>
                                    <TableCell>{line.narration}</TableCell>
                                    <TableCell className="text-muted-foreground">{line.textOverlay}</TableCell>
                                    <TableCell className="text-muted-foreground">{line.visualDirection}</TableCell>
                                    <TableCell className="text-muted-foreground">{line.audioNote}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
             </CardContent>
          </Card>

           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
                <CardDescription>Questions to spark comments.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {result.engagementQuestions.map((q, i) => <li key={i}><span className="text-foreground">{q}</span></li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Call to Action & Music</CardTitle>
                <CardDescription>Closing thoughts and audio suggestions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                  <h4 className="font-semibold">Call to Action</h4>
                  <p className="text-muted-foreground">{result.callToAction}</p>
                </div>
                 <div>
                  <h4 className="font-semibold">Suggested Music</h4>
                  <p className="text-muted-foreground">{result.suggestedMusic}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScriptPage() {
  return (
    <Suspense fallback={<div className="container mx-auto flex items-center justify-center py-20"><Loader className="h-10 w-10"/></div>}>
      <ScriptGenerator />
    </Suspense>
  )
}
