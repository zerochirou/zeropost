import { createClient } from "@/lib/supabase/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

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
      slug,
      content,
      image,
      created_at
      `
    )
    .eq("slug", slug)
    .maybeSingle();



  const title =
    post?.slug
      ?.split("_")
      .join(" ")
      .toUpperCase()
      ||
    "ZEROPOSTS";


  const description =
    post?.content
      ?.replace(/<[^>]*>/g, "")
      .slice(0, 150)
      ||
    "Catatan dan tulisan pribadi.";



  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          color: "#111827",
          fontFamily: "Arial",
        }}
      >


        {/* Image */}
        {post?.image && (
          <img
            src={post.image}
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
            }}
          />
        )}



        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "45px 60px",
            gap: "18px",
          }}
        >


          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>



          <div
            style={{
              fontSize: 26,
              color:"#6b7280",
              lineHeight:1.4,
              maxWidth:"1000px",
            }}
          >
            {description}
          </div>



          <div
            style={{
              marginTop:"10px",
              fontSize:22,
              color:"#9ca3af",
            }}
          >
            zeroposts.netlify.app
          </div>


        </div>


      </div>
    ),
    size
  );
}