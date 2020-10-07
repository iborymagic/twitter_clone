import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 얘는 사실, Boolean(userObj)로 대체가 가능함. 없어도 됨.
  const [userObj, setUserObj] = useState(null); // userObj는 어플리케이션의 가장 상위인 App.js에 존재해야 함.
  // EditProfile.js, Profile.js 등등 여러 곳에서 사용하기 때문에 Router로 보내서, Router에서 여러 곳으로 뿌려줄 수 있다.
  // 각각 따로따로 firebase.auth를 불러줘도 되지만, 이렇게 하면 한 곳에서만 userObj에 변화가 일어나도 그 즉시 전체적으로 변화가 일어나게 된다.


  useEffect(() => {
    // 일종의 이벤트 리스너와 같다. auth의 state에 변화가 있는지를 듣고 있다가, 변화가 생기면 그에 맞는 행동을 취함.
    // user가 로그인하거나, 로그아웃하거나 할 때 변화가 생김.
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName : user.displayName,
          uid : user.uid,
          updateProfile : (args) => user.updateProfile(args)
          // updateProfile은 원래 user 객체에 존재하는 메소드. 우리가 원하는 메소드를 포함한 객체를 만들기 위해 function을 하나 더 거치도록 만들어준 것. 메소드를 위한 중간 메소드.
        });
        // 근데 user 객체같은 경우는, console.log 해보면 객체의 덩어리가 너무 크다. 이런 경우에는 react.js가 state의 변화를 올바르게 파악할 수가 없음. 그래서 객체의 크기를 줄여줘야 한다.

      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    // Profile에서 user의 정보를 변경해줘도, Navigation은 변화가 없다.
    // Navigation은 firebase 자체에 연결되어있는 게 아닌, userObj에 간접 연결되어있기 때문.
    // 그래서 react.js의 state로 저장된 userObj를 직접 수정해줘야 한다.
    // setUserObj(authService.currentUser);
    // 역시나 state 변화를 올바르게 인지하기 위해 객체 크기를 줄여준다.
    const user = authService.currentUser;
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile : (args) => user.updateProfile(args)
    });
  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Twitter Clone</footer>
    </>
  );
  // 초기화가 되었으면 Router를 보여주고, 아니면 숨김
}

export default App;
