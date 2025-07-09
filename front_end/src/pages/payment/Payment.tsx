import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialAmount =
    Number(query.get("amount")) || location.state?.amount || 0; // Bỏ fallback 10000
  const initialTxnRef = query.get("txnRef") || `ORDER_${Date.now()}`;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(initialAmount);
  const [txnRef, setTxnRef] = useState(initialTxnRef);

  useEffect(() => {
    console.log("Payment state:", location.state); // Debug state
    console.log("Payment query amount:", query.get("amount")); // Debug query
    if (!initialAmount) {
      setError("Amount is missing! Please go back and try again.");
    }
    setAmount(initialAmount);
    setTxnRef(initialTxnRef);
  }, [initialAmount, initialTxnRef]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      if (!amount || amount < 1) {
        setError("Minimum amount is 1,000 VND!");
        return;
      }
      if (amount > 100000000) {
        setError("Maximum amount is 100,000,000 VND!");
        return;
      }
      if (!txnRef) {
        setError("Invalid transaction reference!");
        return;
      }

      const response = await axios.get(
        `http://103.161.172.90:9898/hotel/payment/pay?amount=${amount}&txnRef=${encodeURIComponent(
          txnRef
        )}`,
        { headers: { "Content-Type": "application/json" } }
      );

      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setError("Failed to retrieve payment URL!");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
            alt="VNPAY"
            className="w-12 h-12"
          />
          <h2 className="text-2xl font-bold text-gray-800 ml-2">
            VNPAY Payment
          </h2>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (VND)
          </label>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value) || initialAmount)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600] disabled:bg-gray-100"
            placeholder="Enter amount"
            disabled={loading || !!initialAmount} // Khóa input nếu có initialAmount
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Reference
          </label>
          <input
            type="text"
            value={txnRef}
            onChange={(e) => setTxnRef(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600] disabled:bg-gray-100"
            placeholder="Enter transaction reference"
            disabled={loading || !!initialTxnRef}
          />
        </div>
        <button
          onClick={handlePayment}
          disabled={loading || !amount || amount <= 0 || !txnRef}
          className="w-full bg-[#FF6600] text-white py-2 rounded-md font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Payment;
