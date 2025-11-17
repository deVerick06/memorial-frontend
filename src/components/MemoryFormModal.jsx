import React from "react";

function MemoryFormModal({
    isOpen,
    onClose,
    isEditing,
    title,
    setTitle,
    description,
    setDescription,
    onSubmit
}) {
    if (!isOpen) return null;

    return (
        <div
            className={`modal-overlay ${isOpen ? 'active' : ''}`}
            id="addMemoryModalOverlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3>{isEditing ? 'Editar Lembrança' : 'Adicionar Nova Lembrança'}</h3>
                <form id="addMemoryForm" onSubmit={onSubmit}>
                    <div className="form-group-modal">
                        <label htmlFor="newMemoryTitle">Título</label>
                        <input 
                            type="text"
                            id="newMemoryTitle"
                            placeholder="Um título para este momento"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group-modal">
                        <label htmlFor="newMemoryDescription">Descrição</label>
                        <textarea
                            id="newMemoryDescription" 
                            rows="4" 
                            placeholder="Descreva a lembrança..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group-modal">
                        <label htmlFor="newMemoryImage">Foto (Opcional)</label>
                        <input type="file" id="newMemoryImage" accept="image/png, image/jpeg" />
                        <label htmlFor="newMemoryImage" className="file-input-label">
                            <span>Escolher arquivo...</span>
                        </label>
                    </div>
                    <button type="submit" className="btn-submit auth-btn">Salvar Lembrança</button>
                </form>
            </div>
        </div>
    );
}

export default MemoryFormModal;