type ComingSoonProps = {
  title: string;
  description?: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="lm-card w-full max-w-[680px] p-8">
      <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
        COMING SOON
      </div>
      <h1 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.02em]">
        {title}
      </h1>
      <p className="mt-2 text-[16px] text-[color:var(--muted-foreground)]">
        {description || "This section isn’t part of the Week 1 MVP yet."}
      </p>

      <div className="mt-6">
        <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--muted-foreground)]">
          We’ll ship this after the core roadmap → guide → quiz flow is stable.
        </div>
      </div>
    </div>
  );
}
