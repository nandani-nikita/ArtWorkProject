import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import { FaHeart } from "react-icons/fa";
const AllComments = ({ postId, commentData }) => {
    const { user } = useContext(Context);
    console.log("=\n", commentData);
    const [comments, setComments] = useState(commentData.comments);


    const [commentCount, setCommentCount] = useState(commentData.commentsCount);
    const [likeCount, setLikeCount] = useState(commentData.likesCount);
    const [avgStars, setAvgStars] = useState(commentData.ratings);
    const [isLiked, setIsLiked] = useState(commentData.likeStatus);
    // const [commentCount, setCommentCount] = useState(0);
    // const [likeCount, setLikeCount] = useState(0);
    // const [avgStars, setAvgStars] = useState(0.0);
    // const [isLiked, setIsLiked] = useState(false);
    // useEffect(() => {
    //     console.log(']]]]]]]]]]]]]]]]]');
    //     console.log(commentData);
    //     setCommentCount(commentData.commentsCount);
    //     setLikeCount(commentData.likesCount);
    //     setAvgStars(commentData.ratings);
    //     setIsLiked(commentData.likeStatus)
    // }, [postId, commentData, isLiked])

    const handleLikeChange = async () => {
        const isLikedStatus = isLiked ? false : true
        try {
            await axios.post("http://localhost:8080/react/like/", {
                artId: postId
            }, {
                headers: {
                    "authorization": `Bearer ${user.token}`
                }
            });
            setIsLiked(isLikedStatus);
            // window.location.reload(true);
        } catch (error) {
            console.log(error.response);
        }
    }

    return (
        // <>hi</>
        <div className="comment">
            <div className="reaction-status">
                <span id="commentCount">{commentCount}{commentCount > 1 ? ' Comments' : ' Comment'}</span>
                <span id="likeCount">{likeCount}{likeCount > 1 ? ' Likes' : ' Like'}</span>
                <span id="starsCount">{avgStars}{avgStars > 1 ? ' Stars' : ' Star'}</span>
                {user && <span id="likeButton">
                    <FaHeart
                        className="reactionIcon"
                        style={{ color: isLiked ? 'teal' : 'rgb(183, 181, 181)' }}
                        onClick={handleLikeChange}
                    />
                </span>}
            </div>
            {comments && comments.map((comment) =>
                <div className="commentSection" key={comment.id}>

                    <cite className="commentText">
                        {comment.comment}
                    </cite>
                    <span className="commentAuthor"> ...Says, {comment.commentPersonName ? comment.commentPersonName : 'Annonymus'}</span>

                </div>
            )}
        </div>
    )
}

export default AllComments;
