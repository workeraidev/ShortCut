type PageHeaderProps = {
  title: string;
  description: React.ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
