export interface INewMessage {
  event: "NEW_MESSAGE";
  chatId: string;
  content: { attachments?: string[]; text?: string };
}

export interface IMessage {
  chatId: string;
  content: { attachments?: string[]; text?: string };
  userId: string;
  username: string;
}
