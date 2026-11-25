"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface MessageCounterProps {
  className?: string;
}

export function MessageCounter({ className }: MessageCounterProps) {
  const [usage, setUsage] = useState<{
    messagesUsed: number;
    remaining: number;
    limit: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage(): Promise<void> {
      try {
        // Import dynamically to avoid SSR issues
        const { getCurrentUserUsage } = await import("@/lib/usage-counter");
        const result = await getCurrentUserUsage();
        
        if (result.success) {
          setUsage(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
    
    // Refresh every minute (not too aggressive)
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything while loading or if no data
  if (loading || !usage) return null;
  
  // Only show when approaching limit (last 15 messages)
  if (usage.remaining > 15) return null;

  const isNearLimit = usage.remaining <= 10;
  const isVeryNearLimit = usage.remaining <= 5;
  const isAtLimit = usage.remaining <= 0;

  return (
    <Badge 
      variant={
        isAtLimit 
          ? "destructive" 
          : isVeryNearLimit 
            ? "destructive" 
            : isNearLimit 
              ? "secondary" 
              : "outline"
      }
      className={className}
    >
      {usage.messagesUsed}/{usage.limit} mensajes hoy
    </Badge>
  );
}
