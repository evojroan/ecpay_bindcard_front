# 綠界站內付 2.0 信用卡綁定

## 這是什麼？

這是串接綠界金流站內付 2.0 信用卡綁定的範例，分別以 React 與 Node.js 實作前後端。

說明文章：

前端頁面：

後端 Repo：

## 待完成、優化功能

- [x] 1. 付款方式選 ATM 回傳的付款資訊
- [x] 2. 付款方式選 BARCODE 回傳的付款資訊
- [x] 3. 付款方式選 CVS 回傳的付款資訊
- [ ] 4. ApplePay 付款方式
- [ ] 5. ReturnURL
- [x] 6. OrderResultURL
- [x] 7. Input.jsx 按鈕不可重複按
- [ ] 8. Input 頁面可以切換語言
- [ ] 9. 所有頁面如果有 error，要於前端顯示，不要只顯示於 console.log

## 待解決問題

- [ ] 1.  進到 Payment 頁面後，Uncaught TypeError: i is not a function
- [ ] 2.  Payment.jsx 尚待解決 useCallback 問題：

```
useEffect(() => {
    if (PayToken) {
      handleCreatePayment();
    }
  }, [PayToken]);
```

### 整理管理

- [ ] 1. 用 Reducer 管理所有狀態
- [ ] 2. 用 useContext 傳遞狀態
