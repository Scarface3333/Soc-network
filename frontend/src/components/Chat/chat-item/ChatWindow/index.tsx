import React from "react";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../../../app/services/messageApi";
import CreateMessage from "../../../create-message";
import { BASE_URL } from "../../../../constants";

const ChatWindow: React.FC = () => {
  const { senderId, recipientId } = useParams<{ senderId: string; recipientId: string }>();

  if (!senderId || !recipientId) {
    return <div>Неверные параметры чата</div>;
  }

  const { data, isLoading, error } = useGetMessagesQuery({
    userId: senderId,
    chatPartnerId: recipientId,
  });

  if (isLoading) return <div>Загрузка сообщений...</div>;
  if (error) return <div></div>;

  const { messages, chatPartner } = data || {};

  return (
    <div className="flex flex-col h-full">
      {/* Информация о собеседнике */}
      <div className="flex items-center p-4 border-b" >
        <img
          src={`${BASE_URL}${chatPartner?.avatarUrl || "/default-avatar.png"}`}
          alt={chatPartner?.name || "Собеседник"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="ml-3 font-bold">{chatPartner?.name || "Неизвестный пользователь"}</p>
      </div>

      {/* Список сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.senderId === senderId ? "flex-row-reverse self-end" : "self-start"
            }`}
          >
            {/* Аватарка отправителя */}
            <img
              src={`${BASE_URL}${message.senderAvatar || "/default-avatar.png"}`}
              alt={message.senderName}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Контейнер сообщения */}
            <div className={`p-3 rounded-md max-w-sm bg-slate-400`} >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Поле ввода нового сообщения */}
      <div className="p-4 border-t">
        <CreateMessage />
      </div>
    </div>
  );
};

export default ChatWindow;
