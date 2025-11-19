import React from "react";

function TributeForm({ onSubmit, isModal = false }) {
    return (
        <section className={`tribute-form-section ${isModal ? 'modal-form' : ''}`}>
            <h2>Compartilhe sua história com a Lulu</h2>
            <p>Sua lembrança aparecerá no mural abaixo para que todos possam ver.</p>

            <form id="tributeForm" onSubmit={onSubmit}>
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
    );
}

export default TributeForm;