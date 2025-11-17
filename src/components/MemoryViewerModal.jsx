import React from "react";

function MemoryViewerModal({ isOpen, onClose, card }) {

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} id="memoryModalOverlay" onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-image-placeholder">
                    {card?.image_url && (
                        <img 
                            src={card.image_url} 
                            alt={card.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} 
                        />
                    )}
                </div>
                <div className="modal-text">
                    <h3>{card?.title}</h3>
                    <p>{card?.description}</p>
                </div>
            </div>
        </div>
    );
}

export default MemoryViewerModal;