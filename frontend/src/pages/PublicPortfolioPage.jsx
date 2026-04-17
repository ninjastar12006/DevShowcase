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

    const [activePage, setActivePage] = useState("about");

    const [activeImageIndexes, setActiveImageIndexes] = useState({});

    useEffect(() => {
        // Makes page look better by stopping content from shifting when there is and isn't a scrollbar.
        const html = document.documentElement;

        const previousOverflowY = html.style.overflowY;
        const previousScrollbarGutter = html.style.scrollbarGutter;

        html.style.overflowY = "scroll";
        html.style.scrollbarGutter = "stable";

        return () => {
            html.style.overflowY = previousOverflowY;
            html.style.scrollbarGutter = previousScrollbarGutter;
        };
    }, []);

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

    const { primaryColor, secondaryColor, about, projects, involvement } = portfolioData;

    const sectionPriority = {
        workExperience: 4,
        clubs: 3,
        skills: 1,
        education: 2,
        awards: 1,
        certifications: 1,
        volunteer: 2,
    };

    const sortedVisibleSections = [...(involvement?.visibleSections || [])].sort(
        (a, b) => (sectionPriority[b] || 0) - (sectionPriority[a] || 0)
    );

    const getLayoutClasses = () => {
        const count = sortedVisibleSections.length;

        if (count === 1) return ["col-span-12"];
        if (count === 2) return ["col-span-6", "col-span-6"];
        if (count === 3) return ["col-span-8", "col-span-4", "col-span-12"];
        if (count === 4) return ["col-span-8", "col-span-4", "col-span-6", "col-span-6"];
        if (count === 5) return ["col-span-8", "col-span-4", "col-span-6", "col-span-6", "col-span-12"];
        if (count === 6) return ["col-span-8", "col-span-4", "col-span-6", "col-span-6", "col-span-6", "col-span-6"];
        if (count === 7) return ["col-span-8", "col-span-4", "col-span-6", "col-span-6", "col-span-4", "col-span-4", "col-span-4"];

        return [];
    };

    const layoutClasses = getLayoutClasses();

    const renderSectionCard = (section, index) => {
        const layoutClass = layoutClasses[index] || "col-span-6";

        if (section === "education") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Education</h2>
                    <div className="mt-4 space-y-3">
                        {involvement.education.map((entry) => (
                            <div
                                key={entry.id}
                                className="rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${secondaryColor}70` }}
                            >
                                <p className="font-semibold text-white">
                                    {entry.school || "Untitled School"}
                                </p>
                                <p className="text-gray-400">
                                    {entry.degree || ""}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {entry.startDate || "Start"} - {entry.endDate || "End"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "skills") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Skills</h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {involvement.skills.map((skill) => (
                            <div
                                key={skill.id}
                                className="rounded-full border border-white/10 bg-[rgb(25,25,25)] px-4 py-2"
                            >
                                <span className="text-sm font-medium" style={{ color: secondaryColor }}>
                                    {skill.name || "Untitled Skill"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "clubs") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Clubs</h2>
                    <div className="mt-4 space-y-4">
                        {involvement.clubs.map((entry) => (
                            <div
                                key={entry.id}
                                className="rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${secondaryColor}70` }}
                            >
                                <p className="font-semibold text-white">
                                    {entry.role || "Untitled Role"}
                                </p>
                                <p className="text-gray-400">
                                    {entry.club || "Untitled Club"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {entry.startDate || "Start"} - {entry.endDate || "End"}
                                </p>
                                {entry.description && (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-400">
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "workExperience") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Work Experience</h2>
                    <div className="mt-4 space-y-4">
                        {involvement.workExperience.map((entry) => (
                            <div
                                key={entry.id}
                                className="rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${secondaryColor}70` }}
                            >
                                <p className="font-semibold text-white">
                                    {entry.role || "Untitled Role"}
                                </p>
                                <p className="text-gray-400">
                                    {entry.company || "Untitled Company"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {entry.startDate || "Start"} - {entry.endDate || "End"}
                                </p>
                                {entry.description && (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-400">
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "awards") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Awards</h2>
                    <div className="mt-4 space-y-4">
                        {involvement.awards.map((entry, entryIndex) => (
                            <div key={entry.id}>
                                <div>
                                    <p className="font-semibold text-white">
                                        {entry.title || "Untitled Award"}
                                    </p>
                                    <p className="text-gray-400">
                                        {entry.issuer || "Unknown Issuer"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {entry.date || "No Date"}
                                    </p>
                                    {entry.description && (
                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-400">
                                            {entry.description}
                                        </p>
                                    )}
                                </div>

                                {entryIndex !== involvement.awards.length - 1 && (
                                    <div className="mt-4 border-t" style={{ borderColor: `${secondaryColor}70` }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "certifications") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Certifications</h2>
                    <div className="mt-4 space-y-4">
                        {involvement.certifications.map((entry, entryIndex) => (
                            <div key={entry.id}>
                                <div>
                                    <p className="font-semibold text-white">
                                        {entry.name || "Untitled Certification"}
                                    </p>
                                    <p className="text-gray-400">
                                        {entry.issuer || "Unknown Issuer"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {entry.date || "No Date"}
                                    </p>

                                    {entry.credentialLink && (
                                        <a
                                            href={entry.credentialLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-block text-sm hover:opacity-80 transition-opacity duration-200"
                                            style={{ color: secondaryColor }}
                                        >
                                            View Credential
                                        </a>
                                    )}
                                </div>

                                {entryIndex !== involvement.certifications.length - 1 && (
                                    <div className="mt-4 border-t" style={{ borderColor: `${secondaryColor}70` }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "volunteer") {
            return (
                <div key={section} className={`${layoutClass} rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: primaryColor }}>
                    <h2 className="text-2xl font-bold text-white">Volunteer</h2>
                    <div className="mt-4 space-y-4">
                        {involvement.volunteer.map((entry) => (
                            <div
                                key={entry.id}
                                className="rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${secondaryColor}70` }}
                            >
                                <p className="font-semibold text-white">
                                    {entry.role || "Untitled Role"}
                                </p>
                                <p className="text-gray-400">
                                    {entry.organization || "Untitled Organization"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {entry.startDate || "Start"} - {entry.endDate || "End"}
                                </p>
                                {entry.description && (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-400">
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-[rgb(25,25,25)] text-white font-sans">
            
            {/* PREVIEW BANNER */}
            {isPreview && (
                <div className="bg-cyan-600 text-white text-center py-2 font-bold tracking-wide shadow-md">
                    PREVIEW MODE — This is exactly how your portfolio will look when published.
                </div>
            )}

            {/* NAVIGATION PILL */}
            <div className="sticky top-0 z-20 flex justify-center px-6 py-4 bg-transparent">
                <div className="relative rounded-full border border-white/10 bg-white/8 backdrop-blur-md">
                    <div
                        className="absolute top-0 z-0 h-full w-1/3 rounded-full transition-all duration-300"
                        style={{
                            left:
                                activePage === "about" ? "0%" : activePage === "projects" ? "27%" : "57%",
                            width:
                                activePage === "about" ? "26.5%" : activePage === "projects" ? "30%" : "42.6%",
                            background: primaryColor,
                        }}
                    ></div>

                    <button
                        onClick={() => setActivePage("about")}
                        className={`relative z-10 rounded-full px-4 py-2 font-medium ${
                            activePage === "about" ? "text-white" : "text-gray-300"
                        }`}
                    >
                        About
                    </button>

                    <button
                        onClick={() => setActivePage("projects")}
                        className={`relative z-10 rounded-full px-4 py-2 font-medium ${
                            activePage === "projects" ? "text-white" : "text-gray-300"
                        }`}
                    >
                        Projects
                    </button>

                    <button
                        onClick={() => setActivePage("involvement")}
                        className={`relative z-10 rounded-full px-4 py-2 font-medium ${
                            activePage === "involvement" ? "text-white" : "text-gray-300"
                        }`}
                    >
                        Involvement
                    </button>
                </div>
            </div>

            {/* HERO / ABOUT SECTION */}
            {activePage === "about" && (
                <div className="p-0 flex flex-col min-h-full">
                    <div className="mt-2 flex gap-2 max-w-4xl mx-auto justify-center items-center">
                        <div className="flex h-72 w-72 items-center justify-center rounded-full border border-gray-700 bg-[rgb(35,35,35)] text-sm text-gray-400 overflow-hidden">
                            <img
                                src={
                                    typeof about?.headshot === "string" && about.headshot.trim() !== ""
                                        ? about.headshot
                                        : tempHeadshot
                                }
                                alt="Headshot"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="w-[520px]">
                            <h2 className="ml-8 mt-20 leading-[1.3] text-5xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                {about?.name?.trim() || "Your Name"}
                            </h2>

                            <div
                                className="w-[800px] pl-9 -mt-1 flex gap-1 text-lg"
                                style={{ color: secondaryColor }}
                            >
                                <p>{about?.year?.trim() || "Year"}</p>
                                <p>{about?.major?.trim() || "Major"}</p>
                                <p>student at</p>
                                <p>{about?.college?.trim() || "College"}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative z-10 -mt-14 flex-1 bg-[rgb(40,40,40)] p-12 border-t-6 text-gray-400 text-justify"
                        style={{ color: primaryColor }}
                    >
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold text-white">About Me</h2>

                            <p className="mt-4 text-lg text-gray-400 whitespace-pre-line">
                                {about?.paragraph?.trim() || "Your bio goes here."}
                            </p>

                            {typeof about?.resume === "string" && about.resume.trim() !== "" && (
                                <div className="mt-8">
                                    <iframe
                                        src={about.resume}
                                        title="Resume Preview"
                                        className="h-[1130px] w-full rounded-2xl border border-gray-700 bg-white"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* PROJECTS SECTION */}
            {activePage === "projects" && portfolioData.template === "classic" && (
                <div className="p-0">
                    {projects?.map((project, index) => {
                        const hasMedia =
                            (project.mediaType === "images" && project.images?.length > 0) ||
                            (project.mediaType === "youtube" && project.youtubeUrl);

                        return (
                            <div className={`${index % 2 === 1 ? "bg-[rgb(40,40,40)]" : "bg-[rgb(25,25,25)]"}`}>
                                <div
                                    key={project.id || index}
                                    className="relative grid grid-cols-2 gap-8 p-8 max-w-7xl mx-auto"
                                >
                                    <div
                                        className={`flex flex-col justify-center ${
                                            hasMedia
                                                ? index % 2 === 1
                                                    ? "mx-auto pr-8 order-2"
                                                    : "mx-auto pl-8 order-1"
                                                : "col-span-2 max-w-5xl mx-auto"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-bold text-white">
                                                {project.title || `Project ${index + 1}`}
                                            </p>

                                            <div className="flex items-center gap-3">
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                    >
                                                        <img src={githubLogo} className="h-7 w-7" alt="GitHub" />
                                                    </a>
                                                )}

                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                    >
                                                        <img src={urlIcon} className="h-6 w-6" alt="Live site" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {project.description && (
                                            <p className="mt-3 text-base leading-7 text-gray-400 text-justify">
                                                {project.description}
                                            </p>
                                        )}

                                        {project.technologies && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {project.technologies.split(",").map((tech, techIndex) => (
                                                    <span
                                                        key={techIndex}
                                                        className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm"
                                                        style={{ color: secondaryColor }}
                                                    >
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`flex flex-col justify-center ${
                                            index % 2 === 1 ? "items-center order-1" : "items-center order-2"
                                        }`}
                                    >
                                        {project.mediaType === "youtube" && project.youtubeUrl && (
                                            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-700 bg-[rgb(20,20,20)]">
                                                <iframe
                                                    src={(() => {
                                                        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
                                                        const match = project.youtubeUrl.match(regExp);
                                                        return match ? `https://www.youtube.com/embed/${match[1]}` : "";
                                                    })()}
                                                    title={`${project.title || "Project"} video`}
                                                    className="aspect-video w-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}

                                        {project.mediaType === "images" && project.images?.length > 0 && (() => {
                                            const currentIndex = activeImageIndexes[project.id] || 0;
                                            const prevIndex =
                                                currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
                                            const nextIndex =
                                                currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;

                                            const currentImage = project.images[currentIndex];
                                            const imageSrc =
                                                typeof currentImage === "string" && currentImage.trim() !== ""
                                                    ? currentImage
                                                    : "";

                                            if (!imageSrc) return null;

                                            return (
                                                <div className="w-full max-w-xl">
                                                    <div className="relative">
                                                        <img
                                                            src={imageSrc}
                                                            alt="Project preview"
                                                            className="h-72 w-full rounded-2xl object-cover border border-gray-700"
                                                        />

                                                        {project.images.length > 1 && (
                                                            <div>
                                                                <button
                                                                    onClick={() =>
                                                                        setActiveImageIndexes({
                                                                            ...activeImageIndexes,
                                                                            [project.id]: prevIndex,
                                                                        })
                                                                    }
                                                                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                                                                >
                                                                    ←
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        setActiveImageIndexes({
                                                                            ...activeImageIndexes,
                                                                            [project.id]: nextIndex,
                                                                        })
                                                                    }
                                                                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                                                                >
                                                                    →
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activePage === "projects" && portfolioData.template === "minimalist" && (
                <div className="px-8 mt-12">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 auto-rows-[220px]">
                        {projects?.map((project, index) => (
                            <a
                                key={project.id || index}
                                href={project.githubUrl || "#"}
                                target={project.githubUrl ? "_blank" : undefined}
                                rel={project.githubUrl ? "noreferrer" : undefined}
                                className={`group rounded-2xl border bg-[rgb(35,35,35)] p-6 transition hover:-translate-y-1 hover:bg-[rgb(42,42,42)] ${
                                    project.githubUrl ? "cursor-pointer" : "cursor-default"
                                }`}
                                style={{ borderColor: primaryColor }}
                            >
                                <div className="flex h-full flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {project.title || `Project ${index + 1}`}
                                        </h2>

                                        <p className="mt-4 line-clamp-5 text-sm leading-6 text-gray-400">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>

                                    {project.githubUrl && (
                                        <p
                                            className="mt-4 text-sm font-medium transition group-hover:opacity-80"
                                            style={{ color: secondaryColor }}
                                        >
                                            View on GitHub →
                                        </p>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {activePage === "projects" && portfolioData.template === "technical" && (
                <div className="p-0">
                    {projects?.map((project, index) => {
                        const hasMedia =
                            (project.mediaType === "images" && project.images?.length > 0) ||
                            (project.mediaType === "youtube" && project.youtubeUrl);

                        const contributionItems = (project.keyContributions || "")
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean);

                        return (
                            <div className={`${index % 2 === 1 ? "bg-[rgb(40,40,40)]" : "bg-[rgb(25,25,25)]"}`}>
                                <div
                                    key={`${project.id}-${index}`}
                                    className="relative grid grid-cols-2 gap-8 p-8 max-w-7xl mx-auto"
                                >
                                    <div
                                        className={`flex flex-col justify-center ${
                                            hasMedia
                                                ? index % 2 === 1
                                                    ? "mx-auto pr-8 order-2"
                                                    : "mx-auto pl-8 order-1"
                                                : "col-span-2 max-w-5xl mx-auto"
                                        }`}
                                    >
                                        {contributionItems.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-2 gap-16">
                                                    <div>
                                                        <div className="flex items-center gap-4">
                                                            <p className="text-2xl font-bold text-white">
                                                                {project.title || `Project ${index + 1}`}
                                                            </p>

                                                            <div className="flex items-center gap-3">
                                                                {project.githubUrl && (
                                                                    <a
                                                                        href={project.githubUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                                    >
                                                                        <img src={githubLogo} className="h-7 w-7" alt="GitHub" />
                                                                    </a>
                                                                )}

                                                                {project.liveUrl && (
                                                                    <a
                                                                        href={project.liveUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                                    >
                                                                        <img src={urlIcon} className="h-6 w-6" alt="Live site" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {project.date && (
                                                            <p className="mt-2 text-sm font-medium" style={{ color: primaryColor }}>
                                                                {project.date}
                                                            </p>
                                                        )}

                                                        {project.description && (
                                                            <p className="mt-4 text-base leading-7 text-gray-400 text-justify">
                                                                {project.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="mt-4">
                                                        {project.role && (
                                                            <p
                                                                className="text-sm font-semibold uppercase tracking-wide"
                                                                style={{ color: primaryColor }}
                                                            >
                                                                {project.role}
                                                            </p>
                                                        )}

                                                        <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-400">
                                                            {contributionItems.map((item, itemIndex) => (
                                                                <li key={itemIndex} className="flex gap-2">
                                                                    <span style={{ color: secondaryColor }}>•</span>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {project.technologies && (
                                                    <div className="mt-6 flex flex-wrap gap-2">
                                                        {project.technologies.split(",").map((tech, techIndex) => (
                                                            <span
                                                                key={techIndex}
                                                                className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm"
                                                                style={{ color: secondaryColor }}
                                                            >
                                                                {tech.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-2xl font-bold text-white">
                                                        {project.title || `Project ${index + 1}`}
                                                    </p>

                                                    <div className="flex items-center gap-3">
                                                        {project.githubUrl && (
                                                            <a
                                                                href={project.githubUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                            >
                                                                <img src={githubLogo} className="h-7 w-7" alt="GitHub" />
                                                            </a>
                                                        )}

                                                        {project.liveUrl && (
                                                            <a
                                                                href={project.liveUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                            >
                                                                <img src={urlIcon} className="h-6 w-6" alt="Live site" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {project.date && (
                                                    <p className="mt-2 text-sm font-medium" style={{ color: secondaryColor }}>
                                                        {project.date}
                                                    </p>
                                                )}

                                                {project.role && (
                                                    <p
                                                        className="mt-2 text-sm font-semibold uppercase tracking-wide"
                                                        style={{ color: secondaryColor }}
                                                    >
                                                        {project.role}
                                                    </p>
                                                )}

                                                {project.description && (
                                                    <p className="mt-4 text-base leading-7 text-gray-400 text-justify">
                                                        {project.description}
                                                    </p>
                                                )}

                                                {project.technologies && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {project.technologies.split(",").map((tech, techIndex) => (
                                                            <span
                                                                key={techIndex}
                                                                className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm"
                                                                style={{ color: secondaryColor }}
                                                            >
                                                                {tech.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div
                                        className={`flex flex-col justify-center ${
                                            index % 2 === 1 ? "items-center order-1" : "items-center order-2"
                                        }`}
                                    >
                                        {project.mediaType === "youtube" && project.youtubeUrl && (
                                            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-700 bg-[rgb(20,20,20)]">
                                                <iframe
                                                    src={(() => {
                                                        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
                                                        const match = project.youtubeUrl.match(regExp);
                                                        return match ? `https://www.youtube.com/embed/${match[1]}` : "";
                                                    })()}
                                                    title={`${project.title || "Project"} video`}
                                                    className="pointer-events-none aspect-video w-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}

                                        {project.mediaType === "images" && project.images?.length > 0 && (() => {
                                            const currentIndex = activeImageIndexes[project.id] || 0;
                                            const prevIndex =
                                                currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
                                            const nextIndex =
                                                currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;

                                            const currentImage = project.images[currentIndex];
                                            const imageSrc =
                                                typeof currentImage === "string" && currentImage.trim() !== ""
                                                    ? currentImage
                                                    : "";

                                            if (!imageSrc) return null;

                                            return (
                                                <div className="w-full max-w-xl">
                                                    <div className="relative">
                                                        <img
                                                            src={imageSrc}
                                                            alt="Project preview"
                                                            className="h-72 w-full rounded-2xl object-cover border border-gray-700"
                                                        />

                                                        {project.images.length > 1 && (
                                                            <div>
                                                                <button
                                                                    onClick={() =>
                                                                        setActiveImageIndexes({
                                                                            ...activeImageIndexes,
                                                                            [project.id]: prevIndex,
                                                                        })
                                                                    }
                                                                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                                                                >
                                                                    ←
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        setActiveImageIndexes({
                                                                            ...activeImageIndexes,
                                                                            [project.id]: nextIndex,
                                                                        })
                                                                    }
                                                                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                                                                >
                                                                    →
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* INVOLVEMENT SECTION */}
            {activePage === "involvement" && (
                <div className="px-8 mt-12">
                    <div className="max-w-6xl mx-auto mt-12 pb-24 grid grid-cols-12 gap-4">
                        {sortedVisibleSections.map((section, index) => renderSectionCard(section, index))}
                    </div>
                </div>
            )}
            
            {/* FOOTER */}
            <footer className="text-center py-4 text-gray-500 text-gray-600 text-md mt-auto bg-[rgb(25,25,25)]">
                <p>Built with DevShowcase</p>
            </footer>
        </div>
    );
}