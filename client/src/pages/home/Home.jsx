import { useEffect, useState, useContext } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
// import Sidebar from "../../components/sidebar/Sidebar";
import "./home.css";
import axios from "axios";
// import { useLocation } from "react-router";
import { Context } from "../../context/Context";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(Context);
  useEffect(() => {
    const fetchPosts = async () => {
      const auth = user ? `Bearer ${user.token}` : null
      const res = await axios.get("http://3.110.154.209:8080/art/all", {
        headers: {
          'authorization': auth
        }
      });
      setPosts(res.data.data);
    };
    fetchPosts();
  }, []);
  return (
    <>
      <Header />
      <div className="home">
        <Posts posts={posts} />
      </div>
    </>
  );
}
