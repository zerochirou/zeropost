"use client"

import { deleteBlog } from "@/app/admin/(protected)/actions"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type BlogListItem = {
  id: string
  slug: string
  like_count: number | null
  created_at: string
  imageUrl: string | null
}

type BlogListProps = {
  blogs: BlogListItem[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export function BlogList({
  blogs,
  currentPage,
  totalPages,
  totalItems,
}: BlogListProps) {
  const router = useRouter()

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)

      await deleteBlog(id)

      /*
       * Kalau item terakhir di page dihapus,
       * pindah ke page sebelumnya agar tidak
       * meninggalkan page kosong.
       */
      if (
        blogs.length === 1 &&
        currentPage > 1
      ) {
        router.replace(
          `/admin?page=${currentPage - 1}`
        )

        return
      }

      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return
    }

    router.push(`/admin?page=${page}`)
  }

  return (
    <div className="md:col-span-2 col-span-5 md:border-l border-t md:border-t-0 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <h2 className="font-semibold">
            Blog
          </h2>

          <p className="text-sm text-muted-foreground">
            {totalItems} posting
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          Page {currentPage} / {totalPages}
        </span>
      </div>

      {/* Blog list */}
      {blogs.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada blog.
          </p>
        </div>
      ) : (
        <div>
          {blogs.map((blog) => {
            const isDeleting =
              deletingId === blog.id

            return (
              <article
                key={blog.id}
                className="flex gap-3 border-b px-4 py-4"
              >
                {/* Image */}
                {blog.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.imageUrl}
                    alt={blog.slug}
                    className="h-16 w-20 shrink-0 rounded-md border object-cover"
                  />
                ) : (
                  <div className="h-16 w-20 shrink-0 rounded-md border bg-muted" />
                )}

                {/* Content */}
                <div className="flex w-full min-w-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      /{blog.slug}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Heart className="size-3.5" />

                        {blog.like_count ?? 0} likes
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />

                        {new Intl.DateTimeFormat(
                          "id-ID",
                          {
                            dateStyle: "medium",
                          }
                        ).format(
                          new Date(blog.created_at)
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    disabled={
                      deletingId !== null
                    }
                    onClick={() =>
                      handleDelete(blog.id)
                    }
                  >
                    {isDeleting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}

                    <span className="sr-only">
                      Delete {blog.slug}
                    </span>
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() =>
              goToPage(currentPage - 1)
            }
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          <PageNumbers
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              currentPage >= totalPages
            }
            onClick={() =>
              goToPage(currentPage + 1)
            }
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

type PageNumbersProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: PageNumbersProps) {
  const pages = getVisiblePages(
    currentPage,
    totalPages
  )

  return (
    <div className="hidden items-center gap-1 sm:flex">
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex size-8 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            type="button"
            variant={
              page === currentPage
                ? "default"
                : "ghost"
            }
            size="icon"
            className="size-8"
            onClick={() =>
              onPageChange(page)
            }
          >
            {page}
          </Button>
        )
      })}
    </div>
  )
}

function getVisiblePages(
  currentPage: number,
  totalPages: number
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    )
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      totalPages,
    ]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ]
}