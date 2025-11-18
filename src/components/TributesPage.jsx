import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import TributeCard from "./TributeCard.jsx";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import './TributesPage.css'

function TributesPage() {
    const [homenagens, setHomenagens] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            setIsLoggedIn(true);
            fetch('http://127.0.0.1:8000/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setCurrentUser(data));

            fetch('http://127.0.0.1:8000/homenagens/', {
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
                console.error(err);
                setHomenagens([]);
            });
        }
    }, []);

    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/lembrancas');
    };

    const handleOpenLogin = () => navigate('/lembrancas'); 

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

            <div className="tributes-feed-container" style={{marginTop: "20px"}}>
                <h2 style={{color: "white", textAlign: "center", marginBottom: "20px"}}>Mural da Comunidade</h2>
                
                {homenagens.map(h => (
                    <TributeCard key={h.id} tribute={h} currentUser={currentUser} />
                ))}
                
                {homenagens.length === 0 && (
                    <p style={{textAlign: "center", color: "#ccc"}}>Carregando...</p>
                )}
            </div>
        </>
    );
}

export default TributesPage;