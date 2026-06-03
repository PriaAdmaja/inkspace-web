import { createApi } from "unsplash-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "10";
  const numberPage = parseInt(page);
  const numberPerPage = parseInt(perPage);

  if (!search) {
    return new Response(
      JSON.stringify({ error: "Missing search query parameter 'search'" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return new Response(
      JSON.stringify({
        message: "Missing UNSPLASH_ACCESS_KEY environment variable",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const unsplash = createApi({
    accessKey: accessKey,
  });

  const response = await unsplash.search.getPhotos({
    query: search,
    perPage: isNaN(numberPerPage) ? 10 : numberPerPage,
    page: isNaN(numberPage) ? 1 : numberPage,
  });

  return new Response(
    JSON.stringify({
      message: `Success`,
      data: response.response,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
