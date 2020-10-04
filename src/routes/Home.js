import Tweet from "components/Tweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({userObj}) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);

    // const getTweets = async () => {
    //     // async여야 하기 때문에 별도의 함수로 분리
    //     const dbTweets = await dbService.collection("tweets").get();
    //     dbTweets.forEach(document => {
    //         // tweets 배열에다가 dbTweets의 데이터를 집어넣음.
    //         // 기존에 있던 원소들을 유지하기 위해 ...prev로 걔네들도 넣어줌.
    //         const tweetObject = {
    //             ...document.data(),
    //             id : document.id
    //         }
    //         setTweets((prev) => [tweetObject, ...prev]);
    //          // setter 함수의 매개변수로 함수를 넣어주면, 해당 state의 이전 값을 받아올 수 있음.
    //     });
    // }

    useEffect(() => {
        //getTweets();

        // Snapshot을 리스너로 사용하는 방법(실시간 갱신이 가능)
        // snapshot은 데이터베이스에 create, read, update, delete 등 어떤 일이 일어나건 간에 알림을 받게 된다.
        // getTweets와 하는 역할은 동일하지만, re-render가 되지 않는다는 장점이 있다.
        dbService.collection("tweets").onSnapshot(snapshot => {
            // database의 snapshot을 가져와서 배열로 만들어줌.
            // query를 이용하는 게 아니라 snapshot을 이용하기 때문에, 실시간으로 확인이 가능하다.
            const tweetArray = snapshot.docs.map(doc => ({
                id : doc.id,
                ...doc.data() 
            }));
            setTweets(tweetArray);
        });
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        await dbService.collection("tweets").add({
            text : tweet,
            createdAt : Date.now(),  
            creatorId : userObj.uid // userObj의 uid를 creatorID로 지정. 가입된 사용자의 고유한 id임.
        });
        setTweet("");
    };

    const onChange = e => {
        const {target : {value}} = e;
        setTweet(value);
    };

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Tweet"></input>
            </form>
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};

export default Home;