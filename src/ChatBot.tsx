import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

import './chatbot.css';
import './bubble.css';
import TypingSpinner from './TypingSpiner/TypingSpinner';

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
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!input) return;
    event.preventDefault();
    setMessages((pre) => [...pre, { text: input, user: 'user' }]);
    setInput('');
    setError('');
    try {
      setLoading(true);
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: input,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
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
        setError(error.response.data.error.message);
      } else {
        console.log('Error: ', error.message);
      }
    }
  };

  return (
    <div className="chat-bot">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.user === 'user' ? 'bubble bubble--alt' : 'bubble'
            }
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className={'bubble'}>
            <TypingSpinner />
          </div>
        )}
        {error ? <div className={'bubble'}>{error}</div> : null}
      </div>
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
