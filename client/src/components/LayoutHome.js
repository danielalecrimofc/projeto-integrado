import "./LayoutHome.css";
export const LayoutHome= (props) => {
  return (
    <div className="container">
      <div className="container-home">{props.children}</div>
    </div>
  );
};