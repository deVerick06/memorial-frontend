import React, { useState } from "react";
import { toast } from "react-toastify";

function TributeCard({ 
    tribute, 
    currentUser, 
    onDeleteClick, 
    onEditClick, 
    onToggleVela, 
    onCommentSubmit 
}) {
    const [isLit, setIsLit] = useState(tribute.velas_acesas_por_mim);
    const [velaCount, setVelaCount] = useState(tribute.total_velas);
    const [comments, setComments] = useState(tribute.comentarios);
    
    const [showComments, setShowComments] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");

    const isOwner = currentUser && tribute.owner_id === currentUser.id;
    const isLoggedIn = !!currentUser; 

    const handleDelete = (e) => onDeleteClick(e, tribute.id);
    const handleEdit = () => onEditClick(tribute);

    const handleVelaClick = async () => {
        if (!isLoggedIn) return toast.warn("Faça login para curtir.");
        
        onToggleVela(tribute.id, isLit);

        setIsLit(!isLit);
        setVelaCount(prev => !isLit ? prev + 1 : prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = newCommentText.trim();

        if (!text) return;
        
        const success = await onCommentSubmit(tribute.id, text);
        
        if (success) {
            setNewCommentText(""); 
        }
    };

    return (
        <div className="tribute-card-feed">
            <div className="tribute-header">
                <div className="user-avatar-placeholder">
                    <span className="material-icons">person</span>
                </div>
                <div className="user-info">
                    <span className="author-name">Amigo do Memorial</span> 
                    <span className="post-date">{new Date(tribute.criado_em).toLocaleDateString()}</span>
                </div>
                
                {isOwner && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px', zIndex: 10 }}>
                        <button 
                            className="btn-action-post" 
                            onClick={handleEdit}
                            style={{ backgroundColor: '#105070', color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
                        >
                            <span className="material-icons" style={{ fontSize: '16px' }}>edit</span>
                        </button>
                        
                        <button 
                            className="btn-action-post" 
                            onClick={handleDelete}
                            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
                        >
                            <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="tribute-content">
                {tribute.image_url && (
                    <img src={tribute.image_url} alt="Homenagem" className="tribute-image-feed" />
                )}
                <div className="tribute-text-content">
                    <p className="tribute-message">"{tribute.mensagem}"</p>
                    <p className="tribute-signature">- {tribute.nome}</p>
                </div>
            </div>

            <div className="tribute-actions">
                <button 
                    className={`action-btn vela-btn ${isLit ? 'lit' : ''}`} 
                    onClick={handleVelaClick}
                >
                    <span className="material-icons">favorite</span> 
                    {isLit ? 'Curtido' : 'Curtir'} <span>({velaCount})</span>
                </button>
                
                <button 
                    className="action-btn comment-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    <span className="material-icons">comment</span> 
                    Comentários <span>({comments.length})</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <span className="comment-author">{c.nome_usuario}: </span>
                                <span>{c.texto}</span>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="no-comments">Seja o primeiro a comentar.</p>}
                    </div>

                    {isLoggedIn && (
                        <form onSubmit={handleSubmit} className="comment-form">
                            <input 
                                type="text" 
                                placeholder="Escreva um comentário..." 
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                            />
                            <button type="submit">Enviar</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default TributeCard;