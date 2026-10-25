# Các quy tắc phát triển và vận hành dự án (AI Instructions)

Tài liệu này ghi lại các quy tắc đã được thống nhất để AI hoặc các nhà phát triển sau này tuân thủ khi chỉnh sửa dự án.
Tôi đang triển khai ứng dụng từ github qua vercel, hãy kiểm tra giúp tôi các file vercel.json, index.html có tham chiếu đúng chưa và hướng dẫn tôi setup api key gemini để người dùng tự nhập API key của họ để chạy app

## 1. Cấu hình Model AI & Cơ chế Fallback
- **Model mặc định**: `gemini-3-pro-preview`
- **Model dự phòng**: Tự động chuyển đổi nếu model hiện tại gặp lỗi/quá tải:
  1. `gemini-3-flash-preview`
  2. `gemini-3-pro-preview`
  3. `gemini-2.5-flash`
- **Cơ chế Retry**:
  - Nếu một bước xử lý (Step 1, 2, hoặc 3) gặp lỗi API, hệ thống **tự động** thử lại ngay lập tức với model tiếp theo trong danh sách.
  - Vẫn giữ nguyên kết quả của các bước trước đó, chỉ retry bước đang lỗi.

## 2. Quản lý API Key
- **Cơ chế**:
  - Người dùng nhập API key vào Modal hoặc qua nút Settings trên Header.
  - Lưu vào `localStorage` của trình duyệt.
  - Ưu tiên sử dụng key từ `localStorage`.
- **Giao diện**:
  - **Thiết lập Model & API Key**: Cần hiển thị như hình mẫu.
    - Hiển thị danh sách chọn Model AI (dạng thẻ/Cards).
    - Thứ tự hiển thị: `gemini-3-flash-preview` (Default), `gemini-3-pro-preview`, `gemini-2.5-flash`.
  - Nút **Settings (API Key)** kèm dòng chữ màu đỏ "Lấy API key để sử dụng app" phải luôn hiển thị trên Header để người dùng dễ dàng thay đổi key khi hết quota. 
  - Khi chưa có key, hiển thị Modal bắt buộc nhập.
  - Việc nhập key ban đầu trước khi dùng app, hướng dẫn người dùng vào https://aistudio.google.com/api-keys để lấy key API

## 3. Quản lý Trạng thái & Lỗi (State Management)
- **Hiển thị lỗi**:
  - Nếu tất cả các model đều thất bại -> Hiện thông báo lỗi màu đỏ, hiển thị nguyên văn lỗi từ API (VD: `429 RESOURCE_EXHAUSTED`).
  - Trạng thái các cột đang chờ phải chuyển thành **"Đã dừng do lỗi"**, tuyệt đối không được hiện "Hoàn tất" hoặc checkmark xanh nếu quy trình bị gián đoạn.
- **Tiến trình**:
  - Progress bar chỉ hiển thị trạng thái hoàn thành (xanh) khi bước đó thực sự thành công.

## 4. Triển khai (Deployment)
- **Nền tảng**: Vercel.
- **File bắt buộc**: `vercel.json` ở root để xử lý SPA routing.
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```


## 5. Quy tắc Dựng Hình Lăng Trụ & Đặt Tên Đỉnh (Prism Standards)
- **Bảo toàn tên đỉnh tuyệt đối theo đề bài đã nạp**:
  - Với hình hộp / lăng trụ tứ giác: `ABCD.A'B'C'D'` thì 8 đỉnh bắt buộc là `A, B, C, D, A', B', C', D'`. Tuyệt đối không tự ý đổi thành `E, F, G, H` hay `A1, B1, C1, D1`.
  - Với hình lăng trụ tam giác: `ABC.A'B'C'` thì 6 đỉnh bắt buộc là `A, B, C, A', B', C'`.
- **Tọa độ chuẩn SGK Việt Nam**:
  - Lăng trụ tứ giác `ABCD.A'B'C'D'`:
    + Đáy dưới (y = 0): A(-2.0, 0, -1.2), B(-1.0, 0, 1.2), C(2.5, 0, 1.2), D(1.5, 0, -1.2)
    + Đáy trên (y = 3.2): A'(-2.0, 3.2, -1.2), B'(-1.0, 3.2, 1.2), C'(2.5, 3.2, 1.2), D'(1.5, 3.2, -1.2)
  - Lăng trụ tam giác `ABC.A'B'C'`:
    + Đáy dưới (y = 0): A(-1.8, 0, -0.8), B(0.0, 0, 1.2), C(2.2, 0, -0.6)
    + Đáy trên (y = 3.2): A'(-1.8, 3.2, -0.8), B'(0.0, 3.2, 1.2), C'(2.2, 3.2, -0.6)
- **Quy ước nét vẽ SGK**:
  - Với `ABCD.A'B'C'D'`: Đỉnh A ở góc khuất, 3 cạnh đồng quy tại A là nét đứt (AA', AB, AD). Tất cả 9 cạnh còn lại là nét liền (BC, CD, BB', CC', DD', A'B', B'C', C'D', D'A').
  - Với `ABC.A'B'C'`: Cạnh AC ở đáy dưới bị khuất (nét đứt), 8 cạnh còn lại nét liền.
- **Mặt phẳng (Faces)**:
  - Liệt kê đỉnh theo thứ tự chu vi khép kín (cyclic order) để Three.js không bị vặn xoắn mặt phẳng:
    ABCD, A'B'C'D', ABB'A', BCC'B', CDD'C', DAA'D'.
