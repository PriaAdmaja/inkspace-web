import { FieldSeparator } from "@/components/ui/field";
import GithubButton from "../components/github-button";
import GoogleButton from "../components/google-button";
import SignUpCredentialsForm from "./sign-up-credentials-form";

export default function SignUpForm() {
  return (
    <section>
      <div className="flex flex-col gap-4">
        <GoogleButton />
        <GithubButton />
      </div>
      <FieldSeparator className="my-7">OR</FieldSeparator>
      <SignUpCredentialsForm />
    </section>
  );
}
