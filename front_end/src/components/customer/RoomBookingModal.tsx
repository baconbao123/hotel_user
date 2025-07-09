import React, { useEffect, useState, useRef } from 'react';
import { Input, InputNumber, DatePicker, Select, Button, message, Card, Radio, Tooltip, Avatar, Modal, Descriptions, Result } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CreditCardOutlined, DollarOutlined, WalletOutlined } from '@ant-design/icons';

import html2canvas from 'html2canvas';
import { useInfiniteHotels } from '@/hooks/useHotelsData';
import { jwtDecode } from 'jwt-decode';

interface RoomBookingModalProps {
  roomId: string;
  show: boolean;
  onClose: () => void;
}

const paymentMethods = [
  {
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" alt="VNPAY" style={{ width: 28, height: 28 }} />
        <span style={{ fontWeight: 500, fontSize: 16 }}>VNPAY Wallet</span>
      </span>
    ),
    value: 1,
  },
  
  {
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#aaa' }}>
        <CreditCardOutlined style={{ fontSize: 24 }} />
        <span style={{ fontWeight: 500, fontSize: 16 }}>Pay at Hotel</span>
      </span>
    ),
    value: 2,
  },
];

const hoursList = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);


const RoomBookingModal: React.FC<RoomBookingModalProps> = ({ roomId, show, onClose }) => {
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
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const { hotels } = useInfiniteHotels();

  const token = Cookies.get('token');
  let user = { id: '', name: '', email: '', phoneNumber: '', avatarUrl: '' };
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      user = {
        id: decoded.userId || decoded.id || decoded.sub || '',
        name: decoded.fullname || '',
        email: decoded.email || '',
        phoneNumber: decoded.phoneNumber || '',
        avatarUrl: decoded.avatarUrl || ''
      };
      console.log("userToken", user);
    } catch (e) { console.error('Error decoding token:', e); }
  }

  useEffect(() => {
    setSelectedHour(null);
  }, [hours]);

  useEffect(() => {
    if (!show || !date) return;
    const fetchBooked = async () => {
      try {
        setLoading(true);
        setError('');
        const token = Cookies.get('token');
        const res = await axios.get(`http://103.161.172.90:9898/hotel/booking/user/${roomId}?date=${dayjs(date).format('YYYY-MM-DD')}`, {
          headers: { Authorization: `Bearer ${token}` }
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

  const handleDownloadBill = async () => {
    if (!billRef.current) return;
    const canvas = await html2canvas(billRef.current, { backgroundColor: '#fff', scale: 2 });
    const link = document.createElement('a');
    link.download = `booking-bill-${billData?.bookingId || Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 w-full max-w-2xl relative h-[600px] max-h-[80vh] flex flex-col border-2  shadow-lg">
          <button
            className="absolute top-2 right-2 text-[#FF6600] text-2xl font-bold hover:text-orange-700"
            onClick={onClose}
            aria-label="Close"
          >×</button>
          <div className="overflow-y-auto flex-1 pr-2">
            
            <Card bordered={false} className="rounded-2xl shadow-sm mb-4">
              <div className="font-semibold mb-2 text-[#FF6600]">Guest Information</div>
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={user.avatarUrl} size={48} />
                <div>
                  <div className="font-semibold text-base">{user.name}</div>
                  <div className="text-sm text-gray-700">{user.email}</div>
                  <div className="text-sm text-gray-700">{user.phoneNumber}</div>
                </div>
              </div>
            </Card>
            <div className="mb-4">
              <label className="block font-medium mb-1 text-[#FF6600]">Date</label>
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
                <label className="block font-medium mb-1 text-[#FF6600]">Payment Method</label>
                <Radio.Group
                  options={paymentMethods}
                  onChange={e => setMethodId(e.target.value)}
                  value={methodId}
                  optionType="button"
                  className="w-full flex flex-col gap-2"
                  style={{ width: '100%' }}
                  buttonStyle="solid"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-[#FF6600]">Amount</label>
                <InputNumber
                  value={amount}
                  readOnly
                  className="w-full"
                  min={0}
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="Amount"
                  style={{ borderColor: '#FF6600' }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1 text-[#FF6600]">Note</label>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Enter note" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Payment Note</label>
              <Input value={notePayment} onChange={e => setNotePayment(e.target.value)} placeholder="Enter payment note" />
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-2">
            <Button onClick={onClose} style={{ borderColor: '#FF6600', color: '#FF6600' }}>Close</Button>
            <Button
              type="primary"
              loading={loading}
              style={{ background: '#FF6600', borderColor: '#FF6600', fontWeight: 600 }}
              onClick={async () => {
                const token = Cookies.get('token');
                if (!token) {
                  message.warning('Please login to book a room');
                  return;
                }
                setLoading(true);
                setError('');
                try {
                  const formData = new FormData();
                  formData.append('userId', user.id || '');
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
                  // Tìm thông tin khách sạn và phòng thực tế
                  let hotelName = '', roomName = '', hotelAddress = '';
                  for (const hotel of hotels) {
                    for (const type of hotel.types || []) {
                      const foundRoom = (type.rooms || []).find((r: any) => String(r.id) === String(roomId));
                      if (foundRoom) {
                        hotelName = hotel.name;
                        roomName = foundRoom.name;
                        hotelAddress = hotel.address;
                        break;
                      }
                    }
                  }
                  setBillData({
                    bookingId: res.data?.result?.bookingId || res.data?.result?.id || '',
                    roomId,
                    checkInTime,
                    checkOutTime,
                    amount,
                    method: paymentMethods.find(m => m.value === methodId)?.label?.props?.children?.[1]?.props?.children || 'Payment',
                    guest: user,
                    note,
                    hotelName,
                    roomName,
                    hotelAddress,
                  });
                  setShowBill(true);
                  if (Number(methodId) === 2 && res.data && res.data.vnpayUrl) {
                    window.location.href = res.data.vnpayUrl;
                  }
                } catch (err) {
                  setError('Booking failed!');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !user || !roomId || !checkInTime || !checkOutTime || !methodId || !amount || allHoursDisabled}
            >
              {allHoursDisabled ? 'Sold Out' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      {/* Modal Bill */}
      <Modal open={showBill} onCancel={() => { setShowBill(false); onClose(); }} footer={null} width={500} centered>
        <div ref={billRef} style={{ background: '#fff', padding: 16 }}>
          <Result
            status="success"
            title="Booking Successful!"
            subTitle={billData?.bookingId ? `Booking ID: ${billData.bookingId}` : ''}
          />
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Hotel Name">{billData?.hotelName}</Descriptions.Item>
            <Descriptions.Item label="Room Name">{billData?.roomName}</Descriptions.Item>
            <Descriptions.Item label="Hotel Address">{billData?.hotelAddress}</Descriptions.Item>
            <Descriptions.Item label="Guest Name">{billData?.guest?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{billData?.guest?.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{billData?.guest?.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Room ID">{billData?.roomId}</Descriptions.Item>
            <Descriptions.Item label="Check-in">{billData?.checkInTime}</Descriptions.Item>
            <Descriptions.Item label="Check-out">{billData?.checkOutTime}</Descriptions.Item>
            <Descriptions.Item label="Amount">{billData?.amount?.toLocaleString()}₫</Descriptions.Item>
            <Descriptions.Item label="Payment Method">{billData?.method}</Descriptions.Item>
            {billData?.note && <Descriptions.Item label="Note">{billData?.note}</Descriptions.Item>}
          </Descriptions>
        </div>
        <div className="flex justify-center mt-6 gap-3">
          <Button onClick={handleDownloadBill} style={{ borderColor: '#FF6600', color: '#FF6600' }}>Download Bill</Button>
          <Button type="primary" style={{ background: '#FF6600', borderColor: '#FF6600' }} onClick={() => { setShowBill(false); onClose(); }}>Close</Button>
        </div>
      </Modal>
    </>
  );
};

export default RoomBookingModal; 