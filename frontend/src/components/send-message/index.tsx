import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

type Props = {
    senderId: string;
    recipientId: string;
}

export const SendMessage: React.FC<Props> = ({
    senderId,
    recipientId
}) => {
    const chatLink = `/messages/${senderId}/${recipientId}`;
    
  return (
      <Link to={chatLink}>
          <Button >
              Написать сообщение
          </Button>
    </Link>
)
}
