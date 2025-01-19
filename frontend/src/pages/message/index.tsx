import React from "react";
import ChatUserSearch from "../../components/Chat/chat-item/chat-user-search";
import ChatSidebar from "../../components/Chat/chat-item/chat-sidebar";
import ChatWindow from "../../components/Chat/chat-item/ChatWindow";
import { useParams } from "react-router-dom";


const MessagePage: React.FC = () => {

  const user = {
    name: 'Имя',
    avatarUrl: '#'
  }
  return (
    <div className="flex h-screen w-screen">
      {/* Левая панель: поиск и список чатов */}
      <div className="w-1/3  p-4 border-r ">
        <ChatUserSearch
          name={user.name}
          avatarUrl={user.avatarUrl}
        />
        <ChatSidebar
        />
      </div>

      {/* Правая панель: окно чата */}
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
};

export default MessagePage;