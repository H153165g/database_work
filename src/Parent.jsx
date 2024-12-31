import { useEffect, useState } from "react";
import { delete_kids, getKids } from "./api";
import { useNavigate } from "react-router-dom";
import "./Parent.css";
export default function Parent() {
  const navigate = useNavigate();
  const status = localStorage.getItem("status");
  const email = localStorage.getItem("email");
  const [kids, setKid] = useState([]);
  const [dele, setDele] = useState(false);

  useEffect(() => {
    (async () => {
      const acounts = await getKids(email);
      console.log(acounts);
      setKid(acounts);
      localStorage.setItem("kid_data", JSON.stringify(acounts));
    })();
  }, []);

  function movepage(item) {
    localStorage.setItem("name", JSON.stringify(item));
    navigate("/kid");
  }

  if (status === "parent") {
    return (
      <div className="parent-container">
        <div className="mypage_header">
          <h1>マイページ</h1>
        </div>
        {kids.map((item) => (
          <div key={item["子Id"]} className="kid-item">
            <div
              className="kid-info"
              onClick={() => {
                movepage(item);
              }}
            >
              <div className="kid-id">子供ID: {item["子Id"]}</div>
              <div className="study-status">
                {item["勉強中"] !== "false" ? "勉強中" : "休憩中"}
              </div>
            </div>
            {dele && (
              <button
                className="delete-button"
                onClick={() => {
                  delete_kids({ UserId: email, 子Id: item["子Id"] });
                  alert("反映まで時間がかかります。ご注意ください。");
                  window.location.reload();
                }}
              >
                削除
              </button>
            )}
          </div>
        ))}
        <div className="action-buttons">
          <button onClick={() => navigate("./Crpa")}>子供の追加</button>
          <button onClick={() => navigate("./item")}>未承認の勉強記録</button>
          <button
            onClick={() => {
              setDele(!dele);
              if (!dele)
                alert("これから現れる削除ボタンを押すと本当に削除されます。");
            }}
          >
            削除モード{!dele ? "を起動する" : "を取り消す"}
          </button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  } else {
    return <div className="not-found">ページが見つかりません</div>;
  }
}
