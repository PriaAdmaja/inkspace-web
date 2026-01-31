'use client'
import SignInButton from "../auth/SignInButton";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";

export default function Header({ session }: { session: Session | null }) {
    return (
            <header className="flex justify-between gap-2 items-center px-10 py-4">
                <h1>Header</h1>
                <section className="flex gap-2 items-center">
                    {!!session?.user ? (
                        <UserAvatar user={session.user} />
                    ) : (
                        <SignInButton />
                    )}
                </section>
            </header>
    )
}