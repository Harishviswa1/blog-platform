const firebaseConfig = {
  apiKey: "AIzaSyCEXq-7LH-psqH9KFQ_GWQU4zQLkyKqnsc",
  authDomain: "blog-application-4e658.firebaseapp.com",
  projectId: "blog-application-4e658",
  storageBucket: "blog-application-4e658.appspot.com",
  messagingSenderId: "588919300300",
  appId: "1:588919300300:web:52eb2f916537debce3a269"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let auth = firebase.auth();