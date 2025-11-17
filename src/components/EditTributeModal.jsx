import React from "react";

function EditTributeModal({
    isOpen,
    onClose,
    name,
    setName,
    message,
    setMessage,
    onSubmit
}) {
    if (!isOpen) return null;

    return (
        <div
            className={`modal-overlay ${isOpen ? 'active' : ''}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3>Editar Homenagem</h3>

                <form id="editHomenagemForm" onSubmit={onSubmit}>
                    <div className="form-group-modal">
                        <label htmlFor="editHomenagemName">Nome</label>
                        <input 
                            type="text" 
                            id="editHomenagemName"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group-modal">
                        <label htmlFor="editHomenagemMessage">Mensagem</label>
                        <textarea 
                            id="editHomenagemMessage"
                            rows="4"
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-submit auth-btn">Salvar Alterações</button>
                </form>
            </div>
        </div>
    );
}

export default EditTributeModal;