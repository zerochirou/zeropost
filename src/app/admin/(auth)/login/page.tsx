import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LoginForm } from "@/features/admin/login-form"

export default async function AdminLoginPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (data?.claims?.sub) {
    redirect("/admin")
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <LoginForm />
    </main>
  )
}
