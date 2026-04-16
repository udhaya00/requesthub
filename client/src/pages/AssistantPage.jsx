import { useState } from "react";

import { sendChatMessage } from "../api/chatApi";
import PageContainer from "../components/PageContainer.jsx";

const starterMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "I can help with request creation, status questions, workflow rules, and exports. Ask me anything about Smart Request Hub.",
  },
];

const AssistantPage = () => {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) {
      return;
    }

    const nextUserMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(messageText);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
          suggestions: data.suggestions,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "I hit a problem reaching the assistant service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="section-heading">
        <div>
          <span className="eyebrow">AI Assistant</span>
          <h1>Ask for help like you would in ChatGPT</h1>
          <p>Keyword-driven guidance for request creation, FAQs, and status support.</p>
        </div>
      </div>

      <section className="chat-card card">
        <div className="chat-thread">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble message-bubble-${message.role}`}
            >
              <span className="eyebrow">{message.role}</span>
              <p>{message.content}</p>
              {message.suggestions && (
                <div className="suggestion-row">
                  {message.suggestions.map((suggestion) => (
                    <button
                      className="ghost-button"
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="message-bubble message-bubble-assistant">Thinking...</div>}
        </div>

        <form
          className="chat-composer"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <textarea
            rows="3"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about workflow, request status, exports, or how to submit a request"
          />
          <button className="primary-button" type="submit" disabled={loading}>
            Send
          </button>
        </form>
      </section>
    </PageContainer>
  );
};

export default AssistantPage;

