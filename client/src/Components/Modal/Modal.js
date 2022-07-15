import "./main-modal.css"
const Modal = ({ title, text, onAgree, setDisplayModal }) => {
    return (
        <div className="modal">
            <div className="modal-wrap">
                <h2 className="modal-title">{title}</h2>
                <p className="modal-text">{text}</p>
                <div className="modal-action-container">
                    <button className="modal-btn modal-cancel" onClick={() => setDisplayModal(false)}>No</button>
                    <button className="modal-btn modal-agree" onClick={onAgree}>Yes</button>
                </div>
            </div>
        </div>
    )
}

export default Modal