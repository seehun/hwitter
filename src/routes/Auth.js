import React,{useState} from 'react';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
    } from 'firebase/auth';

const Auth = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChangeEmail=(e)=>{
        setEmail(e.currentTarget.value);
    }

    const onChangePassword=(e)=>{
        setPassword(e.currentTarget.value);
    }

    const onSubmit= async(e)=>{
        e.preventDefault();
        try{
            let data;
            const auth = getAuth();
            if(newAccount){
                //create account
                data =await createUserWithEmailAndPassword(auth, email, password)
            }
            else{
                //login
                data = await signInWithEmailAndPassword(auth, email, password)
            }
            console.log(data);
        }
        catch(error){
            console.log(error.message);
            setError(error.message);
        }
        
    }
    const toggleAccount =() => setNewAccount(!newAccount);
    const onSocialClick=(e)=>{
        const auth = getAuth();
        let provider;
        if (e.target.name === "google"){
            provider = new GoogleAuthProvider();
        }else if(e.target.name ==="github"){
            provider = new GithubAuthProvider();
        }
        signInWithPopup(auth, provider)
        .then((result)=>{
            console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

  return (
    <div>
      <form>
        <input type='email' placeholder='Email' value={email} onChange ={onChangeEmail} required />
        <input type='password' placeholder='Password' value={password} onChange={onChangePassword}  required />
        {/* <input type='submit' value='log in' /> */}
        <button onClick={onSubmit}>{newAccount ? "Create Account" : "log in."}</button>
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "log in." :"Create Account"}</span>
      <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button>
        <button name="github" onClick={onSocialClick}>Continue with Github</button>
      </div>
    </div>
  );
};
export default Auth;
