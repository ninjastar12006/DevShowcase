import { Link } from "react-router-dom";

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-gray-500">
        <div className="mx-auto max-w-xl p-10">
            <div className="bg-white rounded-2xl shadow p-8">
                <nav className="flex gap-4 text-sm mb-8">
                    <Link className="text-slate-600 hover:text-slate-900" to="/">Home</Link>
                    <Link className="text-slate-600 hover:text-slate-900" to="/sign-in">Sign In</Link>
                    <Link className="text-slate-600 hover:text-slate-900" to="/build">Build</Link>
                </nav>
            </div>
        </div>
    </div>
  );
}