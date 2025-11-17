import React from "react";

function MemoryGallery({
    memoryCards,
    isEditing,
    onToggleEditMode,
    onCardClick,
    onDeleteClick,
    onAddClick,
    currentUser
}) {
    return (
        <>
            <div className="gallery-header"> 
                <div className="gallery-title">
                    <h2>Suas lembranças:</h2>
                    <p>(Principais)</p>
                </div>
                <button className="edit-button" id="editButton" onClick={onToggleEditMode}>{isEditing ? 'Concluir' : 'Editar'}</button> 
            </div>

            <div className="gallery-grid"> 
                {memoryCards.map(card => (
                    <div 
                        className="memory-card"
                        key={card.id}
                        onClick={() => onCardClick(card)}
                        style={{
                            backgroundImage: card.image_url ? `url(${card.image_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!card.image_url && (
                            <div style={{ padding: '10px', color: 'black' }}>
                                <h4 style={{ marginBottom: '5px' }}>{card.title}</h4>
                                <p style={{ fontSize: '0.8em' }}>{card.description.substring(0, 30)}...</p>
                            </div>
                        )}
                        {isEditing && currentUser && card.owner_id === currentUser.id && (
                            <button
                                className="btn-remove-card"
                                onClick={(e) => onDeleteClick(e, card.id)}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}
                {isEditing && memoryCards.length < 8 && (
                    <div className="add-card-button" onClick={onAddClick}>
                        <span>+</span>
                    </div>
                )}
            </div>
        </>
    );
}

export default MemoryGallery;