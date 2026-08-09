import { logout } from "@/app/admin/(protected)/actions"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive">
        Logout <LogOut/>
      </Button>
    </form>
  )
}
