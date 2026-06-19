export const API_ROUTES = {
  POSTS: {
    GET_ALL: "/api/public/posts/list",
    GET_BY_ID: (id: string) => `/api/public/posts/${id}`,
    CREATE: "/api/posts/create",
    UPDATE: (id: string) => `/api/posts/${id}`,
    PUBLISH: (id: string) => `/api/posts/${id}/publish`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  ME: {
    GET: "/api/me",
    UPDATE: "/api/me",
    POSTS: "/api/me/posts",
  },
  USERS: {
    POSTS: (userId: string) => `/api/public/users/${userId}/posts`,
  },
};
