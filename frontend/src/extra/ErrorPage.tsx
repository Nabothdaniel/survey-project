import { useRouteError, Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <FiAlertTriangle className="text-blue-600 text-7xl mb-4" />
      <h1 className="text-4xl font-bold text-blue-600">Something went wrong</h1>
      <p className="mt-4 text-gray-700">
        {error?.statusText || error?.message || "An unexpected error occurred."}
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
