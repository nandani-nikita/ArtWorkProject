import "./settings.css";
import { useContext } from "react";
import { Context } from "../../context/Context";

export default function Settings() {

  const { user } = useContext(Context);
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">My Info</span>
        </div>
        <form className="settingsForm" >
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={user.profilePicture}
              alt=""
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.name}
            disabled
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            disabled
          />
          <label>Phone Number</label>
          <input
            type="text"
            placeholder={user.phone}
            disabled
          />

        </form>
      </div>
    </div>
  );
}
