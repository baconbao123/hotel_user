# Tính năng Kiểm tra Authentication cho Đặt phòng

## Tổng quan
Tính năng này đảm bảo rằng người dùng phải đăng nhập trước khi có thể đặt phòng. Khi người dùng chưa đăng nhập và nhấn nút "Reserve Now" hoặc "Choose", hệ thống sẽ hiển thị modal yêu cầu đăng nhập.

## Các thay đổi đã thực hiện

### 1. Utility Functions (`src/lib/utils.ts`)
- Thêm `isAuthenticated()`: Kiểm tra token trong cookies
- Thêm `getAuthToken()`: Lấy token từ cookies
- Thêm `redirectToLogin()`: Chuyển hướng đến trang đăng nhập với return URL

### 2. Component Modal Authentication (`src/components/common/AuthRequiredModal.tsx`)
- Modal hiển thị khi người dùng chưa đăng nhập
- Có 2 lựa chọn: Đăng nhập hoặc Đăng ký
- Tự động chuyển hướng về trang ban đầu sau khi đăng nhập thành công

### 3. Cập nhật HotelDetail (`src/pages/hotel/HotelDetail.tsx`)
- Thêm kiểm tra authentication cho nút "Reserve Now"
- Thêm kiểm tra authentication cho nút "Choose" trong danh sách phòng
- Sử dụng modal thay vì chuyển hướng trực tiếp

### 4. Cập nhật Login/Register (`src/pages/auth/Login.tsx`, `src/pages/auth/Register.tsx`)
- Hỗ trợ return URL để chuyển hướng về trang ban đầu sau khi đăng nhập
- Sử dụng query parameter `returnUrl` để lưu trữ URL cần quay lại

### 5. Cập nhật RoomBookingModal (`src/components/customer/RoomBookingModal.tsx`)
- Thay đổi từ localStorage sang cookies để lấy token
- Đảm bảo tính nhất quán với hệ thống authentication

## Cách hoạt động

1. **Khi người dùng chưa đăng nhập:**
   - Nhấn nút "Reserve Now" hoặc "Choose"
   - Hiển thị modal yêu cầu đăng nhập
   - Modal có 2 lựa chọn: Đăng nhập hoặc Đăng ký

2. **Khi người dùng chọn đăng nhập:**
   - Chuyển hướng đến trang đăng nhập với return URL
   - Sau khi đăng nhập thành công, quay lại trang ban đầu

3. **Khi người dùng chọn đăng ký:**
   - Chuyển hướng đến trang đăng ký với return URL
   - Sau khi đăng ký thành công, quay lại trang ban đầu

4. **Khi người dùng đã đăng nhập:**
   - Nút "Reserve Now" hoạt động bình thường
   - Mở modal đặt phòng

## Các điểm cần lưu ý

- Token được lưu trong cookies thay vì localStorage để đảm bảo tính bảo mật
- Return URL được mã hóa để tránh lỗi khi chuyển hướng
- Modal có giao diện thân thiện với người dùng
- Hỗ trợ cả đăng nhập và đăng ký từ modal

## Testing

Để test tính năng này:
1. Xóa token trong cookies (hoặc mở trình duyệt ẩn danh)
2. Vào trang chi tiết khách sạn
3. Nhấn nút "Reserve Now" hoặc "Choose"
4. Kiểm tra modal hiển thị
5. Thử đăng nhập và kiểm tra quay lại trang ban đầu 