import React from "react";
import { useSelector } from "react-redux";
import { selectCurrent } from "../../../../features/user/userSlice";
import { useGetUserMessagesQuery } from "../../../../app/services/messageApi";
import ChatItem from "../chat-item";

const ChatSidebar = () => {
  const currentUser = useSelector(selectCurrent);

  const { data: chats, isLoading, error } = useGetUserMessagesQuery(
    currentUser?.id || "",
    { skip: !currentUser?.id }
  );

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <ul className="space-y-2">
      {chats?.map((chat) => (
        <ChatItem
          key={chat.partnerId} 
          partnerId={chat.partnerId}
          partnerName={chat.partnerName}
          partnerAvatarUrl={chat.partnerAvatarUrl}
          messages={chat.messages}
          currentUserId={currentUser?.id || ""}
        />
      ))}
    </ul>
  );
};

export default ChatSidebar;
