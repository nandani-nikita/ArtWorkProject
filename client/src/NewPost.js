import React from 'react';

const NewPost = ({
  handleSubmit, postCaption, setPostCaption, postDescription, setPostDescription
}) => {
  return (
    <main className='NewPost'>
      <h2>New Post</h2>
      <form className='newPostForm' onSubmit={handleSubmit} >
        <label htmlFor='postCaption'>Caption:</label>
        <input
          id="postCaption"
          type="text"
          required
          value={postCaption}
          onChange={(e) => setPostCaption(e.target.value)} />

        <label htmlFor='postDescription'>Description:</label>
        <textarea
          id="postDescription"
          required
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>
    </main>
  )
}

export default NewPost;
