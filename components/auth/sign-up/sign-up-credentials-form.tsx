import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputPassword from "../components/input-password";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { RegisterResponse } from "@/types/auth";
import { API_ROUTES } from "@/constants/api-routes";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CircleAlert, CircleCheckBig } from "lucide-react";

export default function SignUpCredentialsForm() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const usernameStatus = useUsernameChecker(username);

  const onSubmit = async () => {
    if (!!password && !!rePassword && password !== rePassword) {
      setIsPasswordNotMatch(true);
      return;
    }

    try {
      setIsLoading(true);
      const body = {
        email: email.trim(),
        password,
        username: username.trim(),
        name,
      };
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
          <FieldLabel>Full Name</FieldLabel>
          <Input
            placeholder="Enter your name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <InputGroup>
            <InputGroupInput
              placeholder="Enter your username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputGroupAddon align={"inline-end"}>
              {usernameStatus ? (
                usernameStatus.isLoading ? (
                  <Spinner />
                ) : usernameStatus.isPassed ? (
                  <CircleCheckBig className="text-green-500" />
                ) : (
                  <CircleAlert className="text-red-500" />
                )
              ) : null}
            </InputGroupAddon>
          </InputGroup>
          {!usernameStatus?.isPassed && (
            <FieldError>{usernameStatus?.message}</FieldError>
          )}
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

type UsernameCheckerResult = {
  isPassed: boolean;
  isLoading: boolean;
  message: string;
};
type FetchResultType = Omit<UsernameCheckerResult, "isLoading">;
const USERNAME_REGEX = /^[a-z0-9](?:[a-z0-9_]{3,8})[a-z0-9]$/;

const useUsernameChecker = (username: string): UsernameCheckerResult | null => {
  const [fetchResult, setFetchResult] = useState<FetchResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedUsername = useDebounce(username, 500);

  const checkingUsername = async (username: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post<Response<{ isAvailable: boolean }>>(
        API_ROUTES.USERS.CHECK_USERNAME,
        {
          username: username,
        },
      );
      const data = res.data.data;
      if (data) {
        setFetchResult({ isPassed: data.isAvailable, message: "" });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (error) {
      setFetchResult({
        isPassed: false,
        message: "Failed to check this username",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (USERNAME_REGEX.test(debouncedUsername)) {
      checkingUsername(debouncedUsername);
    }
  }, [debouncedUsername]);

  const result = useMemo(() => {
    if (debouncedUsername === "") {
      return null;
    }

    if (!USERNAME_REGEX.test(debouncedUsername)) {
      return {
        isPassed: false,
        isLoading: false,
        message:
          "Username must be 5–10 characters long and contain only lowercase letters, numbers, and underscores.",
      };
    }

    if (isLoading) {
      return {
        isPassed: false,
        isLoading: true,
        message: "",
      };
    }

    return fetchResult
      ? {
          isPassed: fetchResult.isPassed,
          isLoading: false,
          message: fetchResult.isPassed
            ? `${debouncedUsername} is available`
            : `Choose another username`,
        }
      : null;
  }, [debouncedUsername, isLoading, fetchResult]);

  return result;
};
