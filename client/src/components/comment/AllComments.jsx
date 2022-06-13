import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import { FaHeart } from "react-icons/fa";
const AllComments = ({ post }) => {
    const { user } = useContext(Context);
    const [comments, setComments] = useState([]);

    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [avgStars, setAvgStars] = useState(0.0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        async function getComments() {
            try {
                console.log(post.id);
                const auth = user ? `Bearer ${user.token}` : null;
                const allComments = (await axios.post("http://localhost:8080/react/all-comments", {
                    artId: post.id,
                }, {
                    headers: {
                        "authorization": auth
                    }
                })).data;
                const commentData = allComments.comments;
                for (let ele in commentData) {
                    const authorInfo = await axios.get("http://localhost:8080/user/" + commentData[ele].comment_by);

                    Object.assign(commentData[ele], authorInfo)
                }
                setComments(commentData);
                setCommentCount(allComments.commentsCount);
                setLikeCount(allComments.likesCount);
                setAvgStars(allComments.ratings);
                setIsLiked(allComments.likeStatus && allComments.likeStatus)

            } catch (err) {
                console.log(err.response);
            }
        }

        getComments();
    }, [post.id, user, isLiked])
    const handleLikeChange = async () => {
        const isLikedStatus = isLiked ? false : true
        try {
            await axios.post("http://localhost:8080/react/like/", {
                artId: post.id
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
                    <span className="commentAuthor">...Says, {comment.data ? comment.data.name : 'Annonymus'}</span>

                </div>
            )}
        </div>
    )
}

export default AllComments;
