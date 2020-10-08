import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "routes/Profile.css";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onSignOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const getMyTweets = async () => {
        // where은 필터링의 역할.
        const tweets = await dbService
                        .collection("tweets")
                        .where("creatorId", "==", userObj.uid)
                        .orderBy("createdAt")
                        .get();
        // creatorId라는 field path의 값이 userObj.uid와 같은 애들을 필터링해줌.
        // 원한다면, where 뒤에 또 다른 where을 연달아 사용 가능.
        // orderBy를 추가하면 index가 필요하다는 에러가 발생하는데, index 만들어주면 됨.
        // console.log(tweets.docs.map((doc) => doc.data()));
    };

    const onChange = (e) => {
        const {target : {value}} = e;
        setNewDisplayName(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            // displayName에 변경이 없으면, profile을 update하지 않음.
            // firestore의 한계점이 드러나는 부분. UpdateProfile로는 displayName과 photoURL정도밖에 수정할 수 없다.
            // 만약 유저 정보를 더 많이 담고싶다면, user라는 이름의 collection을 만들어 유저 하나 당 document를 만들고, 거기다가 정보를 저장하는 방식을 사용하면 됨.
            const response = await userObj.updateProfile({
                displayName : newDisplayName
            });
            refreshUser();
            // firestore에 있는 profile을 고친 후, react.js에 있는 profile도 바로 refresh 해준다. -> 화면에 실시간 적용
        }
    }

    useEffect(() => {
        getMyTweets();
    }, []);

    return(
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" autoFocus placeholder="Display name" value={newDisplayName} className="formInput" />
                <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop : 10 }} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onSignOutClick}>
                Sign Out
            </span>
        </div>
    ); 
}