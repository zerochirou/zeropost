import { PageFrame } from "@/features/blog-page/components/page-frame";
import { PageShare } from "@/features/blog-page/components/page-share";
import { BlogCardAvatar } from "@/features/blogs-card/components/blog-card-avatar";
import { BlogCardImage } from "@/features/blogs-card/components/blog-card-image";
import { BlogHeader } from "@/features/blogs-card/components/blog-header";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select(
      `
        id,
        slug,
        content,
        image,
        like_count,
        created_at
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!blog) {
    notFound();
  }

  let imageUrl: string | null = null;

  if (blog.image) {
    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(blog.image);

    imageUrl = data.publicUrl;
  }

  return (
    <div className="max-w-3xl w-full mx-auto">
      <BlogHeader />
      <div className="border-x px-2 border-t pt-4">
        <Link href={"/"}>
          <Button variant={"ghost"}>
            <ChevronLeft /> Back
          </Button>
        </Link>
      </div>
      <PageFrame>
        <div className="flex items-center justify-between">
          <BlogCardAvatar date={blog.created_at} />
          <PageShare />
        </div>
        <p className="mt-4">{blog.content}</p>
        <BlogCardImage image={imageUrl} />
      </PageFrame>
    </div>
  );
}
