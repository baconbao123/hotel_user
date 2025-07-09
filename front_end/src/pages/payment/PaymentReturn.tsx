import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const PaymentResult = () => {
  const [status, setStatus] = useState("Đang kiểm tra...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const txnRef = queryParams.get("vnp_TxnRef");
      const responseCode = queryParams.get("vnp_ResponseCode");
      const transDate = queryParams.get("vnp_TransDate");

      if (!txnRef) {
        setStatus("Mã giao dịch không hợp lệ! 😵");
        return;
      }

      // Hiển thị trạng thái sơ bộ dựa trên responseCode
      if (responseCode === "00") {
        setStatus("Thanh toán có vẻ thành công, đang kiểm tra lại... 😎");
      } else {
        setStatus(
          `Giao dịch thất bại (Mã lỗi: ${responseCode}). Đang kiểm tra chi tiết... 😢`
        );
      }

      try {
        const response = await axios.get(
          `http://localhost:9898/hotel/payment/verify?txnRef=${txnRef}&transDate=${
            transDate || ""
          }`
        );
        setStatus(response.data.message);
      } catch (err) {
        setStatus(
          `Lỗi kiểm tra thanh toán: ${err.response?.data || err.message} 😭`
        );
      }
    };

    checkPaymentStatus();
  }, [location]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Kết quả thanh toán</h2>
      <p className="my-4">{status}</p>
      <Button onClick={() => navigate("/payment")}>Quay lại thanh toán</Button>
    </div>
  );
};

export default PaymentResult;
