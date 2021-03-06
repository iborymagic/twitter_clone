import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import "routes/Home.css";

const Home = ({userObj}) => {
    const [tweets, setTweets] = useState([]);
    let isCancelled = false;
    // const [visibleTweets, setVisibleTweets] = useState(0);

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
        
    // 현재 불러온 데이터의 끝까지 스크롤이 되면 visibleTweets를 5 더해줌
    /*
    const infiniteScroll = () => {
        let scrollbarTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop);
        let contentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

        if(document.documentElement.clientHeight + scrollbarTop >= contentHeight) {
            // setVisibleTweets(visibleTweets + 5);
        }
    }
    */
    useEffect(() => {
        // window.addEventListener("scroll", infiniteScroll);

        // getTweets();

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

            if(!isCancelled) {
                setTweets(tweetArray.sort((a, b) => b.createdAt - a.createdAt));
            }
        }, (error) => {
        });
        /*
        return () => {
            window.removeEventListener("scroll", infiniteScroll);
        };
        */
       return () => {
           isCancelled = true;
       };
    }, []);

    // visibleTweets의 변경에 대응하는 useEffect
    /*
    useEffect(() => {
        dbService.collection("tweets").onSnapshot(snapshot => {
            const tweetArray = snapshot.docs.slice(visibleTweets, visibleTweets + 5).map(doc => ({
                id : doc.id,
                ...doc.data() 
            }));
            setTweets(tweets.concat(...tweetArray).sort((a, b) => b.createdAt - a.createdAt));
        }, (error) => {
        });
    }, [visibleTweets]);
*/
    return(
        <div className="container">
            <TweetFactory userObj={userObj} />
            <div className="tweet__list">
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} userObj={userObj} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
// 참고로, 하나의 component 내부에서 너무 많은 것들을 하면 안된다. 분리가 필요함.

export default Home;