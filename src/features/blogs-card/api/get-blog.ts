import type { SupabaseClient } from "@supabase/supabase-js"

export const BLOG_PAGE_SIZE = 9

export type Blog = {
  id: string
  slug: string
  content: string
  image: string | null
  imageUrl: string | null
  like: number
  created_at: string
}

export type BlogCursor = {
  id: string
  created_at: string
}

export type BlogPage = {
  blogs: Blog[]
  nextCursor: BlogCursor | null
  hasMore: boolean
}

export async function getBlogs(
  supabase: SupabaseClient,
  cursor?: BlogCursor | null
): Promise<BlogPage> {
  /*
   * Ambil +1 item.
   *
   * Jika PAGE_SIZE = 9:
   * kita query 10.
   *
   * Kalau dapat 10 berarti masih ada
   * page berikutnya.
   */
  let query = supabase
    .from("blogs")
    .select(`
      id,
      slug,
      content,
      image,
      like_count,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    })
    .order("id", {
      ascending: false,
    })
    .limit(BLOG_PAGE_SIZE + 1)

  /*
   * Cursor pagination.
   *
   * Jika created_at lebih kecil:
   * berarti posting lebih lama.
   *
   * Kalau created_at sama,
   * gunakan ID sebagai tie breaker.
   */
  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  const rows = data ?? []

  const hasMore =
    rows.length > BLOG_PAGE_SIZE

  const pageRows = rows.slice(
    0,
    BLOG_PAGE_SIZE
  )

  const blogs: Blog[] = pageRows.map(
    (blog) => {
      let imageUrl: string | null = null

      if (blog.image) {
        const { data: storageData } =
          supabase.storage
            .from("blog-images")
            .getPublicUrl(blog.image)

        imageUrl = storageData.publicUrl
      }

      return {
        id: blog.id,
        slug: blog.slug,
        content: blog.content,
        image: blog.image,
        imageUrl,
        like: blog.like_count ?? 0,
        created_at: blog.created_at,
      }
    }
  )

  const lastBlog =
    blogs[blogs.length - 1]

  const nextCursor =
    hasMore && lastBlog
      ? {
          id: lastBlog.id,
          created_at:
            lastBlog.created_at,
        }
      : null

  return {
    blogs,
    nextCursor,
    hasMore,
  }
}