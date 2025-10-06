import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Loader({ className, ...props }: React.HTMLAttributes<SVGElement>) {
  return <Loader2 className={cn('animate-spin', className)} {...props} />;
}
