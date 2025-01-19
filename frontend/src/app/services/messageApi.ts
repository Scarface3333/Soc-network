import { GetMessagesResponse, Message } from "../types"
import { api } from "./api"


export const MessageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createMessage: builder.mutation<Message, { content: string; senderId: string; recipientId: string }>({
            query: (messageData) => ({
                url: '/messages',
                method: 'POST',
                body: messageData
            })
        }),
        getMessages: builder.query<GetMessagesResponse, { userId: string; chatPartnerId: string }>({
            query: ({ userId, chatPartnerId }) => ({
              url: `/messages/${userId}/${chatPartnerId}`,
              method: 'GET',
            }),
          }),

        deleteMessage: builder.mutation<void, string>({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE'
            })
        }),
        getUserMessages: builder.query<{ partnerId: string; partnerName: string; partnerAvatarUrl: string; messages: Message[]; }[], string>({
            query: (userId) => ({
                url: `/messages/${userId}`,
                method: 'GET',
            }),
        }),
    })
})

export const {
    useCreateMessageMutation,
    useGetMessagesQuery,
    useDeleteMessageMutation,
    useGetUserMessagesQuery

} = MessageApi;

export const {
    endpoints: { createMessage, getMessages, deleteMessage, getUserMessages }
} = MessageApi;