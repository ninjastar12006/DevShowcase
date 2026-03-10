import { useNavigate } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import logo from "../assets/DevShowcaseLogo4.png";
import logoText from "../assets/DevShowcaseLogo4Text.png";
import cyanArrow from "../assets/CyanBackArrow.png";
import greyArrow from "../assets/GreyBackArrow.png";

export default function SignInPage() {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-[rgb(25,25,25)]">
            {/* Expanded the main wrapper to max-w-3xl to give the internal components room to stretch */}
            <div className="my-auto mx-auto max-w-3xl w-full p-4">
                <div className="[--radius:var(--radius-4xl)] [--padding:--spacing(1)] bg-[rgb(75,75,75)] rounded-(--radius) p-(--padding)">
                    <div className="flex flex-col h-auto rounded-[calc(var(--radius)-var(--padding))] bg-[rgb(35,35,35)] p-10 pb-12">
                        
                        <div className="relative w-full h-12 mb-10">
                            <div className="absolute left-0 top-0">
                                <button type="button" onClick={() => navigate(-1)} className="relative h-12 w-12">
                                    <img src={greyArrow} className="absolute inset-0 h-full w-full object-contain opacity-100 hover:opacity-0 transition-opacity duration-0" />
                                    <img src={cyanArrow} className="absolute inset-0 h-full w-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-0" />
                                </button>
                            </div>
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex items-center justify-center">
                                <img src={logo} className="h-12 w-auto" />
                                <img src={logoText} className="h-12 w-auto" />
                            </div>
                        </div>
                        
                        <div className="flex justify-center w-full">
                            <SignIn 
                                routing="path" 
                                path="/sign-in" 
                                signUpUrl="/sign-up" 
                                appearance={{
                                    baseTheme: dark,
                                    variables: {
                                        fontSize: '1.35rem', // Fine-tuned so it's large but fits perfectly
                                        spacingUnit: '1.4rem',
                                    },
                                    elements: {
                                        rootBox: "w-full flex justify-center",
                                        cardBox: "w-full max-w-[600px]", // Forces Clerk to allow a wider layout
                                        card: "shadow-none bg-transparent w-full",
                                        socialButtonsBlockButton: "w-full",
                                        socialButtonsBlockButtonText: "whitespace-nowrap", // Stops "Continue with GitHub" from clipping
                                        footerAction: "whitespace-nowrap", // Forces "Don't have an account? Sign up" onto one line
                                    }
                                }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}