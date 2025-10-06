"use client";
import React from 'react';
import Streamdown from 'streamdown';
import { cn } from '@/lib/utils';

interface ResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
}

export const Response = React.forwardRef<HTMLDivElement, ResponseProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("prose prose-sm dark:prose-invert max-w-full", className)} {...props}>
        <Streamdown>{children}</Streamdown>
      </div>
    );
  }
);
Response.displayName = 'Response';
