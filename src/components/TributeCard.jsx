import React, { useState } from "react";
import { toast } from "react-toastify";

function TributeCard({ tribute, currentUser }) {
    const [isLit, setIsLit] = useState(tribute.velas_acesas_por_mim);
    const [velaCount, setVelaCount] = useState(tribute.total_velas);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(tribute.comentarios);
    const [newComment, setNewComment] = useState("");

    const handleToggleVela = async () => {
        const token = localStorage.getItem('token');
        if (!token) return toast.warn("Faça login para acender uma vela.");

        const newStatus = !isLit;
        setIsLit(newStatus);
        setVelaCount(prev => newStatus ? prev + 1 : prev - 1);

        try {
            await fetch(`http://127.0.0.1:8000/homenagens/${tribute.id}/vela`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            setIsLit(!newStatus);
            setVelaCount(prev => !newStatus ? prev + 1 : prev - 1);
            toast.error("Erro ao conectar com o servidor.");
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!newComment.trim()) return;
        
        try {
            const response = await fetch(`http:127.0.0.1:8000/homenagens/${tribute.id}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: newComment })
            });

            if (response.ok) {
                const commentData = await response.json();
                setComments([...comments, commentData]);
                setNewComment("");
            }
        } catch (error) {
            toast.error("Erro ao comentar.")
        }
    };

    return (
        <div className="tribute-card-feed">
            <div className="tribute-header">
                <div className="user-avatar-placeholder">Avatar</div>
                <div className="user-info">
                    <span className="author-name">Amigo do Memorial</span>
                    <span className="post-date">{new Date(tribute.criado_em).toLocaleDateString()}</span>
                </div>
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
                    onClick={handleToggleVela}
                >
                    Vela {isLit ? 'Acesa' : 'Acender Vela'} <span>({velaCount})</span>
                </button>

                <button
                    className="action-btn comment-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    Comentários <span>({comments.length})</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <span className="comment-author">{c.nome_usuario}</span>
                                <span>{c.texto}</span>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="no-comments">Seja o primeiro a comentar</p>}
                    </div>

                    <form onSubmit={handleSubmitComment} className="comment-form">
                        <input 
                            type="text" 
                            placeholder="Escreva um comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!currentUser}
                        />
                        <button type="submit" disabled={!currentUser}>Enviar</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default TributeCard;