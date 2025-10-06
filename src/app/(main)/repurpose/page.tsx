"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { repurposeContent } from "@/ai/flows/repurpose-content";
import {
  type RepurposeContentOutput,
} from "@/ai/schemas/repurpose-content-schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recycle, ListChecks, Video } from "lucide-react";
import { Suggestions, Suggestion } from "@/components/ai/suggestion";
import { Response } from "@/components/ai/response";

const formSchema = z.object({
  sourceType: z.enum(["url", "text"]),
  contentUrl: z.string().optional(),
  contentText: z.string().optional(),
}).refine(data => {
    if (data.sourceType === "url") {
        return !!data.contentUrl && z.string().url().safeParse(data.contentUrl).success;
    }
    if (data.sourceType === "text") {
        return !!data.contentText && data.contentText.length >= 50;
    }
    return false;
}, {
    message: "Please provide a valid URL or text content (min 50 characters).",
    path: ["contentUrl"], // assign error to a field for display
});


export default function RepurposePage() {
  const { toast } = useToast();
  const [result, setResult] = useState<RepurposeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: "url",
      contentUrl: "",
      contentText: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const input = values.sourceType === 'url' ? { contentUrl: values.contentUrl } : { contentText: values.contentText };
      const response = await repurposeContent(input);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to repurpose content. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // This is a simple client-side reordering.
  // In a real app, you might want to call the AI again for more details on the selected idea.
  const handleSuggestionClick = (ideaTitle: string) => {
    if (!result) return;
    const newResult = { ...result };
    const clickedIdeaIndex = newResult.videoIdeas.findIndex(idea => idea.title === ideaTitle);
    if(clickedIdeaIndex > -1) {
      const clickedIdea = newResult.videoIdeas.splice(clickedIdeaIndex, 1);
      newResult.videoIdeas.unshift(clickedIdea[0]);
      setResult(newResult);
    }
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Repurpose Content"
        description="Turn blog posts, articles, or any text into a series of short video ideas."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Repurpose Your Content</CardTitle>
          <CardDescription>
            Provide content from a URL or paste text to generate short-form video ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="url" className="w-full" onValueChange={(value) => {
                form.setValue("sourceType", value as "url" | "text");
                form.clearErrors(); // Clear errors when switching tabs
                if(value === 'url') {
                  form.unregister('contentText');
                } else {
                  form.unregister('contentUrl');
                }
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">From URL</TabsTrigger>
                  <TabsTrigger value="text">From Text</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="pt-4">
                  <FormField
                    control={form.control}
                    name="contentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Article URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-blog.com/awesome-article" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="text" className="pt-4">
                  <FormField
                    control={form.control}
                    name="contentText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Article Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the full text of your article here..."
                            rows={10}
                            {...field}
                          />
                          </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading && <Loader className="mr-2" />}
                <Recycle className="mr-2 h-4 w-4" />
                Repurpose Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader className="h-12 w-12 mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Transforming your content into video gold...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in-50">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListChecks /> Key Takeaways</CardTitle>
              <CardDescription>The most important points from the original content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Response>{result.keyTakeaways.map(t => `- ${t}`).join('\n')}</Response>
            </CardContent>
          </Card>

          <div>
             <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
              <Video className="h-7 w-7 text-primary" />
              Short Video Ideas
            </h2>
            <div className="space-y-6">
                <Suggestions>
                  {result.videoIdeas.map((idea) => (
                    <Suggestion
                      key={idea.title}
                      suggestion={idea.title}
                      onClick={() => handleSuggestionClick(idea.title)}
                    />
                  ))}
                </Suggestions>
                <Response>
                  {result.videoIdeas.map(idea => `### ${idea.title}\n\n**Format:** ${idea.format}\n\n**Hook:** "${idea.hook}"\n\n**Angle:** ${idea.contentAngle}`).join('\n\n---\n\n')}
                </Response>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
