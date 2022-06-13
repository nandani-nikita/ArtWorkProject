import "./post.css";
import { Link } from "react-router-dom";
import Comment from "../comment/Comment";
import AllComments from "../comment/AllComments";

export default function Post({ post }) {
  // console.log(post);
  return (
    <div className="post">
      {post.art_work && <img className="postImg" src={post.art_work} alt="img" />}
      <div className="postInfo">
        
        <Link to={`/post/${post.id}`} className="link">
          <span className="postTitle">{post.caption}</span>
        </Link>
        <hr />
        <span className="postDate">
          {new Date(post.uploaded_on).toDateString()}
        </span>
      </div>
      <p className="postDesc">{post.description}</p>
      <hr />
      <AllComments post={post} />
      <Comment post={post} />
    </div>
  );
}
