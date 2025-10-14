import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Not Found</h1>
        <p className="mb-6">The page you are looking for does not exist.</p>
        <Link to="/" className="px-4 py-2 bg-primary text-white rounded">Go to Login</Link>
      </div>
    </div>
  );
}
