import { Link } from "react-router-dom"
import "./author.css"

const Author = ({ author }) => {
    return (
        <div className="author-details-wrap">
            <div className="blog-author-detail">
                <div className="blog-author-img-wrap">
                    {
                        author.imageUrl ?
                            // <img className="blog-author-image" src={author.imageUrl} alt="profile-pic" />
                            <div className="blog-author-image" style={{ backgroundImage: `url(${author.imageUrl})` }}></div>
                            : <img className="blog-author-alt" src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" alt="profile-pic" />
                    }
                </div>
                <div className="blog-author-content">
                    <Link to={`/blog/user/${author._id}`} className="author-name">{`${author.fname} ${author.lname}`}</Link>
                    <p className="author-expertise">{author.expertise}</p>
                    <p className="author-description">{author.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Author