import "./LayoutAuth.css";
export const LayoutAuth = (props) => {
  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">{props.children}</div>
      </div>
    </div>
  );
};

export default LayoutAuth;