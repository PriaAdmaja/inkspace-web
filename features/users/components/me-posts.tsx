import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/constants/api-routes";
import PostItem from "@/features/posts/components/post-item";
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

  const endpoint = API_ROUTES.ME.POSTS
  const { flattedData, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQueryFn<Post>({
      endpoint: endpoint,
      queryKey: [endpoint, tabValue],
      queryParams: {
        isPublished: isPublishedFilterValue
      }
    });

  return (
    <Tabs
    //   value={String(tabsValue)}
      defaultValue='published'
      onValueChange={(value) => {
        console.log(value)
        if (tabsValueArray.includes(value as TabsValue)) {
          setTabValue(value as TabsValue);
        }
      }}
    >
      <TabsList className="mb-2">
        <TabsTrigger value='published'>
          Published
        </TabsTrigger>
        <TabsTrigger value='draft'>
          Draft
        </TabsTrigger>
      </TabsList>


      <section className="flex flex-col gap-4">
        {flattedData.map((d, i) => (
          <PostItem post={d} key={i} isMe/>
        ))}
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
    </Tabs>
  );
}
