import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, user } from '@nextui-org/react';
import { User } from '../../components/user';
import { useGetFollowerQuery } from '../../app/services/followApi';
import { GoBack } from '../go-back';

export const Followers = () => {
  const { id } = useParams<{ id: string }>(); // ID пользователя из URL

  const { data: followersList, isLoading, isError } = useGetFollowerQuery(
    { userId: id ?? "", type: "followers" }, // Параметры запроса
    { skip: !id } // Пропускаем запрос, если id отсутствует
  );

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (isError || !followersList) {
    return <p>Не удалось загрузить подписчиков</p>;
  }

  return followersList.length > 0 ? (
    <>
      <GoBack />
      
    <div className="gap-5 flex-col min-w-[360px]">
      {followersList.map((user) => (
        <Link to={`/Search/UserProfilePage/${user.id}`} key={user.id}>
          <Card>
            <CardBody className="block">
              <User
                name={user.name ?? ""}
                avatarUrl={user.avatarUrl ?? ""}
                description={user.email ?? ""}
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
        <h1>У вас нет подписчиков</h1>
      </>
  );
};
