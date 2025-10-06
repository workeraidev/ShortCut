"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Suggestions = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  React.ComponentPropsWithoutRef<typeof ScrollArea>
>(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea
      ref={ref}
      className={cn("w-full whitespace-nowrap", className)}
      {...props}
    >
      <div className="flex w-max space-x-2 pb-4">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
});
Suggestions.displayName = "Suggestions";

interface SuggestionProps extends React.ComponentPropsWithoutRef<typeof Button> {
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
