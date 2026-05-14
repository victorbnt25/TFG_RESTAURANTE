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

  // Obtenemos el usuario actual
  const user = JSON.parse(sessionStorage.getItem("usuario") || "null");

  // Feedback visual al añadir al carrito
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

  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

    // Función para procesar negritas (**texto**) e imágenes (![alt](url))
    const parseMarkdown = (text) => {
      const parts = [];
      let lastIndex = 0;
      const combinedRegex = /!\[([^\]]*)\]\((.*?)\)|\*\*(.*?)\*\*/g;
      let match;

      while ((match = combinedRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        if (match[1] !== undefined) {
          // Es imagen
          const alt = match[1];
          const url = match[2].startsWith('http') ? match[2] : `http://localhost:8000${match[2]}`;
          parts.push(
            <img 
              key={match.index} 
              src={url} 
              alt={alt} 
              style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px', display: 'block' }} 
            />
          );
        } else if (match[3] !== undefined) {
          // Es negrita
          parts.push(<strong key={match.index}>{match[3]}</strong>);
        }
        lastIndex = combinedRegex.lastIndex;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts;
    };

    // Agrupamos las partes para renderizar texto y luego el carrusel de platos
    const finalElements = [];
    let cardGroup = [];

    parts.forEach((part, i) => {
      if (part.type === 'text') {
        if (cardGroup.length > 0) {
          finalElements.push(<div key={`group-${i}`} className="platos-carousel">{cardGroup}</div>);
          cardGroup = [];
        }
        finalElements.push(
          <div key={i} className="text-content">
            {parseMarkdown(part.value)}
          </div>
        );
      } else {
        const plato = part.value;
        const imgUrl = plato.foto_url ? `http://localhost:8000${plato.foto_url}` : 'https://via.placeholder.com/300x200?text=Comida';
        cardGroup.push(
          <div key={i} className="plato-card-mini">
            <div className="plato-card-image-container">
              <div className="plato-card-img" style={{ backgroundImage: `url(${imgUrl})` }}></div>
            </div>
            <div className="plato-card-body">
              <h4 className="plato-name">{plato.nombre}</h4>
              <p className="plato-price">{plato.precio}€</p>
              <p className="plato-desc-mini">{plato.descripcion}</p>
              <button
                className="btn-chatbot-anadir"
                onClick={() => handleAnadirAlCarrito(plato)}
              >
                + Añadir al carrito
              </button>
            </div>
          </div>
        );
      }
    });

    if (cardGroup.length > 0) {
      finalElements.push(<div key="group-final" className="platos-carousel">{cardGroup}</div>);
    }

    return finalElements;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          history: messages.slice(-10), // Limitamos a los últimos 10 mensajes
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
      {/* Toast de notificación */}
      {toast && (
        <div className="chatbot-toast">
          {toast}
        </div>
      )}

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
                {renderMessageContent(msg.content)}
                
                {/* Botones de acción solo en el último mensaje del bot */}
                {msg.role === 'bot' && index === messages.length - 1 && (
                  <div className="bot-actions">
                    <Link to="/carta" className="btn-chatbot-action outline">
                      Ver Carta 📖
                    </Link>
                    
                    {user ? (
                      <Link to="/reservas" className="btn-chatbot-action">
                        Hacer Reserva 📅
                      </Link>
                    ) : (
                      <Link to="/registrarse" className="btn-chatbot-action">
                        Registrarme para Reservar 🔐
                      </Link>
                    )}
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
