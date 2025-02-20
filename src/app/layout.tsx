import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Experiments Management System",
  description:
    "A system that allows collecting, storing and retrieving scientific experiments data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Experiments Management System</title>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
