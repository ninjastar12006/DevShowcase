import { Link } from "react-router-dom";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/DevShowcaseLogo4.png";
import templateImage from "../assets/TemplateImage.png";

export default function BuildPage() {
    // Clerk hooks to grab the token and check auth status
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [backendResponse, setBackendResponse] = useState(null);
    const navigate = useNavigate();
    const { user } = useUser();
    const [activePage, setActivePage] = useState("projects");
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [projectInputMode, setProjectInputMode] = useState("github");

    const [manualProject, setManualProject] = useState({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        technologies: "",
    });

    const [portfolioData, setPortfolioData] = useState({
        template: "classic",
        primaryColor: "#09c1de",
        secondaryColor: "#47e4b0",
        about: {
            image: "",
            college: "",
            major: "",
            paragraph: "",
        },
        projects: [],
        involvement: {
            education: "",
            clubs: [],
            certifications: [],
            other: "",
        },
    });
    const selectedTemplate = portfolioData.template;
    const primaryColor = portfolioData.primaryColor;
    const secondaryColor = portfolioData.secondaryColor;

    const testBackend = async () => {
        try {
            const token = await getToken();
            console.log("Token generated:", token); 
            const response = await fetch("http://localhost:8080/protected", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setBackendResponse(data);
        } catch (error) {
            console.error("Failed to fetch:", error);
            setBackendResponse({ error: "Failed to connect to backend. Is your FastAPI server running?" });
        }
    };

    if (!isLoaded) {
        return <div className="p-10 text-white min-h-screen bg-[rgb(25,25,25)]">Loading Clerk...</div>;
    }

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
        <div className="flex text-white bg-[rgb(25,25,25)] min-h-screen">
            <aside className="w-64 border-r border-gray-700 flex flex-col p-4">
                <div className="mb-10 pb-4 space-y-4">
                    <Link className="flex items-center" to="/">
                        <img src={logo} className="h-16 w-auto"/>
                    </Link>
                    
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide">
                            Templates
                        </h2>
                        <div className="flex flex-col items-center pt-2 pb-4 gap-2">
                            <div
                                onClick={() => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        template: "classic",
                                    })
                                }
                                className={`flex cursor-pointer flex-col items-center p-1 rounded-xl ${
                                    selectedTemplate === "classic" ? "bg-[rgba(9,173,245,.5)] border border-[rgba(11,209,244,0.45)]" : "bg-transparent border border-transparent"
                                }`}
                            >
                                <img src={templateImage} className="w-48"/>
                                <p className={`text-sm font-semibold ${selectedTemplate === "classic" ? "text-gray-100" : "text-gray-400"}`}>Classic</p>
                            </div>

                            <div
                                onClick={() => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        template: "minimalist",
                                    })
                                }
                                className={`flex cursor-pointer flex-col items-center p-1 rounded-xl ${
                                    selectedTemplate === "minimalist" ? "bg-[rgba(9,173,245,.5)] border border-cyan-200" : "bg-transparent border border-transparent"
                                }`}
                            >
                                <img src={templateImage} className="w-48"/>
                                <p className={`text-sm font-semibold ${selectedTemplate === "minimalist" ? "text-gray-100" : "text-gray-400"}`}>Minimalist</p>
                            </div>

                            <div
                                onClick={() => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        template: "technical",
                                    })
                                }
                                className={`flex cursor-pointer flex-col items-center p-1 rounded-xl ${
                                    selectedTemplate === "technical" ? "bg-[rgba(9,173,245,.5)] border border-cyan-200" : "bg-transparent border border-transparent"
                                }`}
                            >
                                <img src={templateImage} className="w-48"/>
                                <p className={`text-sm font-semibold ${selectedTemplate === "technical" ? "text-gray-100" : "text-gray-400"}`}>Technical</p>
                            </div>
                        </div>
                        
                        <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide pt-4">
                            Accent Colors
                        </h2>
                        <div className="flex gap-4 items-center justify-between px-6 mt-4">
                            <p className="text-sm font-semibold text-gray-400">Primary</p>
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        primaryColor: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex gap-4 items-center justify-between px-6 mt-4">
                            <p className="text-sm font-semibold text-gray-400">Secondary</p>
                            <input
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        secondaryColor: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <div className="flex items-center gap-5 pl-2 pb-2">
                        <UserButton afterSignOutUrl="/" appearance={{ 
                            baseTheme: dark ,
                            elements: {userButtonTrigger: "scale-125 origin-left"}
                            }} />
                        <span className="text-lg font-semibold text-white">
                            {user?.fullName || user?.firstName || "User"}
                        </span>
                    </div>
                </div>
            </aside>
            
            <main className="flex-1 p-8 bg-[rgb(35,35,35)]">
                <div className="h-full rounded-2xl border border-gray-700 bg-[rgb(25,25,25)]">
                        <div className="flex justify-center gap-8 border-b border-gray-700">
                            <button
                                onClick={() => setActivePage("about")}
                                className={`rounded-lg px-4 py-2 font-medium ${
                                    activePage === "about" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-300"
                                }`}
                            >
                                About
                            </button>

                            <button
                                onClick={() => setActivePage("projects")}
                                className={`rounded-lg px-4 py-2 font-medium ${
                                    activePage === "projects" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-300"
                                }`}
                            >
                                Projects
                            </button>

                            <button
                                onClick={() => setActivePage("involvement")}
                                className={`rounded-lg px-4 py-2 font-medium ${
                                    activePage === "involvement" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-300"
                                }`}
                            >
                                Involvement
                            </button>
                        </div>
                        
                        {activePage === "about" && selectedTemplate === "classic" && (
                            <div className="p-8">
                                <h1 className="text-2xl font-bold text-white">About</h1>
                            </div>
                        )}

                        {activePage === "projects" && selectedTemplate === "classic" && (
                            <div className="p-8">
                                <h1 className="text-2xl font-bold text-white">Projects</h1>

                                <div className="mt-6 space-y-4">
                                    {portfolioData.projects.length === 0 && (
                                        <div className="mt-6 rounded-xl border border-dashed border-gray-700 p-6 text-gray-400">
                                            No projects added yet.
                                        </div>
                                    )}
                                    {portfolioData.projects.map((project) => (
                                        <div key={project.id} className="rounded-xl border border-gray-700 p-4">
                                            <p className="font-semibold text-white">
                                                {project.title || `Project ${project.id}`}
                                            </p>
                                            {project.description && (
                                                <p className="mt-2 text-sm text-gray-400">{project.description}</p>
                                            )}
                                            {project.technologies && (
                                                <p 
                                                    className="mt-2 text-sm"
                                                    style={{ color: primaryColor}}
                                                >
                                                    {project.technologies}
                                                </p>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 inline-block text-sm"
                                                    style={{ color: primaryColor}}
                                                >
                                                    View GitHub Repo
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-2 ml-4 inline-block text-sm"
                                                    style={{ color: secondaryColor}}
                                                >
                                                    View Live Project
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingProjectId(null);
                                        setIsAddProjectOpen(true);
                                    }}
                                    className="mt-4 rounded-lg bg-cyan-600 cursor-pointer hover:bg-cyan-400 px-4 py-2 font-medium text-white"
                                >
                                    Add Project
                                </button>
                            </div>
                        )}
                        {isAddProjectOpen && editingProjectId === null && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="w-full max-w-2xl rounded-2xl bg-[rgb(25,25,25)] px-6 pb-6 pt-2 border border-gray-700">
                                    <div className="flex items-center pb-4">
                                        <button
                                            onClick={() => setIsAddProjectOpen(false)}
                                            className="text-2xl text-gray-400 hover:text-white"
                                        >×</button>

                                        <div className="flex flex-1 justify-center gap-4">
                                            <button
                                                onClick={() => setProjectInputMode("github")}
                                                className={`px-4 py-2 font-medium ${
                                                    projectInputMode === "github" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400"
                                                }`}
                                            >Import from GitHub</button>

                                            <button
                                                onClick={() => setProjectInputMode("manual")}
                                                className={`px-4 py-2 font-medium ${
                                                    projectInputMode === "manual" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400"
                                                }`}
                                            >Enter Manually</button>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-700">
                                        {projectInputMode === "github" ? (
                                            <div className="space-y-3">
                                                <h2 className="text-lg font-semibold text-white">Import a repository</h2>
                                                <div className="rounded-xl border border-gray-700 p-4 text-gray-400">
                                                    Connected repositories will go here
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <h2 className="text-lg font-semibold text-white">Add a project manually</h2>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Project Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter project title"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.title}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                title: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                                    <textarea
                                                        placeholder="Enter project description"
                                                        rows={4}
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none resize-none"
                                                        value={manualProject.description}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">GitHub URL</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Paste GitHub repository link"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.githubUrl}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                githubUrl: e.target.value,
                                                            })
                                                        }
                                                   />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Live URL</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Paste deployed project link"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.liveUrl}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                liveUrl: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Technologies</label>
                                                    <input
                                                        type="text"
                                                        placeholder="React, Tailwind, FastAPI, etc."
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.technologies}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                technologies: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-3 pt-2">
                                                    <button
                                                        className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800"
                                                        onClick={() => {
                                                            setIsAddProjectOpen(false);
                                                            setManualProject({
                                                                title: "",
                                                                description: "",
                                                                githubUrl: "",
                                                                liveUrl: "",
                                                                technologies: "",
                                                            });
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500"
                                                        onClick={() => {
                                                            setPortfolioData({
                                                                ...portfolioData,
                                                                projects: [
                                                                    ...portfolioData.projects,
                                                                    {
                                                                        id: portfolioData.projects.length + 1,
                                                                        ...manualProject,
                                                                    },
                                                                ],
                                                            });
                                                            setIsAddProjectOpen(false);
                                                            setManualProject({
                                                                title: "",
                                                                description: "",
                                                                githubUrl: "",
                                                                liveUrl: "",
                                                                technologies: "",
                                                            });
                                                        }}
                                                    >
                                                        Save Project
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePage === "involvement" && selectedTemplate === "classic" && (
                            <div className="p-8">
                                <h1 className="text-2xl font-bold text-white">Involvement</h1>
                            </div>
                        )}

                
                    {/* <button 
                        onClick={testBackend}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Test Backend Connection
                    </button>
                    
                    {backendResponse && (
                        <div className="mt-8 p-6 bg-[rgb(35,35,35)] rounded-xl border border-gray-600 shadow-lg max-w-2xl">
                            <h2 className="text-xl mb-4 font-semibold text-gray-300">FastAPI Response:</h2>
                            <pre className="text-green-400 overflow-x-auto text-sm">
                                {JSON.stringify(backendResponse, null, 2)}
                            </pre>
                        </div>
                    )} */}
                </div>
            </main>
            
        </div>
    );
}