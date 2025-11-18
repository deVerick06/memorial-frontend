import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import TributeCard from "./TributeCard.jsx";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import EditTributeModal from "./EditTributeModal.jsx";
import './TributesPage.css'

function TributesPage() {
    const [homenagens, setHomenagens] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 
    
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
                    <TributeCard key={h.id} tribute={h} currentUser={currentUser} />
                ))}
                
                {homenagens.length === 0 && (
                    <div style={{textAlign: "center", color: "#ccc", marginTop: "50px"}}>
                        <p>Ainda não há homenagens neste mural.</p>
                        <p>Faça login ou crie a primeira!</p>
                    </div>
                )}
            </main>
        </>
    );
}

export default TributesPage;