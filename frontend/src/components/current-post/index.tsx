import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/postsApi';
import { Card } from '../card';
import { GoBack } from '../go-back';
import { CreateComment } from '../create-comment';

export const CurrentPost = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetPostByIdQuery(params?.id ?? '')

  if (!data) {
    return <h2>Поста не существует</h2>
  }

  const {
    content,
    id,
    authorId,
    comments,
    likes,
    author,
    likedByUser,
    createdAt,
  } = data;
  return (
    <>
      <GoBack />
      <Card
        cardFor='current-post'
        avatarUrl={author.avatarUrl ?? ''}
        content={content}
        name={author.name ?? ''}
        likesCount={likes.length}
        commentsCount={comments.length}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
      />
      <div className="mt-10">
        <CreateComment />
      </div>
      <div className="mt-10">
        {
          data.comments ?
            data.comments.map((comment) => (
              <Card
                cardFor='comment'
                key={comment.id}
                avatarUrl={comment.user.avatarUrl ?? ''}
                content={comment.content}
                name={comment.user.name ?? ''}
                authorId={comment.userId}
                commentId={comment.id}
                id={id}
              />
            )) : null
        }
      </div>
    </>
  )
}
