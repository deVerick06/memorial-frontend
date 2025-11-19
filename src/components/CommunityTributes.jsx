import React from "react";

function CommunityTributes({
    homenagens,
    isEditing,
    currentUser,
    onSubmit,
    onDeleteClick,
    onCardClick
}) {
    return (
<div className="community-tributes">
            

            <section className="tribute-mural-section">
                <h3>Mural de Homenagens</h3>
                <div className="tribute-mural" id="tributeMural">
                    {homenagens.map(homenagem => (
                        <div 
                            className={`tribute-post ${homenagem.image_url ? '' : 'no-image'}`} 
                            key={homenagem.id}
                            style={{ 
                                position: 'relative', 
                                cursor: (isEditing && currentUser && homenagem.owner_id === currentUser.id) ? 'pointer' : 'default' 
                            }}
                            onClick={() => onCardClick(homenagem)}
                        >
                            {isEditing && currentUser && homenagem.owner_id === currentUser.id && (
                                <button
                                    className="btn-remove-card"
                                    onClick={(e) => onDeleteClick(e, homenagem.id)}
                                    style={{ top: '10px', right: '10px' }} 
                                >
                                    &times;
                                </button>
                            )}
                            
                            {homenagem.image_url && (
                                <img 
                                    src={homenagem.image_url} 
                                    alt={`Homenagem de ${homenagem.nome}`} 
                                    className="post-image" 
                                />
                            )}
                            
                            <p className="post-message">"{homenagem.mensagem}"</p>
                            <span className="post-author">- {homenagem.nome}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default CommunityTributes;