import { signOut } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCartDashFill } from "react-icons/bs";
import {
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { User } from "../types/types";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>
        HOME
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch size={30} />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <div style={{position:'relative'}}>
        <span style={{position:'absolute',bottom:'15px',left:'25px',zIndex:'10',color:'green',fontWeight:'bold',fontSize:'1.5rem'}}>{cartItems.length === 0 ? '' : cartItems.length}</span>
        <BsCartDashFill size={30}/>
        </div>
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser size={30}/>
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;