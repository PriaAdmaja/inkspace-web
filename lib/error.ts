import { Response } from "@/types/app";
import { AxiosError } from "axios";

export function errorMessageBuilder<T>(
  error: Error | AxiosError<Response<T>> | unknown,
): string {
  const errorResponseData =
    (error as AxiosError<Response<T>>).response?.data?.error?.[0].message ??
    undefined;
  if (errorResponseData) {
    return errorResponseData;
  }

  if ((error as Error).message) {
    return (error as Error).message;
  }

  return "An unexpected error occurred.";
}

export const errorFieldBuilder = <T>(
  error: Error | AxiosError<Response<T>> | unknown,
) => {
  const errorField =
    (error as AxiosError<Response<T>>).response?.data?.error ?? undefined;
  const result: Record<string, string> = {};

  if (Array.isArray(errorField)) {
    errorField.forEach((err) => {
      result[err.field] = err.message;
    });
  }

  return result;
};
