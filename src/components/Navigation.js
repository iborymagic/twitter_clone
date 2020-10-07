import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => <nav>
    <nav>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/profile">{userObj.displayName}'s Profile</Link>
            </li>
        </ul>
    </nav>
</nav>;
export default Navigation;