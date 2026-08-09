import { getBlogs } from "@/features/blogs-card/api/get-blog";
import BlogCard from "@/features/blogs-card/components/blog-card";
import { BlogHeader } from "@/features/blogs-card/components/blog-header";
import FrameBlog from "@/features/blogs-card/components/frame-blog";
import FrameCards from "@/features/blogs-card/components/frame-cards";
import { createClient } from "@/lib/supabase/server";

export default async function Blog() {
  const supabase = await createClient();
  const initialPage = await getBlogs(supabase);

  return (
    <FrameBlog>
      <BlogHeader />
      <FrameCards>
        {initialPage.blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            image={blog.imageUrl}
            content={blog.content}
            slug={blog.slug}
            date={blog.created_at}
          />
        ))}
      </FrameCards>
    </FrameBlog>
  );
}
