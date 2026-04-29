"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { API_ROUTES } from "@/constants/api-routes";
import useAxios from "@/hooks/use-axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

const TiptapEditor = dynamic(() => import("@/components/text-editor/tiptap"), {
  ssr: false,
});

export default function NewIdea() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const axios = useAxios()

  const isDisable = !title.trim() || !content.trim();

  const onSave = async () => {
    try {
      setIsLoading(true);
      await axios.post(API_ROUTES.POSTS.CREATE, {
        title,
        content,
      });
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full space-y-2">
      <div className="flex w-full">
        <TiptapEditor
          placeholder="Title"
          className="font-bold text-2xl w-full"
          isDisableEnter
          onChange={setTitle}
        />
        <Button onClick={onSave} variant={"secondary"} className="ml-auto" disabled={isDisable || isLoading}>
          {isLoading && <Spinner data-icon="inline-start" />}
          Save
        </Button>
      </div>
      <Separator />
      <TiptapEditor onChange={setContent} />
    </section>
  );
}
