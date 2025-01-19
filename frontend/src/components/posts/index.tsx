import React from 'react'
import { useGetAllPostsQuery } from '../../app/services/postsApi'
import { CreatePost } from '../create-post';
import { Card } from '../card';
import { useSelector } from 'react-redux';
import { selectCurrent } from '../../features/user/userSlice';
import { useGetUserByIdQuery } from '../../app/services/userApi';

type Props = {
  id: string; 
};

export const Posts: React.FC<Props> = ({ id }) => {
  const { data: postsData } = useGetAllPostsQuery();
  const currentUser = useSelector(selectCurrent);
  const { data: userData } = useGetUserByIdQuery(id);

  // Преобразуем userId в число для сравнения
  const numericUserId = Number(id);

  // Фильтрация постов по userId
  const userPosts = postsData?.filter(post => Number(post.authorId) === numericUserId) || [];
 

  return (
    <>
      {currentUser?.id === userData?.id ? (
        <div className='mt-10 mb-10 w-full'>
          <CreatePost />
        </div>
      ) : null}
      {
        userPosts.length > 0
          ? userPosts.map(post => (
              <Card
                key={post.id}
                avatarUrl={post.author.avatarUrl ?? ''}
                content={post.content}
                name={post.author.name ?? ''}
                likesCount={post.likes.length}
                commentsCount={post.comments.length}
                authorId={post.authorId}
                id={post.id}
                likedByUser={post.likedByUser}
                createdAt={post.createdAt}
                cardFor='post'
              />
            ))
          : null
      }
    </>
  );
};
