import { SidebarNav } from "./SidebarNav";
import { LogoutButton } from "./LogoutButton";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  user: { email?: string | null };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(0,212,255,0.12)] bg-[rgba(0,8,18,0.7)] shrink-0">
        <div>
          <p className="cyber-text font-mono text-xs font-bold tracking-[0.2em]">
            {`// HUMOR FLAVORS`}
          </p>
          <p className="font-mono text-[0.6rem] tracking-[0.3em] text-[rgba(0,212,255,0.4)] mt-0.5">
            PROMPT CHAIN TOOL
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <p className="cyber-label text-[0.6rem] truncate hidden sm:block">{user.email}</p>
          <LogoutButton />
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside className="w-52 shrink-0 border-r border-[rgba(0,212,255,0.12)] bg-[rgba(0,8,18,0.7)]">
          <div className="py-3">
            <SidebarNav />
          </div>
        </aside>
        <div className="flex-1 min-w-0 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
