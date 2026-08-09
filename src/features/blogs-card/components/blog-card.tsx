import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BlogOtherDrawer } from "./blog-card-drawer";
import { BlogCardImage } from "./blog-card-image";
import { BlogCardAvatar } from "./blog-card-avatar";

export default function BlogCard({
  content,
  slug,
  image,
  date,
}: {
  content: string;
  slug: string;
  image: string | null;
  date: string;
}) {
  return (
    <div className="border-t px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-4">
        <BlogCardAvatar date={date} />
        <BlogOtherDrawer date={date} />
      </div>
      <div >
        <p className="line-clamp-5">{content}</p>
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center font-medium opacity-50 hover:underline"
        >
          Lebih lanjut
          <ChevronRight className="size-4 ml-1" />
        </Link>
      </div>
      {image && <BlogCardImage image={image} />}
    </div>
  );
}
