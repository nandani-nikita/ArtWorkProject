import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
    return (
        <article className='post'>
            <Link to={`/post/${post.id}`}>
                <h2>{post.caption}</h2>
                <p className='postDate'>{post.uploaded_on}</p>
            </Link>
            <p className='postDescription'>
                {
                    (post.description).length <= 25
                    ? post.description 
                    : `${(post.description).slice(0,25)}...`
                }
            </p>
        </article>
    )
}

export default Post;
