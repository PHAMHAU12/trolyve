# TRỢ LÝ VẼ HÌNH _ PHẠM HẬU

Hệ thống Trợ lý Vẽ hình Toán học AI chuẩn Sách Giáo Khoa Việt Nam. 
Tự động đồng bộ việc nạp đề bài (văn bản hoặc OCR ảnh) và vẽ hình học 3D/2D đẹp, chuẩn logic toán học, chính xác tuyệt đối.

## Tính năng nổi bật
- **Nạp đề & Vẽ hình đồng bộ**: Chỉ cần nhập đề toán, dán ảnh chụp đề (OCR) hoặc chọn bài tập mẫu, hệ thống tự động bóc tách và vẽ hình ngay lập tức.
- **Hình vẽ chuẩn SGK Việt Nam**:
  - Tọa độ 3D chính xác, phân định chuẩn nét đứt (khuất) và nét liền (thấy).
  - Đáy, đường cao, chân đường vuông góc, đỉnh, nhãn điểm ($A, B, C, D, S, M, N...$).
  - Mặt phẳng thiết diện tô màu trong suốt tuyệt đẹp kèm thanh trượt điều chỉnh vị trí.
- **Tiện ích chuyên nghiệp cho giáo viên**:
  - **Chế độ Giấy Trắng (White Paper Mode)**: Chuyển nền trắng để dán vào tài liệu/đề thi Word không bị viền đen.
  - **Sao chép ảnh vào Clipboard (1-click)**: Nhấn nút là có thể Ctrl+V dán ngay vào Microsoft Word / PowerPoint.
  - Tải ảnh PNG chất lượng cao & mã SVG vector.
  - Xuất mã TikZ/LaTeX và GeoGebra Script.
- **Cấu hình Model AI & API Key**:
  - Hỗ trợ nhập Gemini API Key cá nhân từ [Google AI Studio](https://aistudio.google.com/api-keys) (miễn phí).
  - Tự động fallback giữa các model: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-1.5-flash`.

## Hướng dẫn chạy và triển khai (Vercel / Local)
1. Cài đặt thư viện: `npm install` hoặc `bun install`
2. Chạy môi trường phát triển: `npm run dev`
3. Triển khai lên Vercel: Dự án đã được cấu hình sẵn file `vercel.json` phục vụ SPA routing.
