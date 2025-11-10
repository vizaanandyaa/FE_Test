// components/ClientProviders.tsx
"use client";

import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
    //   withNormalizeCSS
    //   withGlobalStyles
      theme={{
        // colorScheme: "light",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {children}
    </MantineProvider>
  );
}
