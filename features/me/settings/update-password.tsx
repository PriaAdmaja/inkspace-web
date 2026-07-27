import InputPassword from "@/components/auth/components/input-password";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { API_ROUTES } from "@/constants/api-routes";
import axios from "@/lib/axios";
import { errorFieldBuilder, errorMessageBuilder } from "@/lib/error";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";

export default function UpdatePassword() {
  const [open, setOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorField, setErrorField] = useState<
    Record<string, { isError: boolean; message?: string }>
  >({});

  const isFormFilled =
    !!currentPassword || !!newPassword || !!confirmNewPassword;

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrorField((prev) => ({
        ...prev,
        newPassword: { isError: true },
        confirmNewPassword: {
          isError: true,
          message: "Passwords do not match",
        },
      }));
      return;
    }

    const body = {
      currentPassword,
      newPassword,
    };

    try {
      setIsLoading(true);
      await axios.patch(API_ROUTES.ME.CHANGE_PASSWORD, body);
      toast.success('Your password is updated successfully.')
      setOpen(false);
    } catch (error) {
      const message = errorMessageBuilder(error);
      const errorField = errorFieldBuilder(error);
      setErrorField((prev) => {
        const oldData = { ...prev };
        Object.entries(errorField).forEach(([key, value]) => {
          oldData[key] = { isError: true, message: value };
        });
        return oldData;
      });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setConfirmNewPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setErrorField({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        resetState();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Change Password</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => {
          if (isFormFilled) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isFormFilled) {
            e.preventDefault();
          }
        }}
      >
        <form
          id="change-password-form"
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={errorField.currentPassword?.isError}>
              <FieldLabel htmlFor="currentPassword">
                Current Password *
              </FieldLabel>
              <InputPassword
                required
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => {
                  if (errorField.currentPassword) {
                    const prevError = { ...errorField };
                    delete prevError.currentPassword;
                    setErrorField(prevError);
                  }
                  setCurrentPassword(e.target.value);
                }}
                aria-invalid={errorField.currentPassword?.isError}
              />
              {errorField.currentPassword?.message && (
                <FieldError>{errorField.currentPassword?.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={errorField.newPassword?.isError}>
              <FieldLabel htmlFor="newPassword">New Password *</FieldLabel>
              <InputPassword
                required
                name="newPassword"
                id="newPassword"
                aria-invalid={errorField.newPassword?.isError}
                value={newPassword}
                onChange={(e) => {
                  if (errorField.newPassword) {
                    const prevError = { ...errorField };
                    delete prevError.newPassword;
                    delete prevError.confirmNewPassword;
                    setErrorField(prevError);
                  }
                  setNewPassword(e.target.value);
                }}
              />
              {errorField.newPassword?.message && (
                <FieldError>{errorField.newPassword?.message}</FieldError>
              )}
            </Field>

            <Field
              data-invalid={
                errorField.confirmNewPassword?.isError ||
                errorField.newPassword?.isError
              }
            >
              <FieldLabel htmlFor="confirmNewPassword">
                Confirm New Password *
              </FieldLabel>
              <InputPassword
                required
                name="confirmNewPassword"
                id="confirmNewPassword"
                aria-invalid={
                  errorField.confirmNewPassword?.isError ||
                  errorField.newPassword?.isError
                }
                value={confirmNewPassword}
                onChange={(e) => {
                  if (errorField.newPassword) {
                    const prevError = { ...errorField };
                    delete prevError.newPassword;
                    delete prevError.confirmNewPassword;
                    setErrorField(prevError);
                  }
                  setConfirmNewPassword(e.target.value);
                }}
              />
              {errorField.confirmNewPassword?.message && (
                <FieldError>
                  {errorField.confirmNewPassword?.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            {isLoading === false && (
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
