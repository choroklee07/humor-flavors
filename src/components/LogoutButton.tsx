"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    sessionStorage.removeItem("humor_rain_done");
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="cyber-btn cyber-btn-danger rounded px-4 py-2">
      SIGN OUT
    </button>
  );
}
