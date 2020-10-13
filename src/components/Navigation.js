import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "components/Navigation.css";

const Navigation = () => {
        return(
        <nav>
            <ul className="navigation__ul">
                <li>
                    <Link to="/" className="home__link">
                        <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="4x" />
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="profile__link">
                        <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="4x" />
                    </Link>
                </li>
            </ul>
        </nav>        
    );
}

export default Navigation;