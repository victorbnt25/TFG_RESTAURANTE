import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import './Chatbot.css';

const saludos = [
  '¡Hola! 🤖 Soy tu asistente virtual. Dime qué necesitas o, si lo prefieres, puedes consultar la carta o gestionar una nueva reserva.',
  '¡Bienvenido! 🍔 ¿Tienes hambre? Puedes echar un vistazo a nuestra carta o reservar tu mesa ahora mismo.',
  '¡Hola! ✨ ¿En qué puedo ayudarte? Recuerda que puedes ver nuestro menú digital o pedir una mesa para hoy.',
  '¡Ey! 👋 Bienvenido a Sons of Burger. ¿Te apetece ver la carta o prefieres que te reservemos sitio?'
];

const quickSuggestions = [
  { label: '🍔 Recomiéndame algo', query: '¿Qué hamburguesa me recomiendas hoy?' },
  { label: '📅 Reservar mesa', query: 'Quiero hacer una reserva' },
  { label: '📍 ¿Dónde estáis?', query: '¿Cuál es vuestra ubicación y horario?' }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: saludos[Math.floor(Math.random() * saludos.length)] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const mostrarToast = (texto) => {
    setToast(texto);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAnadirAlCarrito = (plato) => {
    agregarAlCarrito({
      id: plato.id,
      nombre: plato.nombre,
      precio: Number(plato.precio),
      foto_url: plato.foto_url || '',
    });
    mostrarToast(`✅ ${plato.nombre} añadido al carrito`);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const renderMessageContent = (content) => {
    const platoRegex = /\[PLATO:({.*?})\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = platoRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
      }
      try {
        parts.push({ type: 'card', value: JSON.parse(match[1]) });
      } catch (e) {
        parts.push({ type: 'text', value: match[0] });
      }
      lastIndex = platoRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.substring(lastIndex) });
    }

    const parseMarkdown = (text) => {
      const result = [];
      let li = 0;
      const re = /\*\*(.*?)\*\*/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m.index > li) result.push(text.substring(li, m.index));
        result.push(<strong key={m.index}>{m[1]}</strong>);
        li = re.lastIndex;
      }
      if (li < text.length) result.push(text.substring(li));
      return result;
    };

    const finalElements = [];
    let cardGroup = [];

    parts.forEach((part, i) => {
      if (part.type === 'text') {
        if (cardGroup.length > 0) {
          finalElements.push(<div key={`g-${i}`} className="platos-carousel">{cardGroup}</div>);
          cardGroup = [];
        }
        finalElements.push(
          <div key={i} className="text-content">{parseMarkdown(part.value)}</div>
        );
      } else {
        const plato = part.value;
        const imgUrl = plato.foto_url
          ? `http://localhost:8000${plato.foto_url}`
          : 'https://via.placeholder.com/300x200?text=Comida';
        cardGroup.push(
          <div key={i} className="plato-card-mini">
            <div className="plato-card-image-container">
              <div className="plato-card-img" style={{ backgroundImage: `url(${imgUrl})` }}></div>
            </div>
            <div className="plato-card-body">
              <h4 className="plato-name">{plato.nombre}</h4>
              <p className="plato-price">{plato.precio}€</p>
              <p className="plato-desc-mini">{plato.descripcion}</p>
              <button className="btn-chatbot-anadir" onClick={() => handleAnadirAlCarrito(plato)}>
                + Añadir al carrito
              </button>
            </div>
          </div>
        );
      }
    });

    if (cardGroup.length > 0) {
      finalElements.push(<div key="gf" className="platos-carousel">{cardGroup}</div>);
    }
    return finalElements;
  };

  const handleSendMessage = async (e, directQuery = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const messageText = directQuery || inputValue;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInputValue('');
    setIsTyping(true);

    const currentUser = JSON.parse(sessionStorage.getItem('usuario') || 'null');

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history: messages.slice(-10), user: currentUser }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (query) => {
    setInputValue(query);
    setTimeout(() => {
      handleSendMessage({ preventDefault: () => {} }, query);
    }, 100);
  };

  const currentUser = JSON.parse(sessionStorage.getItem('usuario') || 'null');

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {toast && <div className="chatbot-toast">{toast}</div>}

      <button className="chatbot-bubble" onClick={() => setIsOpen(o => !o)}>
        {isOpen ? '✕' : '💬'}
      </button>

      <div className="chatbot-window">
        <div className="chatbot-header">
          <div>
            <h3>Asistente Virtual</h3>
            <p>Restaurante en línea</p>
          </div>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                {renderMessageContent(msg.content)}
                {msg.role === 'bot' && index === messages.length - 1 && (
                  <div className="bot-actions">
                    <Link to="/carta" className="btn-chatbot-action outline">Ver Carta 📖</Link>
                    {currentUser
                      ? <Link to="/reservas" className="btn-chatbot-action">Hacer Reserva 📅</Link>
                      : <Link to="/registrarse" className="btn-chatbot-action">Registrarme 🔐</Link>
                    }
                  </div>
                )}
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

        <div className="chatbot-quick-suggestions">
          {quickSuggestions.map((s, idx) => (
            <button key={idx} className="quick-suggestion-btn"
              onClick={() => handleQuickSuggestion(s.query)} disabled={isTyping}>
              {s.label}
            </button>
          ))}
        </div>

        <form className="chatbot-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" disabled={isTyping}>➤</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
