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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ROUTES } from "@/constants/api-routes";
import { useMediaQueries } from "@/hooks/use-media-queries";
import axios from "@/lib/axios";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import { User } from "@/types/users";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const avatarPlaceholder = "/no-profile.jpg";

export default function EditProfile({ user }: { user?: User }) {
  const [open, setOpen] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null | undefined>(undefined); // undefined means no change, null means remove avatar, File means new avatar
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.medium ?? avatarPlaceholder,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setUserData = useUserDataStore((state) => state.setUserData);
  const { sm } = useMediaQueries();

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);

      switch (avatar) {
        case undefined:
          formData.delete("avatar");
          break;
        case null:
          formData.delete("avatar");
          formData.set("avatarAction", "remove");
          break;
        default:
          // New avatar file
          formData.set("avatarAction", "upload");
      }

      const res = await axios.patch<Response<User>>(
        API_ROUTES.ME.UPDATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const userData = res.data.data;
      if (userData) {
        setUserData({
          id: userData.id,
          email: userData.email,
          username: userData.username,
          name: userData.name,
          about: userData.about ?? undefined,
          avatar: userData.avatar,
        });
      }

      setOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          setAvatarPreview(user?.avatar?.medium ?? avatarPlaceholder);
          setAvatar(undefined);
          setOpen(false);
          return;
        }

        setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button size={sm ? "default" : "sm"}>
          <Pencil /> Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel>Avatar</FieldLabel>
              <ImageUploader
                alt={user?.username ?? "avatar"}
                avatar={avatarPreview}
                onChange={(file) => {
                  setAvatar(file);

                  if (file) {
                    setAvatarPreview(URL.createObjectURL(file));
                  } else {
                    setAvatarPreview(avatarPlaceholder);
                  }
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="input-name">Name *</FieldLabel>
              <Input
                id="input-name"
                defaultValue={user?.name ?? ""}
                name="name"
                minLength={3}
                maxLength={30}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="input-about">About</FieldLabel>
              <Textarea
                id="input-about"
                defaultValue={user?.about ?? ""}
                name="about"
                maxLength={500}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            {isLoading === false && (
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const ImageUploader = ({
  avatar,
  alt,
  onChange,
}: {
  avatar: string;
  alt: string;
  onChange: (file: File | null) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="flex gap-4">
      <img
        src={avatar}
        alt={alt}
        className="object-cover shrink-0 rounded-xl size-24 sm:size-20"
      />

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            <Button asChild size={"sm"} className="cursor-pointer">
              <label htmlFor="avatar">Upload New Photo</label>
            </Button>

          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={handleRemove}
            type="button"
          >
            Remove
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-secondary-foreground text-pretty">
          At least 800x800 px recomended. JPG or PNG is allowed.
        </p>
      </div>
    </div>
  );
};
