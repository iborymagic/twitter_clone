import { storageService, dbService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faFeatherAlt } from "@fortawesome/free-solid-svg-icons";
import "components/TweetFactory.css";

const TweetFactory = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState(""); // attachment = file

    const onSubmit = async e => {
        if(tweet === "") {
            return;
        }

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
            creatorName : userObj.displayName,
            creatorImage : userObj.profileImage,
            creatorMail : userObj.email,
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

    const onClearAttachment = () => setAttachment("");

    return (
        <>
        <div className="factory__hello">
            Hello, <p className="user__name">{userObj.displayName ? userObj.displayName : 'User'}. </p>
            <br />Let me know your feelings.
        </div>
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input type="text" className="factoryInput__input" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120}></input>
                <button type="submit" className="factoryInput__arrow"><FontAwesomeIcon icon={faFeatherAlt} size="lg"/></button>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input type="file" id="attach-file" accept="image/*" onChange={onFileChange} />
            {/* 이미지 파일만 허용. 이미지 파일이기만 하면 뭐든 상관 x */}
            {attachment && 
                <>
                <div className="factoryForm__attachment">
                    <img alt="" src={attachment} className="factoryForm__img" style={{backgroundImage : attachment}} />
                </div>
                <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                </>
            }
            {/* attachment가 있을 때만 attachment를 보여준다. */}
        </form>
        </>
    );
};

export default TweetFactory;