import { Link } from "react-router-dom";
import logo from "../assets/DevShowcaseLogo3.png";
import logoText from "../assets/DevShowcaseLogo3Text.png";
import logoText2 from "../assets/DevShowcaseLogo4Text.png";
import blankProfile from "../assets/BlankProfile.png";
import coloredRectangle from "../assets/ColoredRectangle.png";
import whiteRectangle from "../assets/WhiteRectangle.png";
import linkedinLogo from "../assets/LinkedInLogo.png";
import connectGithub from "../assets/ConnectGithubImage.png";

export default function AboutPage() {
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
                            relative text-slate-400 hover:text-white
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                            after:scale-x-0 hover:after:scale-x-100
                            after:origin-center after:transition-transform after:duration-500">Home</Link>
                    <Link to="/about" className="
                            relative text-white hover:text-white
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                            after:scale-x-100 hover:after:scale-x-100
                            after:origin-center after:transition-transform after:duration-500">About</Link>
                    <Link to="/sign-in" className="
                            relative text-slate-400 hover:text-white
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-[2px] after:w-full after:bg-white after:rounded-full after:opacity-80
                            after:scale-x-0 hover:after:scale-x-100
                            after:origin-center after:transition-transform after:duration-500">Sign In</Link>
                </div>
                <div className="pointer-events-none absolute left-0 right-0 top-full h-32 bg-gradient-to-b from-black via-black/50 to-black/0"/>
            </nav>
            
            
            <div className="flex justify-center gap-3 relative h-64 bg-[rgb(0,5,15)] px-12 pt-32 pb-32">
                <h1 className="text-6xl text-slate-200 font-semibold">Why We Built</h1>
                <img src={logoText2} className="h-[82px] w-auto -translate-y-[6px]"/>
            </div>
            <div className="grid grid-cols-[repeat(3,400px)] auto-rows-[220px] gap-8 justify-center mx-auto bg-[rgb(0,5,15)] px-12 pt-2 pb-36">
                <div className="flex justify-center bg-[rgb(9,173,245)] shadow-[inset_0_8px_12px_rgba(0,0,0,.8)] rounded-3xl row-span-2">
                    <h1 className="text-6xl text-slate-800 font-semibold text-shadow-lg content-center">Temp</h1>
                </div>

                <div className="flex justify-center bg-[rgb(95,239,198)] shadow-[inset_0_8px_12px_rgba(0,0,0,.8)] rounded-3xl col-span-2">
                    <h1 className="text-6xl text-white content-center">Temp</h1>
                </div>

                <div className="flex justify-center bg-[rgb(124,241,172)] shadow-[inset_0_8px_12px_rgba(0,0,0,.8)] rounded-3xl">
                    <h1 className="text-6xl text-white content-center">Temp</h1>
                </div>

                <div className="flex justify-center bg-[rgb(4,219,254)] shadow-[inset_0_8px_12px_rgba(0,0,0,.8)] rounded-3xl">
                    <h1 className="text-6xl text-white content-center">Temp</h1>
                </div>
            </div>
            
            <div className="flex justify-center relative bg-[rgb(0,5,15)] px-12 pt-32 pb-8">
                <h1 className="text-6xl font-semibold text-slate-200">Our Team</h1>
            </div>
            <div className="flex justify-center gap-6 relative bg-[rgb(0,5,15)] px-12 pt-2 pb-64">
                <div role="link" tabIndex={0} onClick={() => window.open("https://www.linkedin.com/in/jackson-bailey-92b26032b/", "_blank", "noreferrer")}
                    className="cursor-pointer relative group hover:scale-[1.01] transition-transform duration-500">
                    <img src={coloredRectangle} className="h-[620px] w-auto origin-center scale-y-[.9] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    <img src={whiteRectangle} className="absolute left-1/2 top-1/2 h-[620px] w-auto origin-center scale-x-[1.046] scale-y-[.895] -translate-x-1/2 -translate-y-[310px] opacity-100 group-hover:opacity-0 transition-opacity duration-500"/>
                    <img src={blankProfile} className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-auto -translate-x-1/2 -translate-y-52 origin-center"/>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-6 text-center">
                        <h1 className="text-2xl text-white font-bold">Jackson Bailey</h1>
                        <h2 className="text-lg text-white font-semibold">Frontend Lead</h2>
                        <p className="text-md text-slate-300 translate-y-4">Sophomore Computer Science Student at the University of Florida</p>
                    </div>
                    <div className="flex gap-4 justify-center absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[165px] origin-center">
                        <img src={linkedinLogo} className="h-[48px] w-auto object-contain"/>
                    </div>
                </div>

                <div className="relative group hover:scale-[1.01] transition-transform duration-500">
                    <img src={coloredRectangle} className="h-[620px] w-auto origin-center scale-y-[.9] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    <img src={whiteRectangle} className="absolute left-1/2 top-1/2 h-[620px] w-auto origin-center scale-x-[1.046] scale-y-[.895] -translate-x-1/2 -translate-y-[310px] opacity-100 group-hover:opacity-0 transition-opacity duration-500"/>
                    <img src={blankProfile} className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-auto -translate-x-1/2 -translate-y-52 origin-center"/>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-6 text-center">
                        <h1 className="text-2xl text-white font-bold">Jackson Bailey</h1>
                        <h2 className="text-lg text-white font-semibold">Frontend Lead</h2>
                        <p className="text-md text-slate-300 translate-y-4">Sophomore Computer Science Student at the University of Florida</p>
                    </div>
                    <div className="flex gap-4 justify-center absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[165px] origin-center">
                        <a className="shrink-0 flex items-center" href="https://www.linkedin.com/in/jackson-bailey-92b26032b/" target="_blank">
                            <img src={linkedinLogo} className="h-[48px] w-auto object-contain"/>
                        </a>
                        <a className="shrink-0 flex items-center" href="" target="_blank">
                            <img src={connectGithub} className="h-[52px] w-auto object-contain"/>
                        </a>
                    </div>
                </div>

                <div className="relative group hover:scale-[1.01] transition-transform duration-500">
                    <img src={coloredRectangle} className="h-[620px] w-auto origin-center scale-y-[.9] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    <img src={whiteRectangle} className="absolute left-1/2 top-1/2 h-[620px] w-auto origin-center scale-x-[1.046] scale-y-[.895] -translate-x-1/2 -translate-y-[310px] opacity-100 group-hover:opacity-0 transition-opacity duration-500"/>
                    <img src={blankProfile} className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-auto -translate-x-1/2 -translate-y-52 origin-center"/>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-6 text-center">
                        <h1 className="text-2xl text-white font-bold">Jackson Bailey</h1>
                        <h2 className="text-lg text-white font-semibold">Frontend Lead</h2>
                        <p className="text-md text-slate-300 translate-y-4">Sophomore Computer Science Student at the University of Florida</p>
                    </div>
                    <div className="flex gap-4 justify-center absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[165px] origin-center">
                        <a className="shrink-0 flex items-center" href="https://www.linkedin.com/in/jackson-bailey-92b26032b/" target="_blank">
                            <img src={linkedinLogo} className="h-[48px] w-auto object-contain"/>
                        </a>
                        <a className="shrink-0 flex items-center" href="" target="_blank">
                            <img src={connectGithub} className="h-[52px] w-auto object-contain"/>
                        </a>
                    </div>
                </div>

                <div className="relative group hover:scale-[1.01] transition-transform duration-500">
                    <img src={coloredRectangle} className="h-[620px] w-auto origin-center scale-y-[.9] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    <img src={whiteRectangle} className="absolute left-1/2 top-1/2 h-[620px] w-auto origin-center scale-x-[1.046] scale-y-[.895] -translate-x-1/2 -translate-y-[310px] opacity-100 group-hover:opacity-0 transition-opacity duration-500"/>
                    <img src={blankProfile} className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-auto -translate-x-1/2 -translate-y-52 origin-center"/>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-6 text-center">
                        <h1 className="text-2xl text-white font-bold">Jackson Bailey</h1>
                        <h2 className="text-lg text-white font-semibold">Frontend Lead</h2>
                        <p className="text-md text-slate-300 translate-y-4">Sophomore Computer Science Student at the University of Florida</p>
                    </div>
                    <div className="flex gap-4 justify-center absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[165px] origin-center">
                        <a className="shrink-0 flex items-center" href="https://www.linkedin.com/in/jackson-bailey-92b26032b/" target="_blank">
                            <img src={linkedinLogo} className="h-[48px] w-auto object-contain"/>
                        </a>
                        <a className="shrink-0 flex items-center" href="" target="_blank">
                            <img src={connectGithub} className="h-[52px] w-auto object-contain"/>
                        </a>
                    </div>
                </div>

                {/*<div className="relative group">
                    <img src={coloredRectangle} className="h-[620px] w-auto origin-center scale-y-[.9] grayscale-100 group-hover:grayscale-0 transition-all duration-300"/>
                    <img src={blankProfile} className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-auto -translate-x-1/2 -translate-y-52 origin-center"/>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 w-64 -translate-x-1/2 translate-y-6 text-center">
                        <h1 className="text-2xl text-white font-bold">Jackson Bailey</h1>
                        <h2 className="text-lg text-white font-semibold">Frontend Lead</h2>
                        <p className="text-md text-slate-300 translate-y-4">Sophomore Computer Science Student at the University of Florida</p>
                    </div>
                    <div className="flex gap-4 justify-center absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[165px] origin-center">
                        <a className="shrink-0 flex items-center" href="https://www.linkedin.com/in/jackson-bailey-92b26032b/" target="_blank">
                            <img src={linkedinLogo} className="h-[48px] w-auto object-contain"/>
                        </a>
                        <a className="shrink-0 flex items-center" href="" target="_blank">
                            <img src={connectGithub} className="h-[52px] w-auto object-contain"/>
                        </a>
                    </div>
                </div>*/}
                
            </div>
        </div>
    </div>
  );
}