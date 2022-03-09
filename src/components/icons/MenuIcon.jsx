
const MenuIcon = ({className, clicked, setClicked}) => {

  return (
    <div className={`${className} btn ${!clicked ? 'not-active' : 'active'}`} onClick={() => setClicked(!clicked)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
export default MenuIcon;
