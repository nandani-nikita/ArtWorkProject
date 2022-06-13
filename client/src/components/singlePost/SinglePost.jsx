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
      // console.log(path, "pathhh");
      const res = (await axios.get("http://localhost:8080/art/" + path)).data;
      // console.log(res.data);
      // console.log(res.data.description);
      setPost(res.data);
      setTitle(res.data.caption);
      setDesc(res.data.description);
      // console.log(post.uploaded_by);
      const getAuthor = await axios.get("http://localhost:8080/user/" + res.data.uploaded_by);
      // console.log(getAuthor.data);
      setAuthor(getAuthor.data.name);
    };
    getPost();
  }, [path, post]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/art/del/${post.id}`, {
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

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, {
        uploaded_by: user.id,
        title,
        desc,
      });
      setUpdateMode(false)
    } catch (err) { }
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
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
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
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
      <AllComments post={post} />
      <Comment post={post} />
    </div>
  );
}