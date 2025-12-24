'use client';

export default function AboutApp() {
  return (
    <div className="h-full w-full p-4 text-sm text-gray-800">
      <h1 className="mb-2 text-lg font-semibold">About</h1>
      <p>
        This is a Windows-style interactive portfolio built using Next.js,
        TypeScript, Tailwind CSS, and Zustand.
      </p>
      <p className="mt-2">
        The goal is to demonstrate strong architectural discipline by separating
        OS shell logic from application content.
      </p>
    </div>
  );
}
