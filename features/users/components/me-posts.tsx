import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/constants/api-routes";
import PostItem from "@/features/posts/components/post-item";
import PostItemSkeleteon from "@/features/posts/components/post-item-skeleteon";
import useInfiniteQueryFn from "@/hooks/use-infinite-query";
import { Post } from "@/types/posts";
import { useState } from "react";

const tabsValue = {
  published: "published",
  draft: "draft",
} as const;
const tabsValueArray = Object.entries(tabsValue).map(([, value]) => value);
type TabsValue = (typeof tabsValue)[keyof typeof tabsValue];

export default function MePost() {
  const [tabValue, setTabValue] = useState<TabsValue>("published");

  let isPublishedFilterValue = "";

  switch (tabValue) {
    case "published":
      isPublishedFilterValue = "true";

      break;
    case "draft":
      isPublishedFilterValue = "false";

      break;
  }

  const endpoint = API_ROUTES.ME.POSTS;
  const {
    flattedData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQueryFn<Post>({
    endpoint: endpoint,
    queryKey: [endpoint, tabValue],
    queryParams: {
      isPublished: isPublishedFilterValue,
    },
  });

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => {
        console.log(value);
        if (tabsValueArray.includes(value as TabsValue)) {
          setTabValue(value as TabsValue);
        }
      }}
    >
      <TabsList className="mb-2">
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
      </TabsList>

      {isLoading ? (
        <section className="flex flex-col gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <PostItemSkeleteon key={i} />
          ))}
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {flattedData.length > 0 ? (
            flattedData.map((d, i) => (
              <PostItem
                post={d}
                key={i}
                isMe
                showSeparator={flattedData.length - 1 !== i}
              />
            ))
          ) : (
            <p className="text-center mt-4">No posts yet</p>
          )}
          {hasNextPage && (
            <div className="mx-auto mt-2">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Spinner />}
                Load more
              </Button>
            </div>
          )}
        </section>
      )}
    </Tabs>
  );
}
