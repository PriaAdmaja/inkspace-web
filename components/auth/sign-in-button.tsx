'use client'
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export default function SignInButton() {
    const [isLoading, setIsLoading] = useState(false)

    const onSignIn = async () => {
        try {
            setIsLoading(true)
            await signIn("github")
        } catch (err) {
            toast.error((err as Error)?.message || "Failed to sign in")
            setIsLoading(false)
        }
    }

    return (
        <Button onClick={onSignIn} disabled={isLoading}>{isLoading ? <Spinner /> : <LogIn />} Sign In</Button>
    )
}