export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string | null;
    avatar: string | null;
  };
  tags: {
    name: string;
    slug: string;
  }[];
};
