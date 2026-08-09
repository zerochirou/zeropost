"use client";

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createBlog,
  type CreateBlogState,
} from "@/app/admin/(protected)/actions";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateBlogState = {
  error: null,
  success: null,
};

export function BlogForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(createBlog, initialState);

  // useEffect(() => {
  //   if (!state.success) return;

  //   formRef.current?.reset();
  //   setPreview(null);
  // }, [state.success]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (preview) URL.revokeObjectURL(preview);

    if (!file) {
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="p-4 md:col-span-3 col-span-5">
      <div className="mb-4">
        <CardTitle>Upload blog</CardTitle>
        <CardDescription>
          Isi slug, content, dan gambar. Jumlah like dimulai dari 0.
        </CardDescription>
      </div>

      <div>
        <form ref={formRef} action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="cara-menggunakan-supabase"
              required
            />
            <p className="text-xs text-muted-foreground">
              Akan dinormalisasi otomatis menjadi format URL.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              className="min-h-72 resize-y"
              placeholder="Tulis isi blog di sini..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, atau WebP. Maksimal 5 MB.
            </p>
          </div>

          {preview ? (
            <div className="overflow-hidden rounded-lg border bg-muted">
              {/* Preview lokal, bukan next/image karena URL berasal dari blob browser. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview gambar blog"
                className="aspect-video w-full object-cover"
              />
            </div>
          ) : null}

          {state.error ? (
            <p
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm" role="status">
              {state.success}
            </p>
          ) : null}

          <Button type="submit" disabled={pending}>
            {pending ? "Publishing..." : "Publish blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
