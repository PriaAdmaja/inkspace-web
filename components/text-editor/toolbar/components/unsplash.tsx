import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Photos } from "unsplash-js/dist/methods/search/types/response";
import { toast } from "sonner";

export default function Unsplash({ editor }: { editor: Editor | null }) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [images, setImages] = useState<Photos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(images);
  const getUnsplashImages = async (query: string) => {
    try {
      const response = await fetch(
        `/api/unsplash?search=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(
        "Failed to fetch images from Unsplash. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (searchValue) {
      getUnsplashImages(searchValue)
        .then((data) => {
          setImages(data || null);
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchValue]);

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);

        if (!open) {
          setSearchInput("");
          setSearchValue("");
          setImages(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <div>
          <ToolbarButton toolbarName="Type and press enter to search Unsplash">
            <Image
              src="/logo/unsplash.png"
              alt="Unsplash"
              width={14}
              height={14}
            />
          </ToolbarButton>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Unsplash Image</DialogTitle>
          <DialogDescription>
            Search for an image on Unsplash and insert it into your document.
          </DialogDescription>
        </DialogHeader>

        {searchValue === "" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchValue(searchInput);
            }}
          >
            <Input
              placeholder="Search Unsplash..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
        ) : (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : images && images.results.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {images.results.map((image) => (
                  <div
                    key={image.id}
                    className="mb-4 break-inside-avoid cursor-pointer"
                    onClick={() => {
                      if (!editor) return;

                      const data = {
                        src: image.urls.regular,
                        alt: image.alt_description || "Unsplash Image",
                        photographerName: image.user.name,
                        photographerUrl: image.user.links.html,
                        unsplashUrl: image.links.html,
                      };
                      editor.commands.insertUnsplashImage(data);
                      setOpenDialog(false);
                    }}
                  >
                    <img
                      src={image.urls.thumb}
                      alt={image.alt_description || "Unsplash Image"}
                      className="object-contain rounded-md w-full hover:ring-2 hover:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No images found.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
