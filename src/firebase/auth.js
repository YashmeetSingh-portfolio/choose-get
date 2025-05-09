import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification
} from "firebase/auth";
  import { auth } from "./firebase";
  
  // Authentication functions
  export const doCreateUserWithEmailAndPassword = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification email immediately after signup
    await sendEmailVerification(userCredential.user);
    alert("Verification email sent. Please check your inbox.");
    return userCredential;
  };
  
  
  export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider); // Only call once
  };
  
  export const doSignOut = async () => {
    return signOut(auth);
  };
  
  export const doPasswordReset = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  export const doPasswordUpdate = async (password) => {
    if (auth.currentUser) {
      return updatePassword(auth.currentUser, password);
    }
    throw new Error("No user is currently signed in.");
  };
  
  export const doSendEmailVerification = async () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
    throw new Error("No user is currently signed in.");
  };