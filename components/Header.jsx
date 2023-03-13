function Header({ color, children }) {
  const className = color
    ? `text-${color}-500 text-2xl font-bold pb-2`
    : "text-2xl text-big font-bold pb-2";
  return <h2 className={className}>{children}</h2>;
}
export default Header;
