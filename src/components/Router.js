import React, {useState} from "react";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({isLoggedIn}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation />} 
            {/* 로그인이 되어 있을 때만 Navigation을 보여줌. */}
            <Switch> 
                {isLoggedIn ? (
                    // switch는 하위 라우터들 중 한 번에 하나의 Router만 보여줌.
                    // Log in이 되어있으면 Home 화면만 보여줌.
                    <>
                        <Route exact path = "/">
                            <Home />
                        </Route>
                        <Route exact path = "/profile">
                            <Profile />
                        </Route>
                        {/*<Redirect from="*" to="/" />*/}
                    </>
                    // <> </>는 Fragment. 부모 요소가 없는 많은 요소들을 render 하고싶을 때, 근데 div나 span에 집어넣기는 싫을 때 사용.
                ) : (
                    // Log in이 되어 있지 않으면 Auth 화면을 보여줌.
                    <>
                        <Route exact path = "/">
                            <Auth />
                        </Route>
                        {/*<Redirect from="*" to="/" />*/}
                    </>
                )}
            </Switch>
        </Router>
    )
}

export default AppRouter;