import { cn } from "@/lib/utils";

export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl", className)}>
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl", className)}>
      {children}
    </h2>
  );
}

export function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>{children}</p>;
}

export function TypographyMuted({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}
