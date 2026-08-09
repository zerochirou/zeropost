"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type CreateBlogState = {
  error: string | null
  success: string | null
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function extensionFromMime(type: string) {
  if (type === "image/jpeg") return "jpg"
  if (type === "image/png") return "png"
  return "webp"
}

export async function createBlog(
  _previousState: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> {
  const supabase = await createClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (claimsError || !userId) {
    return {
      error: "Session tidak valid. Silakan login ulang.",
      success: null,
    }
  }

  const slug = normalizeSlug(String(formData.get("slug") ?? ""))
  const content = String(formData.get("content") ?? "").trim()
  const image = formData.get("image")

  if (!slug || !content) {
    return {
      error: "Slug dan content wajib diisi.",
      success: null,
    }
  }

  let imagePath: string | null = null

  if (image instanceof File && image.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      return {
        error: "Gambar hanya boleh JPG, PNG, atau WebP.",
        success: null,
      }
    }

    if (image.size > MAX_FILE_SIZE) {
      return {
        error: "Ukuran gambar maksimal 5 MB.",
        success: null,
      }
    }

    imagePath = `${userId}/${crypto.randomUUID()}.${extensionFromMime(image.type)}`

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(imagePath, image, {
        contentType: image.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      return {
        error: `Upload gambar gagal: ${uploadError.message}`,
        success: null,
      }
    }
  }

  const { error: insertError } = await supabase.from("blogs").insert({
    author_id: userId,
    slug,
    content,
    image: imagePath,
  })

  if (insertError) {
    // Hindari file yatim kalau insert database gagal.
    if (imagePath) {
      await supabase.storage.from("blog-images").remove([imagePath])
    }

    if (insertError.code === "23505") {
      return {
        error: "Slug sudah digunakan. Gunakan slug lain.",
        success: null,
      }
    }

    return {
      error: `Blog gagal disimpan: ${insertError.message}`,
      success: null,
    }
  }

  revalidatePath("/admin")
  revalidatePath("/")

  return {
    error: null,
    success: "Blog berhasil dipublikasikan.",
  }
}

export async function deleteBlog(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("blogs").delete().eq("id", id)

  if (error) {
    return {
      error: `Gagal menghapus blog: ${error.message}`,
      success: null,
    }
  }

  return {
    error: null,
    success: "Blog berhasil dihapus.",
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath("/", "layout")
  redirect("/admin/login")
}
