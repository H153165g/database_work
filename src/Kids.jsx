import { useEffect, useState } from "react";
import { change_pay, get_itemfalse, getkids_study, post_pay } from "./api";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./Kids.css";

// Chart.jsを登録
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default function Kids() {
  const navigate = useNavigate();
  const state = localStorage.getItem("status");
  const name = JSON.parse(localStorage.getItem("name"));
  const id = localStorage.getItem("email");
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 現在のページ
  const itemsPerPage = 10; // 1ページあたりの項目数
  const [pay, setPay] = useState(100);
  const [payAuth, setPayAuth] = useState(false);

  function study() {
    navigate("./study");
    return;
  }

  if (name != null) {
    useEffect(() => {
      (async () => {
        const kid = await getkids_study({ UserId: id, 子Id: name["子Id"] });
        console.log(name["学年"]);
        setData(kid[0]);
      })();
    }, []);

    useEffect(() => {
      async function fetchData() {
        try {
          const offset = currentPage * itemsPerPage; // オフセットを計算
          const item = await get_itemfalse(
            { UserId: id, shounin: "true", kid: name["子Id"] },
            itemsPerPage,
            offset
          );
          setData2(item);
        } catch (error) {
          console.error("データ取得エラー:", error);
        }
      }
      fetchData();
    }, [currentPage, id]);

    if (data != null) {
      // 勉強時間の合計を計算
      const totalStudyTime =
        data["外国語"] +
        data["国語"] +
        data["数学"] +
        data["理科"] +
        data["社会"];

      // 円グラフ用のデータセット
      const chartData = {
        labels: ["外国語", "国語", "数学", "理科", "社会"], // ラベル
        datasets: [
          {
            data: [
              data["外国語"],
              data["国語"],
              data["数学"],
              data["理科"],
              data["社会"],
            ], // 各科目の勉強時間（分）
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF8E72",
              "#8E44AD", // セクションの色
            ],
            borderWidth: 1, // セクションの境界線の太さ
          },
        ],
      };

      // 円グラフにポイントした際に表示されるツールチップの設定
      const options = {
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const hours = tooltipItem.raw / 60; // 分を時間に変換
                return `${tooltipItem.label}: ${hours}時間`;
              },
            },
          },
        },
      };

      return (
        <div className="container">
          {state == "parent" ? (
            <div className="mypage_header">
              <h1>{name["子Id"]}のページ</h1>
            </div>
          ) : (
            <div className="mypage_header">
              <h1>マイページ</h1>
            </div>
          )}
          <div className="allowance-info">
            今月のお小遣い: {data["お小遣い"]}円
          </div>
          <div className="hourly-wage">現在の時給: {data["時給"]}円</div>

          {/* 勉強時間が0の場合 */}
          {totalStudyTime > 0 ? (
            <div className="study-time-container">
              <h3>勉強時間の割合</h3>
              <Pie data={chartData} options={options} />
            </div>
          ) : (
            <div className="no-study-time">勉強の記録がここに表示されます</div>
          )}

          {state == "parent" ? (
            <div className="parent-actions">
              {!payAuth ? (
                <button
                  onClick={() => {
                    setPayAuth(true);
                  }}
                >
                  時給を変更する
                </button>
              ) : (
                <div>
                  <textarea
                    id="number"
                    value={pay}
                    onChange={(e) => setPay(e.target.value)}
                    placeholder="時給を入力してください"
                  />
                  <label className="writestudy-label">円</label>

                  <button
                    className="writestudy-button"
                    onClick={() => {
                      const parsedPay = Number(pay); // payを数値に変換
                      if (Number.isInteger(parsedPay)) {
                        change_pay({
                          時給: parsedPay, // 数値として渡す
                          UserId: id,
                          子Id: name["子Id"],
                        });
                        alert("反映まで少々時間がかかります");
                        window.location.reload();
                        setPayAuth(false);
                      } else {
                        alert(
                          "入力した値が正しくありません。整数で入力してください。"
                        );
                      }
                    }}
                  >
                    送信
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  post_pay({ UserId: id, 子Id: name["子Id"] });
                  alert("必ずお支払いください");
                }}
              >
                お小遣いを支払う
              </button>
            </div>
          ) : (
            <div className="child-actions">
              <button onClick={study}>勉強を始める</button>
            </div>
          )}

          <div>
            <h1>今までやった勉強内容</h1>

            {data2 != null ? (
              <div className="subjects">
                {data2.map((item, index) => (
                  <div className="subject-item" key={index}>
                    <h3>教科:{item["教科"]}</h3>
                    <h3>勉強した時間:</h3>
                    <h3>{item["時間"]}</h3>
                    <h3>内容:</h3>
                    <h3>{item["内容"]}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading">少々お待ちください。</div>
            )}

            {/* ページングボタン */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                前へ
              </button>
              <span> {currentPage + 1}</span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={data2 == null || data2.length < itemsPerPage}
              >
                次へ
              </button>
            </div>
          </div>

          {state == "parent" && (
            <button onClick={() => navigate("/parent")}>戻る</button>
          )}

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
      );
    } else {
      return <div>少々お待ちください。</div>;
    }
  } else {
    return <div>ページが見つかりません</div>;
  }
}
