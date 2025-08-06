import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <FiAlertCircle className="text-blue-600 text-7xl mb-4" />
      <h1 className="text-5xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-lg text-gray-700">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
