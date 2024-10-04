import {useEffect, useState} from "react";
import axios from "axios"; // npm i axios
import {useNavigate} from "react-router-dom"; //   npm i react-router-dom

export default function Payment({
  backendurl,
  MerchantID,
  MerchantMemberID,
  setPaymentInfo,
  Token,
  Language,
  ServerType,
  IsLoading
}) {
  const navigate = useNavigate();

  const [paymentRendered, setPaymentRendered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [BindCardPayToken, setBindCardPayToken] = useState("");
  const [ThreeDURL, setThreeDURL] = useState("");
  const [UnionPayURL, setUnionPayURL] = useState("");
  const Timestamp = Math.floor(Date.now() / 1000);
  const Data = {
    PlatformID: "",
    MerchantID: MerchantID,
    BindCardPayToken: BindCardPayToken,
    MerchantMemberID: MerchantMemberID
  };

  const CreateBindCardPayload = {
    MerchantID: MerchantID,
    RqHeader: {Timestamp: Timestamp},
    Data: Data
  };

  useEffect(() => {
    if (!window.ECPayInitialized) {
      window.ECPay.initialize(ServerType, IsLoading, function (errMsg) {
        if (errMsg) {
          console.error(errMsg);
        } else {
          window.ECPay.addBindingCard(Token, Language, function (errMsg) {
            if (errMsg) {
              console.error(errMsg);
            } else {
              setPaymentRendered(true);
              window.ECPayInitialized = true; // 標記為已初始化
            }
          });
        }
      });
    } else {
      // 如果已經初始化，直接呼叫 addBindingCard
      window.ECPay.addBindingCard(Token, Language, function (errMsg) {
        if (errMsg) {
          console.error(errMsg);
        } else {
          setPaymentRendered(true);
        }
      });
    }
  }, [Token, Language, ServerType, IsLoading]);

  //等待取得 Paytoken
  useEffect(() => {
    if (BindCardPayToken) {
      handleAddBindingCard();
    }
  }, [BindCardPayToken]); //useCallback 尚待解決

  //等待取得 ThreeDURL
  useEffect(() => {
    if (ThreeDURL) {
      window.location.href = ThreeDURL.replace(/^"|"$/g, "");
    } else if (UnionPayURL) {
      window.location.href = UnionPayURL.replace(/^"|"$/g, "");
    }
  }, [ThreeDURL, UnionPayURL]);

  //取得 Paytoken 後，立即以 addBindingCardPayload 呼叫後端
  async function handleAddBindingCard() {

    console.log("CreateBindCardPayload為：",CreateBindCardPayload)

    try {
      const response = await axios.post(
        `${backendurl}/CreateBindCard`,
        //"http://localhost:3000/addBindingCard",
        CreateBindCardPayload
      );
      if (response.data.ThreeDInfo.ThreeDURL) {
        setThreeDURL(response.data.ThreeDInfo.ThreeDURL);
      } else if (response.data.UnionPayInfo.UnionPayURL) {
        setUnionPayURL(response.data.UnionPayInfo.UnionPayURL);
      } else {
        setPaymentInfo(response.data);
        navigate("/PaymentInfoPage");
      }

      //addBindingCard 還要 3D 驗證。
    } catch (error) {
      console.error(error);
    }
  }

  //SDK 取得 BindingCardPaytoken
  function handleGetBindCardPayToken() {
    ECPay.getBindCardPayToken(function (BindCardPayToken, errMsg) {
      if (errMsg) {
        console.error(errMsg);
        return;
      }
      setBindCardPayToken(BindCardPayToken.BindCardPayToken);
      setIsClicked(true);
    });
  }

  return (
    <div>
      <h2>綠界站內付 2.0 綁定信用卡畫面</h2>

      <div id="PaymentComponent">
        <div id="ECPayPayment"> </div>
        {paymentRendered && (
          <button
            onClick={handleGetBindCardPayToken}
            disabled={isClicked}>
            {isClicked ? "付款中" : "付款"}
          </button>
        )}
      </div>
    </div>
  );
}
