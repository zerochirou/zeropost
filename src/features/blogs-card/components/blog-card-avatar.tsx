"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/time-format";

export function BlogCardAvatar({ date }: { date: string }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={"/avatar.png"} />
                <AvatarFallback>ZH</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Zerochirou</span>
                <ChevronRight className="size-4" />
                <span className="font-semibold opacity-50" suppressHydrationWarning>{formatRelativeTime(date)}</span>
              </div>
            </div>
          </button>
        }
      />
      <DialogContent>
        <DialogHeader className="flex items-center justify-center">
          <Image
            src={"/avatar.png"}
            alt={"avatar"}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">Zerochirou</span>
            <span className="font-semibold opacity-50">5 jam lalu</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={'secondary'}>
              <Image
                src="/icons/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
              />
              WhatsApp
            </Button>
            <Button variant={'secondary'}>
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
              Instagram
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
