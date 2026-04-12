import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GithubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/build", { replace: true });
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  const success = searchParams.get("success") === "true";
  const githubLogin = searchParams.get("github_login");
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(25,25,25)] px-6 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[rgb(35,35,35)] p-8 text-center">
        <h1 className="text-2xl font-semibold">GitHub Connection</h1>
        <p className="mt-4 text-gray-300">
          {success
            ? `Connected${githubLogin ? ` to ${githubLogin}` : ""}. Returning to the builder...`
            : `GitHub connection failed${error ? `: ${error}` : "."}`}
        </p>
        <button
          onClick={() => navigate("/build", { replace: true })}
          className="mt-6 rounded-lg bg-cyan-600 px-5 py-2 font-medium text-white hover:bg-cyan-500"
        >
          Return now
        </button>
      </div>
    </div>
  );
}
