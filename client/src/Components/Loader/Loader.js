import "./loader.css"

const Loader = ({ className }) => {
    return (
        <div className="loader-wrapper">
            <div className={`loader ${className ? className : ""}`}></div>
        </div>
    )
}

export default Loader