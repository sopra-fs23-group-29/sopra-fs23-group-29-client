import "styles/ui/Tab.scss";

export const Tab = props => (
  <tab
    {...props}
    style={{width: props.width, ...props.style}}
    className={`tab ${props.className}`}>
    {props.children}
  </tab>
);
