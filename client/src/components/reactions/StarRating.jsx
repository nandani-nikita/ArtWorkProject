import React, { useContext, useState, useEffect } from "react";
import './starRating.css';
import { Context } from "../../context/Context";
import axios from "axios";

const StarRating = ({ postId, commentData }) => {
    const { user } = useContext(Context);
    const [rating, setRating] = useState(commentData ? commentData.myRatings : 0);
    const [hover, setHover] = useState(0);
    useEffect(() => {

        setRating(commentData && commentData.myRatings);

    }, [postId, commentData])
    const handleStars = async (index) => {
        try {
            const setStars = await axios.post("http://3.110.154.209:8080/react/rate", {
                artId: postId,
                rating: parseInt(index)
            }, {
                headers: {
                    "authorization": `Bearer ${user.token}`
                }
            });
            setRating(index);
            window.location.reload(true);
        } catch (error) {
            console.log(error.response);
        }

    }
    return (
        <div className="star-rating">
            {
                [...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                        <button
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "on" : "off"}
                            onClick={() => handleStars(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            <span className="star">&#9733;</span>
                        </button>
                    );
                })
            }
        </div>
    );
};

export default StarRating;