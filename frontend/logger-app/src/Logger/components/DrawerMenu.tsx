import { useState } from 'react';
import { Link } from "react-router";
import  Logout from "./Logout"

function DrawerMenu() {

  const [isActive, setIsActive] = useState(false);

  const activeToggle = () => {
      setIsActive(!isActive)
  }

  return (
    <>
    <div className={`menu-btn ${isActive ? "is-active" : ""}`} onClick={activeToggle}>
        <span>Menu</span>
        <span className="-close">Close</span>
    </div>
    {isActive &&(
        <div className="header-overlay is-active" onClick={activeToggle}></div>
    )}
    <div className={`g-nav ${isActive ? "is-active" : ""}`}>
        <nav>
            <ul className="g-nav__list">
                <li><Link to="/" onClick={activeToggle}>Home</Link></li>
                <li><Link to="/" onClick={activeToggle}>Projects</Link></li>
                <li><Logout/></li>
            </ul> 
        </nav>
    </div>
    </>
  );
}

export default DrawerMenu;