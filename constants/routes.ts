export const routes = {
    newIdea: "/new-idea",
    me: "/me",
    post: {
        view: (postId: string) => `/post/${postId}`,
        edit: (postId: string) => `/post/${postId}/edit`,
    }
}