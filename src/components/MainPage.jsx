import React, { useState, useEffect } from "react";
import './MainPage.css'
import { data, Link } from "react-router-dom";

function MainPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);

    const [homenagens, setHomenagens] = useState([]);

    const [memoryCards, setMemoryCards] = useState([]);

    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            document.body.classList.add('logged-in');
        }

        const searchHomenagens = () => {
            fetch('http://127.0.0.1:8000/homenagens/')
                .then(response => response.json())
                .then(data => {
                    setHomenagens(data);
                })
                .catch(error => console.error("Erro ao buscar homenagens:", error));
        };

        const searchMemory = () => {
            fetch('http://127.0.0.1:8000/memorias/')
                .then(response => response.json())
                .then(data => setMemoryCards(data))
                .catch(error => console.error("Erro ao buscar memorias:", error));
        };

        searchHomenagens();
        searchMemory();
    }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.loginEmail.value;
        const password = form.loginPassword.value;

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        fetch('http://127.0.0.1:8000/token', {
            method: 'POST',
            headers: {

            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.detail) });
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.access_token);

            setIsLoggedIn(true);
            document.body.classList.add('logged-in');
            setIsLoginModalOpen(false);
            form.reset();
        })
        .catch(error => {
            console.error("Erro ao fazer login:", error);
            alert(`Erro ao logar: ${error.message}`);
        })
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        document.body.classList.remove('logged-in');
        document.body.classList.remove('edit-mode');
        closeUserDropdown();
        setIsEditing(false);
    };
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openMemoryModal = (CardData) => {
        if (isEditing) return;

        setSelectedCard(CardData);
        setIsMemoryModalOpen(true);
    };
    const closeMemoryModal = () => setIsMemoryModalOpen(false);
    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
    const closeUserDropdown = () => setIsUserDropdownOpen(false);

    const openAddMemoryModal = () => setIsAddMemoryModalOpen(true);
    const closeAddMemoryModal = () => setIsAddMemoryModalOpen(false)

    const toggleEditMode = () => {
        if (!isLoggedIn) return;

        const nextIsEditing = !isEditing;
        setIsEditing(nextIsEditing);

        document.body.classList.toggle('edit-mode', nextIsEditing);

        setIsMemoryModalOpen(false);
        setIsUserDropdownOpen(false);
    };
    useEffect (() => {
        if (!isUserDropdownOpen) return;

        const handleClickOutside = (event) => {
            const profileButton = document.getElementById('userProfileButton');
            const dropdown = document.getElementById('userDropdown');
            if (profileButton && !profileButton.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
                closeUserDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserDropdownOpen]);

    const removeCard = (event, cardIdToRemove) => {
        event.stopPropagation();
        setMemoryCards(currentCards => currentCards.filter(card => card.id !== cardIdToRemove));
    };

    const handleAddMemorySubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const title = form.newMemoryTitle.value;
        const description = form.newMemoryDescription.value;
        //const file = form.newMemoryImage.files[0];

        if (!title || !description) {
            alert("Título e Descrição são obrigatórios.");
            return;
        }

        const newMemory = {
            title: title,
            description: description
        };
        fetch('http://127.0.0.1:8000/memorias/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMemory),
        })
        .then(response => response.json())
        .then(memoryCreated => {
            setMemoryCards(cardsAtuais => [...cardsAtuais, memoryCreated]);
            closeAddMemoryModal();
            form.reset();
        })
        .catch(error => {
            console.error("Erro ao criar memoria:", error);
            alert("Ops, algo deu errado ao salvar sua memoria");
        });
    };

    const handleSignup = (event) => {
        event.preventDefault();
        const form = event.target;
        const nome = form.signupName.value;
        const email = form.signupEmail.value;
        const password = form.signupPassword.value;

        const newUser = {
            nome: nome,
            email: email,
            password: password
        }

        fetch('http://127.0.0.1:8000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.detail) });
            }
            return response.json();
        })
        .then(userCreated => {
            alert(`Usuário ${userCreated.nome} criado com sucesso! Por favor, faça o login.`);
            form.reset();
            setShowSignup(false);
        })
        .catch(error => {
            console.error("Erro ao criar usuário:", error);
            alert(`Erro ao cadastrar: ${error.message}`);
        });
    };


    const handleTributeSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.tributeName.value;
        const message = form.tributeMessage.value;

        const newHomenagem = {
            nome: name,
            mensagem: message
        };

        fetch('http://127.0.0.1:8000/homenagens/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newHomenagem),
        })
        .then(response => response.json())
        .then(createdHomenagem => {
            setHomenagens(homenagensAtuais => [createdHomenagem, ...homenagensAtuais]);
            alert(`Obrigado, ${name}! Sua homenagem foi recebida.`);
            form.reset();
        })
        .catch(error => {
            console.error("Erro ao criar homenagem:", error);
            alert("Ops, algo deu errado. Tente novamente.")
        })
    };

    return (
        <>
            <header className="main-header">
                <h1><Link to="/lembrancas">Lembranças</Link></h1>
                <div className={`user-profile ${isUserDropdownOpen ? 'open' : ''}`} id="userProfileButton" onClick={isLoggedIn ? toggleUserDropdown : openLoginModal}>
                    <div className="profile-pic"></div>
                    <span className="profile-name">{isLoggedIn ? "Lulu" : "Visitante"}</span>
                    <span className="dropdown-arrow"></span>
                </div>
                <div className={`user-dropdown ${isUserDropdownOpen ? 'open' : ''}`} id="userDropdown">
                    <button className="dropdown-btn" id="logoutButton" onClick={handleLogout}>Sair</button>
                </div>
            </header>
            <main className="content">
                {!isLoggedIn && (
                    <section className="login-prompt logged-out-item">
                        <h2>Bem-vindo ao Memorial</h2>
                        <p>Faça login para ver e adicionar suas lembranças.</p>
                        <button className="btn-login-prompt" id="loginPromptButton" onClick={openLoginModal}>Entrar</button>
                    </section>
                )}
                {isLoggedIn && (
                    <>
                        <section className="tribute-section">
                            <div className="tribute-image"></div>
                            <div className="tribute-text">
                                <h2>Para Sempre em Nossos Corações</h2>
                                <p>
                                    "Algumas pessoas tornam nossas vidas melhores apenas por fazerem parte dela. 
                                    Sua risada era música e sua amizade, um presente. Este espaço é dedicado a 
                                    celebrar cada momento que tivemos a sorte de compartilhar com você."
                                </p>
                                <p className="signature">- Seus amigos</p>
                            </div>
                        </section>
                        
                        <div className="gallery-header"> 
                            <div className="gallery-title">
                                <h2>Suas lembranças:</h2>
                                <p>(Principais)</p>
                            </div>
                            <button className="edit-button" id="editButton" onClick={toggleEditMode}>{isEditing ? 'Concluir' : 'Editar'}</button> 
                        </div>
                        
                        <div className="gallery-grid"> 
                            {memoryCards.map(card => (
                                <div 
                                    className="memory-card"
                                    key={card.id}
                                    onClick={() => openMemoryModal(card)}
                                    style={{
                                        backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {!card.imageUrl && (
                                        <div style={{ padding: '10px', color: 'black' }}>
                                            <h4 style={{ marginBottom: '5px' }}>{card.title}</h4>
                                            <p style={{ fontSize: '0.8em' }}>{card.description.substring(0, 30)}...</p>
                                        </div>
                                    )}

                                    <button
                                        className="btn-remove-card"
                                        onClick={(e) => removeCard(e, card.id)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {isEditing && memoryCards.length < 8 && (
                                <div className="add-card-button" onClick={openAddMemoryModal}>
                                    <span>+</span>
                                </div>
                            )}
                        </div>

                        <div className=" community-tributes">
                            <section className="tribute-form-section">
                                <h2>Compartilhe sua história com a Lulu</h2>
                                <p>Sua lembrança aparecerá no mural abaixo para que todos possam ver.</p>

                                <form id="tributeForm" onSubmit={handleTributeSubmit}>
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
                                        <div className="tribute-post no-image" key={homenagem.id}>
                                            <p className="post-message">"{homenagem.mensagem}"</p>
                                            <span className="post-author">- {homenagem.nome}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </main>
            
            <div className={`modal-overlay ${isMemoryModalOpen ? 'active' : ''}`} id="memoryModalOverlay" onClick={(e) => {if (e.target === e.currentTarget) closeMemoryModal();}}>
                <div className="modal-content">
                    <button className="modal-close" onClick={closeMemoryModal}>&times;</button>
                    <div className="modal-image-placeholder">
                        {selectedCard?.imageUrl && (
                            <img 
                                src={selectedCard.imageUrl} 
                                alt={selectedCard.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} 
                            />
                        )}
                    </div>
                    <div className="modal-text">
                        <h3>{selectedCard?.title}</h3>
                        <p>{selectedCard?.description}</p>
                    </div>
                    </div>
            </div>
            
            <div className={`modal-overlay ${isLoginModalOpen ? 'active' : ''}`} id="loginModalOverlay" onClick={(e) => { if (e.target === e.currentTarget) closeLoginModal(); }}>
                <div className={`modal-content login-modal ${showSignup ? 'show-signup' : ''}`} id="authModalContent">
                    <button className="modal-close" id="loginModalClose" onClick={closeLoginModal}>&times;</button>
                    <div className="login-view">
                        <h3>Acesse o Memorial</h3>
                        <form id="loginForm" onSubmit={handleLogin}>
                            <div className="form-group-modal">
                                <label htmlFor="loginEmail">Email</label>
                                <input type="email" id="loginEmail" placeholder="seuemail@exemplo.com" required />
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="loginPassword">Senha</label>
                                <input type="password" id="loginPassword" placeholder="Sua senha" required />
                            </div>
                            <button type="submit" className="btn-submit auth-btn">Entrar</button>
                        </form>
                        <div className="divider">ou</div>
                        <button className="google-login-btn" id="googleLoginButton" onClick={handleLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C42.21 36.6 46.98 31.05 46.98 24.55z"/>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                <path fill="none" d="M0 0h48v48H0z"/>
                            </svg>
                            <span>Entrar com Google</span>
                        </button>
                        <p className="modal-toggle-link">
                            Não tem uma conta? <span id="showSignupLink" onClick={() => setShowSignup(true)}>Cadastre-se</span>
                        </p>
                    </div>
                    <div className="signup-view">
                        <h3>Crie sua Conta</h3>
                        <form id="signupForm" onSubmit={handleSignup}>
                            <div className="form-group-modal">
                                <label htmlFor="signupName">Seu Nome</label>
                                <input type="text" id="signupName" placeholder="Como você quer ser chamado" required />
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="signupEmail">Email</label>
                                <input type="email" id="signupEmail" placeholder="seuemail@exemplo.com" required />
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="signupPassword">Senha</label>
                                <input type="password" id="signupPassword" placeholder="Crie uma senha forte" required />
                            </div>
                            <button type="submit" className="btn-submit auth-btn">Cadastrar</button>
                        </form>
                        <p className="modal-toggle-link">
                            Já tem uma conta? <span id="showLoginLink" onClick={() => setShowSignup(false)}>Entre</span>
                        </p>
                    </div>
                </div>
            </div>
            <div
                className={`modal-overlay ${isAddMemoryModalOpen ? 'active' : ''}`}
                id="addMemoryModalOverlay"
                onClick={(e) => { if (e.target === e.currentTarget) closeAddMemoryModal(); }}
            >
                <div className="modal-content">
                    <button className="modal-close" onClick={closeAddMemoryModal}>&times;</button>
                    <h3>Adicionar Nova Lembrança</h3>

                    <form id="addMemoryForm" onSubmit={handleAddMemorySubmit}>
                        <div className="form-group-modal">
                            <label htmlFor="newMemoryTitle">Título</label>
                            <input type="text" id="newMemoryTitle" placeholder="Um título para este momento" required />
                        </div>
                        <div className="form-group-modal">
                            <label htmlFor="newMemoryDescription">Descrição</label>
                            <textarea id="newMemoryDescription" rows="4" placeholder="Descreva a lembrança..."></textarea>
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
        </>
    );
}

export default MainPage;