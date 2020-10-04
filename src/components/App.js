import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 얘는 사실, Boolean(userObj)로 대체가 가능함. 없어도 됨.
  const [userObj, setUserObj] = useState(null); // userObj는 어플리케이션의 가장 상위인 App.js에 존재해야 함.
  // EditProfile.js, Profile.js 등등 여러 곳에서 사용하기 때문에 Router로 보내서, Router에서 여러 곳으로 뿌려줄 수 있다.


  useEffect(() => {
    // 일종의 이벤트 리스너와 같다. auth의 state에 변화가 있는지를 듣고 있다가, 변화가 생기면 그에 맞는 행동을 취함.
    // user가 로그인하거나, 로그아웃하거나 할 때 변화가 생김.
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Twitter Clone</footer>
    </>
  );
  // 초기화가 되었으면 Router를 보여주고, 아니면 숨김
}

export default App;
