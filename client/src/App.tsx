import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const GlobalStyle = createGlobalStyle`
  body {
    background: #f5f6fa;
    font-family: 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const ChatWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 70vh;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 24px 24px 12px 24px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  background: #fff;
  border-bottom: 1px solid #f1f3f5;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px 24px 16px;
  background: #f9fafb;
`;

const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  margin: 10px 0;
`;

const Bubble = styled.div<{ isUser: boolean }>`
  background: ${props => (props.isUser ? '#3182f6' : '#fff')};
  color: ${props => (props.isUser ? '#fff' : '#222')};
  padding: 14px 18px;
  border-radius: 18px;
  max-width: 75%;
  font-size: 1.08rem;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(49,130,246,0.06);
  border: ${props => (props.isUser ? 'none' : '1.5px solid #e5e8eb')};
  font-weight: 500;
  word-break: break-word;
`;

const InputBox = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 16px 18px 16px 18px;
  border-top: 1.5px solid #f1f3f5;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: #f1f3f5;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 1.05rem;
  outline: none;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(49,130,246,0.03);
  &:focus {
    background: #fff;
    box-shadow: 0 2px 8px rgba(49,130,246,0.08);
  }
`;

const Button = styled.button`
  background: #3182f6;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0 22px;
  font-size: 1.05rem;
  font-weight: 700;
  height: 44px;
  cursor: pointer;
  transition: background 0.18s;
  box-shadow: 0 1px 4px rgba(49,130,246,0.08);
  &:hover {
    background: #2563eb;
  }
  &:disabled {
    background: #bcdcff;
    color: #fff;
    cursor: not-allowed;
  }
`;

interface MessageType {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! 인하대학교 자유전공융합학부 학과 추천 챗봇입니다.\n\n저는 여러분의 성향, 학습 스타일, 협업 선호, 문제 해결 방식 등 다양한 관점에서 질문을 드리고, 그 답변을 바탕으로 가장 잘 맞는 학과를 추천해드릴 거예요.\n\n너무 구체적인 관심사가 없어도 괜찮으니, 편하게 답변해 주세요!\n\n먼저, 새로운 것을 배울 때 혼자 깊이 파고드는 걸 선호하시나요, 아니면 여러 사람과 함께 토론하며 배우는 걸 더 좋아하시나요?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <GlobalStyle />
      <ChatWrapper>
        <ChatContainer>
          <ChatHeader>인하대 자유전공 학과 추천 챗봇</ChatHeader>
          <Messages>
            {messages.map((msg, idx) => (
              <Message key={idx} isUser={msg.role === 'user'}>
                <Bubble isUser={msg.role === 'user'}>{msg.content}</Bubble>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </Messages>
          <InputBox onSubmit={handleSend}>
            <Input
              type="text"
              placeholder="메시지를 입력하세요"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? '...' : '전송'}
            </Button>
          </InputBox>
        </ChatContainer>
      </ChatWrapper>
    </>
  );
}

export default App;
