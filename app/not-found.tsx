export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[90dvh] bg-gray-50 text-center px-6">
      <h1 className="text-6xl font-extrabold text-indigo-700 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
