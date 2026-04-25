import { Link } from "react-router";
import  DrawerMenu from "./Logger/components/DrawerMenu"

function Header(){

    return (
        <header className="header">
            <div className="header__inner c-inner">
                <h1><Link to="/">Simple Time Logger</Link></h1>
                <DrawerMenu/>
            </div>
        </header>
    );
  }
  
  export default Header;