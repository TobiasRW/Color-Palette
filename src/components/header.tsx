import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-foreground bg-background p-3">
      <h1 className="text-3xl font-bold text-orange">
        <Link href="/" className="font-heading">
          Palette
        </Link>
      </h1>
    </header>
  );
}
