import "styles/ui/Tab.scss";

export const Tab = (props) => (
  <div
    {...props}
    style={{ width: props.width, ...props.style }}
    className={`tab ${props.className}`}
  >
    {props.children}
  </div>
);
