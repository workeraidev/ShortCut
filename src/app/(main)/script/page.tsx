"use client";

import { useEffect, useState } from "react";
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
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  category: z.string().min(2, "Category is required."),
  duration: z.string().min(1, "Duration is required"),
});

export default function ScriptPage() {
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
    
    if (videoUrl) {
      form.setValue('videoUrl', videoUrl);
    }
    if (startTime) {
      form.setValue('startTime', startTime);
      // simple logic to estimate end time from duration
      if (duration) {
         try {
            const [min, sec] = startTime.split(':').map(Number);
            const totalSeconds = min * 60 + sec + parseInt(duration);
            const endMin = Math.floor(totalSeconds / 60);
            const endSec = totalSeconds % 60;
            form.setValue('endTime', `${endMin}:${endSec.toString().padStart(2, '0')}`);
         } catch (e) {
            // ignore if time format is unexpected
         }
      }
    }
     if (duration) {
       form.setValue('duration', duration);
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate a Script</CardTitle>
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
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
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
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1:23" {...field} />
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
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1:38" {...field} />
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
                        <Input placeholder="e.g., Tech, Lifestyle" {...field} />
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
                          <SelectTrigger>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2" />}
                Generate Script
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
             </CardHeader>
             <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Narration</TableHead>
                            <TableHead>Text Overlay</TableHead>
                            <TableHead>Visuals</TableHead>
                            <TableHead>Audio</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.script.map((line, i) => (
                             <TableRow key={i}>
                                <TableCell className="font-medium">{line.timestamp}</TableCell>
                                <TableCell>{line.narration}</TableCell>
                                <TableCell>{line.textOverlay}</TableCell>
                                <TableCell>{line.visualDirection}</TableCell>
                                <TableCell>{line.audioNote}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
             </CardContent>
          </Card>

           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Engagement</CardTitle></CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Engagement Questions:</h4>
                <ul className="list-disc space-y-2 pl-5">
                    {result.engagementQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Call to Action & Music</CardTitle></CardHeader>
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
