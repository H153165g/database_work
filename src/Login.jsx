import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { getPublishers } from "./api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [useraccount, setUseraccount] = useState([]);
  const [username, setUsername] = useState("");
  const [userpass, setUserpass] = useState("");
  const [loginacount, setLoginacount] = useState(false);
  const [loginmail, setLoginmail] = useState(false);
  const [acount, setAcount] = useState({});

  useEffect(() => {
    (async () => {
      localStorage.clear();
      const acounts = await getPublishers(email);
      console.log(acounts);
      setAcount(acounts[0]);
    })();
  }, [loginmail]);

  function SignIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("ログイン成功:", user["email"]);
        setLoginacount(user["email"]);
        setLoginmail(true);
      })
      .catch((error) => {
        console.error("ログインエラー:", error.message);
        alert("メールアドレスが間違っているか、パスワードが間違っています。");
      });
  }

  function signacount() {
    let sta = false;
    if (acount["親Id"] === username && acount["親パスワード"] === userpass) {
      localStorage.setItem("status", "parent");
      localStorage.setItem("kid", JSON.stringify(acount["子供"]));
      localStorage.setItem("email", loginacount);
      navigate("/parent");
      sta = true;
    } else {
      acount["子供"].forEach((item) => {
        if (item["子Id"] === username && item["子パスワード"] === userpass) {
          localStorage.setItem("status", "kid");
          localStorage.setItem("name", JSON.stringify(item));
          localStorage.setItem("学年", item["学年"]);
          localStorage.setItem("email", loginacount);
          navigate("/kid");
          sta = true;
        }
      });
    }
    if (!sta) alert("名前またはパスワードが間違っています。");
  }

  return (
    <div className="login-container">
      {loginmail ? (
        <div className="user-info-form">
          <h2>ユーザ情報を入力してください</h2>
          <div className="form-group">
            <label>名前</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="名前を入力してください"
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              value={userpass}
              onChange={(e) => setUserpass(e.target.value)}
              placeholder="パスワードを入力してください"
            />
          </div>
          <div className="button-group">
            <button onClick={signacount}>ログイン</button>
            <button
              onClick={() => {
                signOut(auth);
                setLoginmail(false);
              }}
            >
              戻る
            </button>
          </div>
        </div>
      ) : (
        <div className="login-form">
          <h2>ログインまたは新規登録</h2>
          <div className="form-group">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button onClick={SignIn}>ログイン</button>
            <button onClick={() => navigate("./addacount")}>新規登録</button>
          </div>
        </div>
      )}
    </div>
  );
}
