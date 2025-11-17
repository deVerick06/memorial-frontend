import React from "react";
import { Link } from "react-router-dom";

function Header({
    isLoggedIn, 
    currentUser, 
    isDropdownOpen, 
    onToggleDropdown, 
    onOpenLogin, 
    onLogout
}) {
    return (
        <header className="main-header">
            <h1><Link to="/lembrancas">Lembranças</Link></h1>
            
            <div 
                className={`user-profile ${isDropdownOpen ? 'open' : ''}`} 
                id="userProfileButton" 
                onClick={isLoggedIn ? onToggleDropdown : onOpenLogin}
            >
                <div className="profile-pic"></div>
                <span className="profile-name">
                    {isLoggedIn ? (currentUser ? currentUser.nome : "...") : "Visitante"}
                </span>
                <span className="dropdown-arrow"></span>
            </div>

            <div className={`user-dropdown ${isDropdownOpen ? 'open' : ''}`} id="userDropdown">
                <button className="dropdown-btn" id="logoutButton" onClick={onLogout}>
                    Sair
                </button>
            </div>
        </header>
    );
}

export default Header;