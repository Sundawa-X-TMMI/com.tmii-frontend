import type {Metadata} from "next";
import "../styles/globals.css";
import {Toaster} from "@/components/ui/sonner";
import {QueryProvider} from "@/providers/QueryProvider";
import {StoreProvider} from "@/providers/StoreProvider";

export const metadata: Metadata = {
  title: "TMII",
  description: "A system PPOB multi-tenant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <QueryProvider>
          <StoreProvider>
            {children}
            <Toaster position="top-right" />
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
