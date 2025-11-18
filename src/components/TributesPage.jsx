import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import TributeCard from "./TributeCard.jsx";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import './TributesPage.css';

function TributesPage() {
    const [homenagens, setHomenagens] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            setIsLoggedIn(true);
            fetch('http://127.0.0.1:8000/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error('Falha user');
                return res.json();
            })
            .then(data => setCurrentUser(data))
            .catch(err => console.error("Erro ao carregar usuário:", err));

            fetch('http://127.0.0.1:8000/homenagens/', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error('Falha homenagens');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setHomenagens(data);
                } else {
                    setHomenagens([]);
                }
            })
            .catch(err => {
                console.error("Erro ao carregar feed:", err);
                setHomenagens([]);
                toast.error("Não foi possivel carregar o feed. Tente logar novamente.");
            });
        } else {
            setHomenagens([]);
            toast.warn("Você precisa estar logado para ver o feed completo.");
        }
    }, []);

    return (
        <>
            <ToastContainer position="top-right" theme="colored" />
            
            <div style={{
                backgroundColor: "#105070", 
                padding: "20px 40px", 
                color: "white", 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>
                <h1 style={{fontSize: "1.5rem", margin: 0}}>Mural da Comunidade</h1>
                <Link to="/lembrancas" style={{
                    color: "white", 
                    textDecoration: "none",
                    fontWeight: "bold",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    padding: "8px 15px",
                    borderRadius: "20px"
                }}>
                    ← Voltar
                </Link>
            </div>

            <main className="content" style={{ maxWidth: "700px", margin: "0 auto", padding: "30px 20px" }}>
                {homenagens.map(h => (
                    <TributeCard key={h.id} tribute={h} currentUser={currentUser} />
                ))}
                
                {homenagens.length === 0 && (
                    <div style={{textAlign: "center", color: "#666", marginTop: "50px"}}>
                        <h3>Nenhuma homenagem carregada...</h3>
                        <p>Verifique se você está logado.</p>
                    </div>
                )}
            </main>
        </>
    );
}

export default TributesPage;