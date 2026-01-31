'use client'
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export default function SignInButton() {
    return (
        <Button onClick={() => signIn("github")}>Sign In</Button>
    )
}