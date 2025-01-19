import React from "react";
import { useCreateMessageMutation, useGetMessagesQuery } from "../../app/services/messageApi";
import { useForm, Controller } from "react-hook-form";
import { Textarea, Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";

export const CreateMessage = () => {
  const { senderId, recipientId } = useParams<{ senderId: string; recipientId: string }>();

  if (!senderId || !recipientId) {
    return NaN
  }

  const { data: messages, isLoading, error,refetch } = useGetMessagesQuery({
    userId: senderId, // Используем senderId как userId
    chatPartnerId: recipientId, // Используем recipientId
  });
  const [createMessage] = useCreateMessageMutation();

  const { handleSubmit, control, setValue } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!senderId || !recipientId) {
        throw new Error("Недостаточно данных для отправки сообщения");
      }

      await createMessage({
        content: data.message,
        senderId: senderId,
        recipientId: recipientId,
      }).unwrap();
      setValue("message", ""); // Очищаем поле после успешной отправки
      refetch();
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  });
  
  if (isLoading) return <div>Загрузка сообщений...</div>;
  if (error) return <div>Ошибка при загрузке сообщений.</div>;
  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="message"
        control={control}
        defaultValue=""
        rules={{ required: "Сообщение не может быть пустым" }}
        render={({ field }) => (
          <Textarea {...field} placeholder="Введите сообщение..." />
        )}
      />
      <Button className="mt-1" type="submit">Отправить</Button>
    </form>
  );
};

export default CreateMessage;
