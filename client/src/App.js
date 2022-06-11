import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api/posts'


function App() {


  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postCaption, setpostCaption] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/all');
          console.log(response.data.data);
          setPosts(response.data.data);
      } catch (error) {
        if (error.response) {

          // Not in 200 response range
          console.log(error.response.data);
          console.log(error.response.error);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
      }
    }
    fetchPosts();
  }, [])

  useEffect(() => {
    const filteredResults = posts.filter(post =>
      ((post.description).toLowerCase()).includes(search.toLowerCase())
      ||
      ((post.caption).toLowerCase()).includes(search.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const uploaded_on = (new Date(Date.now())).toDateString();
    const newPost = { id: id, caption: postCaption, uploaded_on: uploaded_on, description: postDescription };
    try {
      const response = await api.post('/new', newPost)
      const allPosts = [...posts, newPost];
      setPosts(allPosts);
      setpostCaption('');
      setPostDescription('');
      navigate('/');
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
      
    }
  }

  const handleDelete = async (id) => {
    const postsList = posts.filter(post => post.id !== id);
    setPosts(postsList);
    navigate('/');

  }
  return (
    <div className='App'>

      <Header title={'Art Blog'} />
      <Nav
        search={search}
        setSearch={setSearch}
      />

      <Routes >
        <Route exact path='/' element={<Home posts={searchResults} />} />

        <Route path='post' element={<NewPost handleSubmit={handleSubmit} postCaption={postCaption} setpostCaption={setpostCaption} postDescription={postDescription} setPostDescription={setPostDescription} />} />

        <Route path='post/:id' element={<PostPage posts={posts} handleDelete={handleDelete} />} />

        <Route path='about' element={<About />} />

        <Route path='*' element={<Missing />} />

      </Routes>

      <Footer />
    </div>
  );
}

export default App;
