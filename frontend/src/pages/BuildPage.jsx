import { useAuth, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuildPage() {
    // Clerk hooks to grab the token and check auth status
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [backendResponse, setBackendResponse] = useState(null);
    const navigate = useNavigate();

    const testBackend = async () => {
        try {
            // 1. Get the secure session token from Clerk
            const token = await getToken();
            console.log("Token generated:", token); 
            
            // 2. Send the token to your teammate's FastAPI route
            const response = await fetch("http://localhost:8080/protected", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // 3. Display the result!
            const data = await response.json();
            setBackendResponse(data);
        } catch (error) {
            console.error("Failed to fetch:", error);
            setBackendResponse({ error: "Failed to connect to backend. Is your FastAPI server running?" });
        }
    };

    // Quick loading state
    if (!isLoaded) {
        return <div className="p-10 text-white min-h-screen bg-[rgb(25,25,25)]">Loading Clerk...</div>;
    }

    // Protect the route: if they aren't signed in, tell them to go back
    if (!isSignedIn) {
        return (
            <div className="p-10 text-white min-h-screen bg-[rgb(25,25,25)] flex flex-col items-center justify-center">
                <h2 className="text-2xl mb-4 font-semibold">You must be signed in to view the builder!</h2>
                <button 
                    onClick={() => navigate('/sign-in')} 
                    className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg font-bold transition-colors"
                >
                    Go to Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="p-10 text-white bg-[rgb(25,25,25)] min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b border-gray-600 pb-4">
                <h1 className="text-3xl font-bold text-cyan-500">DevShowcase Builder</h1>
                
                {/* This drops in a nice profile picture menu in the top right corner */}
                <UserButton afterSignOutUrl="/" /> 
            </div>
            
            <button 
                onClick={testBackend}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
                Test Backend Connection
            </button>
            
            {backendResponse && (
                <div className="mt-8 p-6 bg-[rgb(35,35,35)] rounded-xl border border-gray-600 shadow-lg max-w-2xl">
                    <h2 className="text-xl mb-4 font-semibold text-gray-300">FastAPI Response:</h2>
                    {/* Prints out the raw JSON response from your backend */}
                    <pre className="text-green-400 overflow-x-auto text-sm">
                        {JSON.stringify(backendResponse, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}