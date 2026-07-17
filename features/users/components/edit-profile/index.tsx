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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ROUTES } from "@/constants/api-routes";
import { useMediaQueries } from "@/hooks/use-media-queries";
import axios from "@/lib/axios";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import { User } from "@/types/users";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { isFormChanged } from "./utils";
import errorMessageBuilder from "@/lib/error-message-builder";

const avatarPlaceholder = "/no-profile.jpg";

export default function EditProfile({ user }: { user?: User }) {
  const [open, setOpen] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null | undefined>(undefined); // undefined means no change, null means remove avatar, File means new avatar
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.medium ?? avatarPlaceholder,
  );
  const [name, setName] = useState<string>(user?.name ?? "");
  const [about, setAbout] = useState<string>(user?.about ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setUserData = useUserDataStore((state) => state.setUserData);
  const { sm } = useMediaQueries();

  const isChanged = isFormChanged({ user, name, about, avatar });

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
      const message = errorMessageBuilder(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setAvatarPreview(user?.avatar?.medium ?? avatarPlaceholder);
    setAvatar(undefined);
    setName(user?.name ?? "");
    setAbout(user?.about ?? "");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onClose();
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

      <DialogContent
        onInteractOutside={(e) => {
          if (isChanged) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isChanged) {
            e.preventDefault();
          }
        }}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-5">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                minLength={3}
                maxLength={30}
                required
              />
              <FieldDescription className="text-end text-xs">
                {name.length.toLocaleString()} / 30
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="input-about">About</FieldLabel>
              <Textarea
                id="input-about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                name="about"
                maxLength={500}
              />

              <FieldDescription className="text-end text-xs">
                {about.length.toLocaleString()} / 500
              </FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter>
            {isLoading === false && (
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            )}
            <Button type="submit" disabled={isLoading || !isChanged}>
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
  maxSize = 1 * 1024 * 1024, // Default max size is 1MB
}: {
  avatar: string;
  alt: string;
  onChange: (file: File | null) => void;
  maxSize?: number;
}) => {
  const defaultMaxSize = maxSize / (1024 * 1024); // 1MB

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > maxSize) {
      toast.error(
        `File size exceeds the maximum limit of ${defaultMaxSize} MB.`,
      );
      return;
    }

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
            accept="image/jpeg, image/png, image/webp"
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
          Recommended size: at least 500 × 500 px, with a file size of no more
          than {defaultMaxSize} MB.
        </p>
      </div>
    </div>
  );
};
