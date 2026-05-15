import { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ tecnicas: true, analiticas: true, marketing: false });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = (type) => {
    let s = settings;
    if (type === 'all')   s = { tecnicas: true, analiticas: true, marketing: true };
    if (type === 'basic') s = { tecnicas: true, analiticas: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(s));
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
              <p>Utilizamos cookies para mejorar tu experiencia.</p>
            </div>
            <div className="cookie-actions">
              <button className="btn-cookie-secondary" onClick={() => setShowSettings(true)}>Personalizar</button>
              <button className="btn-cookie-decline" onClick={() => handleSave('basic')}>Solo Técnicas</button>
              <button className="btn-cookie-accept" onClick={() => handleSave('all')}>Aceptar Todas</button>
            </div>
          </>
        ) : (
          <div className="cookie-settings">
            <h3>Configuración de Cookies</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div><strong>Técnicas (Obligatorias)</strong><p>Necesarias para el funcionamiento.</p></div>
                <input type="checkbox" checked disabled />
              </div>
              <div className="setting-item">
                <div><strong>Analíticas</strong><p>Nos ayudan a entender el uso.</p></div>
                <input type="checkbox" checked={settings.analiticas}
                  onChange={(e) => setSettings({ ...settings, analiticas: e.target.checked })} />
              </div>
              <div className="setting-item">
                <div><strong>Marketing</strong><p>Para publicidad relevante.</p></div>
                <input type="checkbox" checked={settings.marketing}
                  onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })} />
              </div>
            </div>
            <div className="cookie-actions" style={{ marginTop: '16px' }}>
              <button className="btn-cookie-secondary" onClick={() => setShowSettings(false)}>Volver</button>
              <button className="btn-cookie-accept" onClick={() => handleSave('custom')}>Guardar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
