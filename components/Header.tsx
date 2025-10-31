// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-gray-900"
        >
          <span className="font-bold text-[#28394b]">Ville</span> CRM
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/features"
            className="text-gray-600 transition hover:text-gray-900"
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="text-gray-600 transition hover:text-gray-900"
          >
            Pricing
          </Link>

          {/* Login Button */}
          <Link
            href="/login"
            className="rounded-full bg-[#28394b] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#1f2e3b]"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
