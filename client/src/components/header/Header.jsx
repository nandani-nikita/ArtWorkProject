import "./header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleSm">Art Gallery</span>
        <span className="headerTitleLg">Blog</span>
      </div>
      <img
        className="headerImg"
        // src="https://fsd-bucket.s3.ap-south-1.amazonaws.com/others/bgHome.jpg"
        src="https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        alt=""
      />
    </div>
  );
}
