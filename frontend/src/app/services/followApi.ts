import { Follows } from "../types";
import { api } from "./api"

export const FollowApi = api.injectEndpoints({
    endpoints: (builder) => ({
      followUser: builder.mutation<void, { followingId: string }>({
        query: (body) => ({
          url: `/follow`,
          method: "POST",
          body,
        }),
        invalidatesTags: (result, error, { followingId }) => [
          { type: "User", id: followingId },
        ],
      }),
      unfollowUser: builder.mutation<void, string>({
        query: (userId) => ({
          url: `/unfollow/${userId}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, userId) => [{ type: "User", id: userId }],
      }),
      getFollower: builder.query<
      { id: number; name: string; email: string; avatarUrl: string }[],
      { userId: string; type: "followers" | "following" }
    >({
      query: ({ userId, type }) => {
        const endpoint = type === "followers" ? "followers" : "following";
        return {
          url: `/${endpoint}/${userId}`, // Соответствует вашему маршруту
          method: "GET",
        };
      },
      providesTags: (result, error, { userId, type }) => [
        { type: "UserFollowers", id: `${userId}-${type}` },
      ],
    }),
    }),
  });
  
  export const {
    useFollowUserMutation,
    useUnfollowUserMutation,
    useGetFollowerQuery,
  } = FollowApi;
  
  export const {
    endpoints: { followUser, unfollowUser, getFollower },
  } = FollowApi;