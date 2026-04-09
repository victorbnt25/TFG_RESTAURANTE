import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  titulo, 
  mensaje, 
  onConfirm, 
  onCancel, 
  textoConfirmar = "ACEPTAR", 
  textoCancelar = "CANCELAR",
  tipo = "normal" // "normal" o "peligro"
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className={`confirm-modal-window ${tipo}`}>
        <div className="confirm-modal-header">
          <h3>{titulo}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{mensaje}</p>
        </div>
        <div className="confirm-modal-footer">
          <button className="confirm-btn-cancelar" onClick={onCancel}>
            {textoCancelar}
          </button>
          <button className={`confirm-btn-aceptar ${tipo}`} onClick={onConfirm}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
