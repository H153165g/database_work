import { useEffect, useState } from "react";
import { get_itemfalse, getkids_study, update_study } from "./api";
import { useNavigate } from "react-router-dom";
import "./Items.css";

export default function Items() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function itemAuther(item) {
    const times = item["時間"].split(":").map(Number);
    const hours = times[0];
    const minutes = times[1] / 60;

    try {
      const cleanId = item["子id"];
      const study = await getkids_study({ UserId: email, 子Id: cleanId });

      if (!study || study.length === 0) {
        console.error("該当するデータが見つかりませんでした。");
        return;
      }

      const hourlyRate = study[0] ? study[0]["時給"] : study["時給"];
      const money = Number(hourlyRate * (hours + minutes));
      const isoTime = new Date(item["投稿時間"]).toISOString();

      await update_study({
        UserId: email,
        金額: money,
        教科: item["教科"],
        時間: times[0],
        子Id: cleanId,
        時刻: isoTime,
      });

      window.location.reload();
    } catch (error) {
      console.error("承認エラー:", error);
    }
  }

  async function fetchData() {
    try {
      const item = await get_itemfalse({
        UserId: email,
        shounin: "false",
        kid: "",
      });
      setData(item || []);
    } catch (error) {
      console.error("データ取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [email]);

  if (loading) {
    return <div className="items-loading">少々お待ちください。</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="items-container">
        <div className="items-no-data">
          <h2>投稿がありません</h2>
          <button onClick={() => navigate("/parent")}>戻る</button>
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
  }

  return (
    <div className="items-container">
      {data.map((item, index) => (
        <div key={index} className="item-card">
          <h2 className="item-title">
            {item["子id"]}さん {item["学年"]}
          </h2>
          <p className="item-time">{item["時間"]}</p>
          <p className="item-content">{item["内容"]}</p>
          <div className="item-buttons">
            <button className="item-button-delete">削除</button>
            <button
              className="item-button-approve"
              onClick={() => itemAuther(item)}
            >
              承認
            </button>
          </div>
        </div>
      ))}

      <div className="items-navigation">
        <button onClick={() => navigate("/parent")}>戻る</button>
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
}
