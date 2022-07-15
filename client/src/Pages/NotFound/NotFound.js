import ErrorMessage from "../../Components/Error/ErrorMessage"

const NotFound = () => {
    return (
        <div className="not-found-wrap">
            <ErrorMessage error={"The Page you are looking for, does not Exists"} />
        </div>
    )
}

export default NotFound