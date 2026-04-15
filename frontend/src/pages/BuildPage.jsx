import { Link } from "react-router-dom";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/DevShowcaseLogo4.png";
import templateImage from "../assets/TemplateImage.png";
import githubLogo from "../assets/ConnectGithubImage.png";
import urlIcon from "../assets/CleanLinkImage.png";
import tempHeadshot from "../assets/BlankProfile.png";
import BuilderModal from "../components/BuilderModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
    const [activeImageIndexes, setActiveImageIndexes] = useState({});

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [isEditingYear, setIsEditingYear] = useState(false);
    const [yearInput, setYearInput] = useState("");
    const [isEditingMajor, setIsEditingMajor] = useState(false);
    const [majorInput, setMajorInput] = useState("");
    const [isEditingCollege, setIsEditingCollege] = useState(false);
    const [collegeInput, setCollegeInput] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState("");
    const bioTextareaRef = useRef(null);

    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
    const [schoolEntry, setSchoolEntry] = useState({
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
    });
    const [isAddWorkExperienceOpen, setIsAddWorkExperienceOpen] = useState(false);
    const [workExperienceEntry, setWorkExperienceEntry] = useState({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [isAddClubOpen, setIsAddClubOpen] = useState(false);
    const [clubEntry, setClubEntry] = useState({
        club: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
    const [skillEntry, setSkillEntry] = useState({
        name: "",
    });
    const [isAddVolunteerOpen, setIsAddVolunteerOpen] = useState(false);
    const [volunteerEntry, setVolunteerEntry] = useState({
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [isAddAwardOpen, setIsAddAwardOpen] = useState(false);
    const [awardEntry, setAwardEntry] = useState({
        title: "",
        issuer: "",
        date: "",
        description: "",
    });
    const [isAddCertificationOpen, setIsAddCertificationOpen] = useState(false);
    const [certificationEntry, setCertificationEntry] = useState({
        name: "",
        issuer: "",
        date: "",
        credentialLink: "",
    });
    
    const [githubStatus, setGithubStatus] = useState({ connected: false, repository_count: 0 });
    const [githubRepositories, setGithubRepositories] = useState([]);
    const [selectedGithubRepoIds, setSelectedGithubRepoIds] = useState([]);
    const [githubLoading, setGithubLoading] = useState(false);
    const [githubError, setGithubError] = useState("");
    const [githubMessage, setGithubMessage] = useState("");

    const [manualProject, setManualProject] = useState({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        technologies: "",
        mediaType: "youtube",
        youtubeUrl: "",
        images: [],
    });

    const [portfolioData, setPortfolioData] = useState({
        template: "classic",
        primaryColor: "#09c1de",
        secondaryColor: "#47e4b0",
        about: {
            headshot: null,
            name: "",
            year: "",
            college: "",
            major: "",
            paragraph: "",
            resume: null,
        },
        projects: [],
        involvement: {
            visibleSections: [],
            education: [],
            skills: [],
            clubs: [],
            workExperience: [],
            certifications: [],
            awards: [],
            volunteer: [],
        },
    });

    const sectionPriority = {
        workExperience: 4,
        clubs: 3,
        skills: 1,
        education: 2,
        awards: 1,
        certifications: 1,
        volunteer: 2,
    };
    const sortedVisibleSections = [...(portfolioData.involvement?.visibleSections || [])].sort(
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
    const removeSection = (sectionToRemove) => {
        setPortfolioData({
            ...portfolioData,
            involvement: {
                ...portfolioData.involvement,
                visibleSections: portfolioData.involvement.visibleSections.filter(
                    (section) => section !== sectionToRemove
                ),
            },
        });
    };
    const renderSectionCard = (section, index) => {
        const layoutClass = layoutClasses[index] || "col-span-6";
        if (section === "education") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Education</h2>
                            <button
                                onClick={() => {
                                    setSchoolEntry({
                                        school: "",
                                        degree: "",
                                        startDate: "",
                                        endDate: "",
                                    });
                                    setIsAddSchoolOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                            >
                                + Add School
                            </button>
                        </div>
                        <button
                            onClick={() => removeSection("education")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>
                    <div className="mt-4 space-y-3">
                        {portfolioData.involvement.education.map((entry) => (
                            <div key={entry.id} className="group flex items-start justify-between gap-4 rounded-xl border bg-[rgb(25,25,25)] p-4" style={{ borderColor: `${portfolioData.secondaryColor}70` }}>
                                <div className="flex-1">
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
                                <button
                                    onClick={() =>
                                        setPortfolioData({
                                            ...portfolioData,
                                            involvement: {
                                                ...portfolioData.involvement,
                                                education: portfolioData.involvement.education.filter(
                                                    (school) => school.id !== entry.id
                                                ),
                                            },
                                        })
                                    }
                                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "skills") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Skills</h2>
                            <button
                                onClick={() => {
                                    setSkillEntry({ name: "" });
                                    setIsAddSkillOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                            >
                                + Add Skill
                            </button>
                        </div>
                        <button
                            onClick={() => removeSection("skills")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {portfolioData.involvement.skills.map((skill) => (
                            <div
                                key={skill.id}
                                className="flex items-center gap-2 rounded-full border border-white/10 bg-[rgb(25,25,25)] px-4 py-2"
                            >
                                <span className="text-sm font-medium" style={{ color: portfolioData.secondaryColor }}>
                                    {skill.name || "Untitled Skill"}
                                </span>
                                <button
                                    onClick={() =>
                                        setPortfolioData({
                                            ...portfolioData,
                                            involvement: {
                                                ...portfolioData.involvement,
                                                skills: portfolioData.involvement.skills.filter(
                                                    (currentSkill) => currentSkill.id !== skill.id
                                                ),
                                            },
                                        })
                                    }
                                    className="text-sm text-red-300 hover:text-red-200"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "clubs") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Clubs</h2>
                            <button
                                onClick={() => {
                                    setClubEntry({
                                        club: "",
                                        role: "",
                                        startDate: "",
                                        endDate: "",
                                        description: "",
                                    });
                                    setIsAddClubOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                            >
                                + Add Club
                            </button>
                        </div>
                        <button
                            onClick={() => removeSection("clubs")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="mt-4 space-y-4">
                        {portfolioData.involvement.clubs.map((entry) => (
                            <div
                                key={entry.id}
                                className="group flex items-start justify-between gap-4 rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${portfolioData.secondaryColor}70` }}
                            >
                                <div className="flex-1">
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

                                <button
                                    onClick={() =>
                                        setPortfolioData({
                                            ...portfolioData,
                                            involvement: {
                                                ...portfolioData.involvement,
                                                clubs: portfolioData.involvement.clubs.filter(
                                                    (club) => club.id !== entry.id
                                                ),
                                            },
                                        })
                                    }
                                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "workExperience") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border border-gray-700 bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Work Experience</h2>
                            <button
                                onClick={() => {
                                    setWorkExperienceEntry({
                                        company: "",
                                        role: "",
                                        startDate: "",
                                        endDate: "",
                                        description: "",
                                    });
                                    setIsAddWorkExperienceOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                            >
                                + Add Work
                            </button>
                        </div>
                        <button
                            onClick={() => removeSection("workExperience")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>
                    <div className="mt-4 space-y-4">
                        {portfolioData.involvement.workExperience.map((entry) => (
                            <div
                                key={entry.id}
                                className="group flex items-start justify-between gap-4 rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${portfolioData.secondaryColor}70` }}
                            >
                                <div className="flex-1">
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

                                <button
                                    onClick={() =>
                                        setPortfolioData({
                                            ...portfolioData,
                                            involvement: {
                                                ...portfolioData.involvement,
                                                workExperience: portfolioData.involvement.workExperience.filter(
                                                    (work) => work.id !== entry.id
                                                ),
                                            },
                                        })
                                    }
                                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "awards") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Awards</h2>
                            <button
                                onClick={() => {
                                    setAwardEntry({
                                        title: "",
                                        issuer: "",
                                        date: "",
                                        description: "",
                                    });
                                    setIsAddAwardOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white hover:bg-[rgb(45,45,45)]"
                            >
                                + Add Award
                            </button>
                        </div>

                        <button
                            onClick={() => removeSection("awards")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="mt-4 space-y-4">
                        {portfolioData.involvement.awards.map((entry, entryIndex) => (
                            <div key={entry.id}>
                                <div className="group flex items-start justify-between gap-4">
                                    <div className="flex-1">
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

                                    <button
                                        onClick={() =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    awards: portfolioData.involvement.awards.filter(
                                                        (award) => award.id !== entry.id
                                                    ),
                                                },
                                            })
                                        }
                                        className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>

                                {entryIndex !== portfolioData.involvement.awards.length - 1 && (
                                    <div className="mt-4 border-t" style={{ borderColor: `${portfolioData.secondaryColor}70` }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "certifications") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Certifications</h2>
                            <button
                                onClick={() => {
                                    setCertificationEntry({
                                        name: "",
                                        issuer: "",
                                        date: "",
                                        credentialLink: "",
                                    });
                                    setIsAddCertificationOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white hover:bg-[rgb(45,45,45)]"
                            >
                                + Add
                            </button>
                        </div>

                        <button
                            onClick={() => removeSection("certifications")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="mt-4 space-y-4">
                        {portfolioData.involvement.certifications.map((entry, entryIndex) => (
                            <div key={entry.id}>
                                <div className="group flex items-start justify-between gap-4">
                                    <div className="flex-1">
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
                                                style={{ color: portfolioData.secondaryColor }}
                                            >
                                                View Credential
                                            </a>
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    certifications: portfolioData.involvement.certifications.filter(
                                                        (certification) => certification.id !== entry.id
                                                    ),
                                                },
                                            })
                                        }
                                        className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>

                                {entryIndex !== portfolioData.involvement.certifications.length - 1 && (
                                    <div className="mt-4 border-t" style={{ borderColor: `${portfolioData.secondaryColor}70` }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (section === "volunteer") {
            return (
                <div key={section} className={`${layoutClass} group rounded-2xl border border-gray-700 bg-[rgb(35,35,35)] p-6`} style={{ borderColor: portfolioData.primaryColor }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Volunteer</h2>
                            <button
                                onClick={() => {
                                    setVolunteerEntry({
                                        organization: "",
                                        role: "",
                                        startDate: "",
                                        endDate: "",
                                        description: "",
                                    });
                                    setIsAddVolunteerOpen(true);
                                }}
                                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl border border-cyan-600 bg-[rgb(25,25,25)] px-4 py-2 font-semibold text-white hover:bg-[rgb(45,45,45)]"
                            >
                                + Add Volunteer
                            </button>
                        </div>

                        <button
                            onClick={() => removeSection("volunteer")}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="mt-4 space-y-4">
                        {portfolioData.involvement.volunteer.map((entry) => (
                            <div
                                key={entry.id}
                                className="group flex items-start justify-between gap-4 rounded-xl border bg-[rgb(25,25,25)] p-4"
                                style={{ borderColor: `${portfolioData.secondaryColor}70` }}

                            >
                                <div className="flex-1">
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

                                <button
                                    onClick={() =>
                                        setPortfolioData({
                                            ...portfolioData,
                                            involvement: {
                                                ...portfolioData.involvement,
                                                volunteer: portfolioData.involvement.volunteer.filter(
                                                    (volunteer) => volunteer.id !== entry.id
                                                ),
                                            },
                                        })
                                    }
                                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 hover:bg-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    const selectedTemplate = portfolioData.template;
    const primaryColor = portfolioData.primaryColor;
    const secondaryColor = portfolioData.secondaryColor;

const displayName = portfolioData.about.name.trim() || "Your Name";
    const displayYear = portfolioData.about.year.trim() || "Year";
    const displayMajor = portfolioData.about.major.trim() || "Major";
    const displayCollege = portfolioData.about.college.trim() || "College";
    const displayBio = portfolioData.about.paragraph.trim() || "Your bio goes here.";

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const fetchExistingPortfolio = async () => {
            try {
                const token = await getToken();
                const response = await fetch("http://localhost:8080/get-portfolio", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const savedData = await response.json();
                    setPortfolioData(prevData => ({
                        ...prevData,
                        template: savedData.template || prevData.template,
                        primaryColor: savedData.primaryColor || prevData.primaryColor,
                        secondaryColor: savedData.secondaryColor || prevData.secondaryColor,
                        about: { ...prevData.about, ...(savedData.about || {}) },
                        projects: savedData.projects || prevData.projects,
                        
                        involvement: {
                            visibleSections: savedData.involvement?.visibleSections || prevData.involvement.visibleSections || [],
                            education: savedData.involvement?.education || prevData.involvement.education || [],
                            skills: savedData.involvement?.skills || prevData.involvement.skills || [],
                            clubs: savedData.involvement?.clubs || prevData.involvement.clubs || [],
                            workExperience: savedData.involvement?.workExperience || prevData.involvement.workExperience || [],
                            certifications: savedData.involvement?.certifications || prevData.involvement.certifications || [],
                            awards: savedData.involvement?.awards || prevData.involvement.awards || [],
                            volunteer: savedData.involvement?.volunteer || prevData.involvement.volunteer || [],
                        }
                    }));
                }
            } catch (error) {
                console.error("Error fetching existing portfolio:", error);
            }
        };

        const loadGithubState = async () => {
            try {
                const token = await getToken();
                const statusResponse = await fetch(`${API_BASE_URL}/github/status`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const statusData = await statusResponse.json();
                setGithubStatus(statusData);

                if (statusData.connected) {
                    const reposResponse = await fetch(`${API_BASE_URL}/github/repositories`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const reposData = await reposResponse.json();
                    setGithubRepositories(reposData.repositories || []);
                }
            } catch (error) {
                console.error("Failed to load GitHub state:", error);
            }
        };

        fetchExistingPortfolio();
        loadGithubState();
    }, [isLoaded, isSignedIn, getToken]);

    // --- SAVE TO MONGODB FUNCTION ---
    const savePortfolio = async () => {
        try {
            const token = await getToken();
            
            // Merge the portfolio data with the user's Clerk profile info
            const payload = {
                ...portfolioData,
                email: user?.primaryEmailAddress?.emailAddress || "",
                username: user?.username || user?.fullName || "Developer",
            };

            const response = await fetch("http://localhost:8080/save-portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload) 
            });
            const data = await response.json();
            alert(data.message);
            setBackendResponse(data);
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save build to database. Check if your backend is running.");
        }
    };

    const connectGithub = async () => {
        try {
            setGithubError("");
            setGithubMessage("");
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/auth/github/start`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            window.location.href = data.authorize_url;
        } catch (error) {
            console.error("Failed to start GitHub OAuth:", error);
            setGithubError(error.message || "Unable to connect GitHub right now.");
        }
    };

    const syncGithubRepos = async () => {
        try {
            setGithubLoading(true);
            setGithubError("");
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/github/sync`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setGithubRepositories(data.repositories || []);
            setGithubStatus((currentStatus) => ({
                ...currentStatus,
                repository_count: data.repository_count ?? currentStatus.repository_count,
            }));
            setGithubMessage("GitHub repositories synced.");
        } catch (error) {
            console.error("Failed to sync GitHub repos:", error);
            setGithubError(error.message || "Unable to sync GitHub repositories.");
        } finally {
            setGithubLoading(false);
        }
    };

    const importSelectedGithubRepos = async () => {
        try {
            if (selectedGithubRepoIds.length === 0) {
                setGithubError("Select at least one repository first.");
                return;
            }

            setGithubLoading(true);
            setGithubError("");
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/github/import-selected`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ repo_ids: selectedGithubRepoIds }),
            });
            const data = await response.json();
            setPortfolioData((currentData) => ({
                ...currentData,
                projects: data.portfolio?.projects || [],
            }));
            setSelectedGithubRepoIds([]);
            setGithubMessage(`Imported ${data.imported_count || 0} repositor${data.imported_count === 1 ? "y" : "ies"}.`);
        } catch (error) {
            console.error("Failed to import GitHub repos:", error);
            setGithubError(error.message || "Unable to import repositories.");
        } finally {
            setGithubLoading(false);
        }
    };

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

    const getYouTubeEmbedUrl = (url) => {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}` : "";
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
        <div className="flex h-screen overflow-hidden text-white bg-[rgb(25,25,25)]">
            <aside className="w-64 h-full overflow-hidden border-r border-gray-700 flex flex-col p-4">
                <div className="mb-6 pb-0 space-y-3">
                    <Link className="flex items-center" to="/">
                        <img src={logo} className="h-12 w-auto"/>
                    </Link>
                    
                    <div className="mt-2">
                        <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide">
                            Templates
                        </h2>
                        <div className="flex flex-col items-center pt-2 pb-2 gap-1">
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
                        
                        <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide pt-1">
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

<div className="pt-5 px-2 space-y-3">
                           <div className="grid grid-cols-2 gap-3">
                               <button
                                    onClick={savePortfolio}
                                    className="rounded-xl border border-cyan-600 bg-[rgb(35,35,35)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                                >
                                    Save
                                </button>

                                {/* --- UPDATED PREVIEW BUTTON --- */}
                                <button
                                    onClick={() => {
                                        // 1. Save current unsaved state to session storage
                                        sessionStorage.setItem("portfolioPreview", JSON.stringify(portfolioData));
                                        // 2. Open the preview route in a new tab
                                        window.open("/preview", "_blank");
                                    }}
                                    className="rounded-xl border border-cyan-600 bg-[rgb(35,35,35)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                                >
                                    Preview
                                </button>
                            </div>
                            
                            {/* --- UPDATED PUBLISH BUTTON --- */}
                            <button
                                onClick={() => {
                                    // Generate the clean URL using their Clerk username or ID
                                    const slug = user?.username || user?.id; 
                                    const publishUrl = `${window.location.origin}/p/${slug}`;
                                    
                                    // Copy to clipboard and notify
                                    navigator.clipboard.writeText(publishUrl);
                                    alert(`Portfolio published! Link copied to clipboard:\n${publishUrl}`);
                                    
                                    // Open it in a new tab so they can see what recruiters see!
                                    window.open(publishUrl, '_blank');
                                }}
                                className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 font-bold text-white transition hover:bg-cyan-500 active:scale-[0.98]"
                            >
                                Publish
                            </button>

                            {/* --- SECRET ADMIN BUTTON --- */}
                            {user?.publicMetadata?.role === "admin" && (
                                <button
                                    onClick={() => navigate('/admin-dashboard')}
                                    className="mt-2 w-full rounded-xl border border-purple-500/50 bg-purple-500/10 px-4 py-2 font-bold text-purple-300 transition hover:bg-purple-500/20"
                                >
                                    Admin Dashboard
                                </button>
                            )}
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
            
            <main className="flex-1 h-full overflow-hidden p-8 bg-[rgb(35,35,35)]">
                <div className="h-full overflow-y-auto rounded-2xl border border-gray-700 bg-[rgb(25,25,25)]">
                        <div className="sticky top-0 z-20 flex justify-center px-6 py-4 bg-transparent">
                            <div className="relative rounded-full border border-white/10 bg-white/8 backdrop-blur-md">
                                <div 
                                    className="absolute top-0 z-0 h-full w-1/3 rounded-full transition-all duration-300"
                                    style={{
                                        left:
                                            activePage === "about" ? "0%" : activePage === "projects" ? "27%" : "58%",
                                        width:
                                            activePage === "about" ? "26.5%" : activePage === "projects" ? "30%" : "41.5%",
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
                        
                        {activePage === "about" && selectedTemplate === "classic" && (
                            <div className="p-0">
                                <div className="mt-2 flex gap-2 max-w-4xl mx-auto justify-center items-center">
                                    <input
                                        id="headshotUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPortfolioData({
                                                    ...portfolioData,
                                                    about: {
                                                        ...portfolioData.about,
                                                        headshot: file,
                                                    },
                                                });
                                            }
                                        }}
                                    />
                                    <div 
                                        onClick={() => document.getElementById("headshotUpload").click()}
                                        className="flex h-72 w-72 cursor-pointer items-center justify-center rounded-full border border-gray-700 bg-[rgb(35,35,35)] text-sm text-gray-400 overflow-hidden"
                                    >
                                        {portfolioData.about.headshot ? (
                                            <img
                                                src={URL.createObjectURL(portfolioData.about.headshot)}
                                                alt={tempHeadshot}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={tempHeadshot}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="w-[520px]">
                                        {isEditingName ? (
                                            <input
                                                type="text"
                                                value={nameInput}
                                                onChange={(e) => setNameInput(e.target.value)}
                                                onBlur={() => {
                                                    setPortfolioData({
                                                        ...portfolioData,
                                                        about: {
                                                            ...portfolioData.about,
                                                            name: nameInput,
                                                        },
                                                    });
                                                    setIsEditingName(false);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            about: {
                                                                ...portfolioData.about,
                                                                name: nameInput,
                                                            },
                                                        });
                                                        setIsEditingName(false);
                                                    }
                                                }}
                                                autoFocus
                                                className="ml-8 mt-20 leading-[1.3] bg-transparent text-5xl font-bold text-white cursor-text whitespace-nowrap overflow-hidden text-ellipsis"
                                            />
                                        ) : (
                                            <h2
                                                onClick={() => {
                                                    setNameInput(portfolioData.about.name.trim());
                                                    setIsEditingName(true);
                                                }}
                                                className="ml-8 mt-20 leading-[1.3] text-5xl font-bold text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                                            >
                                                {displayName}
                                            </h2>
                                        )}

                                        <div className="w-[800px] pl-9 -mt-1 flex gap-1 text-lg" style={{ color: secondaryColor }}>
                                            {isEditingYear ? (
                                                <input
                                                    type="text"
                                                    value={yearInput}
                                                    onChange={(e) => setYearInput(e.target.value)}
                                                    onBlur={() => {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            about: {
                                                                ...portfolioData.about,
                                                                year: yearInput,
                                                            },
                                                        });
                                                        setIsEditingYear(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            setPortfolioData({
                                                                ...portfolioData,
                                                                about: {
                                                                    ...portfolioData.about,
                                                                    year: yearInput,
                                                                },
                                                            });
                                                            setIsEditingYear(false);
                                                        }
                                                    }}
                                                    autoFocus
                                                    className="w-20 bg-transparent"
                                                />
                                            ) : (
                                                <p
                                                    onClick={() => {
                                                        setYearInput(portfolioData.about.year.trim());
                                                        setIsEditingYear(true);
                                                    }}
                                                    className={portfolioData.about.year.trim() ? "cursor-pointer" : "italic cursor-pointer"}
                                                >
                                                    {displayYear}
                                                </p>
                                            )}
                                            {isEditingMajor ? (
                                                <input
                                                    type="text"
                                                    value={majorInput}
                                                    onChange={(e) => setMajorInput(e.target.value)}
                                                    onBlur={() => {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            about: {
                                                                ...portfolioData.about,
                                                                major: majorInput,
                                                            },
                                                        });
                                                        setIsEditingMajor(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            setPortfolioData({
                                                                ...portfolioData,
                                                                about: {
                                                                    ...portfolioData.about,
                                                                    major: majorInput,
                                                                },
                                                            });
                                                            setIsEditingMajor(false);
                                                        }
                                                    }}
                                                    autoFocus
                                                    className="w-32 bg-transparent"
                                                />
                                            ) : (
                                                <p
                                                    onClick={() => {
                                                        setMajorInput(portfolioData.about.major.trim());
                                                        setIsEditingMajor(true);
                                                    }}
                                                    className={portfolioData.about.major.trim() ? "cursor-pointer" : "italic cursor-pointer"}
                                                >
                                                    {displayMajor}
                                                </p>
                                            )}
                                            <p>student at</p>
                                            {isEditingCollege ? (
                                                <input
                                                    type="text"
                                                    value={collegeInput}
                                                    onChange={(e) => setCollegeInput(e.target.value)}
                                                    onBlur={() => {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            about: {
                                                                ...portfolioData.about,
                                                                college: collegeInput,
                                                            },
                                                        });
                                                        setIsEditingCollege(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            setPortfolioData({
                                                                ...portfolioData,
                                                                about: {
                                                                    ...portfolioData.about,
                                                                    college: collegeInput,
                                                                },
                                                            });
                                                            setIsEditingCollege(false);
                                                        }
                                                    }}
                                                    autoFocus
                                                    className="w-40 bg-transparent"
                                                />
                                            ) : (
                                                <p
                                                    onClick={() => {
                                                        setCollegeInput(portfolioData.about.college.trim());
                                                        setIsEditingCollege(true);
                                                    }}
                                                    className={portfolioData.about.college.trim() ? "cursor-pointer" : "italic cursor-pointer"}
                                                >
                                                    {displayCollege}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 -mt-14 bg-[rgb(40,40,40)] p-12 border-t-6 text-gray-400 text-justify" style={{ color: primaryColor }}>
                                    <div className="max-w-5xl mx-auto">
                                        <h2 className="text-2xl font-bold text-white">About Me</h2>
                                        {isEditingBio ? (
                                            <textarea
                                                value={bioInput}
                                                ref={bioTextareaRef}
                                                onChange={(e) => {
                                                    setBioInput(e.target.value);
                                                    e.target.style.height = "auto";
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.height = "auto";
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                }}
                                                onBlur={() => {
                                                    setPortfolioData({
                                                        ...portfolioData,
                                                        about: {
                                                            ...portfolioData.about,
                                                            paragraph: bioInput,
                                                        },
                                                    });
                                                    setIsEditingBio(false);
                                                }}
                                                autoFocus
                                                className="mt-4 w-full resize-none bg-transparent text-lg text-gray-400 outline-none"
                                            />
                                        ) : (
                                            <p
                                                onClick={() => {
                                                    setBioInput(portfolioData.about.paragraph.trim());
                                                    setIsEditingBio(true);
                                                }}
                                                className={`mt-4 text-lg cursor-pointer whitespace-pre-line ${portfolioData.about.paragraph.trim() ? "text-gray-400" : "italic text-gray-500"}`}
                                            >
                                                {displayBio}
                                            </p>
                                        )}
                                        {portfolioData.about.resume && (
                                            <div className="mt-8">
                                                <iframe
                                                    src={URL.createObjectURL(portfolioData.about.resume)}
                                                    title="Resume Preview"
                                                    className="h-[1130px] w-full rounded-2xl border border-gray-700 bg-white"
                                                />
                                            </div>
                                        )}
                                        <input
                                            id="resumeUpload"
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file && file.type === "application/pdf") {
                                                    setPortfolioData({
                                                        ...portfolioData,
                                                        about: {
                                                            ...portfolioData.about,
                                                            resume: file,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                        <div
                                            onClick={() => document.getElementById("resumeUpload").click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files?.[0];
                                                if (file && file.type === "application/pdf") {
                                                    setPortfolioData({
                                                        ...portfolioData,
                                                        about: {
                                                            ...portfolioData.about,
                                                            resume: file,
                                                        },
                                                    });
                                                }
                                            }}
                                            className="flex mt-6 cursor-pointer min-h-32 w-full mx-auto items-center justify-center rounded-2xl border-2 border-dashed border-gray-600 bg-[rgb(35,35,35)] p-6 text-center text-gray-400"
                                        >
                                            {portfolioData.about.resume
                                                ? portfolioData.about.resume.name
                                                : "Drag and drop your resume PDF here"}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {activePage === "projects" && selectedTemplate === "classic" && (
                            <div className="p-0">
                                <div className="px-8 -mt-12">
                                    <button
                                        onClick={() => {
                                            setEditingProjectId(null);
                                            setProjectInputMode("github");
                                            setManualProject({
                                                title: "",
                                                description: "",
                                                githubUrl: "",
                                                liveUrl: "",
                                                technologies: "",
                                                mediaType: "youtube",
                                                youtubeUrl: "",
                                                images: [],
                                            });
                                            setIsAddProjectOpen(true);
                                        }}
                                        className="relative z-30 inline-block cursor-pointer rounded-xl border border-cyan-600 bg-[rgb(35,35,35)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                                    >
                                        + Add Project
                                    </button>
                                </div>
                                <div className="mt-6">
                                    {portfolioData.projects.map((project, index) => {
                                        const hasMedia = (project.mediaType === "images" && project.images?.length > 0) || (project.mediaType === "youtube" && project.youtubeUrl);
                                        return (
                                            <div
                                                key={project.id}
                                                className={`group relative grid grid-cols-2 gap-8 p-8 ${
                                                    index % 2 === 1 ? "bg-[rgb(40,40,40)]" : "bg-[rgb(25,25,25)]"
                                                }`}
                                            >
                                                <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProjectId(project.id);
                                                            setManualProject({
                                                                title: project.title || "",
                                                                description: project.description || "",
                                                                githubUrl: project.githubUrl || "",
                                                                liveUrl: project.liveUrl || "",
                                                                technologies: project.technologies || "",
                                                                mediaType: project.mediaType || "youtube",
                                                                youtubeUrl: project.youtubeUrl || "",
                                                                images: project.images || [],
                                                            });
                                                            setProjectInputMode("manual");
                                                            setIsAddProjectOpen(true);
                                                        }}
                                                        className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm hover:bg-black/60"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setPortfolioData({
                                                                ...portfolioData,
                                                                projects: portfolioData.projects.filter((p) => p.id !== project.id),
                                                            })
                                                        }
                                                        className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 backdrop-blur-sm hover:bg-red-500/20"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                <div className={`flex flex-col justify-center ${hasMedia ? (index % 2 === 1 ? "pr-8 order-2" : "pl-8 order-1") : "col-span-2 max-w-5xl mx-auto"}`}>
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
                                                                    <img src={githubLogo} className="h-7 w-7" />
                                                                </a>
                                                            )}
                                                            {project.liveUrl && (
                                                                <a
                                                                    href={project.liveUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                                >
                                                                    <img src={urlIcon} className="h-6 w-6" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {project.description && (
                                                        <p className="mt-3 text-base leading-7 text-gray-400 text-justify">{project.description}</p>
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
                                                <div className={`flex flex-col justify-center ${index % 2 === 1 ? "items-center order-1" : "items-center order-2"}`}>
                                                    {project.mediaType === "youtube" && project.youtubeUrl && (
                                                        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-700 bg-[rgb(20,20,20)]">
                                                            <iframe
                                                                src={getYouTubeEmbedUrl(project.youtubeUrl)}
                                                                title={`${project.title || "Project"} video`}
                                                                className="aspect-video w-full"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    )}
                                                    {project.mediaType === "images" && project.images?.length > 0 && (
                                                        <div className="w-full max-w-xl">
                                                            {(() => {
                                                                const currentIndex = activeImageIndexes[project.id] || 0;
                                                                const prevIndex = currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
                                                                const nextIndex = currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;
                                                                return (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={URL.createObjectURL(project.images[currentIndex])}
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
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {isAddProjectOpen && (
                            <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="w-full max-w-2xl rounded-2xl bg-[rgb(25,25,25)] px-6 pb-6 pt-2 border border-gray-700">
                                    <div className="flex items-center pb-4">
                                        <button
                                            onClick={() => {
                                                setIsAddProjectOpen(false);
                                                setEditingProjectId(null);
                                                setManualProject({
                                                    title: "",
                                                    description: "",
                                                    githubUrl: "",
                                                    liveUrl: "",
                                                    technologies: "",
                                                    mediaType: "youtube",
                                                    youtubeUrl: "",
                                                    images: [],
                                                });
                                            }}
                                            className="text-2xl text-gray-400 hover:text-white"
                                        >
                                            ×
                                        </button>

                                        {editingProjectId !== null ? (
                                            <div className="flex flex-1 justify-center">
                                                <h2 className="text-lg font-semibold border-b-2 border-cyan-500 text-white">Edit Project</h2>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 justify-center gap-4">
                                                <button
                                                    onClick={() => setProjectInputMode("github")}
                                                    className={`px-4 py-2 font-medium ${
                                                        projectInputMode === "github"
                                                            ? "border-b-2 border-cyan-500 text-white"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    Import from GitHub
                                                </button>

                                                <button
                                                    onClick={() => setProjectInputMode("manual")}
                                                    className={`px-4 py-2 font-medium ${
                                                        projectInputMode === "manual"
                                                            ? "border-b-2 border-cyan-500 text-white"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    Enter Manually
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-gray-700">
                                        {projectInputMode === "github" ? (
                                            <div className="space-y-3">
                                                <div className="rounded-xl border border-gray-700 p-4 text-gray-400">
                                                    Connected repositories will go here
                                                </div>
                                                <h2 className="text-lg font-semibold text-white">Import a repository</h2>
                                                {!githubStatus.connected ? (
                                                    <div className="space-y-3 rounded-xl border border-gray-700 p-4 text-gray-300">
                                                        <p>Connect GitHub to load your repositories automatically.</p>
                                                        <button
                                                            onClick={connectGithub}
                                                            className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500"
                                                        >
                                                            Connect GitHub
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between rounded-xl border border-gray-700 p-4 text-gray-300">
                                                            <div>
                                                                <p className="font-medium text-white">Connected as {githubStatus.github_login || "GitHub user"}</p>
                                                                <p className="text-sm text-gray-400">{githubStatus.repository_count || githubRepositories.length} repositories available</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={syncGithubRepos}
                                                                    disabled={githubLoading}
                                                                    className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
                                                                >
                                                                    Sync Now
                                                                </button>
                                                                <button
                                                                    onClick={importSelectedGithubRepos}
                                                                    disabled={githubLoading}
                                                                    className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                                                                >
                                                                    Import Selected
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {githubError && (
                                                            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                                                                {githubError}
                                                            </div>
                                                        )}
                                                        {githubMessage && (
                                                            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                                                                {githubMessage}
                                                            </div>
                                                        )}
                                                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                                                            {githubRepositories.length === 0 ? (
                                                                <div className="rounded-xl border border-dashed border-gray-700 p-4 text-gray-400">
                                                                    No repositories synced yet.
                                                                </div>
                                                            ) : (
                                                                githubRepositories.map((repo) => (
                                                                    <label key={repo.repo_id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-700 p-4 text-left hover:bg-white/5">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mt-1"
                                                                            checked={selectedGithubRepoIds.includes(repo.repo_id)}
                                                                            onChange={(e) => {
                                                                                setSelectedGithubRepoIds((currentIds) =>
                                                                                    e.target.checked
                                                                                        ? [...currentIds, repo.repo_id]
                                                                                        : currentIds.filter((id) => id !== repo.repo_id)
                                                                                );
                                                                            }}
                                                                        />
                                                                        <div className="flex-1">
                                                                            <p className="font-semibold text-white">{repo.full_name}</p>
                                                                            <p className="mt-1 text-sm text-gray-400">{repo.description || "No description provided."}</p>
                                                                            <p className="mt-2 text-xs text-gray-500">
                                                                                {repo.language || "Unknown language"}
                                                                                {repo.stars ? ` · ${repo.stars} stars` : ""}
                                                                            </p>
                                                                        </div>
                                                                    </label>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
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

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Media Type</label>
                                                    <select
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white outline-none"
                                                        value={manualProject.mediaType}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                mediaType: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="youtube">YouTube Video</option>
                                                        <option value="images">Images</option>
                                                    </select>
                                                </div>

                                                {manualProject.mediaType === "youtube" && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-300">YouTube URL</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Paste YouTube link"
                                                            className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                            value={manualProject.youtubeUrl}
                                                            onChange={(e) =>
                                                                setManualProject({
                                                                    ...manualProject,
                                                                    youtubeUrl: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {manualProject.mediaType === "images" && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-300">Upload Images</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-cyan-600 file:px-3 file:py-1 file:text-white"
                                                            onChange={(e) =>
                                                                setManualProject({
                                                                    ...manualProject,
                                                                    images: Array.from(e.target.files || []),
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex justify-end gap-3 pt-2">
                                                    <button
                                                        className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800"
                                                        onClick={() => {
                                                            setIsAddProjectOpen(false);
                                                            setEditingProjectId(null);
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
                                                            if (editingProjectId !== null) {
                                                                setPortfolioData({
                                                                    ...portfolioData,
                                                                    projects: portfolioData.projects.map((project) =>
                                                                        project.id === editingProjectId
                                                                            ? {
                                                                                ...project,
                                                                                ...manualProject,
                                                                            }
                                                                            : project
                                                                    ),
                                                                });
                                                            } else {
                                                                setPortfolioData({
                                                                    ...portfolioData,
                                                                    projects: [
                                                                        ...portfolioData.projects,
                                                                        {
                                                                            id: crypto.randomUUID(),
                                                                            ...manualProject,
                                                                        },
                                                                    ],
                                                                });
                                                            }

                                                            setIsAddProjectOpen(false);
                                                            setEditingProjectId(null);
                                                            setManualProject({
                                                                title: "",
                                                                description: "",
                                                                githubUrl: "",
                                                                liveUrl: "",
                                                                technologies: "",
                                                                mediaType: "youtube",
                                                                youtubeUrl: "",
                                                                images: [],
                                                            });
                                                        }}
                                                    >
                                                        {editingProjectId !== null ? "Update Project" : "Save Project"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePage === "involvement" && selectedTemplate === "classic" && (
                            <div className="px-8 -mt-12">
                                <div className="relative z-30 inline-block">
                                    <button 
                                        onClick={() => setIsAddSectionOpen((prev) => !prev)}
                                        className="cursor-pointer rounded-xl border border-cyan-600 bg-[rgb(35,35,35)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                                    >
                                        + Add Section
                                    </button>
                                    {isAddSectionOpen && (
                                        <div className="absolute left-0 top-full mt-3 w-40 rounded-2xl border border-gray-700 bg-[rgb(25,25,25)] p-2 shadow-xl">
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("education")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "education"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Education
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("skills")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "skills"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Skills
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("clubs")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "clubs"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Clubs
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("workExperience")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "workExperience"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Work Experience
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("awards")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "awards"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Awards
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("certifications")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "certifications"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Certifications
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!portfolioData.involvement.visibleSections.includes("volunteer")) {
                                                        setPortfolioData({
                                                            ...portfolioData,
                                                            involvement: {
                                                                ...portfolioData.involvement,
                                                                visibleSections: [...portfolioData.involvement.visibleSections, "volunteer"],
                                                            },
                                                        });
                                                    }
                                                    setIsAddSectionOpen(false);
                                                }}
                                                className="cursor-pointer block w-full rounded-xl px-3 py-2 text-left text-white hover:bg-[rgb(40,40,40)]"
                                            >
                                                Volunteer
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="max-w-6xl mx-auto mt-12 pb-24 grid grid-cols-12 gap-4">
                                    {sortedVisibleSections.map((section, index) => renderSectionCard(section, index))}
                                </div>
                                {isAddSchoolOpen && (
                                    <BuilderModal
                                        title="Add School"
                                        onClose={() => setIsAddSchoolOpen(false)}
                                        onSave={() => {
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    education: [
                                                        ...portfolioData.involvement.education,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            ...schoolEntry,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddSchoolOpen(false);
                                            setSchoolEntry({
                                                school: "",
                                                degree: "",
                                                startDate: "",
                                                endDate: "",
                                            });
                                        }}
                                        saveLabel="Save School"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">School</label>
                                                <input
                                                    type="text"
                                                    value={schoolEntry.school}
                                                    onChange={(e) =>
                                                        setSchoolEntry({
                                                            ...schoolEntry,
                                                            school: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter school name"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Degree / Program</label>
                                                <input
                                                    type="text"
                                                    value={schoolEntry.degree}
                                                    onChange={(e) =>
                                                        setSchoolEntry({
                                                            ...schoolEntry,
                                                            degree: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter degree or program"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Start Date</label>
                                                    <input
                                                        type="text"
                                                        value={schoolEntry.startDate}
                                                        onChange={(e) =>
                                                            setSchoolEntry({
                                                                ...schoolEntry,
                                                                startDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Aug 2022"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">End Date</label>
                                                    <input
                                                        type="text"
                                                        value={schoolEntry.endDate}
                                                        onChange={(e) =>
                                                            setSchoolEntry({
                                                                ...schoolEntry,
                                                                endDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="May 2026"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                                {isAddWorkExperienceOpen && (
                                    <BuilderModal
                                        title="Add Work Experience"
                                        onClose={() => setIsAddWorkExperienceOpen(false)}
                                        onSave={() => {
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    workExperience: [
                                                        ...portfolioData.involvement.workExperience,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            ...workExperienceEntry,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddWorkExperienceOpen(false);
                                            setWorkExperienceEntry({
                                                company: "",
                                                role: "",
                                                startDate: "",
                                                endDate: "",
                                                description: "",
                                            });
                                        }}
                                        saveLabel="Save Experience"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Company</label>
                                                <input
                                                    type="text"
                                                    value={workExperienceEntry.company}
                                                    onChange={(e) =>
                                                        setWorkExperienceEntry({
                                                            ...workExperienceEntry,
                                                            company: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter company name"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Role</label>
                                                <input
                                                    type="text"
                                                    value={workExperienceEntry.role}
                                                    onChange={(e) =>
                                                        setWorkExperienceEntry({
                                                            ...workExperienceEntry,
                                                            role: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter role title"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Start Date</label>
                                                    <input
                                                        type="text"
                                                        value={workExperienceEntry.startDate}
                                                        onChange={(e) =>
                                                            setWorkExperienceEntry({
                                                                ...workExperienceEntry,
                                                                startDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Aug 2024"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">End Date</label>
                                                    <input
                                                        type="text"
                                                        value={workExperienceEntry.endDate}
                                                        onChange={(e) =>
                                                            setWorkExperienceEntry({
                                                                ...workExperienceEntry,
                                                                endDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Present"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Description</label>
                                                <textarea
                                                    rows={4}
                                                    value={workExperienceEntry.description}
                                                    onChange={(e) =>
                                                        setWorkExperienceEntry({
                                                            ...workExperienceEntry,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Describe what you did in this role"
                                                    className="w-full resize-none rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                                {isAddClubOpen && (
                                    <BuilderModal
                                        title="Add Club"
                                        onClose={() => setIsAddClubOpen(false)}
                                        onSave={() => {
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    clubs: [
                                                        ...portfolioData.involvement.clubs,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            ...clubEntry,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddClubOpen(false);
                                            setClubEntry({
                                                club: "",
                                                role: "",
                                                startDate: "",
                                                endDate: "",
                                                description: "",
                                            });
                                        }}
                                        saveLabel="Save Club"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Club</label>
                                                <input
                                                    type="text"
                                                    value={clubEntry.club}
                                                    onChange={(e) =>
                                                        setClubEntry({
                                                            ...clubEntry,
                                                            club: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter club name"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Role</label>
                                                <input
                                                    type="text"
                                                    value={clubEntry.role}
                                                    onChange={(e) =>
                                                        setClubEntry({
                                                            ...clubEntry,
                                                            role: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter your role"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Start Date</label>
                                                    <input
                                                        type="text"
                                                        value={clubEntry.startDate}
                                                        onChange={(e) =>
                                                            setClubEntry({
                                                                ...clubEntry,
                                                                startDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Aug 2024"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">End Date</label>
                                                    <input
                                                        type="text"
                                                        value={clubEntry.endDate}
                                                        onChange={(e) =>
                                                            setClubEntry({
                                                                ...clubEntry,
                                                                endDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Present"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Description</label>
                                                <textarea
                                                    rows={4}
                                                    value={clubEntry.description}
                                                    onChange={(e) =>
                                                        setClubEntry({
                                                            ...clubEntry,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Describe your involvement"
                                                    className="w-full resize-none rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                                {isAddSkillOpen && (
                                    <BuilderModal
                                        title="Add Skill"
                                        onClose={() => setIsAddSkillOpen(false)}
                                        onSave={() => {
                                            if (!skillEntry.name.trim()) return;

                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    skills: [
                                                        ...portfolioData.involvement.skills,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            name: skillEntry.name.trim(),
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddSkillOpen(false);
                                            setSkillEntry({
                                                name: "",
                                            });
                                        }}
                                        saveLabel="Save Skill"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Skill</label>
                                                <input
                                                    type="text"
                                                    value={skillEntry.name}
                                                    onChange={(e) =>
                                                        setSkillEntry({
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter a skill"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                                {isAddVolunteerOpen && (
                                    <BuilderModal
                                        title="Add Volunteer Experience"
                                        onClose={() => setIsAddVolunteerOpen(false)}
                                        onSave={() => {
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    volunteer: [
                                                        ...portfolioData.involvement.volunteer,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            ...volunteerEntry,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddVolunteerOpen(false);
                                            setVolunteerEntry({
                                                organization: "",
                                                role: "",
                                                startDate: "",
                                                endDate: "",
                                                description: "",
                                            });
                                        }}
                                        saveLabel="Save Volunteer"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Organization</label>
                                                <input
                                                    type="text"
                                                    value={volunteerEntry.organization}
                                                    onChange={(e) =>
                                                        setVolunteerEntry({
                                                            ...volunteerEntry,
                                                            organization: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter organization name"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Role</label>
                                                <input
                                                    type="text"
                                                    value={volunteerEntry.role}
                                                    onChange={(e) =>
                                                        setVolunteerEntry({
                                                            ...volunteerEntry,
                                                            role: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter your role"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Start Date</label>
                                                    <input
                                                        type="text"
                                                        value={volunteerEntry.startDate}
                                                        onChange={(e) =>
                                                            setVolunteerEntry({
                                                                ...volunteerEntry,
                                                                startDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Aug 2024"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">End Date</label>
                                                    <input
                                                        type="text"
                                                        value={volunteerEntry.endDate}
                                                        onChange={(e) =>
                                                            setVolunteerEntry({
                                                                ...volunteerEntry,
                                                                endDate: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Present"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Description</label>
                                                <textarea
                                                    rows={4}
                                                    value={volunteerEntry.description}
                                                    onChange={(e) =>
                                                        setVolunteerEntry({
                                                            ...volunteerEntry,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Describe your volunteer work"
                                                    className="w-full resize-none rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                                {isAddAwardOpen && (
                                    <BuilderModal
                                        title="Add Award"
                                        onClose={() => setIsAddAwardOpen(false)}
                                        onSave={() => {
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    awards: [
                                                        ...portfolioData.involvement.awards,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            ...awardEntry,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddAwardOpen(false);
                                            setAwardEntry({
                                                title: "",
                                                issuer: "",
                                                date: "",
                                                description: "",
                                            });
                                        }}
                                        saveLabel="Save Award"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Award Title</label>
                                                <input
                                                    type="text"
                                                    value={awardEntry.title}
                                                    onChange={(e) =>
                                                        setAwardEntry({
                                                            ...awardEntry,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter award title"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Issuer</label>
                                                <input
                                                    type="text"
                                                    value={awardEntry.issuer}
                                                    onChange={(e) =>
                                                        setAwardEntry({
                                                            ...awardEntry,
                                                            issuer: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter issuer"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Date</label>
                                                <input
                                                    type="text"
                                                    value={awardEntry.date}
                                                    onChange={(e) =>
                                                        setAwardEntry({
                                                            ...awardEntry,
                                                            date: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Apr 2026"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Description</label>
                                                <textarea
                                                    rows={4}
                                                    value={awardEntry.description}
                                                    onChange={(e) =>
                                                        setAwardEntry({
                                                            ...awardEntry,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Optional description"
                                                    className="w-full resize-none rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                                {isAddCertificationOpen && (
                                    <BuilderModal
                                        title="Add Certification"
                                        onClose={() => setIsAddCertificationOpen(false)}
                                        onSave={() => {
                                            setPortfolioData({
                                                ...portfolioData,
                                                involvement: {
                                                    ...portfolioData.involvement,
                                                    certifications: [
                                                        ...portfolioData.involvement.certifications,
                                                        {
                                                            id: crypto.randomUUID(),
                                                            ...certificationEntry,
                                                        },
                                                    ],
                                                },
                                            });
                                            setIsAddCertificationOpen(false);
                                            setCertificationEntry({
                                                name: "",
                                                issuer: "",
                                                date: "",
                                                credentialLink: "",
                                            });
                                        }}
                                        saveLabel="Save Certification"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Certification Name</label>
                                                <input
                                                    type="text"
                                                    value={certificationEntry.name}
                                                    onChange={(e) =>
                                                        setCertificationEntry({
                                                            ...certificationEntry,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter certification name"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Issuer</label>
                                                <input
                                                    type="text"
                                                    value={certificationEntry.issuer}
                                                    onChange={(e) =>
                                                        setCertificationEntry({
                                                            ...certificationEntry,
                                                            issuer: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter issuer"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Date</label>
                                                <input
                                                    type="text"
                                                    value={certificationEntry.date}
                                                    onChange={(e) =>
                                                        setCertificationEntry({
                                                            ...certificationEntry,
                                                            date: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Apr 2026"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Credential Link</label>
                                                <input
                                                    type="text"
                                                    value={certificationEntry.credentialLink}
                                                    onChange={(e) =>
                                                        setCertificationEntry({
                                                            ...certificationEntry,
                                                            credentialLink: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Paste credential URL"
                                                    className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </BuilderModal>
                                )}
                            </div>
                        )}
                </div>
            </main>
            
        </div>
    );
}