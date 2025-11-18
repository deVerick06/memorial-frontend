import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './Header.css';

function Header({
    isLoggedIn, 
    currentUser, 
    isDropdownOpen, 
    onToggleDropdown, 
    onOpenLogin, 
    onLogout
}) {
    const fileInputRef = useRef(null);

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://127.0.0.1:8000/users/me/avatar', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                toast.success("Foto de perfil aualizada! Atualize a página para ver.");
                window.location.reload();
            } else {
                throw new Error('Erro no upload');
            }
        } catch (error) {
            toast.error("Erro ao atualizar foto.");
        }
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <h1><Link to="/lembrancas">Lulu</Link></h1>
                
                <Link to="/homenagens" className="nav-link">
                    Mural da Comunidade
                </Link>
            </div>
            
            <div 
                className={`user-profile ${isDropdownOpen ? 'open' : ''}`} 
                id="userProfileButton" 
                onClick={isLoggedIn ? onToggleDropdown : onOpenLogin}
            >
                {isLoggedIn && currentUser?.profile_pic_url ? (
                    <img 
                        src={currentUser.profile_pic_url} 
                        alt="Perfil" 
                        className="profile-pic" 
                    />
                ) : (
                    <div className="profile-pic" style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#bbb', fontSize: '18px'
                    }}>
                        <span className="material-icons">person</span>
                    </div>
                )}
                <span className="profile-name">
                    {isLoggedIn ? (currentUser ? currentUser.nome.split(' ')[0] : "...") : "Entrar"}
                </span>
                <span className="dropdown-arrow"></span>
            </div>
            <div className={`user-dropdown ${isDropdownOpen ? 'open' : ''}`} id="userDropdown">
                <button className="dropdown-btn" onClick={() => fileInputRef.current.click()}>
                    Trocar Foto
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    accept="image/*"
                    onChange={handleAvatarChange}
                />
                <div style={{borderTop: '1px solid #eee', margin: '5px 0'}}></div>
                <button className="dropdown-btn" onClick={onLogout} style={{color: '#ff4d4d'}}>
                    Sair
                </button>
            </div>
        </header>
    );
}

export default Header;