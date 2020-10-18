import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "components/Tweet.css";

const Tweet = ({tweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false); // editing mode인지를 알려주는 boolean
    const [newTweet, setNewTweet] = useState(tweetObj.text); // input에 입력된 text를 가져다 update해줌

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        if(ok) {
            // doc(document)의 id를 알고있기 때문에 삭제의 구현이 어렵지 않다.
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
            if(tweetObj.attachmentUrl) {
                await storageService.refFromURL(tweetObj.attachmentUrl).delete();
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);
    
    const onSubmit = async e => {
        // update tweet 구현
        e.preventDefault();
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text : newTweet
        });
        toggleEditing();
    };

    const onChange = e => {
        // update tweet input의 내용이 변하면 그대로 newTweet에 적용
        const {target : {value}} = e;
        setNewTweet(value);
    };

    return (
        <div className="tweet" key={tweetObj.id}>
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container tweetEdit">
                        <input type="text" placeholder="Edit your tweet!" onChange={onChange} value={newTweet} required autoFocus className="formInput"/>
                        <input type="submit" value="Update tweet" className="formBtn updateBtn" />
                        <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
                    </form>
                </>
            ) : (
                <>
                    
                    {tweetObj.creatorImage ? <div className="creator_img_frame"><img className="creator_img" alt="" src={tweetObj.creatorImage} /></div> : <FontAwesomeIcon icon={faUserCircle} size="3x" color={"gray"} />}
                
                    <div className="tweet_content">
                        <h1>{tweetObj.creatorName ? tweetObj.creatorName : tweetObj.creatorMail}</h1>
                        <h2>{tweetObj.creatorMail}</h2>
                        <h4>{tweetObj.text}</h4>
                        {tweetObj.attachmentUrl && <div className="tweet_imgFrame"><img className="tweet_img" alt="" src={tweetObj.attachmentUrl} /></div>}
                        {/* 트윗을 삭제하거나 수정하는 버튼이 해당 트윗의 작성자에게만 보이도록 */}
                        {isOwner && (
                            <>
                                <div className="tweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} color={"white"} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} color={"white"} />
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                
                </>
            )}
        </div>
    )
};

export default Tweet;