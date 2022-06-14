import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlePost.css";
import Comment from "../comment/Comment";
import AllComments from "../comment/AllComments";
export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [author, setAuthor] = useState('');


  useEffect(() => {

    const getPost = async () => {
      const auth = user ? `Bearer ${user.token}` : null;
      const res = (await axios.get("http://3.110.154.209:8080/art/" + path,
        {
          headers: {
            "authorization": auth
          }
        })).data;
      setPost(res.data);
      setTitle(res.data.caption);
      setDesc(res.data.description);
      setAuthor(res.data.authorInfo.name);
    };
    getPost();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://3.110.154.209:8080/art/del/${post.id}`, {
        headers: {
          "authorization": `Bearer ${user.token}`
        }
      });
      alert('Deleted');
      window.location.replace("/");
    } catch (err) {
      alert(err.response ? err.response.data.error : 'Some Error Occurred. Please Try Again.');
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.art_work && (
          <img src={post.art_work} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.uploaded_by === user?.id && (
              <div className="singlePostEdit">

                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user.id=${post.uploaded_by}`} className="link">
              <b> {author}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.uploaded_on).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}

      </div>
      {post.commentData &&
        <AllComments postId={post.id} commentData={post.commentData} />}
      <Comment post={post} />
    </div>
  );
}
