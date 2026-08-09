"use client"

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
import { Copy, Ellipsis } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function PageShare() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Gagal menyalin URL: ", err);
    }
  };

  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 items-center justify-center p-4">
          <Button className="w-full" variant="outline">
            <Image
              src="/icons/whatsapp.svg"
              alt="WhatsApp"
              width={20}
              height={20}
            />
            Share on WhatsApp
          </Button>
          <Button className="w-full" variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <Copy />
                Berhasil Disalin!
              </>
            ) : (
              <>
                <Copy />
                Copy
              </>
            )}
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button>Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
