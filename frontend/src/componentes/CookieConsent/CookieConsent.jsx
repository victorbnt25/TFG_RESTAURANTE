import { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    tecnicas: true,
    analiticas: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = (type) => {
    let finalSettings = settings;
    if (type === 'all') {
      finalSettings = { tecnicas: true, analiticas: true, marketing: true };
    } else if (type === 'basic') {
      finalSettings = { tecnicas: true, analiticas: false, marketing: false };
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(finalSettings));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className={`cookie-consent-card ${showSettings ? 'expanded' : ''}`}>
        {!showSettings ? (
          <>
            <div className="cookie-icon">🍪</div>
            <div className="cookie-content">
              <h3>Aviso de Cookies</h3>
              <p>
                Utilizamos cookies para mejorar tu experiencia. Puedes aceptarlas todas o personalizar tus preferencias.
              </p>
            </div>
            <div className="cookie-actions">
              <button className="btn-cookie-secondary" onClick={() => setShowSettings(true)}> Personalizar </button>
              <button className="btn-cookie-decline" onClick={() => handleSave('basic')}> Solo Técnicas </button>
              <button className="btn-cookie-accept" onClick={() => handleSave('all')}> Aceptar Todas </button>
            </div>
          </>
        ) : (
          <div className="cookie-settings">
            <h3>Configuración de Cookies</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div>
                  <strong>Técnicas (Obligatorias)</strong>
                  <p>Necesarias para el funcionamiento de la web.</p>
                </div>
                <input type="checkbox" checked disabled />
              </div>
              <div className="setting-item">
                <div>
                  <strong>Analíticas</strong>
                  <p>Nos ayudan a entender cómo usas la web.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.analiticas} 
                  onChange={(e) => setSettings({...settings, analiticas: e.target.checked})}
                />
              </div>
              <div className="setting-item">
                <div>
                  <strong>Marketing</strong>
                  <p>Para mostrarte publicidad relevante.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.marketing} 
                  onChange={(e) => setSettings({...settings, marketing: e.target.checked})}
                />
              </div>
            </div>
            <div className="cookie-actions" style={{ marginTop: '20px' }}>
              <button className="btn-cookie-secondary" onClick={() => setShowSettings(false)}> Volver </button>
              <button className="btn-cookie-accept" onClick={() => handleSave('custom')}> Guardar Preferencias </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
