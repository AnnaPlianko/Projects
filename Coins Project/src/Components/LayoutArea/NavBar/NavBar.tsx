
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useDispatch } from "react-redux";
import { setSearchText } from "../../../Redux/SearchSlice";


export function NavBar() {
    const dispatch = useDispatch();
    return (
        <div className="NavBar">

            <NavLink to="/home">Home</NavLink>
            <NavLink to="/reports">Real Time Reports</NavLink>
            <NavLink to="recommendation">Recommendation</NavLink>
            <NavLink to="/about">About Us</NavLink>

            <input type="text"
                className="coin-search"
                placeholder="Search coin..."
                onChange={(e) => dispatch(setSearchText(e.target.value))}
            />
        </div>
    );
}