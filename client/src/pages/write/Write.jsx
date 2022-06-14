import { useContext, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      name: user.name,
      title,
      desc,
    };
    if (file) {
      const formdata =new FormData();
      formdata.append("caption", title);
      formdata.append("description", desc);
      formdata.append("artWork", file);
      newPost.photo = file;
      try {
        await axios.post("http://3.110.154.209:8080/art/new",formdata, { headers: {
          "Content-Type": "multipart/form-data",
          "authorization":`Bearer ${user.token}`
        }});
        window.location.replace("/");
      } catch (err) {
        console.log(err.error);
        alert(err.response ? err.response.data.error : 'Some Error Occurred. Please Try Again.');
      }
    }
   
  };
  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e=>setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={e=>setDesc(e.target.value)}
          ></textarea>
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
