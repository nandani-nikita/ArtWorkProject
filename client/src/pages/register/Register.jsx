import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
// import {FormData} from 'form-data';

export default function Register() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(0);
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState();
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    var formdata = new FormData();
    formdata.append('name', name);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('dob', dob);
    formdata.append('mobile', mobile);
    formdata.append('gender', gender);
    formdata.append('profilePicture', file);

    for (var pair of formdata.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    // console.log(name,gender, email, password, dob, mobile, file);
    try {
      const res = await axios.post("http://localhost:8080/user/new", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      res.data && window.location.replace("/login");
    } catch (err) {
      console.log(err);
      // console.log(res.error);
      // console.log(res.msg);
      // console.log(err);
      alert(err.response ? err.response.data.error : 'Some Error Occurred. Please Try Again.');
      setError(true);
    }
  };
  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          className="registerInput"
          placeholder="Enter your name..."
          onChange={(e) => setName(e.target.value)}
        />
        <label>Gender</label>
        <input
          type="radio"
          // className="registerInput"
          // placeholder="Enter your name..."
          name="gender"
          value="Male"
          onChange={(e) => setGender(e.target.value)}
        /> <label>Male</label>
        <input
          type="radio"
          // className="registerInput"
          // placeholder="Enter your name..."
          name="gender"
          value="Female"
          onChange={(e) => setGender(e.target.value)}
        /> <label>Female</label>

        <label>Email</label>
        <input
          type="text"
          className="registerInput"
          placeholder="Enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Mobile</label>
        <input
          type="number"
          className="registerInput"
          placeholder="Enter your phone number..."
          onChange={(e) => setMobile(e.target.value)}
        />
        <label>DOB</label>
        <input
          type="datetime"
          className="registerInput"
          placeholder="Enter your dob..."
          onChange={(e) => setDob(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          className="registerInput"
          placeholder="Enter your password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Profile Picture</label>
        <input
          type="file"
          className="registerInput"
          placeholder="Select Profile Picture"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="registerButton" type="submit">
          Register
        </button>
      </form>
      <button className="registerLoginButton">
        <Link className="link" to="/login">
          Login
        </Link>
      </button>
      {error && <span style={{ color: "red", marginTop: "10px" }}>Something went wrong!</span>}
    </div>
  );
}
