import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes, ReactNode, useState } from "react";
import { Photos } from "unsplash-js/dist/methods/search/types/response";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { X } from "lucide-react";

const UnsplashLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="size-3.5"
    >
      <path
        d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
};

export default function Unsplash({ editor }: { editor: Editor | null }) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [images, setImages] = useState<Photos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const clearAll = () => {
    setSearchInput("");
    setImages(null);
  };

  const fetchImages = async ({
    search,
    page = 1,
  }: {
    search: string;
    page?: number;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/unsplash?search=${encodeURIComponent(search)}&page=${page}&perPage=${perPage}`,
      );
      const data = await response.json();
      setImages(data.data || null);
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);

        if (!open) {
          clearAll();
        }
      }}
    >
      <DialogTrigger asChild>
        <div>
          <ToolbarButton toolbarName="Unsplash Image">
            <UnsplashLogo />
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

        <InputGroup>
          <InputGroupInput
            value={searchInput}
            placeholder="Search Unsplash..."
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchImages({ search: searchInput });
              }
            }}
          />
          {searchInput !== "" && (
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                onClick={() => {
                  setSearchInput("");
                  setImages(null);
                }}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div>
          {loading ? (
            <ImagesLayout>
              {Array.from({ length: 8 }).map((_, index) => (
                <ImageWrapper key={index}>
                  <Skeleton className="w-full h-[300px] rounded-md" />
                </ImageWrapper>
              ))}
            </ImagesLayout>
          ) : images ? (
            images.results.length > 0 ? (
              <section>
                {images && (
                  <ImagesNavigation
                    fetchImages={fetchImages}
                    images={images}
                    page={page}
                    searchInput={searchInput}
                    setPage={setPage}
                  />
                )}

                <div className="max-h-[700px] overflow-y-auto">
                  <ImagesLayout>
                    {images.results.map((image) => (
                      <ImageWrapper
                        key={image.id}
                        className="mb-4 break-inside-avoid cursor-pointer"
                        onClick={() => {
                          if (!editor) return;

                          const data = {
                            src: image.urls.regular,
                            thumbnailUrl: image.urls.thumb,
                            alt: image.alt_description || "Unsplash Image",
                            photographerName: image.user.name,
                            photographerUrl: image.user.links.html,
                            unsplashUrl: image.links.html,
                          };
                          editor.commands.insertUnsplashImage(data);
                          setOpenDialog(false);
                          clearAll();
                        }}
                      >
                        <img
                          src={image.urls.thumb}
                          alt={image.alt_description || "Unsplash Image"}
                          className="object-contain rounded-md w-full hover:ring-2 hover:ring-blue-500"
                        />
                      </ImageWrapper>
                    ))}
                  </ImagesLayout>
                </div>
              </section>
            ) : (
              <p>No images found.</p>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ImagesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">{children}</div>
  );
};

const ImageWrapper = ({
  children,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={cn("mb-4 break-inside-avoid", props.className)}>
      {children}
    </div>
  );
};

const ImagesNavigation = ({
  page,
  fetchImages,
  searchInput,
  images,
  setPage,
}: {
  page: number;
  fetchImages: (options: { search: string; page: number }) => void;
  searchInput: string;
  images: Photos;
  setPage: (page: number) => void;
}) => {
  return (
    <div className="flex justify-between gap-2 mb-4">
      {page === 1 ? (
        <div />
      ) : (
        <button
          onClick={() => {
            const prevPage = Math.max(1, page - 1);
            fetchImages({ search: searchInput, page: prevPage });
            setPage(prevPage);
          }}
        >
          prev
        </button>
      )}
      <p>{images.total.toLocaleString()} images</p>
      <button
        onClick={() => {
          const nextPage = page + 1;
          fetchImages({ search: searchInput, page: nextPage });
          setPage(nextPage);
        }}
      >
        next
      </button>
    </div>
  );
};
