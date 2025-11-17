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
            <section className="tribute-form-section">
                <h2>Compartilhe sua história com a Lulu</h2>
                <p>Sua lembrança aparecerá no mural abaixo para que todos possam ver.</p>

                <form id="tributeForm" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="tributeName">Seu Nome</label>
                        <input type="text" id="tributeName" placeholder="Como você gostária de ser lembrado?" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tributeImage">Anexar uma Foto (Opcional)</label>
                        <input type="file" id="tributeImage" accept="image/png, image/jpeg" />
                        <label htmlFor="tributeImage" className="file-input-label">
                            <span>Escolher arquivo...</span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tributeMessage">Sua Lembrança</label>
                        <textarea id="tributeMessage" rows="5" placeholder="Conte um momento especial, uma piada interna, ou uma palavra de carinho..." required></textarea>
                    </div>
                    <button type="submit" className="btn-submit-tribute">Enviar Homenagem</button>
                </form>
            </section>

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