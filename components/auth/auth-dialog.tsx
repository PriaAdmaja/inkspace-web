"use client";
import { LogIn, UserRoundPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ToggleGroupItem, ToggleGroup } from "../ui/toggle-group";
import SignInForm from "./sign-in/sign-in-forms";
import SignUpForm from "./sign-up/sign-up-form";

export default function AuthDialog() {
  const [openSignInDialog, setOpenSignInDialog] = useState<boolean>(false);
  const [tab, setTab] = useState<"signIn" | "signUp">("signIn");

  const onSignIn = () => {
    setOpenSignInDialog(true);
  };

  return (
    <>
      <Button onClick={onSignIn}>
        <LogIn /> Sign In
      </Button>

      <Dialog open={openSignInDialog} onOpenChange={setOpenSignInDialog}>
        <DialogContent onInteractOutside={(event) => event.preventDefault()} aria-describedby="">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <ToggleGroup
              type="single"
              className="mx-auto mb-4"
              value={tab}
              onValueChange={(value) =>
                value && setTab(value as "signIn" | "signUp")
              }
              variant={"outline"}
            >
              <ToggleGroupItem value="signIn">
                <LogIn />
                Sign In
              </ToggleGroupItem>
              <ToggleGroupItem value="signUp">
                <UserRoundPlus />
                Sign Up
              </ToggleGroupItem>
            </ToggleGroup>
          </DialogHeader>

          {tab === "signIn" && <SignInForm />}
          {tab === "signUp" && <SignUpForm />}
        </DialogContent>
      </Dialog>
    </>
  );
}
