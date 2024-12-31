import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { postKids, postParents } from "./api";
import "./Addacount.css";
export default function Addacount() {
  const [grade, setGrade] = useState("");
  const schools = [
    "小学1年生",
    "小学2年生",
    "小学3年生",
    "小学4年生",
    "小学5年生",
    "小学6年生",
    "中学1年生",
    "中学2年生",
    "中学3年生",
    "高校1年生",
    "高校2年生",
    "高校3年生",
  ];

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentname, setParentname] = useState("");
  const [parentpass, setParentpass] = useState("");
  const [kidsname, setKidsname] = useState("");
  const [kidspass, setKidspass] = useState("");
  function SignUp() {
    console.log("AAA");
    let au = true;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("新規登録成功:", user);
        alert("新規登録が完了しました。ログインしてください。");
        postParents({
          UserId: user["email"],
          親Id: parentname,
          親パスワード: parentpass,
        });
        postKids({
          UserId: user["email"],
          子Id: kidsname,
          子パスワード: kidspass,
          学年: grade,
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error("新規登録エラー:", error.message);
        alert("そのメールアドレスは使用されています。");
        au = false;
      });
  }

  return (
    <div className="container">
      <div className="form-header">
        <h2>アカウントの登録</h2>
      </div>
      <div className="form-group">
        <input
          type="email"
          className="input-field"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="input-field"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="parent-info">
        <h3>保護者の情報入力</h3>
        <div className="form-group">
          <input
            type="text"
            className="input-field"
            placeholder="保護者名"
            value={parentname}
            onChange={(e) => setParentname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="input-field"
            placeholder="保護者パスワード"
            value={parentpass}
            onChange={(e) => setParentpass(e.target.value)}
          />
        </div>
      </div>

      <div className="child-info">
        <h3>子供の情報入力</h3>
        <div className="form-group">
          <input
            type="text"
            className="input-field"
            placeholder="子供名"
            value={kidsname}
            onChange={(e) => setKidsname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="input-field"
            placeholder="子供のパスワード"
            value={kidspass}
            onChange={(e) => setKidspass(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select
            className="select-field"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">--学年を選んでください--</option>
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="submit-btn"
        onClick={() => validateInputs() && SignUp()}
      >
        登録
      </button>
      <button className="back-button" onClick={() => navigate("/")}>
        戻る
      </button>
    </div>
  );
}
