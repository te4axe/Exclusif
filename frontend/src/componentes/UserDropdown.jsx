import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { BsBox, BsXCircle } from "react-icons/bs";
import { AiOutlineLogout, AiOutlineStar } from "react-icons/ai";

const UserDropdown = ({ isDropdownOpen, userName = "Guest", handleLogout }) => {
  return (
    <>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
          {/* User info display */}
          <div className="px-4 py-2 text-center">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="user-avatar"
              className="w-12 h-12 rounded-full mx-auto mb-2"
            />
            <p className="font-bold">{userName}</p>
            <p className="text-gray-500 text-sm">name@example.com</p>
          </div>

          {/* Dropdown options */}
          <Link to="/Profile" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
            <IoPersonOutline className="mr-3" /> Mon compte
          </Link>
          <Link to="/orders" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
            <BsBox className="mr-3" /> Mes commandes
          </Link>
          <Link to="/cancellations" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
            <BsXCircle className="mr-3" /> Annulations
          </Link>
          <Link to="/reviews" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
            <AiOutlineStar className="mr-3" /> Avis
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 transition"
          >
            <AiOutlineLogout className="mr-3" /> Déconnexion
          </button>
        </div>
      )}
    </>
  );
};

// Add PropTypes validation
UserDropdown.propTypes = {
  isDropdownOpen: PropTypes.bool.isRequired,
  userName: PropTypes.string, // Now it's optional
  handleLogout: PropTypes.func.isRequired,
};

export default UserDropdown;
