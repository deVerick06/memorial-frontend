import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import TributeCard from "./TributeCard.jsx";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import TributeForm from "./TributeForm.jsx";
import EditTributeModal from "./EditTributeModal.jsx";
import './TributesPage.css'

function TributesPage() {
    const [homenagens, setHomenagens] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 

    const [isFloatingTributeModalOpen, setIsFloatingTributeModalOpen] = useState(false);
    
    const navigate = useNavigate();

    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/lembrancas'); 
    };

    const handleOpenLogin = () => navigate('/lembrancas');
    
    const closeUserDropdown = () => setIsUserDropdownOpen(false); 
    useEffect(() => {
    }, [isUserDropdownOpen]);

    const handleHomenagemCardClick = (homenagem) => {
        if (isEditing && currentUser && homenagem.owner_id === currentUser.id) {
            setHomenagemToEdit(homenagem);
            setEditHomenagemName(homenagem.nome);
            setEditHomenagemMessage(homenagem.mensagem);
            setIsHomenagemModalOpen(true);
        }
    };

    const handleTributeDelete = (event, tributeIdToRemove) => {
        event.stopPropagation();
        const token = localStorage.getItem('token');
    
        if (!window.confirm("Tem certeza que quer apagar esta homenagem?")) {
            return;
        }
    
        fetch(`http://127.0.0.1:8000/homenagens/${tributeIdToRemove}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                setHomenagens(currentTributes => currentTributes.filter(tribute => tribute.id !== tributeIdToRemove));
                toast.success("Homenagem apagada!");
            } else {
                toast.warn("Não foi possível apagar a homenagem.");
                console.error("Erro ao deletar:", response.status);
            }
        })
        .catch(error => {
            console.error("Erro ao deletar homenagem:", error);
            toast.error("Ops, algo deu errado.");
        });
    };

    const handleTributeSubmit = (event) => {
            event.preventDefault();
            const form = event.target;
            const name = form.tributeName.value;
            const message = form.tributeMessage.value;
            const file = form.tributeImage.files[0];
            const token = localStorage.getItem('token');
    
            const saveTributeData = (imageUrl) => {
                const newHomenagem = {
                    nome: name,
                    mensagem: message,
                    image_url: imageUrl
                };
    
                fetch('http://127.0.0.1:8000/homenagens/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newHomenagem),
                })
                .then(response => response.json())
                .then(createdHomenagem => {
                    setHomenagens(homenagensAtuais => [createdHomenagem, ...homenagensAtuais]);
                    toast.success(`Obrigado, ${name}! Sua homenagem foi recebida.`);
                    form.reset();
                })
                .catch(error => {
                    console.error("Erro ao criar homenagem:", error);
                    toast.error("Ops, algo deu errado. Tente novamente.")
                });
            };
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
    
                fetch('http://127.0.0.1:8000/upload-image/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(uploadData => {
                    saveTributeData(uploadData.image_url);
                })
                .catch(error => {
                    console.error("Erro ao fazer upload da imagem:", error);
                    toast.error("Ops, algo deu errado com o upload da sua foto.");
                });
            } else {
                saveTributeData(null);
            }
    };

    const updateVelaCount = (homenagemId, isLiking) => {
        setHomenagens(currentHomenagens => currentHomenagens.map(h => {
            if (h.id === homenagemId) {
                return {
                    ...h,
                    total_velas: h.total_velas + (isLiking ? 1 : -1),
                    velas_acesas_por_mim: isLiking
                };
            }
            return h;
        }));
    };

    const handleToggleVela = async (homenagemId, currentlyLit) => {
        const token = localStorage.getItem('token');
        if (!token) return toast.warn("Você precisa estar logado para curtir.");

        updateVelaCount(homenagemId, !currentlyLit);

        try {
            const response = await fetch(`http://127.0.0.1:8000/homenagens/${homenagemId}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                updateVelaCount(homenagemId, currentlyLit);
                throw new Error("Erro de servidor ao curtir");
            }
        } catch (error) {
            updateVelaCount(homenagemId, currentlyLit);
            toast.error("Erro de conexão ao curtir.");
        }
    };

    const handleSubmitComment = async (homenagemId, texto) => {
        const token = localStorage.getItem('token');
        if (!token) return toast.warn("Faça login para comentar.");

        try {
            const response = await fetch(`http://127.0.0.1:8000/homenagens/${homenagemId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: texto })
            });
            if (response.ok) {
                const commentData = await response.json();

                setHomenagens(currentHomenagens => currentHomenagens.map(h => {
                    if (h.id === homenagemId) {
                        return { ...h, comentarios: [...h.comentarios, commentData] };
                    }
                    return h;
                }));
                return true;
            } else {
                throw new Error("Falha ao salvar comentário.");
            }
        } catch (error) {
            toast.error("Erro ao enviar comentário.");
            return false;
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            setIsLoggedIn(true);
            
            fetch('http://127.0.0.1:8000/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setCurrentUser(data));

            fetch('http://127.00.0.1:8000/homenagens/', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error('Falha homenagens'); 
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setHomenagens(data);
                else setHomenagens([]);
            })
            .catch(err => {
                console.error("Erro ao carregar feed:", err);
                setHomenagens([]);
                toast.error("Não foi possível carregar o feed. Tente logar novamente.");
            });
        } else {
            setHomenagens([]);
            toast.warn("Você precisa estar logado para ver o feed completo.");
        }
    }, []);


    return (
        <>
            <ToastContainer position="top-right" theme="colored" />
            
            <Header 
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                isDropdownOpen={isUserDropdownOpen}
                onToggleDropdown={toggleUserDropdown}
                onOpenLogin={handleOpenLogin}
                onLogout={handleLogout}
            />

            <main className="content" style={{ maxWidth: "700px", margin: "0 auto", padding: "30px 20px" }}>
                
                <h1 style={{color: "white", textAlign: "center", marginBottom: "30px", fontSize: "2rem"}}>
                    Mural da Comunidade
                </h1>

                
                {homenagens.map(h => (
                    <TributeCard 
                        key={h.id} 
                        tribute={h} 
                        currentUser={currentUser} 
                        onDeleteClick={handleTributeDelete}
                        onEditClick={handleHomenagemCardClick}

                        onToggleVela={handleToggleVela}
                        onCommentSubmit={handleSubmitComment}
                    />
                ))}
                
                {homenagens.length === 0 && (
                    <div style={{textAlign: "center", color: "#ccc", marginTop: "50px"}}>
                        <p>Ainda não há homenagens neste mural.</p>
                        <p>Faça login ou crie a primeira!</p>
                    </div>
                )}
            </main>
            {isLoggedIn && (
                <button 
                    className="floating-add-btn" 
                    onClick={() => setIsFloatingTributeModalOpen(true)}
                >
                    +
                </button>
            )}
            {isLoggedIn && (
                <div
                    className={`modal-overlay ${isFloatingTributeModalOpen ? 'active' : ''}`}
                    onClick={(e) => { if (e.target === e.currentTarget) setIsFloatingTributeModalOpen(false); }}
                >
                    <div className="modal-content" style={{maxWidth: '800px'}}>
                        <button className="modal-close" onClick={() => setIsFloatingTributeModalOpen(false)}>&times;</button>
                        <TributeForm onSubmit={handleTributeSubmit} isModal={true} /> 
                    </div>
                </div>
            )}
        </>
    );
}

export default TributesPage;