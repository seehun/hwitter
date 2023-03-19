import React,{useState} from 'react';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
    } from 'firebase/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
      faTwitter,
      faGoogle,
      faGithub,
    } from "@fortawesome/free-brands-svg-icons";

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
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <form onSubmit={onSubmit} className="container">
        <input type='email' placeholder='Email' value={email} onChange ={onChangeEmail} required className="authInput"/>
        <input type='password' placeholder='Password' value={password} onChange={onChangePassword}  required className="authInput"/>
        {/* <input type='submit' value='log in' /> */}
        {/* <button onClick={onSubmit}>{newAccount ? "Create Account" : "log in."}</button> */}
        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">{newAccount ? "log in." :"Create Account"}</span>
      <div className="authBtns">
        <button name="google" onClick={onSocialClick} className="authBtn">Continue with Google <FontAwesomeIcon icon={faGoogle}/> </button>
        <button name="github" onClick={onSocialClick} className="authBtn">Continue with Github <FontAwesomeIcon icon={faGithub} /></button>
      </div>
    </div>
  );
};
export default Auth;
