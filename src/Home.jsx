import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_item } from "./api";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [gra, setGra] = useState(""); // 学年選択
  const [stu, setStu] = useState("");
  const [data, setData] = useState([]); // データ状態
  const [page, setPage] = useState(1); // 現在のページ番号
  const studies = ["外国語", "数学", "国語", "理科", "社会"];
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

  const fetchItems = async () => {
    try {
      const item = await get_item(gra, stu, page);
      setData(item);
    } catch (error) {
      console.error("データ取得エラー:", error);
      setData([]);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchItems();
  }, [gra, stu]);

  // useEffect(() => {
  //   if (gra !== "") {
  //     fetchItems(); // ページ変更時にデータ取得
  //   }
  // }, [page]);

  const handleNavigation = () => {
    const status = localStorage.getItem("status");
    if (status === null) {
      navigate("/login");
    } else if (status === "kid") {
      navigate("/kid");
    } else {
      navigate("/parent");
    }
  };

  return (
    <div className="home-container">
      {/* ログイン・マイページボタン */}
      <div className="home-login-button">
        <button onClick={handleNavigation}>
          {localStorage.getItem("status") === null
            ? "ログイン　または　新規登録"
            : "マイページへ"}
        </button>
      </div>
      <header className="home-header">
        <h1>最近のみんなの勉強記録</h1>
      </header>

      {/* 学年選択セレクトボックス */}
      <div className="home-select-container">
        <select
          className="home-select"
          value={gra}
          onChange={(e) => setGra(e.target.value)}
        >
          <option value="">--学年を選んでください--</option>
          {schools.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="home-select"
          value={stu}
          onChange={(e) => setStu(e.target.value)}
        >
          <option value="">--教科を選んでください--</option>
          {studies.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* データ表示 */}
      <div className="home-data-container">
        {data.length === 0 ? (
          <div className="home-no-data">少々お待ちください。</div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="home-data-item">
              <h2 className="home-data-title">
                {item["子id"]}さん {item["学年"]}
              </h2>
              <p className="home-data-content">{item["内容"]}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
