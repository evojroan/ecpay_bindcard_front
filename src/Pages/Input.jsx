import {useState} from "react";
import "../App.css";
import axios from "axios"; // npm i axios
import {useNavigate} from "react-router-dom"; //   npm install react-router-dom

export default function Input({
  backendurl,
  setToken,
  MerchantID,
  MerchantMemberID,
  getCurrentTime,
  setMerchantTradeNo,
  setMerchantMemberID,
}) {
  const navigate = useNavigate();
  const Timestamp = Math.floor(Date.now() / 1000);
  

  const [Unit, setUnit] = useState(1);
  const [TotalAmount, setTotalAmount] = useState(100);
  const [Name, setName] = useState("測試帳號三");
  const [Phone, setPhone] = useState("0912345678");
  const [Email, setEmail] = useState("3002607@test.com");
  const [isClicked, setIsClicked] = useState(false);
  const price = 100;
  const OrderResultURL = `${backendurl}/OrderResultURL`;
  const ReturnURL = "https://www.ecpay.com.tw/";
  const latestMerchantTradeNo = `emb${getCurrentTime().string}`;
  const MerchantTradeDate = `${getCurrentTime().time}`;
  const TradeDesc = "站內付 2.0 綁定信用卡範例";
  const ItemName = "測試商品";

  const Data = {
    MerchantID: MerchantID,

    ConsumerInfo: {
      MerchantMemberID: MerchantMemberID,
      Name: Name,
      Phone: Phone,
      Email: Email
    },

    OrderInfo: {
      MerchantTradeDate: MerchantTradeDate,
      MerchantTradeNo: latestMerchantTradeNo,
      TotalAmount: TotalAmount,
      TradeDesc: TradeDesc,
      ItemName: ItemName,
      ReturnURL: ReturnURL
    },
   
    OrderResultURL: OrderResultURL
  };
  const GetTokenByBindingCardPayload = {
    MerchantID: MerchantID,
    RqHeader: {Timestamp: Timestamp},
    Data: Data
  };

  async function handleSubmit() {
    setMerchantTradeNo(latestMerchantTradeNo);
    setIsClicked(true);
    try {
      const response = await axios.post(
        `${backendurl}/GetTokenbyBindingCard`,

        GetTokenByBindingCardPayload
      );

      setToken(response.data);
      navigate("/payment");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="paramsInput">
        <div className="purchase-info">
          <h2>請輸入購買數量</h2>
          <p>價格：{price}元/份</p>
          <p>
            <input
              value={Unit}
              id="Unit"
              type="number"
              min="1"
              max="100"
              onChange={e => {
                const newUnit = Math.min(
                  100,
                  Math.max(1, parseInt(e.target.value) || 1)
                );
                setUnit(newUnit);
                setTotalAmount(newUnit * price);
              }}
            />
          </p>
          總額：{TotalAmount}元
        </div>

        <div className="purchase-info">
          <h2>請輸入購買資訊</h2>
          <p>
            <label>姓名</label>
            <input
              id="Name"
              type="text"
              maxLength="50"
              onChange={e => setName(e.target.value)}
              value={Name}
            />
          </p>
          <p>
            <label>消費者會員編號</label>
            <input
              id="MerchantMemberID"
              type="text"
              maxLength="60"
              onChange={e => setMerchantMemberID(e.target.value)}
              value={MerchantMemberID}
            />
          </p>
          <p>
            <label>電話</label>
            <input
              id="Phone"
              type="tel"
              maxLength="60"
              onChange={e => {
                const inputValue = e.target.value.replace(/\D/g, "");
                setPhone(inputValue);
              }}
              value={Phone}
            />
          </p>
          <p>
            <label>電子郵件</label>
            <input
              id="Email"
              type="email"
              maxLength="30"
              onChange={e => setEmail(e.target.value)}
              value={Email}
            />
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isClicked}>
          {isClicked ? "送出中" : "送出"}
        </button>
      </div>

      <div
        id="ECPayPayment"
        className="PaymentUI"></div>
    </>
  );
}
