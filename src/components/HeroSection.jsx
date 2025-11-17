import React from "react";

function HeroSection() {
    return (
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
    );
}

export default HeroSection;