"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { formatRelativeTime } from "@/lib/time-format";
import { Calendar, Ellipsis, User } from "lucide-react";

export function BlogOtherDrawer({ date }: { date: string }) {
  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        }
      />

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>About this blog</DrawerTitle>
          <DrawerDescription>
            The meta information about this blog.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 p-4">
          <div className="rounded-2xl justify-center p-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-foreground/70 shrink-0" />
              <span className="font-medium text-foreground">ZeroChirou</span>
            </div>

            {/* Published Date */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/30 mr-1 select-none">
                •
              </span>
              <Calendar className="h-4 w-4 text-foreground/70 shrink-0" />
              <span suppressHydrationWarning>{formatRelativeTime(date)}</span>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose render={<Button>Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
