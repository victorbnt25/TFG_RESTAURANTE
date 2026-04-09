import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: '¡Hola! 🤖 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const user = JSON.parse(localStorage.getItem("usuario") || "null");
    
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          history: messages, // Enviamos todo el historial
          user: user         // Enviamos los datos del usuario si está identificado
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);
      } else {
        throw new Error('Sin respuesta del bot');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'bot', content: 'Lo siento, ha habido un problema de conexión. ¿Puedes intentarlo más tarde?' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Burbuja flotante */}
      <button className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Ventana de Chat */}
      <div className="chatbot-window">
        <div className="chatbot-header">
          <h3>Asistente Virtual</h3>
          <p>Restaurante en línea</p>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message-bubble typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" disabled={isTyping}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
