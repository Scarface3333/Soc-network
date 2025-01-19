import { Button, Card, Image, useDisclosure } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, selectCurrent } from '../../features/user/userSlice';
import { useGetUserByIdQuery, useLazyGetUserByIdQuery } from '../../app/services/userApi';
import { useFollowUserMutation, useUnfollowUserMutation } from '../../app/services/followApi';
import { GoBack } from '../go-back';
import { BASE_URL } from '../../constants';
import { MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { ProfileInfo } from '../profile-info';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { CountInfo } from '../count-info';
import { EditProfile } from '../edit-profile';
import { NavButton } from '../nav-button';
import { SendMessage } from '../send-message';

type Props = {
  id: string;
  
};

export const UserProfile: React.FC<Props> = ({
  id,
 
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useSelector(selectCurrent);
  
  const { data, error, isLoading } = useGetUserByIdQuery(id);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
  const dispatch = useDispatch();
  
  useEffect(() => {
    return () => {
      dispatch(resetUser());
    };
  }, [dispatch]);

  const handleFollow = async () => {
    if (data) {
      try {
        if (data.isFollowing) {
          await unfollowUser(id).unwrap();
        } else {
          await followUser({ followingId: id }).unwrap();
        }
        await triggerGetUserByIdQuery(id);
      } catch (error) {
        console.error("Ошибка при подписке:", error);
      }
    }
  };

  const handleClose = async () => {
    try {
      await triggerGetUserByIdQuery(id);
      onClose();
    } catch (error) {
      console.error("Ошибка при закрытии профиля:", error);
    }
  };

  

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки профиля.</div>;
  if (!data) return null;

  return (
    <>
      <GoBack />
      <Card className="flex flex-row gap-2 mb-5">
        <div className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={`${BASE_URL}${data.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-white"
          />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {data.name}
            {currentUser?.id === data.id ? (
              <Button endContent={<CiEdit />} onClick={onOpen}>
                Редактировать
              </Button>
            ) : (
              <Button
                color={data.isFollowing ? "default" : "primary"}
                variant="flat"
                className="gap-2"
                onClick={handleFollow}
                endContent={
                  data.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {data.isFollowing ? 'Отписаться' : 'Подписаться'}
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-4 p-5 flex-1">
          <ProfileInfo title='Почта' info={data.email} />
          <ProfileInfo title='Местоположение' info={data.location || 'Не указано'} />
          <ProfileInfo title='Дата рождения' info={formatToClientDate(data.dateOfBirth)} />
          <ProfileInfo title='Обо мне' info={data.bio || 'Нет информации'} />
          <p className="flex gap-2">
            <NavButton href = 'Followers'>
              <CountInfo count={data.followers.length} title='Подписчики' />
            </NavButton>
            <NavButton href = 'Following'>
              <CountInfo count={data.following.length} title='Подписки' />
            </NavButton>
          </p> {currentUser && (
            <SendMessage senderId={currentUser.id} recipientId={id} />
          )}
        </div>
      </Card>
      
      <EditProfile isOpen={isOpen} onClose={handleClose} user={data}  />
    </>
  );
};
