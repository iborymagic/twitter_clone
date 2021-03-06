import { authService, firebaseInstance } from "fbase";
import React from "react";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub} from "@fortawesome/free-brands-svg-icons";
import "routes/Auth.css";

const Auth = () => {
    const onSocialClick = async e => {
        const {target : {name}} = e;
        let provider;
        if(name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
            await authService.signInWithPopup(provider);
        } else if(name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
            await authService.signInWithPopup(provider);
        }
    };

    return (
        <div className="authContainer">
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" style={{ marginBottom : 30 }} />
            <AuthForm />
            <div className="authBtns">
                <button onClick={onSocialClick} name="google" className="authBtn">
                    Sign in with Google <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button onClick={onSocialClick} name="github" className="authBtn">
                    Sign in with Github <FontAwesomeIcon icon={faGithub} />
                </button>
            </div>
        </div>
    )
};
export default Auth;