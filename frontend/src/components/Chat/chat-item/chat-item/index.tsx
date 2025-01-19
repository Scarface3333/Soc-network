import React from "react";
import { Link } from "react-router-dom";
import { Message } from "../../../../app/types";
import { BASE_URL } from "../../../../constants";

type Props = {
  partnerId: string;
  partnerName: string;
  partnerAvatarUrl: string; // URL для аватарки
  messages: Message[];
  currentUserId: string;
};

export const ChatItem: React.FC<Props> = ({
  partnerId,
  partnerName,
  partnerAvatarUrl,
  messages,
  currentUserId,
}) => {
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  const lastMessage = sortedMessages[sortedMessages.length - 1];

  return (
    <li className="p-2 rounded flex items-center gap-3">
      <div className="flex-1">
        <Link
          to={`/messages/${currentUserId}/${partnerId}`}
          className="flex items-center gap-4"
        >
          {/* Аватарка собеседника */}
          <img
            src={`${BASE_URL}${partnerAvatarUrl}`} // Путь к аватарке собеседника
            alt={`${partnerName}'s avatar`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <strong className="text-sm font-medium">{partnerName}</strong>
            <p className="text-xs text-gray-500">
              {lastMessage?.content || "Нет сообщений"}
            </p>
          </div>
        </Link>
      </div>

      {/* Время последнего сообщения */}
      {lastMessage && (
        <span className="text-xs text-gray-400">
          {new Date(lastMessage.createdAt).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </li>
  );
};

export default ChatItem;
