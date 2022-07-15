import "./error-message.css"

const ErrorMessage = ({ error }) => {
    return (
        <div className="no-content">
            <p className="no-content-message">{error}</p>
        </div>
    )
}

export default ErrorMessage