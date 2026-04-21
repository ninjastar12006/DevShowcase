import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import logo from "../assets/DevShowcaseLogo4.png";
import logoText from "../assets/DevShowcaseLogo4Text.png";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// --- IMPORT YOUR TEAM IMAGES HERE ---
// Make sure these filenames match exactly what you put in your assets folder!
import jacksonImg from "../assets/jackson.jpeg"; 
import samuelImg from "../assets/samuel.jpeg"; 
import aayudeshImg from "../assets/aayudesh.jpeg"; 
import timImg from "../assets/tim.jpeg"; 

export default function HomePage() {
    const { user } = useUser();
    const navigate = useNavigate();
    
    const teamMembers = [
    {
        name: "Jackson Bailey",
        role: "Frontend Developer",
        desc: "Sophomore Computer Science Student at the University of Florida",
        github: "https://github.com/JBailey0703", 
        linkedin: "https://linkedin.com/in/jackson-bailey-92b26032b/",
        image: jacksonImg
    },
    {
        name: "Samuel Fong",
        role: "Backend Developer",
        desc: "Sophomore Computer Engineering Student at the University of Florida",
        github: "https://github.com/ninjastar12006",
        linkedin: "https://www.linkedin.com/in/samuel-fong-37667a234/",
        image: samuelImg
    },
    {
        name: "Aayudesh Kaparthi",
        role: "Full-Stack Developer",
        desc: "Sophomore Computer Science Student at the University of Florida",
        github: "https://github.com/Aayudesh-k",
        linkedin: "https://www.linkedin.com/in/aayudesh-kaparthi-3a1602294/",
        image: aayudeshImg
    },
    {
        name: "Tim Le",
        role: "Backend Developer",
        desc: "Junior Computer Engineering Student at the University of Florida",
        github: "https://github.com/t-le1",
        linkedin: "https://linkedin.com/in/tim-a-le/",
        image: timImg
    }
    ];

    return (
        <div className="min-h-screen bg-[rgb(15,15,15)]">
            <div className="mx-auto max-w-7xl">
                {/* NAVIGATION */}
                <nav className="relative flex text-xl sticky top-0 h-16 w-full pl-4 pr-6 py-4 bg-transparent z-50 justify-between items-center">
                    <div className="mt-2">
                        <Link className="flex items-center" to="/">
                            <img src={logo} className="h-12 w-auto" alt="Logo" />
                            <img src={logoText} className="h-8 w-auto" alt="Logo Text" />
                        </Link>
                    </div>
                    <div className="flex gap-8 items-center">
                        {/* --- SECRET ADMIN BUTTON --- */}
                        {user?.publicMetadata?.role === "admin" && (
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="cursor-pointer mt-2 w-full rounded-xl border border-purple-500/50 bg-purple-500/10 backdrop-blur-md px-4 py-2 font-bold text-purple-300 transition hover:bg-purple-500/20"
                            >
                                Admin Dashboard
                            </button>
                        )}
                        <Link to="/" className="
                                relative text-white hover:text-white
                                after:content-[''] after:absolute after:left-0 after:-bottom-1
                                after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                                after:scale-x-100 hover:after:scale-x-100
                                after:origin-center after:transition-transform after:duration-500">Home</Link>
                        
                        <SignedOut>
                            <Link to="/sign-in" className="
                                    relative text-slate-400 hover:text-white
                                    after:content-[''] after:absolute after:left-0 after:-bottom-1
                                    after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                                    after:scale-x-0 hover:after:scale-x-100
                                    after:origin-center after:transition-transform after:duration-500">Sign In</Link>
                        </SignedOut>

                        <SignedIn>
                            <Link to="/build" className="
                                    relative text-slate-400 hover:text-white
                                    after:content-[''] after:absolute after:left-0 after:-bottom-1
                                    after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                                    after:scale-x-0 hover:after:scale-x-100
                                    after:origin-center after:transition-transform after:duration-500">Build</Link>
                        </SignedIn>
                    </div>
                </nav>

                {/* INTRO TEXT SECTION (Moved down below the image) */}
                <div className="bg-[rgb(15,15,15)] pt-40 pb-20 px-6 flex flex-col items-center text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent pb-8 drop-shadow-lg">
                        Stop tweaking your portfolio. <br /> Start shipping it.
                    </h1>
                    <p className="text-lg md:text-lg text-slate-300 max-w-3xl mx-auto mb-10 drop-shadow-md">
                        DevShowcase is a Portfolio-as-a-Service platform designed specifically for software engineering students and junior developers. We instantly sync your GitHub repositories, attach your video walkthroughs, and wrap it all in recruiter-ready templates.
                    </p>
                    <SignedOut>
                        <Link to="/sign-in" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                            Go to Builder
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <Link to="/build" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                            Go to Builder
                        </Link>
                    </SignedIn>
                </div>

                {/* BUILT FOR GROWTH SECTION */}
                <section className="bg-[rgb(15,15,15)] px-8 pb-20 flex flex-col items-center relative z-10">
                    <div className="max-w-5xl text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6 drop-shadow-md">Built for Growth, Engineered for Impact</h2>
                        <p className="text-slate-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed drop-shadow-sm">We don't just sync your repos; we transform your scattered projects into a compelling narrative that recruiters can't ignore. Move beyond a simple list of links and give your work the stage it deserves.</p>
                    </div>
                </section>

                {/* LOWER CONTENT SECTIONS */}
                <div className="relative bg-[rgb(15,15,15)] px-8 py-20 flex flex-col items-center">
                    
                    {/* The Developer's Dilemma */}
                    <section className="w-full max-w-5xl px-6 py-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-200">The Developer's Dilemma</h2>
                        <p className="text-slate-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                            Traditional platforms like GitHub and LinkedIn often fail to showcase the actual functionality and UI/UX of our projects. Recruiters only spend a few seconds reviewing a profile, making it difficult for students to stand out. We built DevShowcase to solve this. By combining automated GitHub syncing, live video demos, and clean UI templates, we give developers a centralized platform to prove their impact in seconds.
                        </p>
                    </section>

                    {/* Examples / Features */}
                    <section className="w-full max-w-6xl px-6 py-16 border-t border-slate-800">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-200">Designed to Stand Out</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-[rgb(5,15,30)] rounded-xl p-8 border border-slate-800 hover:border-cyan-500 transition-colors shadow-lg">
                                <h3 className="text-xl font-semibold mb-3 text-white">Live Video Demos</h3>
                                <p className="text-slate-400">Embed YouTube walkthroughs directly into your project cards so recruiters can see your app in action without downloading a thing.</p>
                            </div>
                            <div className="bg-[rgb(5,15,30)] rounded-xl p-8 border border-slate-800 hover:border-emerald-500 transition-colors shadow-lg">
                                <h3 className="text-xl font-semibold mb-3 text-white">Instant GitHub Sync</h3>
                                <p className="text-slate-400">No more manual data entry. We pull your repositories, descriptions, and tech stacks directly from GitHub via OAuth.</p>
                            </div>
                            <div className="bg-[rgb(5,15,30)] rounded-xl p-8 border border-slate-800 hover:border-purple-500 transition-colors shadow-lg">
                                <h3 className="text-xl font-semibold mb-3 text-white">Custom Templates</h3>
                                <p className="text-slate-400">Choose from Classic, Minimalist, or Technical themes to match your personal brand. One click changes your entire site's look.</p>
                            </div>
                        </div>
                    </section>

                    {/* NEW: Example Portfolios Section */}
                    <section className="w-full max-w-6xl px-6 py-20 border-t border-slate-800">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-200">See It In Action</h2>
                        <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
                            Check out these live portfolios built and deployed by real developers using DevShowcase:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* ninjastar12006 (Samuel Fong) */}
                            <div className="bg-[rgb(5,15,30)] cursor-pointer rounded-xl h-64 border border-slate-800 flex flex-col items-center justify-center p-6 text-slate-300 hover:border-cyan-500 transition-all group">
                            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400">ninjastar12006</h3>
                            <a href="https://devshowcase-frontend-one.vercel.app/p/ninjastar12006" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition-colors">
                                View Portfolio →
                            </a>
                            </div>
                            {/* t-le1 (Tim Le) */}
                            <div className="bg-[rgb(5,15,30)] cursor-pointer rounded-xl h-64 border border-slate-800 flex flex-col items-center justify-center p-6 text-slate-300 hover:border-cyan-500 transition-all group">
                            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400">t-le1</h3>
                            <a href="https://devshowcase-frontend-one.vercel.app/p/t-le1" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition-colors">
                                View Portfolio →
                            </a>
                            </div>
                            {/* jbailey0703 (Jackson Bailey) */}
                            <div className="bg-[rgb(5,15,30)] cursor-pointer rounded-xl h-64 border border-slate-800 flex flex-col items-center justify-center p-6 text-slate-300 hover:border-cyan-500 transition-all group">
                            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400">jbailey0703</h3>
                            <a href="https://devshowcase-frontend-one.vercel.app/p/jbailey0703" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition-colors">
                                View Portfolio →
                            </a>
                            </div>
                            {/* aayudesh-k (Aayudesh Kaparthi) */}
                            <div className="bg-[rgb(5,15,30)] cursor-pointer rounded-xl h-64 border border-slate-800 flex flex-col items-center justify-center p-6 text-slate-300 hover:border-cyan-500 transition-all group">
                            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400">aayudesh-k</h3>
                            <a href="https://devshowcase-frontend-one.vercel.app/p/aayudesh-k" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition-colors">
                                View Portfolio →
                            </a>
                            </div>
                        </div>
                    </section>

                    {/* Our Team */}
                    <section className="w-full max-w-[1400px] px-6 py-20 border-t border-slate-800 mt-8 mb-12">
                        <h2 className="text-4xl md:text-5xl font-medium text-center mb-16 text-slate-200">Our Team</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="flex flex-col items-center bg-gradient-to-b from-white/5 to-white/[0.02] p-8 rounded-[2.5rem] border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all backdrop-blur-md group">
                                    
                                    {/* Avatar */}
                                    <div className="w-[140px] h-[140px] rounded-full bg-slate-400 mb-6 border-[4px] border-white/80 overflow-hidden flex items-center justify-center">
                                        {member.image.includes('api.dicebear.com') ? (
                                            <svg className="w-28 h-28 text-slate-200 translate-y-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                        ) : (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    
                                    <h3 className="text-[1.35rem] font-bold text-white mb-1">{member.name}</h3>
                                    <p className="text-[0.9rem] font-bold text-white mb-6 tracking-wide">{member.role}</p>
                                    
                                    <p className="text-[0.85rem] text-slate-300 text-center leading-relaxed mb-8 max-w-[200px]">
                                        {member.desc}
                                    </p>
                                    
                                    {/* Social Icons */}
                                    <div className="flex gap-4">
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-slate-300 transition-colors">
                                            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                                            </svg>
                                        </a>
                                        {member.github && (
                                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-slate-300 transition-colors">
                                                <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}