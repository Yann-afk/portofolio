export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 flex max-w-2xl flex-col gap-4">
      <span className="font-mono text-sm font-medium text-violet-600 dark:text-violet-400">
        {"// "}
        {eyebrow}
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
