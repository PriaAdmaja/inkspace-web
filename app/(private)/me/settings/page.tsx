"use client";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdatePassword from "@/features/me/settings/update-password";
import EditProfile from "@/features/users/components/edit-profile";
import { useUserDataStore } from "@/store/user-data";

export default function Page() {
  const userData = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);

  const loading = !userData || !hasHydrated;

  if (loading) {
    return null;
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Settings</h1>
      <section className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>
              Update your name, avatar, and about information.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center gap-4">
            <img
              src={userData.avatar?.medium ?? "/no-profile.jpg"}
              alt={userData.username}
              className="object-cover shrink-0 rounded-xl size-16 "
            />
            <p className="font-medium">{userData.name}</p>
          </CardContent>

          <CardFooter className="justify-end border-t">
            <EditProfile
              user={userData}
              triggerButton={<Button>Edit Profile</Button>}
            />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update your password regularly to help keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end border-t">
            <UpdatePassword />
          </CardFooter>
        </Card>
      </section>
    </PageLayout>
  );
}
