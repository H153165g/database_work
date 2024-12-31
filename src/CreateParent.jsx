import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postKids } from "./api";

export default function CreateParent() {
  const [grade, setGrade] = useState(""); // 学年の状態
  const [kidsname, setKidsname] = useState(""); // 子供の名前の状態
  const [kidspass, setKidspass] = useState(""); // 子供のパスワードの状態

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
  const email = localStorage.getItem("email");

  // サインアップ処理
  const signUp = () => {
    if (kidsname === "" || kidspass === "" || grade === "") {
      alert("すべての項目を入力してください。");
      return;
    }

    postKids({
      UserId: email,
      子Id: kidsname,
      子パスワード: kidspass,
      学年: grade,
    });

    navigate("/parent");
  };

  return (
    <div className="create-parent-container">
      <h2>子供の情報を入力してください</h2>

      <div className="input-group">
        <label>子供名</label>
        <input
          type="text"
          value={kidsname}
          onChange={(e) => setKidsname(e.target.value)}
          placeholder="子供の名前を入力"
        />
      </div>

      <div className="input-group">
        <label>子供のパスワード</label>
        <input
          type="password"
          value={kidspass}
          onChange={(e) => setKidspass(e.target.value)}
          placeholder="パスワードを入力"
        />
      </div>

      <div className="input-group">
        <label>子供の学年</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">--学年を選んでください--</option>
          {schools.map((school, index) => (
            <option key={index} value={school}>
              {school}
            </option>
          ))}
        </select>
      </div>

      <button onClick={signUp}>登録</button>
    </div>
  );
}
