import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import GetMyTweets from "components/GetMyTweets";
import "routes/Profile.css";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [photo, setPhoto] = useState(userObj.profileImage);
    const [submitting, setSubmitting] = useState(false);
    const oldPhoto = userObj.profileImage;
    let isCancelled = false;

    const onSignOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (e) => {
        const {target : {value}} = e;
        setNewDisplayName(value);
    }

    const onFileChange = e => {
        const {target : {files}} = e;
        const theFile = files[0]; 
        const reader = new FileReader();
        reader.onloadend = finishedEvent => { // reader에 event listener 추가
            // reader에서 파일을 load하는 이벤트(아래의 readAsDataURL로 인해 일어남)가 end되는 순간,
            // 그 event를 finishedEvent 매개변수로 받아온다.
            
            // console.log(finishedEvent);
            // 얘를 console.log 찍어보면 result라는 property가 있음.
            // 걔를 브라우저 URL로 입력해보면 사진이 나옴.
            const {currentTarget : {result}} = finishedEvent;
            if(!isCancelled) {
                setPhoto(result);
            }
        }
        reader.readAsDataURL(theFile); // 사진 파일을 긴 문자열로 얻음
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        let photoUrl = userObj.profileImage;
        let displayName = userObj.displayName;
        let changed = false;

        setSubmitting(true);

        if(oldPhoto !== photo) {
            //const photoRef = storageService.ref().child(`${userObj.uid}_profile/${uuidv4()}`);
            const photoRef = storageService.ref(`profile/${userObj.uid}`); // 이렇게 하면 유저 하나당 하나의 프로필 사진
            // 이전과 달라진 게 없으면 submit이 안먹히도록 해야됨.
            const response = await photoRef.putString(photo, "data_url"); // storage에 사진 저장
            photoUrl = await response.ref.getDownloadURL();
            //console.log(await storageService.refFromURL(newPhotoUrl));

            const myTweets = await dbService.collection("tweets");
                
            myTweets.where("creatorId", "==", userObj.uid).get()
                .then(snapshots => {
                    if(snapshots.size > 0) {
                        snapshots.forEach(item => {
                            myTweets.doc(item.id).update({
                                creatorImage : photoUrl
                            });
                        });
                    }
                });

            changed = true;
        }
        
        if(userObj.displayName !== newDisplayName) {
            displayName = newDisplayName;
            changed = true;
        }
        
        if(changed) {
            await userObj.updateProfile({
                displayName : displayName,
                photoURL : photoUrl
            });
            refreshUser();
        }
        changed = false;

        setSubmitting(false);
    };

    useEffect(() => {
        return () => {
            isCancelled = true;
        }
    }, []);

    return(
        <div className="container">
            <form className="profile__photoForm">
                <div className="profile__photo">
                    {photo ? 
                    <img alt="" src={photo} className="profile__img" style={{backgroundImage : photo}} /> : 
                    <FontAwesomeIcon icon={faUserCircle} color={"#727b89"} size="10x" />
                    }
                </div>
                <label htmlFor="attach-file" className="profile__label">
                    <span>Add Profile Photo</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input type="file" id="attach-file" accept="image/*" onChange={onFileChange} />
            </form>
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" autoFocus placeholder="Display name" value={newDisplayName} className="formInput" />
                <input type="submit" value={submitting ? "Submitting.." : "Update Profile"} className="formBtn updateBtn" style={{ marginTop : 10 }} />
            </form>
            <GetMyTweets userObj={userObj} />
            <span className="formBtn logOut" onClick={onSignOutClick}>
                Log Out
            </span>
        </div>
    ); 
}