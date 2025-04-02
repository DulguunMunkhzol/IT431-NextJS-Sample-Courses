import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-green-300 py-4 bg-green-200">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-9 ">
          <h1 className="text-5xl font-bold text-green-700">Gibli Restaurant Menu</h1>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              Food Items
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 