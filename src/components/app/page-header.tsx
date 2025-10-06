type PageHeaderProps = {
  title: string;
  description: React.ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h1>
      <p className="text-md text-muted-foreground md:text-lg">{description}</p>
    </div>
  );
}
