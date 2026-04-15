import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import tempHeadshot from "../assets/BlankProfile.png";
import githubLogo from "../assets/ConnectGithubImage.png";
import urlIcon from "../assets/CleanLinkImage.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function PublicPortfolioPage() {
    const { username } = useParams();
    const location = useLocation();
    const isPreview = location.pathname === "/preview";

    const [portfolioData, setPortfolioData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        // IF PREVIEW: Load data from Session Storage instead of the Database
        if (isPreview) {
            const previewData = sessionStorage.getItem("portfolioPreview");
            if (previewData) {
                setPortfolioData(JSON.parse(previewData));
            } else {
                setError(true);
            }
            return; // Stop here, do not fetch from backend!
        }

        // IF LIVE PUBLISHED LINK: Fetch from the backend
        const fetchPublicData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/public/portfolio/${username}`);
                if (!response.ok) throw new Error("Not found");
                const data = await response.json();
                setPortfolioData(data);
            } catch (err) {
                console.error(err);
                setError(true);
            }
        };
        
        fetchPublicData();
    }, [username, isPreview]);

    // Handle Image Blob URLs for Preview mode
    const getHeadshotSrc = (about) => {
        if (!about?.headshot) return tempHeadshot;
        // If previewing an uploaded file that hasn't been sent to a CDN yet, it might not render directly 
        // without URL.createObjectURL, but for standard string URLs, this works perfectly.
        return typeof about.headshot === 'string' ? about.headshot : tempHeadshot; 
    };

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[rgb(25,25,25)] text-white">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="mt-4 text-xl text-gray-400">
                    {isPreview ? "No preview data found. Go back and click Preview again." : "Portfolio not found."}
                </p>
            </div>
        );
    }

    if (!portfolioData) {
        return (
            <div className="flex h-screen items-center justify-center bg-[rgb(25,25,25)] text-white text-xl">
                Loading Portfolio...
            </div>
        );
    }

    const { primaryColor, secondaryColor, about, projects } = portfolioData;

    return (
        <div className="min-h-screen bg-[rgb(25,25,25)] text-white font-sans">
            
            {/* PREVIEW BANNER */}
            {isPreview && (
                <div className="bg-cyan-600 text-white text-center py-2 font-bold tracking-wide shadow-md sticky top-0 z-50">
                    PREVIEW MODE — This is exactly how your portfolio will look when published.
                </div>
            )}

            {/* HERO / ABOUT SECTION */}
            <div className="max-w-5xl mx-auto px-8 pt-24 pb-16 flex flex-col items-center text-center">
                <img 
                    src={getHeadshotSrc(about)} 
                    alt="Profile" 
                    className="h-48 w-48 rounded-full object-cover border-4 shadow-lg" 
                    style={{ borderColor: primaryColor }} 
                />
                
                <h1 className="mt-8 text-6xl font-bold tracking-tight">
                    {about?.name || "Developer"}
                </h1>
                
                {(about?.major || about?.college || about?.year) && (
                    <p className="mt-4 text-2xl font-medium" style={{ color: secondaryColor }}>
                        {about?.major && `${about.major} `}
                        {about?.college && `student at ${about.college} `}
                        {about?.year && `• Class of ${about.year}`}
                    </p>
                )}
                
                <p className="mt-8 max-w-3xl text-lg text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                    {about?.paragraph || "Welcome to my portfolio!"}
                </p>
            </div>

            {/* PROJECTS SECTION */}
            {projects && projects.length > 0 && (
                <div className="bg-[rgb(35,35,35)] py-20 mt-8">
                    <div className="max-w-6xl mx-auto px-8">
                        <h2 
                            className="text-3xl font-bold mb-16 border-b-2 inline-block pb-3" 
                            style={{ borderColor: primaryColor }}
                        >
                            Featured Projects
                        </h2>
                        
                        <div className="space-y-24">
                            {projects.map((project, index) => {
                                const hasMedia = (project.mediaType === "images" && project.images?.length > 0) || (project.mediaType === "youtube" && project.youtubeUrl);
                                
                                return (
                                    <div key={project.id || index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        
                                        {/* TEXT COLUMN */}
                                        <div className={`${index % 2 === 1 && hasMedia ? 'lg:order-2 lg:pl-8' : 'lg:pr-8'}`}>
                                            <h3 className="text-3xl font-bold">{project.title || `Project ${index + 1}`}</h3>
                                            
                                            <div className="flex gap-4 mt-6">
                                                {project.githubUrl && (
                                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-transform hover:scale-105 shadow-sm">
                                                        <img src={githubLogo} className="h-7 w-7" alt="GitHub" />
                                                    </a>
                                                )}
                                                {project.liveUrl && (
                                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-transform hover:scale-105 shadow-sm">
                                                        <img src={urlIcon} className="h-6 w-6" alt="Live Site" />
                                                    </a>
                                                )}
                                            </div>
                                            
                                            {project.description && (
                                                <p className="mt-6 text-gray-300 leading-relaxed text-lg text-justify">
                                                    {project.description}
                                                </p>
                                            )}
                                            
                                            {project.technologies && (
                                                <div className="mt-8 flex flex-wrap gap-3">
                                                    {project.technologies.split(",").map((tech, i) => (
                                                        <span 
                                                            key={i} 
                                                            className="rounded-full border border-white/10 bg-[rgb(25,25,25)] px-4 py-1.5 text-sm font-medium tracking-wide shadow-sm" 
                                                            style={{ color: secondaryColor }}
                                                        >
                                                            {tech.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* MEDIA COLUMN */}
                                        {hasMedia && (
                                            <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} shadow-2xl rounded-2xl overflow-hidden border border-gray-700 bg-[rgb(20,20,20)]`}>
                                                {project.mediaType === "youtube" && project.youtubeUrl ? (
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${project.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] || ""}`}
                                                        title={`${project.title} video`}
                                                        className="aspect-video w-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <div className="h-[350px] w-full flex items-center justify-center text-gray-500 font-medium">
                                                        <p>Images will appear here in production</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            
            {/* FOOTER */}
            <footer className="text-center py-12 text-gray-500 text-sm mt-auto">
                <p>Built with DevShowcase</p>
            </footer>
        </div>
    );
}