// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row">
        {/* Left side */}
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-[#28394b]">Ville CRM</span>. All
          rights reserved.
        </p>

        {/* Right links */}
        <div className="flex items-center gap-6">
          <a href="/privacy" className="transition hover:text-gray-800">
            Privacy
          </a>
          <a href="/terms" className="transition hover:text-gray-800">
            Terms
          </a>
          <a href="/contact" className="transition hover:text-gray-800">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
