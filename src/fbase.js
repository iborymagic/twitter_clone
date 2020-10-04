import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
};
// CRA 사용 시에는 환경변수의 이름이 REACT_APP으로 시작해야한다. 반드시.
// .env의 사용은 실제 빌드 시에는 보안에 도움이 되지 않는다. 깃헙에 올릴 때만 도움이 되는 것.
// .env는 루트 디렉토리에 있어야 함.

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();