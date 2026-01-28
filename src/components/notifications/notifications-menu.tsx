"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { notificationsService } from "@/lib/features/notifications/service";
import type { Notification } from "@/lib/features/notifications/types";
import { cn } from "@/lib/utils";

export function NotificationsMenu() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.isRead).length,
    [items],
  );

  const load = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.list(false);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    load();
    // poll every 30s
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const markOne = async (id: number) => {
    await notificationsService.markRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAll = async () => {
    await notificationsService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
        >
          <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 min-w-[1rem] px-1 h-4 rounded-full bg-destructive text-[10px] leading-4 text-white text-center",
                unreadCount > 9 && "px-1.5",
              )}
              aria-label={`${unreadCount} notifications`}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[70vh] overflow-auto"
      >
        <DropdownMenuLabel>
          Notifications {loading ? "(loading...)" : ""}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No notifications
          </div>
        )}
        {items.slice(0, 10).map((n) => (
          <DropdownMenuItem
            key={n.id}
            className="flex flex-col items-start gap-1"
          >
            <div className="w-full flex items-start justify-between gap-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  !n.isRead ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {n.title}
              </span>
              {!n.isRead && (
                <button
                  className="text-[10px] text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    markOne(n.id);
                  }}
                >
                  Mark as read
                </button>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{n.message}</span>
          </DropdownMenuItem>
        ))}
        {items.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={markAll}
              className="justify-center text-primary"
            >
              Mark all as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
