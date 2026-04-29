import CredentialsForm from "./sign-in-credentials-form";
import { FieldSeparator } from "@/components/ui/field";
import GoogleButton from "../components/google-button";
import GithubButton from "../components/github-button";

export default function SignInForm() {
  return (
    <section>
      <CredentialsForm />
      <FieldSeparator className="my-7">OR</FieldSeparator>
      <div className="flex flex-col gap-4">
        <GoogleButton />
        <GithubButton />
      </div>
    </section>
  );
}
