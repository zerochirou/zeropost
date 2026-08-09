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
import { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
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

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const url = `/blog/${post.slug}`;

  return {
    title: post.slug.split("_").join(" "),
    description: post.content,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.slug.split("_").join(" "),
      description: post.content,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.slug.split("_").join(" "),
        },
      ],

      publishedTime: post.created_at,
    },

    twitter: {
      card: "summary_large_image",
      title: post.slug.split("_").join(" "),
      description: post.content,
      images: [post.image],
    },
  };
}

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
      <div className="md:border-x px-2 border-t pt-4">
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
        <p className="mt-4 whitespace-pre-line prose-md">{blog.content}</p>
        {imageUrl && <BlogCardImage image={imageUrl} />}
      </PageFrame>
    </div>
  );
}
