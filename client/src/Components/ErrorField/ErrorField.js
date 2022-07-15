import "./error-field.css"

const ErrorField = ({ text }) => {
    return (
        <p className="error-field-text">{`*${text}*`}</p>
    )
}

export default ErrorField