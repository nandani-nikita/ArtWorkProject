import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import "./comments.css";

import StarRating from "../reactions/StarRating";
// import styles from './new.module.scss';
const Comment = ({ post }) => {
    const { user } = useContext(Context);
    const [comment, setComment] = useState('');
    useEffect(() => {
        var scrollpos = localStorage.getItem('scrollpos');
            if (scrollpos) window.scrollTo(0, scrollpos);
      }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(comment, user, post);
        try {
            await axios.post("http://localhost:8080/react/comment/", {
                artId: post.id,
                comment: comment
            }, {
                headers: {
                    "authorization": `Bearer ${user.token}`
                }
            });
            setComment('');
            localStorage.setItem('scrollpos', window.scrollY);
            document.location.reload(true);
            // window.location.reload(true);
        } catch (err) {
            console.log(err);
            alert(err.response ? err.response.data.error : 'Some Error Occurred. Please Try Again.');
        }


    };
  
    return (

        user ? <form onSubmit={handleSubmit} className="commentForm">
            <input
                type="text"
                name='comment'
                className="commentInput"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />


            <button
                type='submit'
                className="commentSubmit">Comment
            </button>

            {/* <FaHeart
                className="reactionIcon"
                style={{ color: isLiked ? 'teal' : 'rgb(183, 181, 181)' }}
                onClick={handleLikeChange}
            /> */}

            <StarRating postId={post.id} commentData={post.commentData} />
        </form>
            : null
    )
}

export default Comment;
