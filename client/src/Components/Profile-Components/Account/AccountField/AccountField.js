import "./account-field.css"

const AccountField = ({ fieldname, fieldData }) => {
    return (
        <div className="acc-field">
            <label className="acc-label">{`${fieldname} :`}</label>
            <p className="acc-data">{fieldData}</p>
        </div>
    )
}

export default AccountField