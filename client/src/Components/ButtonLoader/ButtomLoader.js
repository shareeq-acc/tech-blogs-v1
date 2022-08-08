import "./button-loader.css"
const ButtomLoader = ({ status, text, type, className, onClick, loadingText }) => {
    return (
        <button className={`button-loader ${className ? className : ""}`} disabled={status === "pending" ? true : false} type={type} onClick={onClick}>
            {status === "pending" && <i className="fa fa-spinner button-loader-icon"></i>}
            {status === "pending" ? `${loadingText ? loadingText : "Submitting"}` : text}
        </button>
    )
}

export default ButtomLoader