import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProviders } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Think Board - Collaborative Whiteboard",
  description: "Realtime collaborative whiteboard with logic layers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProviders>{children}</AuthProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
