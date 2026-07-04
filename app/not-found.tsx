import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center text-center px-6 animate-fade-up">
      <h1 className="font-display text-8xl md:text-9xl font-bold text-gradient mb-4">
        404
      </h1>
      <p className="font-display text-xl text-white mb-2">Lost in space</p>
      <p className="text-slate-400 mb-8 max-w-sm">
        The page you&apos;re looking for drifted out of orbit.
      </p>
      <Link href="/" className="btn-neon px-8 py-3 text-sm">
        Back to Home
      </Link>
    </div>
  );
}
