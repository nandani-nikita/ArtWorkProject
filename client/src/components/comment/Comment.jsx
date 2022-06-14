import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import "./comments.css";

import StarRating from "../reactions/StarRating";
const Comment = ({ post }) => {
    const { user } = useContext(Context);
    const [comment, setComment] = useState('');
  
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://3.110.154.209:8080/react/comment/", {
                artId: post.id,
                comment: comment
            }, {
                headers: {
                    "authorization": `Bearer ${user.token}`
                }
            });
            setComment('');
            window.location.reload(true);
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

            <StarRating postId={post.id} commentData={post.commentData} />
        </form>
            : null
    )
}

export default Comment;
