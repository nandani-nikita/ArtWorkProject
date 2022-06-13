import React, { useContext, useState, useEffect } from "react";
import './starRating.css';
import { Context } from "../../context/Context";
import axios from "axios";

const StarRating = ({ postId, commentData }) => {
    const { user } = useContext(Context);
    const [rating, setRating] = useState(commentData ? commentData.myRatings : 0);
    const [hover, setHover] = useState(0);
    console.log(' \n\n\n\ ', commentData && commentData.myRatings);
    useEffect(() => {

        console.log('firing');
    setRating(commentData && commentData.myRatings);


    // getRatings();
    }, [postId, commentData])
    const handleStars = async (index) => {
        try {
            console.log(rating);
            const setStars = await axios.post("http://localhost:8080/react/rate", {
                artId: postId,
                rating: parseInt(index)
            }, {
                headers: {
                    "authorization": `Bearer ${user.token}`
                }
            });
            setRating(index);
            console.log(setStars.data);
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
// const StarRating = ({ post }) => {
//     const { user } = useContext(Context);
//     const [rating, setRating] = useState(0);
//     const [hover, setHover] = useState(0);

//     useEffect(() => {
//         const getRatings = async () => {
//             const auth = user ? `Bearer ${user.token}` : null;
//             const commentData = (await axios.post("http://localhost:8080/react/all-comments", {
//                 artId: post.id,
//             }, {
//                 headers: {
//                     "authorization": auth
//                 }
//             })).data;
//             console.log(commentData);
//             if (commentData.myRatings) {
//                 setRating(commentData.myRatings);
//             }
//         }
//         getRatings();
//     }, [rating])
//     const handleStars = async (index) => {
//         try {
//             console.log(rating);
//             const setStars = await axios.post("http://localhost:8080/react/rate", {
//                 artId: post.id,
//                 rating: parseInt(index)
//             }, {
//                 headers: {
//                     "authorization": `Bearer ${user.token}`
//                 }
//             });
//             setRating(index);
//             console.log(setStars.data);
//         } catch (error) {
//             console.log(error.response);
//         }

//     }
//     return (
//         <div className="star-rating">
//             {
//                 [...Array(5)].map((star, index) => {
//                     index += 1;
//                     return (
//                         <button
//                             type="button"
//                             key={index}
//                             className={index <= (hover || rating) ? "on" : "off"}
//                             onClick={() => handleStars(index)}
//                             onMouseEnter={() => setHover(index)}
//                             onMouseLeave={() => setHover(rating)}
//                         >
//                             <span className="star">&#9733;</span>
//                         </button>
//                     );
//                 })
//             }
//         </div>
//     );
// };

// export default StarRating;