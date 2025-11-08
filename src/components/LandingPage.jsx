import React from "react";
import {Link} from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-container">
            <h1>Lulu</h1>
            <Link to="/lembrancas" className="lembrancas">Lembranças</Link>

            <div className="decorations">
                <span className="heart h1"></span>
                <span className="heart h2"></span>
                <span className="heart h3"></span>

                <span className="star s1"></span>
                <span className="star s2"></span>
                <span className="star s3"></span>
                <span className="star s4"></span>
            </div>
        </div>
    );
}

export default LandingPage;