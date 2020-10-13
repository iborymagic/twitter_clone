// component를 나누는 기준은 딱히 없음.
// 그냥 어떤 단위의 태그로 인해 코드가 지나치게 길어진다면, 걔를 따로 분리해주면 됨.
// 하나의 component는 한 가지 역할만 잘 하면 된다.
import { authService } from "fbase";
import React, { useState } from "react";
import "components/AuthForm.css";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onChange = e => {
        const {target : {name, value}} = e;
        
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            let data;
            if(newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(email, password);
                /*
                const userInfo = {
                    displayName : null,
                    profileImage : null
                }
                
                await dbService.collection("users").doc(data.user.uid).set(userInfo);
                */
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch(error) {
            setError(error.message);
        }

    };

    return (
        <>
        <form onSubmit={onSubmit} className="container">
            <input type="email" name="email" className="authInput" placeholder="Email" required value={email} onChange={onChange} />
            <input type="password" name="password" className="authInput" placeholder="Password" required value={password} onChange={onChange} />
            <input type="submit" className="authInput authSubmit" value={newAccount ? "Create New Account" : "Sign In"} />
            {error && <span className="authError">error</span>}
        </form>
        <span onClick={toggleAccount} className="authSwitch">
            {newAccount ? "Sign In" : "Create New Account"}
        </span>
        </>
    );
};

export default AuthForm;