import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

import './chatbot.css';

interface Message {
  user: 'user' | 'bot';
  text: string;
}
const API_KEY = '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';

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);
const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages((pre) => [...pre, { text: input, user: 'user' }]);
    setInput('');
    try {
      setLoading(true);
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: input,
      });
      setLoading(false);
      console.log(completion);
      setMessages((pre) => [
        ...pre,
        { text: completion.data.choices[0].text, user: 'bot' },
      ]);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="chat-bot">
      <ul className="messages">
        {messages.map((message, index) => (
          <li key={index} className={message.user === 'user' ? 'right' : ''}>
            {message.text}
          </li>
        ))}
        {loading && (
          <div className="loading-indicator">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        )}
      </ul>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
