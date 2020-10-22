import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Tweet from "components/Tweet";
import "components/GetMyTweets.css";

const GetMyTweets = ({ userObj }) => {
    const [myTweets, setMyTweets] = useState([]);
    const [seeMyTweets, setSeeMyTweets] = useState(false);
    let isCancelled = false;

    const toggleMyTweets = () => {
        if(seeMyTweets) {
            setSeeMyTweets(false);
        } else {
            setSeeMyTweets(true);
        }
    };

    const getMyTweets = async () => {
        const tweets = await dbService
                    .collection("tweets")
                    .where("creatorId", "==", userObj.uid)
                    .orderBy("createdAt")
                    .get();
        // where은 필터링의 역할.
        // creatorId라는 field path의 값이 userObj.uid와 같은 애들을 필터링해줌.
        // 원한다면, where 뒤에 또 다른 where을 연달아 사용 가능.
        // orderBy를 추가하면 index가 필요하다는 에러가 발생하는데, index 만들어주면 됨.
    
        const myTweetsArray = tweets.docs.map((doc) => ({
            id : doc.id,
            ...doc.data()
        }));
        
        if(!isCancelled) {
            setMyTweets(myTweetsArray.sort((a, b) => b.createdAt - a.createdAt));
        }
    }

    useEffect(() => {
        if(seeMyTweets) {
            getMyTweets();
        } else {
            setMyTweets([]);
        }

        return () => {
            isCancelled = true;
        }
    }, [seeMyTweets]);
    
    return (
        <>
            <span className="formBtn getTweets" onClick={toggleMyTweets}>
                {seeMyTweets ? "Close My Tweets" : "Get My Tweets"}
            </span>
            {myTweets.map((tweet) => (<Tweet key={tweet.id} userObj={userObj} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />))}
        </>
    );
};

export default GetMyTweets;