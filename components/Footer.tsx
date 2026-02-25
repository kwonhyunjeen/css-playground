export function Footer() {
  return (
    <footer
      className="px-6 py-6"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(156 163 175) 0 10%, rgba(255,255,255,0) 10%)",
        backgroundSize: "10px 1px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "top",
      }}
    >
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>© {new Date().getFullYear()} Hyunjin Kwon</span>
        <a
          href="https://github.com/kwonhyunjeen/css-playground"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
