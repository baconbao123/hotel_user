import React, { useEffect, useState } from 'react';
import { Input, InputNumber, DatePicker, Select, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import { useNavigate } from 'react-router-dom';

interface RoomBookingModalProps {
  roomId: string;
  show: boolean;
  onClose: () => void;
  user?: { id: string; name: string };
}

const methodOptions = [
  { label: 'Cash', value: 1 },
  { label: 'VNPAY', value: 2 },
];

const hoursList = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);

const TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaG9lYmUgZGV2Iiwic3ViIjoibmd1eWVucGhpbG9uZ2xzMms0QGdtYWlsLmNvbSIsImV4cCI6MTc1MjA4NTc1MiwiaWF0IjoxNzUxOTk5MzUyLCJ1c2VySWQiOjEyfQ.3lHmSEc4LZ8wprNKphPNgX7Ax9w8iWgqMjll9HoDPYcGjGrs5x6fJVXXYdgiYEfWg6OXEzxHGdkM296PiGvQ4w'; //test
const RoomBookingModal: React.FC<RoomBookingModalProps> = ({ roomId, show, onClose, user }) => {
  const [userId, setUserId] = useState(user?.id || '');
  const [note, setNote] = useState('');
  const [hours, setHours] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [methodId, setMethodId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [notePayment, setNotePayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomInfo, setRoomInfo] = useState<{ priceHours: number; priceNights: number } | null>(null);
  const [bookingMode, setBookingMode] = useState<'hourly' | 'overnight'>('hourly');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedHour(null);
  }, [hours]);

  useEffect(() => {
    if (!show || !date) return;
    const fetchBooked = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`http://103.161.172.90:9898/hotel/booking/user/${roomId}?date=${dayjs(date).format('YYYY-MM-DD')}`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const slots: string[] = [];
        (res.data.booked || []).forEach((booking: { checkInTime: string; checkOutTime: string }) => {
          const { checkInTime, checkOutTime } = booking;
          const start = dayjs(checkInTime);
          const end = dayjs(checkOutTime);
          let current = start.clone();
          while (current.isBefore(end)) {
            slots.push(current.format('HH:00'));
            current = current.add(1, 'hour');
          }
        });
        setBookedSlots(slots);
        setRoomInfo(res.data.roomInfo);
        console.log('bookedSlots:', slots);
      } catch (err) {
        setError('Không lấy được giờ đã đặt!');
      } finally {
        setLoading(false);
      }
    };
    fetchBooked();
  }, [show, date, roomId, hours]);

  useEffect(() => {
    if (!roomInfo) return;
    if (bookingMode === 'hourly') setAmount(roomInfo.priceHours * hours);
    else setAmount(roomInfo.priceNights);
  }, [roomInfo, hours, bookingMode]);

  const checkInTime = date && selectedHour
    ? dayjs(date).hour(Number(selectedHour.split(':')[0])).minute(0).second(0).format('YYYY-MM-DDTHH:mm')
    : '';

  const checkOutTime = (() => {
    if (!date || !selectedHour) return '';
    const start = Number(selectedHour.split(':')[0]);
    const end = (start + hours) % 24;
    let d = dayjs(date).hour(end).minute(0).second(0);
    if (end <= start) d = d.add(1, 'day');
    return d.format('YYYY-MM-DDTHH:mm');
  })();

  function isHourDisabled(hour: string) {
    const start = Number(hour.split(':')[0]);
    for (let i = 0; i < hours; i++) {
      const h = (start + i) % 24;
      const hStr = `${h < 10 ? '0' : ''}${h}:00`;
      if (bookedSlots.includes(hStr)) return true;
    }
    return false;
  }
  function isHourInRange(hour: string) {
    if (!selectedHour) return false;
    const start = Number(selectedHour.split(':')[0]);
    const idx = Number(hour.split(':')[0]);
    for (let i = 0; i < hours; i++) {
      if ((start + i) % 24 === idx) return true;
    }
    return false;
  }

  const allHoursDisabled = hoursList.every(isHourDisabled);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-2xl relative h-[600px] max-h-[80vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 text-2xl font-bold hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <div className="overflow-y-auto flex-1 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">User ID</label>
              <Input value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter user ID" />
            </div>
            <div>
              <label className="block font-medium mb-1">Note</label>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Enter note" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Date</label>
            <DatePicker
              value={date ? dayjs(date) : null}
              onChange={d => setDate(d ? d.toDate() : null)}
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Select date"
            />
          </div>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold border ${bookingMode === 'hourly' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600 border-cyan-600'}`}
              onClick={() => setBookingMode('hourly')}
            >
              Hourly
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold border ${bookingMode === 'overnight' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600 border-cyan-600'}`}
              onClick={() => setBookingMode('overnight')}
            >
              Overnight
            </button>
          </div>
          {bookingMode === 'hourly' && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Hours</label>
              <Select
                value={hours}
                onChange={setHours}
                className="w-full"
                options={[...Array(12)].map((_,i)=>({label:`${i+1} hour(s)`,value:i+1}))}
                placeholder="Select hours"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Start Hour</label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {hoursList.map(hour => (
                <button
                  key={hour}
                  type="button"
                  disabled={isHourDisabled(hour)}
                  className={
                    `rounded-lg px-0 py-2 w-full text-base font-semibold transition-all ` +
                    (selectedHour === hour ? 'bg-cyan-600 text-white ' : isHourInRange(hour) && selectedHour ? 'bg-cyan-200 text-cyan-900 ' : 'bg-gray-100 text-gray-700 hover:bg-cyan-100') +
                    (isHourDisabled(hour) ? ' opacity-50 cursor-not-allowed' : '')
                  }
                  onClick={() => setSelectedHour(hour)}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Check In</label>
              <Input value={checkInTime} readOnly className="bg-gray-100" />
            </div>
            <div>
              <label className="block font-medium mb-1">Check Out</label>
              <Input value={checkOutTime as string} readOnly className="bg-gray-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Payment Method</label>
              <Select
                value={methodId}
                onChange={setMethodId}
                className="w-full"
                options={methodOptions}
                placeholder="Select payment method"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Amount</label>
              <InputNumber
                value={amount}
                readOnly
                className="w-full"
                min={0}
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder="Amount"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Payment Note</label>
            <Input value={notePayment} onChange={e => setNotePayment(e.target.value)} placeholder="Enter payment note" />
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t mt-2">
          <Button onClick={onClose}>Close</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={async () => {
              const token = localStorage.getItem('token') || TOKEN;
              if (!token) {
                message.warning('Please login to book a room');
                return;
              }
              setLoading(true);
              setError('');
              try {
                const formData = new FormData();
                formData.append('userId', userId);
                formData.append('roomId', roomId);
                formData.append('checkInTime', checkInTime);
                formData.append('checkOutTime', checkOutTime as string);
                formData.append('note', note || '');
                formData.append('methodId', String(methodId));
                formData.append('amount', String(amount));
                formData.append('notePayment', notePayment || '');
                const res = await axios.post('http://103.161.172.90:9898/hotel/booking/user', formData, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                message.success('Booking successful!');
                onClose();
                if (Number(methodId) === 2) {
                  if (res.data && res.data.vnpayUrl) {
                    window.location.href = res.data.vnpayUrl;
                  } else {
                    navigate('/vnpay');
                  }
                }
              } catch (err) {
                setError('Booking failed!');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !userId || !roomId || !checkInTime || !checkOutTime || !methodId || !amount || allHoursDisabled}
          >
            {allHoursDisabled ? 'Sold Out' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingModal; 