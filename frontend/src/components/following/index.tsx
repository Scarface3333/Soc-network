import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent, selectUser } from '../../features/user/userSlice'
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, user } from '@nextui-org/react';
import { User } from '../user';
import { useGetFollowerQuery } from '../../app/services/followApi';
import { GoBack } from '../go-back';

export const Following = () => {
  const { id } = useParams<{ id: string }>();

  const { data: followingList, isLoading, isError } = useGetFollowerQuery(
    { userId: id ?? "", type: 'following' },
    { skip: !id }
  );

  if (isLoading) {
    return <p>Загрузка...</p>
  }

  if (isError || !followingList) {
    return <p>Не удалось загрузить подписки</p>
  }

  return followingList.length > 0 ? (
    <>
      <GoBack/>
    <div className="gap-5 flex-col min-w-[360px]">
     { followingList.map((user) => (
      <Link to={`/Search/UserProfilePage/${user.id}`} key={user.id}>
        <Card>
          <CardBody className='block'>
            <User
              name={user.name ?? ''}
               avatarUrl={user.avatarUrl ?? ''}
               description={user.email ?? ''}
            />

          </CardBody>
        </Card>
      </Link>
      ))}
      </div>
    </>
  ) : (
      <>
        <GoBack/>
        <h1>У вас нет подписок</h1>
      </>
  )
}