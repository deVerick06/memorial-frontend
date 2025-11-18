import React, { useState, useEffect } from "react";
import './MainPage.css'
import AuthModal from "./AuthModal.jsx";
import MemoryFormModal from "./MemoryFormModal.jsx";
import MemoryViewerModal from "./MemoryViewerModal.jsx";
import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import LoginPrompt from "./LoginPrompt.jsx";
import MemoryGallery from "./MemoryGallery.jsx";
import CommunityTributes from "./CommunityTributes.jsx";
import EditTributeModal from "./EditTributeModal.jsx";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

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

    const [cardToEdit, setCardToEdit] = useState(null);
    const [editMemoryTitle, setEditMemoryTitle] = useState("");
    const [editMemoryDescription, setEditMemoryDescription] = useState("");

    const [isHomenagemModalOpen, setIsHomenagemModalOpen] = useState(false);
    const [homenagemToEdit, setHomenagemToEdit] = useState(null);
    const [editHomenagemName, setEditHomenagemName] = useState("");
    const [editHomenagemMessage, setEditHomenagemMessage] = useState("");

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        let isTokenInvalid = false;

        const handleAuthError = (error) => {
            console.error("Erro de autenticação:", error.message);
            if (!isTokenInvalid) {
                isTokenInvalid = true;
                handleLogout();
            }
        };
        if (token) {
            setIsLoggedIn(true);
            document.body.classList.add('logged-in');

            fetchUserData(token)

            fetch('http://127.0.0.1:8000/homenagens/', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => { 
                if (response.status === 401) throw new Error('401 Unauthorized');
                if (!response.ok) throw new Error('Server Error');
                return response.json();
            })
            .then(data => setHomenagens(data))
            .catch(error => {
                setHomenagens([]);
                if (error.message === '401 Unauthorized') {
                    handleAuthError(error);
                }
            });

            fetch('http://127.0.0.1:8000/memorias/', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                if (response.status === 401) throw new Error('401 Unauthorized');
                if (!response.ok) throw new Error('Server error');
                return response.json();
            })
            .then(data => setMemoryCards(data))
            .catch(error => {
                setMemoryCards([]);
                if (error.message === '401 Unauthorized') {
                    handleAuthError(error);
                }
            });
        } else {
            setHomenagens([]);
            setMemoryCards([]);
            setIsLoggedIn(false);
            document.body.classList.remove('logged-in');
        }
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
            fetchUserData(data.access_token);
            setIsLoggedIn(true);
            document.body.classList.add('logged-in');
            setIsLoginModalOpen(false);
            form.reset();
        })
        .catch(error => {
            console.error("Erro ao fazer login:", error);
            toast.error(`Erro ao logar: ${error.message}`);
        })
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser(null);
        document.body.classList.remove('logged-in');
        document.body.classList.remove('edit-mode');
        closeUserDropdown();
        setIsEditing(false);
    };
    const fetchUserData = (token) => {
        fetch('http://127.0.0.1:8000/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Falha ao buscar dados do usuário.");
            }
            return response.json();
        })
        .then(userData => {
            setCurrentUser(userData);
        })
        .catch(error => {
            console.error(error.message);
        });
    };
    const handleHomenagemUpdateSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const updatedData = {
            nome: editHomenagemName,
            mensagem: editHomenagemMessage,
            image_url: homenagemToEdit.image_url
        };

        fetch(`http://127.0.0.1:8000/homenagens/${homenagemToEdit.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.detail) });
            }
            return response.json();
        })
        .then(savedHomenagem => {
            setHomenagens(homenagensAtuais => homenagensAtuais.map(h => h.id === savedHomenagem.id ? savedHomenagem : h));
            toast.success("Homenagem atualizada com sucesso!");
            setIsHomenagemModalOpen(false);
            setHomenagemToEdit(null);
        })
        .catch(error => {
            console.error("Erro ao atualizar homenagem:", error);
            toast.error(`Ops, algo deu errado: ${error.message}`);
        });
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
    const closeAddMemoryModal = () => {
        setIsAddMemoryModalOpen(false);
        setCardToEdit(null);
        setEditMemoryTitle("");
        setEditMemoryDescription("");
    }

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
        const token = localStorage.getItem('token');

        if (!window.confirm("Tem certeza que deseja apagar essa lembrança?")) {
            return;
        }

        fetch(`http://127.0.0.1:8000/memorias/${cardIdToRemove}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status == 204) {
                setMemoryCards(currentCards => 
                    currentCards.filter(card => card.id !== cardIdToRemove)
                );
                toast.success("Lembrança apagada!");
            } else if (response.status == 401) {
                toast.warn("Sua sessão expirou. Faça login novamente.");
                handleLogout();
            } else {
                toast.error("Não foi possivel apagar a lembrança.");
            }
        })
        .catch(error => {
            console.error("Erro ao deletar a memória:", error);
            toast.error("Ops, algo deu errado.");
        })
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
            toast.error("Ops, algo deu errado.")
        })
    }

    const handleAddMemorySubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const title = editMemoryTitle;
        const description = editMemoryDescription;
        const file = form.newMemoryImage.files[0];
        const token = localStorage.getItem('token');

        if (!title || !description) {
            toast.warn("Título e Descrição são obrigatórios.");
            return;
        }

        const saveMemoryData = (imageUrl) => {

            let finalImageUrl = imageUrl;
            if (cardToEdit && !file) {
                finalImageUrl = cardToEdit.image_url;
            }

            const memoryData = {
                title: title,
                description: description,
                image_url: finalImageUrl
            };

            let url = 'http://127.0.0.1:8000/memorias/';
            let method = 'POST';

            if (cardToEdit) {
                url = `http://127.0.0.1:8000/memorias/${cardToEdit.id}`;
                method = 'PUT';
            }

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(memoryData),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.detail) });
                }
                return response.json();
            })
            .then(savedCard => {
                if (cardToEdit) {
                    setMemoryCards(cardsAtuais => cardsAtuais.map(card => card.id === savedCard.id ? savedCard : card));
                    toast.success("Lembrança atualizada com sucesso!");
                } else {
                    setMemoryCards(cardsAtuais => [...cardsAtuais, savedCard]);
                    toast.success("Lembrança criada com sucesso!");
                }
                closeAddMemoryModal();
                form.reset();
            })
            .catch(error => {
                console.error("Erro ao salvar memoria:", error);
                toast.error(`Ops, algo deu errado: ${error.message}`);
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
                body: formData,
            })
            .then(response => response.json())
            .then(uploadData => {
                saveMemoryData(uploadData.image_url);
            })
            .catch(error => {
                console.error("Erro ao fazer upload da imagem:", error);
                toast.error("Ops, algo deu errado com o upload da sua foto.");
            });
        } else {
            saveMemoryData(null);
        }
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
            toast.success(`Usuário ${userCreated.nome} criado com sucesso! Por favor, faça o login.`);
            form.reset();
            setShowSignup(false);
        })
        .catch(error => {
            console.error("Erro ao criar usuário:", error);
            toast.error(`Erro ao cadastrar: ${error.message}`);
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

    const handleMemoryCardClick = (card) => {
        if (isEditing && currentUser && card.owner_id === currentUser.id) {
            setCardToEdit(card);
            setEditMemoryTitle(card.title);
            setEditMemoryDescription(card.description);
            openAddMemoryModal();
        } else if (!isEditing) {
            openMemoryModal(card);
        }
    };


    const handleHomenagemCardClick = (homenagem) => {
        if (isEditing && currentUser && homenagem.owner_id === currentUser.id) {
            setHomenagemToEdit(homenagem);
            setEditHomenagemName(homenagem.nome);
            setEditHomenagemMessage(homenagem.mensagem);
            setIsHomenagemModalOpen(true);
        }
    };


    const handleAddClick = () => {
        setCardToEdit(null);
        setEditMemoryTitle("");
        setEditMemoryDescription("");
        openAddMemoryModal();
    };

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Header 
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                isDropdownOpen={isUserDropdownOpen}
                onToggleDropdown={toggleUserDropdown}
                onOpenLogin={openLoginModal}
                onLogout={handleLogout}
            />
            <main className="content">
                {!isLoggedIn && (
                    <LoginPrompt onOpenLogin={openLoginModal} />
                )}
                {isLoggedIn && (
                    <>
                        <HeroSection />
                        
                        <MemoryGallery 
                            memoryCards={memoryCards}
                            isEditing={isEditing}
                            onToggleEditMode={toggleEditMode}
                            onCardClick={handleMemoryCardClick}
                            onDeleteClick={removeCard}
                            onAddClick={handleAddClick}
                            currentUser={currentUser}
                        />

                    </>
                )}
            </main>
            
            <MemoryViewerModal 
                isOpen={isMemoryModalOpen}
                onClose={closeMemoryModal}
                card={selectedCard}
            />
            
            <AuthModal 
                isOpen={isLoginModalOpen}
                onClose={closeLoginModal}
                showSignup={showSignup}
                onToggleSignup={setShowSignup}
                onLoginSubmit={handleLogin}
                onSignupSubmit={handleSignup}
            />

            <MemoryFormModal 
                isOpen={isAddMemoryModalOpen}
                onClose={closeAddMemoryModal}
                isEditing={!!cardToEdit}
                title={editMemoryTitle}
                setTitle={setEditMemoryTitle}
                description={editMemoryDescription}
                setDescription={setEditMemoryDescription}
                onSubmit={handleAddMemorySubmit}
            />

        </>
    );
}

export default MainPage;