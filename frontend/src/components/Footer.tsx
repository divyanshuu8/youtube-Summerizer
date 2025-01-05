export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-0">
          <p className="text-gray-600 text-center md:text-left">
            © {new Date().getFullYear()} YT Summarizer. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}