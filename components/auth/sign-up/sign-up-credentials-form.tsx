import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputPassword from "../components/input-password";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { RegisterResponse } from "@/types/auth";
import { API_ROUTES } from "@/constants/api-routes";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpCredentialsForm() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!!password && !!rePassword && password !== rePassword) {
      setIsPasswordNotMatch(true);
      return;
    }

    try {
      setIsLoading(true);
      const body = { email: email.trim(), password, username: username.trim() };
      await axios.post<Response<RegisterResponse>>(
        API_ROUTES.AUTH.REGISTER,
        body,
      );
      toast.success("New user is created sucesfully");
      setEmail("");
      setPassword("");
      setUsername("");
      setRePassword("");
    } catch (error) {
      const message =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An error occurred during sign up.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            placeholder="Enter your email address"
            value={email}
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input
            placeholder="Enter your username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <InputPassword
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field data-invalid={isPasswordNotMatch}>
          <FieldLabel>Confirm Password</FieldLabel>
          <InputPassword
            placeholder="Re-enter your password"
            value={rePassword}
            required
            aria-invalid={isPasswordNotMatch}
            onChange={(e) => {
              if (isPasswordNotMatch) {
                setIsPasswordNotMatch(false);
              }
              setRePassword(e.target.value);
            }}
          />
          {isPasswordNotMatch && (
            <FieldError>The confirmation password does not match.</FieldError>
          )}
        </Field>
        <Field orientation={"vertical"}>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            Create an Account
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
