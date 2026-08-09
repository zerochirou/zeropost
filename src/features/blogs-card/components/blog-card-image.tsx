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
import Image from "next/image";

export function BlogCardImage({ image }: { image: string | null }) {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={
          <button className="mt-10 w-full">
            <Image
              src={image ?? "/fallback.png"}
              alt={""}
              width={500}
              height={300}
              className="rounded-xl w-full border"
            />
          </button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Blog Image</DrawerTitle>
          <DrawerDescription>Image of the blog.</DrawerDescription>
        </DrawerHeader>
        <div className="flex p-4 justify-center items-center">
          <Image
            src={image ?? "/fallback.png"}
            alt={""}
            width={500}
            height={300}
            className="rounded-xl border"
          />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button>Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
