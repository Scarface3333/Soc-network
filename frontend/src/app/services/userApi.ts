import { api } from "./api";
import {User} from '../types'

export const userApi = api.injectEndpoints({
    endpoints:(builder) =>({
        login: builder.mutation<
        {token: string},
        {email:string,password:string}
        >({
            query:(userData) => ({
                url: '/login',
                method:'POST',
                body: userData
            })
        }),
        register: builder.mutation<
          {email: string; password: string; name: string},
          {email: string; password: string; name: string}
        >({
            query:(userData) => ({
                url: '/register',
                method: 'POST',
                body: userData
            })
        }),
        current: builder.query<User, void>({
            query: () => ({
                url: '/current',
                method: 'GET'
            })
        }),
        getUserById: builder.query<User, string>({
            query: (id) => ({
                url : `/users/${id}`,
                method: 'GET'
            })
        }),
        updateUser: builder.mutation<User, {userData: FormData, id: string}>({
            query: ({userData, id}) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: userData
            })
        }),
        SearchUsers: builder.query<User[], string | undefined>({ // Разрешаем undefined
            query: (searchTerm) => ({
                url: '/search',
                method: 'GET',
                params: searchTerm ? { query: searchTerm } : {}, // Передаем параметр только если он есть
            }),
        }),
        
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useCurrentQuery,
    useLazyCurrentQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,
    useUpdateUserMutation,
    useSearchUsersQuery
} = userApi;

export const {
    endpoints: { login, register, current, getUserById, updateUser,SearchUsers}
} = userApi;