import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import logo from "../assets/DevShowcaseLogo3.png";
import logoText from "../assets/DevShowcaseLogo3Text.png";
import logoBG from "../assets/DevShowcaseBGLogo.png";
import arrow from "../assets/ArrowImage.png";
import linkImage from "../assets/CleanLinkImage.png";
import connectGithub from "../assets/ConnectGithubImage.png";
import projectImage from "../assets/PickProjectsImage.png";
import coloredSquare from "../assets/ColoredSquare.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-screen">
            <nav className="relative flex text-xl sticky top-0 h-16 w-full pl-4 pr-6 py-4 bg-black z-50 justify-between items-center">
                <div>
                    <Link className="flex items-center" to="/">
                        <img src={logo} className="h-10 w-auto"/>
                        <img src={logoText} className="h-8 w-auto"/>
                    </Link>
                </div>
                <div className="flex gap-6">
                    <Link to="/" className="
                            relative text-white hover:text-white
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                            after:scale-x-100 hover:after:scale-x-100
                            after:origin-center after:transition-transform after:duration-500">Home</Link>
                    <Link to="/about" className="
                            relative text-slate-400 hover:text-white
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                            after:scale-x-0 hover:after:scale-x-100
                            after:origin-center after:transition-transform after:duration-500">About</Link>
                    
                    {/* Only shows if the user is NOT logged in */}
                    <SignedOut>
                        <Link to="/sign-in" className="
                                relative text-slate-400 hover:text-white
                                after:content-[''] after:absolute after:left-0 after:-bottom-1
                                after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                                after:scale-x-0 hover:after:scale-x-100
                                after:origin-center after:transition-transform after:duration-500">Sign In</Link>
                    </SignedOut>

                    {/* Only shows if the user IS logged in */}
                    <SignedIn>
                        <Link to="/build" className="
                                relative text-slate-400 hover:text-white
                                after:content-[''] after:absolute after:left-0 after:-bottom-1
                                after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                                after:scale-x-0 hover:after:scale-x-100
                                after:origin-center after:transition-transform after:duration-500">Go to Builder</Link>
                    </SignedIn>
                </div>
                <div className="pointer-events-none absolute left-0 right-0 top-full h-32 bg-gradient-to-b from-black via-black/50 to-black/0"/>
            </nav>
            <div className="h-screen bg-fixed bg-cover bg-[position:center_35%]" style={{ backgroundImage : `url(${logoBG})` }}/>
            <div className="z-20 relative bg-[rgb(0,5,15)] px-8 pt-16 pb-64 ring-2 ring-cyan-400 shadow-[0px_0px_60px_rgba(125,216,255,0.75)]">
                <div id="snap-HowItWorks" className="">
                    <h1 className="text-center text-8xl text-slate-200 font-semibold pb-32">How It Works</h1>
                </div>
                <div className="flex items-center justify-center gap-12 flex-col md:flex-row">
                    <div className="relative group">
                        <img src={coloredSquare} className="h-64 w-auto origin-center transition-transform duration-500 hover:scale-x-[1.5] hover:scale-y-[1.8]"/>
                        <img src={connectGithub} className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-auto -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-36 transition-all duration-500"/>
                        <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-10 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-12">
                            <h2 className="text-xl text-white font-semibold">Connect GitHub</h2>
                            <p className="mt-2 text-l text-slate-300">Link your account so we can pull your repos automatically.</p>
                        </div>
                    </div>
                    <img src={arrow} className="h-48 w-auto"/>
                    <div className="relative group">
                        <img src={coloredSquare} className="h-64 w-auto origin-center transition-transform duration-500 hover:scale-x-[1.5] hover:scale-y-[1.8]"/>
                        <img src={projectImage} className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-auto -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-36 transition-all duration-500"/>
                        <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-10 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-12">
                            <h1 className="text-xl text-white font-semibold">Pick Projects</h1>
                            <p className="mt-2 text-l text-slate-300">Choose your best work and highlight what matters.</p>
                        </div>
                    </div>
                    <img src={arrow} className="h-48 w-auto"/>
                    <div className="relative group">
                        <img src={coloredSquare} className="h-64 w-auto origin-center transition-transform duration-500 hover:scale-x-[1.5] hover:scale-y-[1.8]"/>
                        <img src={linkImage} className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-auto -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-36 transition-all duration-500"/>
                        <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-10 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-12">
                            <h1 className="text-xl text-white font-semibold">Share a Clean Link</h1>
                            <p className="mt-2 text-l text-slate-300">Publish a recruiter-ready page you can drop on LinkedIn and your resume.</p>
                        </div>
                    </div>
                </div>
                <div className="pointer-events-none absolute left-0 right-0 -top-32 h-32 bg-gradient-to-b from-black/0 via-[rgb(0,5,15)] to-[rgb(0,5,15)]"/>
                {/*<div className="z-50 pointer-events-none absolute left-0 right-0 -bottom-32 h-32 bg-gradient-to-b from-black via-black to-black/0"/>*/}
            </div>
            <div className="relative bg-[rgb(0,5,15)] px-8 py-96">
                <h1 className="text-4xl font-bold tracking-tight text-slate-800">Temp</h1>
            </div>
        </div>
    </div>
  );
}