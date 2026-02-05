import SignInButton from "../auth/sign-in-button";
import UserAvatar from "./user-avatar";
import { User } from "next-auth";
import SearchBar from "./search-bar";
import Link from "next/link";

export default function Header({ user }: { user?: User }) {
    return (
        <header className="flex justify-between gap-2 items-center px-10 py-4">
            <section className="flex gap-4 items-center">
                <Link href={"/"}>
                    <h1 className="text-2xl font-bold">Inkspace</h1>
                </Link>
                <SearchBar />
            </section>
            <section className="flex gap-2 items-center">
                {!!user ? (
                    <UserAvatar user={user} />
                ) : (
                    <SignInButton />
                )}
            </section>
        </header>
    )
}