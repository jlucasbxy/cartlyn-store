import { Suspense } from "react";
import { Loading } from "@/components";
import { LoginPageClient } from "./login-page-client";

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a]">
      <Loading />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
