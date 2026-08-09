import { Separator } from "@/components/ui/separator";
import { BlogForm } from "@/features/admin/blog-form";
import { BlogHeader } from "@/features/admin/blog-header";
import { BlogList } from "@/features/admin/blog-list";
import { LogoutButton } from "@/features/admin/logout-button";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 10;

type AdminPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;

  const rawPage = Number(params.page ?? "1");

  const currentPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("blogs")
    .select(
      `
          id,
          slug,
          like_count,
          created_at,
          image
        `,
      {
        count: "exact",
      },
    )
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const blogs = (data ?? []).map((blog) => {
    let imageUrl: string | null = null;

    if (blog.image) {
      const { data: publicUrl } = supabase.storage
        .from("blog-images")
        .getPublicUrl(blog.image);

      imageUrl = publicUrl.publicUrl;
    }

    return {
      id: blog.id,
      slug: blog.slug,
      like_count: blog.like_count,
      created_at: blog.created_at,
      imageUrl,
    };
  });

  const totalItems = count ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return (
    <main className="min-h-svh bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <BlogHeader />
        <div className="grid gap-6 grid-cols-5 border-x border-b rounded-b-2xl">
          <BlogForm />
          <BlogList
            blogs={blogs}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        </div>
      </div>
    </main>
  );
}
