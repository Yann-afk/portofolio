import { LoginForm } from "./login-form";

export const metadata = {
  title: "Masuk — Admin",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <LoginForm error={error} />
    </div>
  );
}
