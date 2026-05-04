export const API_ROUTES = {
  POSTS: {
    GET_ALL: "/api/public/posts/list",
    GET_BY_ID: "/api/public/posts/:id",
    CREATE: "/api/posts/create",
    UPDATE: "/api/posts/:id",
    DELETE: "/api/posts/:id",
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
  },
};
