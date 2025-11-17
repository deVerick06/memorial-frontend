import React from "react";

function LoginPrompt({ onOpenLogin }) {
    return (
        <section className="login-prompt logged-out-item">
            <h2>Bem-vindo ao Memorial</h2>
            <p>Faça login para ver e adicionar suas lembranças.</p>
            <button className="btn-login-prompt" id="loginPromptButton" onClick={onOpenLogin}>Entrar</button>
        </section>
    );
}

export default LoginPrompt;