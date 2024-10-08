import { tradeData } from './trades';

type Message = {
  messageId: string;
  timeStamp: string;
  message: string;
};

export const pickRandomTrade = () => {
  const randomIndex = Math.floor(Math.random() * tradeData.length);
  return tradeData[randomIndex];
};

export const generateTrades = () => {
  const message: Message = {
    messageId: Math.random().toString(36).substring(7),
    timeStamp: new Date().toISOString(),
    message: JSON.stringify(pickRandomTrade()),
  };
  return message;
};
