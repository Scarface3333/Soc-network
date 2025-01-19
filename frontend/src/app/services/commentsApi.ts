import { api } from "./api"
import { Comment } from "../types"

export const commentsApi= api.injectEndpoints({
    endpoints: (builder) => ({
        createComment: builder.mutation<Comment, Partial<Comment>>({
            query: (newComment) => ({
                url: `/comments`,
                method: 'POST',
                body: newComment
            })
        }),
        deleteComment: builder.mutation<void, string>({
            query: (commentId) => ({
                url: `/comments/${commentId}`,
                method: 'DELETE'
            })
        }), 
    })
})

export const {
    useCreateCommentMutation,
    useDeleteCommentMutation
} = commentsApi

export const {
endpoints: {
    createComment,
    deleteComment
}
} = commentsApi