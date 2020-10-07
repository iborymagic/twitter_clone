import Tweet from "components/Tweet";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";

const Home = ({userObj}) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState(""); // attachment = file

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
        let attachmentUrl = "";
        if(attachment !== "") { // attachment를 올리지 않을 수도 있으므로.
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text : tweet,
            createdAt : Date.now(),  
            creatorId : userObj.uid, // userObj의 uid를 creatorID로 지정. 가입된 사용자의 고유한 id임.
            attachmentUrl : attachmentUrl
        }
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    };

    const onChange = e => {
        const {target : {value}} = e;
        setTweet(value);
    };

    const onFileChange = e => {
        const {target : {files}} = e;
        const theFile = files[0]; // 어차피 파일은 하나만 올릴거니까.
        // file을 읽기 위해 fileReader API를 사용
        const reader = new FileReader();
        reader.onloadend = finishedEvent => { // reader에 event listener 추가
            // reader에서 파일을 load하는 이벤트가 end되는 순간,
            // 그 event를 finishedEvent 매개변수로 받아온다.
            
            // console.log(finishedEvent);
            // 얘를 console.log 찍어보면 result라는 property가 있음.
            // 걔를 브라우저 URL로 입력해보면 사진이 나옴.
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile); // 사진 파일을 긴 문자열로 얻음

    };

    const onClearAttachment = () => setAttachment(null);

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120}></input>
                <input type="file" accept="image/*" onChange={onFileChange} />
                {/* 이미지 파일만 허용. 이미지 파일이기만 하면 뭐든 상관 x */}
                <input type="submit" value="Tweet"></input>
                {attachment && 
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>}
                {/* attachment가 있을 때만 attachment를 보여준다. */}
            </form>
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
// 참고로, 하나의 component 내부에서 너무 많은 것들을 하면 안된다. 분리가 필요함.

export default Home;