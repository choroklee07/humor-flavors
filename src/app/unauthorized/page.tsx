import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-4 text-center">
        <div className="space-y-2">
          <p className="cyber-label tracking-[0.3em]">{`// ACCESS DENIED`}</p>
          <h1 className="font-mono text-4xl font-bold" style={{ color: "#ff003c", textShadow: "0 0 8px rgba(255,0,60,0.6), 0 0 20px rgba(255,0,60,0.2)" }}>
            UNAUTHORIZED
          </h1>
          <p className="cyber-label mt-4">
            THIS ACCOUNT DOES NOT HAVE SUPERADMIN PRIVILEGES
          </p>
        </div>

        <div className="cyber-card cyber-corner rounded p-6 space-y-4">
          <p className="cyber-value text-xs text-left">
            {">"} PERMISSION_LEVEL: INSUFFICIENT<br />
            {">"} REQUIRED: is_superadmin = TRUE<br />
            {">"} STATUS: BLOCKED
          </p>
          <Link
            href="/login"
            className="cyber-btn block w-full rounded px-6 py-3"
          >
            RETURN TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
