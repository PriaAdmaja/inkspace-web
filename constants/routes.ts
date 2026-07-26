export const routes = {
  newIdea: "/new-idea",
  post: {
    view: (postId: string) => `/post/${postId}`,
    edit: (postId: string) => `/post/${postId}/edit`,
  },
  user: {
    view: (username: string) => `/${username}`,
  },
  me: {
    settings: '/me/settings'
  }
};
