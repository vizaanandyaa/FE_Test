
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Lalin Monitoring",
  description: "Aplikasi monitoring laporan lalu lintas harian",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
