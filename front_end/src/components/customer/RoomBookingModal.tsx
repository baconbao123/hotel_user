import React, { useEffect, useState, useRef } from "react";
import {
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  message,
  Card,
  Radio,
  Avatar,
  Modal,
  Descriptions,
  Result,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { CreditCardOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import { useInfiniteHotels } from "@/hooks/useHotelsData";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Cấu hình dayjs với múi giờ
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

interface RoomBookingModalProps {
  roomId: string;
  show: boolean;
  onClose: () => void;
}

const paymentMethods = [
  {
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
          alt="VNPAY"
          style={{ width: 28, height: 28 }}
        />
        <span style={{ fontWeight: 500, fontSize: 16 }}>VNPAY Wallet</span>
      </span>
    ),
    value: 1,
  },
  {
    label: (
      <span
        style={{ display: "flex", alignItems: "center", gap: 8, color: "#aaa" }}
      >
        <CreditCardOutlined style={{ fontSize: 24 }} />
        <span style={{ fontWeight: 500, fontSize: 16 }}>Pay at Hotel</span>
      </span>
    ),
    value: 2,
  },
];

const hoursList = Array.from(
  { length: 24 },
  (_, i) => `${i < 10 ? "0" : ""}${i}:00`
);

const RoomBookingModal: React.FC<RoomBookingModalProps> = ({
  roomId,
  show,
  onClose,
}) => {
  const [form, setForm] = useState({
    note: "",
    hours: 1,
    date: null as Date | null,
    selectedHour: null as string | null,
    methodId: null as number | null,
    amount: null as number | null,
    notePayment: "",
  });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomInfo, setRoomInfo] = useState<{
    priceHours: number;
    priceNights: number;
  } | null>(null);
  const [bookingMode, setBookingMode] = useState<"hourly" | "overnight">(
    "hourly"
  );
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { hotels } = useInfiniteHotels();

  const token = Cookies.get("token");
  let user = { id: "", name: "", email: "", phoneNumber: "", avatarUrl: "" };
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      user = {
        id: decoded.userId || decoded.id || decoded.sub || "",
        name: decoded.fullname || "",
        email: decoded.email || "",
        phoneNumber: decoded.phoneNumber || "",
        avatarUrl: decoded.avatarUrl || "",
      };
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }

  const userId = useSelector((state: RootState) => state.userDataSlice.id);
  const userName = useSelector(
    (state: RootState) => state.userDataSlice.fullname
  );
  const email = useSelector((state: RootState) => state.userDataSlice.email);
  const phoneNumber = useSelector(
    (state: RootState) => state.userDataSlice.phoneNumber
  );
  const avatarUrl = useSelector(
    (state: RootState) => state.userDataSlice.avatarUrl
  );
  const hotelDetail = useSelector(
    (state: RootState) => state.commonData.hotelDetail
  );
  const roomDetail = useSelector(
    (state: RootState) => state.commonData.roomDetail
  );

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    updateForm({ selectedHour: null });
  }, [form.hours]);

  useEffect(() => {
    if (!show || !form.date) return;
    const fetchBooked = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `http://localhost:9898/hotel/booking/user/${roomId}?date=${dayjs(
            form.date
          )
            .tz()
            .format("YYYY-MM-DD")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const slots: string[] = [];
        (res.data.booked || []).forEach(
          (booking: { checkInTime: string; checkOutTime: string }) => {
            const start = dayjs(booking.checkInTime).tz();
            const end = dayjs(booking.checkOutTime).tz();
            let current = start.clone();
            while (current.isBefore(end)) {
              slots.push(current.format("HH:00"));
              current = current.add(1, "hour");
            }
          }
        );
        setBookedSlots(slots);
        setRoomInfo(res.data.roomInfo);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch booked slots!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBooked();
  }, [show, form.date, roomId, token]);

  useEffect(() => {
    if (!roomInfo) return;
    const newAmount =
      bookingMode === "hourly"
        ? roomInfo.priceHours * form.hours
        : roomInfo.priceNights;
    updateForm({ amount: newAmount });
  }, [roomInfo, form.hours, bookingMode]);

  // Tính checkInTime/checkOutTime cho từng mode
  const checkInTime = bookingMode === "overnight"
    ? form.date
      ? dayjs(form.date).tz().hour(14).minute(0).second(0).format("YYYY-MM-DDTHH:mm")
      : ""
    : (form.date && form.selectedHour
      ? dayjs(form.date).tz().hour(Number(form.selectedHour.split(":")[0])).minute(0).second(0).format("YYYY-MM-DDTHH:mm")
      : "");

  const checkOutTime = bookingMode === "overnight"
    ? form.date
      ? dayjs(form.date).tz().add(1, "day").hour(12).minute(0).second(0).format("YYYY-MM-DDTHH:mm")
      : ""
    : (() => {
        if (!form.date || !form.selectedHour) return "";
        const start = Number(form.selectedHour.split(":")[0]);
        const end = (start + form.hours) % 24;
        let d = dayjs(form.date).tz().hour(end).minute(0).second(0);
        if (end <= start) d = d.add(1, "day");
        return d.format("YYYY-MM-DDTHH:mm");
      })();

  const isHourDisabled = (hour: string) => {
    const start = Number(hour.split(":")[0]);
    return Array.from({ length: form.hours }, (_, i) => {
      const h = (start + i) % 24;
      return `${h < 10 ? "0" : ""}${h}:00`;
    }).some((hStr) => bookedSlots.includes(hStr));
  };

  const isHourInRange = (hour: string) => {
    if (!form.selectedHour) return false;
    const start = Number(form.selectedHour.split(":")[0]);
    const idx = Number(hour.split(":")[0]);
    return Array.from(
      { length: form.hours },
      (_, i) => (start + i) % 24
    ).includes(idx);
  };

  const allHoursDisabled = hoursList.every(isHourDisabled);

  const handleDownloadBill = async () => {
    if (!billRef.current) return;
    const canvas = await html2canvas(billRef.current, {
      backgroundColor: "#fff",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `booking-bill-${billData?.bookingId || Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleBooking = async () => {
    let hotelId = hotelDetail?.name;
    if (!hotelId) {
      for (const hotel of hotels) {
        for (const type of hotel.types || []) {
          const foundRoom = (type.rooms || []).find(
            (r: any) => String(r.id) === String(roomId)
          );
          if (foundRoom) {
            hotelId = hotel.id;
            break;
          }
        }
        if (hotelId) break;
      }
    }

    if (!userName || !email || !phoneNumber) {
      setError("Please provide your name, email, and phone number.");
      return;
    }
    if (!form.date) {
      setError("Please select a date.");
      return;
    }
    if (bookingMode === "hourly" && !form.selectedHour) {
      setError("Please select a start hour.");
      return;
    }
    if (!form.methodId) {
      setError("Please select a payment method.");
      return;
    }
    if (bookingMode === "hourly" && (!form.hours || form.hours < 1)) {
      setError("Please select the number of hours.");
      return;
    }
    if (!form.amount || form.amount < 1 || form.amount > 100000000) {
      setError("Amount must be between 1,000 and 100,000,000 VND!");
      return;
    }
    if (!token) {
      message.warning("Please login to book a room.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("userId", String(userId));
      formData.append("roomId", roomId);
      formData.append("checkInTime", checkInTime);
      formData.append("checkOutTime", checkOutTime);
      formData.append("note", form.note || "");
      formData.append("methodId", String(form.methodId));
      formData.append("amount", String(form.amount));
      formData.append("notePayment", form.notePayment || "");

      const res = await axios.post(
        "http://localhost:9898/hotel/booking/user",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const txnRef = res.data?.result?.bookingId || `BOOK-${Date.now()}`;

      let hotelName = "",
        roomName = "",
        hotelAddress = "";
      for (const hotel of hotels) {
        for (const type of hotel.types || []) {
          const foundRoom = (type.rooms || []).find(
            (r: any) => String(r.id) === String(roomId)
          );
          if (foundRoom) {
            hotelName = hotel.name;
            roomName = foundRoom.name;
            hotelAddress = hotel.address;
            break;
          }
        }
      }

      const bill = {
        bookingId: res.data?.result?.bookingId || res.data?.result?.id || "",
        roomId,
        checkInTime,
        checkOutTime,
        amount: form.amount,
        method:
          paymentMethods.find((m) => m.value === form.methodId)?.label?.props
            ?.children?.[1]?.props?.children || "Payment",
        guest: { name: userName, email, phoneNumber, avatarUrl },
        note: form.note,
        hotelName,
        roomName,
        hotelAddress,
      };

      if (form.methodId === 1) {
        if (form.amount && form.amount > 0) {
          console.log(
            "Navigating with amount:",
            form.amount,
            "hotelId:",
            hotelId
          ); // Debug
          navigate(
            `/payment/pay?amount=${form.amount}&txnRef=${encodeURIComponent(
              txnRef
            )}&hotelId=${hotelId}`,
            { state: { amount: form.amount, txnRef, hotelId } } // Thêm hotelId vào state
          );
        } else {
          setError("Invalid amount for payment!");
        }
        return;
      }
      setBillData(bill);
      setShowBill(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Booking failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 w-full max-w-2xl relative h-[600px] max-h-[80vh] flex flex-col border-2 shadow-lg">
          <button
            className="absolute top-2 right-2 text-[#FF6600] text-2xl font-bold hover:text-orange-700"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <div className="overflow-y-auto flex-1 pr-2">
            <Card bordered={false} className="rounded-2xl shadow-sm mb-4">
              <div className="font-semibold mb-2 text-[#FF6600]">
                Guest Information
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={avatarUrl} size={48} />
                <div>
                  <div className="font-semibold text-base">{userName}</div>
                  <div className="text-sm text-gray-700">{email}</div>
                  <div className="text-sm text-gray-700">{phoneNumber}</div>
                </div>
              </div>
            </Card>
            <div className="mb-4">
              <label className="block font-medium mb-1 text-[#FF6600]">
                Date
              </label>
              <DatePicker
                value={form.date ? dayjs(form.date) : null}
                onChange={(d) => updateForm({ date: d ? d.toDate() : null })}
                className="w-full"
                format="YYYY-MM-DD"
                placeholder="Select date"
              />
            </div>
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded font-semibold border ${
                  bookingMode === "hourly"
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-cyan-600 border-cyan-600"
                }`}
                onClick={() => setBookingMode("hourly")}
              >
                Hourly
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded font-semibold border ${
                  bookingMode === "overnight"
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-cyan-600 border-cyan-600"
                }`}
                onClick={() => setBookingMode("overnight")}
              >
                Overnight
              </button>
            </div>
            {bookingMode === "hourly" && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Hours</label>
                <Select
                  value={form.hours}
                  onChange={(value) => updateForm({ hours: value })}
                  className="w-full"
                  options={[...Array(12)].map((_, i) => ({
                    label: `${i + 1} hour(s)`,
                    value: i + 1,
                  }))}
                  placeholder="Select hours"
                />
              </div>
            )}
            {bookingMode === "hourly" && (
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Select Start Hour
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {hoursList.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      disabled={isHourDisabled(hour)}
                      className={
                        `rounded-lg px-0 py-2 w-full text-base font-semibold transition-all ` +
                        (form.selectedHour === hour
                          ? "bg-cyan-600 text-white "
                          : isHourInRange(hour) && form.selectedHour
                          ? "bg-cyan-200 text-cyan-900 "
                          : "bg-gray-100 text-gray-700 hover:bg-cyan-100") +
                        (isHourDisabled(hour)
                          ? " opacity-50 cursor-not-allowed"
                          : "")
                      }
                      onClick={() => updateForm({ selectedHour: hour })}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium mb-1">Check In</label>
                <Input value={checkInTime} readOnly className="bg-gray-100" />
              </div>
              <div>
                <label className="block font-medium mb-1">Check Out</label>
                <Input value={checkOutTime} readOnly className="bg-gray-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium mb-1 text-[#FF6600]">
                  Payment Method
                </label>
                <Radio.Group
                  options={paymentMethods}
                  onChange={(e) => updateForm({ methodId: e.target.value })}
                  value={form.methodId}
                  optionType="button"
                  className="w-full flex flex-col gap-2"
                  buttonStyle="solid"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-[#FF6600]">
                  Amount
                </label>
                <InputNumber
                  value={form.amount}
                  readOnly
                  className="w-full"
                  min={0}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  placeholder="Amount"
                  style={{ borderColor: "#FF6600" }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1 text-[#FF6600]">
                Note
              </label>
              <Input
                value={form.note}
                onChange={(e) => updateForm({ note: e.target.value })}
                placeholder="Enter note"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Payment Note</label>
              <Input
                value={form.notePayment}
                onChange={(e) => updateForm({ notePayment: e.target.value })}
                placeholder="Enter payment note"
              />
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-2">
            <Button
              onClick={onClose}
              style={{ borderColor: "#FF6600", color: "#FF6600" }}
            >
              Close
            </Button>
            <Button
              type="primary"
              loading={loading}
              style={{
                background: "#FF6600",
                borderColor: "#FF6600",
                fontWeight: 600,
              }}
              onClick={handleBooking}
              disabled={
                loading ||
                !userId ||
                !roomId ||
                !checkInTime ||
                !checkOutTime ||
                !form.methodId ||
                !form.amount ||
                allHoursDisabled
              }
            >
              {allHoursDisabled ? "Sold Out" : "Save"}
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={showBill}
        onCancel={() => {
          setShowBill(false);
          onClose();
        }}
        footer={null}
        width={500}
        centered
      >
        <div ref={billRef} style={{ background: "#fff", padding: 16 }}>
          <Result
            status="success"
            title="Booking Successful!"
            subTitle={
              billData?.bookingId ? `Booking ID: ${billData.bookingId}` : ""
            }
          />
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Hotel Name">
              {hotelDetail?.name || billData?.hotelName}
            </Descriptions.Item>
            <Descriptions.Item label="Room Name">
              {roomDetail?.name || billData?.roomName}
            </Descriptions.Item>
            <Descriptions.Item label="Hotel Address">
              {hotelDetail?.address || billData?.hotelAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Guest Name">
              {billData?.guest?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {billData?.guest?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {billData?.guest?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Room ID">
              {roomDetail?.id || billData?.roomId}
            </Descriptions.Item>
            <Descriptions.Item label="Check-in">
              {billData?.checkInTime}
            </Descriptions.Item>
            <Descriptions.Item label="Check-out">
              {billData?.checkOutTime}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              {billData?.amount?.toLocaleString()}₫
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {billData?.method}
            </Descriptions.Item>
            {billData?.note && (
              <Descriptions.Item label="Note">
                {billData?.note}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
        <div className="flex justify-center mt-6 gap-3">
          <Button
            onClick={handleDownloadBill}
            style={{ borderColor: "#FF6600", color: "#FF6600" }}
          >
            Download Bill
          </Button>
          <Button
            type="primary"
            style={{ background: "#FF6600", borderColor: "#FF6600" }}
            onClick={() => {
              setShowBill(false);
              onClose();
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RoomBookingModal;
