import { createClient } from "@/lib/supabase/server";
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0a",
        color: "#ffffff",
        padding: "70px",
      }}
    >
      <div
        style={{
          fontSize: 28,
          opacity: 0.7,
        }}
      >
        namablog.com
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.05,
          maxWidth: "1000px",
        }}
      >
        {post?.slug.split("_").join(" ").toUpperCase()}
      </div>

      <div
        style={{
          fontSize: 26,
          opacity: 0.7,
        }}
      >
        Nama Anda
      </div>
    </div>,
    size,
  );
}
