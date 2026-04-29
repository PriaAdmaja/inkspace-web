import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputPassword from "../components/input-password";
import { Button } from "@/components/ui/button";

export default function SignUpCredentialsForm() {
  return (
    <FieldGroup className="gap-5">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="Enter your email address" />
      </Field>
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input placeholder="Enter your username" />
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <InputPassword />
      </Field>
      <Field>
        <FieldLabel>Confirm Password</FieldLabel>
        <InputPassword placeholder="Re-enter your password"/>
      </Field>
      <Field orientation={"vertical"}>
        <Button>Create an Account</Button>
      </Field>
    </FieldGroup>
  );
}
