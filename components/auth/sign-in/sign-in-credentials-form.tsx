import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import InputPassword from "../components/input-password";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { API_ROUTES } from "@/constants/api-routes";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAccessTokenStore } from "@/store/access-token";
import { Response } from "@/types/app";
import { LoginResponse } from "@/types/auth";
import { useUserDataStore } from "@/store/user-data";
import axios from "@/lib/axios";

export default function SignInCredentialsForm() {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks and stores
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const setUserData = useUserDataStore((state) => state.setUserData);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const body = { email, password };
      const response = await axios.post<Response<LoginResponse>>(
        API_ROUTES.AUTH.LOGIN,
        body,
      );
      const accessToken = response.data?.data?.accessToken;
      const userData = response.data?.data?.user;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      if (userData) {
        setUserData(userData);
      }
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError && error.response) {
        const message =
          error.response.data?.message || "An error occurred during sign in.";
        toast.error(message);
      } else {
        console.error("Error signing in:", error);
      }
    } finally {
      setIsSubmitting(false);
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex justify-between items-center">
            <FieldLabel>Password</FieldLabel>
            <Link
              href={"/forgot-password"}
              className="text-xs font-semibold"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <InputPassword
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field orientation={"vertical"}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Signing in..." : "Submit"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
