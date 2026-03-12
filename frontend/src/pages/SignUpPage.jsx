import { useNavigate } from "react-router-dom";
import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export default function SignInPage() {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-[rgb(25,25,25)]">
            <div className="my-auto mx-auto max-w-3xl w-full p-4">
                <div className="flex justify-center w-full">
                    <SignUp
                        forceRedirectUrl="http://localhost:5173/build"
                        routing="path" 
                        path="/sign-up" 
                        signInUrl="/sign-in"
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                fontSize: '.9rem', // Fine-tuned so it's large but fits perfectly
                                spacingUnit: '1rem',
                            },
                            elements: {
                                rootBox: "w-full flex justify-center",
                                cardBox: "w-full max-w-[800px]", // Forces Clerk to allow a wider layout
                                card: "shadow-none bg-transparent w-full max-w-[800px]",
                                main: "w-full max-w-[800px]",
                                socialButtonsBlockButton: "w-full",
                                socialButtonsBlockButtonText: "whitespace-nowrap", // Stops "Continue with GitHub" from clipping
                                footerAction: "whitespace-nowrap", // Forces "Don't have an account? Sign up" onto one line
                            },
                            options: {
                                logoPlacement: 'outside'
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}