"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Suggestions = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  React.ComponentProps<typeof ScrollArea>
>(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea
      ref={ref}
      className={cn("w-full whitespace-nowrap", className)}
      {...props}
    >
      <div className="flex gap-2 pb-4">{children}</div>
    </ScrollArea>
  );
});
Suggestions.displayName = "Suggestions";

interface SuggestionProps extends React.ComponentProps<typeof Button> {
  suggestion: string;
  onClick?: (suggestion: string) => void;
}

const Suggestion = React.forwardRef<
  React.ElementRef<typeof Button>,
  SuggestionProps
>(({ suggestion, onClick, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      onClick={() => onClick?.(suggestion)}
      {...props}
    >
      {suggestion}
    </Button>
  );
});
Suggestion.displayName = "Suggestion";


export { Suggestions, Suggestion };
