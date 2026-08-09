import { ThemeToggle } from "@/components/commons/theme/toggle";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export function BlogHeader() {
  return (
    <div className="md:h-16 h-14 md:border-x md:border-t rounded-t-2xl md:mt-4 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <a href="https://zerochirou.netlify.app/">
          <h1 className="md:text-xl text-sm font-bold opacity-50">
            Zerochirou
          </h1>
        </a>
        <div className="md:h-6 h-4 rotate-12 w-0.5 bg-gray-200" />
        <Link href={"/"}>
          <h1 className="md:text-xl text-sm font-bold">posts</h1>
        </Link>
      </div>
      <div className="flex gap-2">
        <Button variant={'destructive'}>
          <Heart /> 23
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
