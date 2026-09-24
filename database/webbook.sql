-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 29, 2026 lúc 07:29 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `web2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdonhang`
--

CREATE TABLE `chitietdonhang` (
  `madh` int(11) NOT NULL,
  `masp` int(11) NOT NULL,
  `soluong` int(11) NOT NULL,
  `giamgia` double NOT NULL DEFAULT 0,
  `gia` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdonhang`
--

INSERT INTO `chitietdonhang` (`madh`, `masp`, `soluong`, `giamgia`, `gia`) VALUES
(1, 13, 2, 0, 0),
(1, 14, 1, 0, 0),
(1, 15, 3, 0, 0),
(2, 13, 2, 0, 0),
(2, 14, 1, 0, 0),
(2, 15, 3, 0, 0),
(3, 2, 1, 0, 0),
(4, 106, 1, 0, 0),
(5, 113, 2, 0, 0),
(6, 112, 1, 0, 0),
(7, 109, 3, 0, 0),
(7, 111, 9, 0, 0),
(8, 99, 1, 0, 0),
(8, 110, 2, 0, 0),
(9, 113, 2, 0, 0),
(10, 111, 1, 0, 0),
(11, 106, 2, 0, 0),
(11, 114, 3, 0, 0),
(12, 78, 2, 0, 0),
(13, 99, 5, 0, 0),
(14, 71, 2, 0, 0),
(15, 71, 1, 0, 0),
(16, 35, 1, 0, 0),
(17, 104, 1, 0, 0),
(18, 83, 4, 0, 0),
(19, 26, 1, 0, 0),
(20, 107, 2, 0, 0),
(21, 113, 1, 0, 0),
(22, 111, 1, 0, 0),
(23, 109, 1, 0, 0),
(24, 111, 1, 0, 0),
(25, 109, 1, 0, 0),
(26, 112, 1, 0, 0),
(27, 109, 2, 0, 0),
(28, 107, 1, 0, 0),
(29, 78, 1, 0, 0),
(30, 114, 1, 0, 0),
(31, 108, 1, 0, 0),
(32, 114, 3, 0, 0),
(33, 114, 1, 0, 0),
(34, 113, 1, 0, 0),
(35, 110, 1, 0, 0),
(36, 111, 1, 0, 0),
(37, 113, 1, 0, 0),
(38, 114, 1, 0, 0),
(39, 108, 1, 0, 0),
(40, 108, 1, 0, 0),
(41, 111, 1, 0, 0),
(42, 111, 1, 0, 0),
(43, 108, 1, 0, 0),
(44, 114, 1, 0, 0),
(45, 76, 1, 0, 0),
(46, 100, 1, 0, 0),
(47, 113, 1, 0, 0),
(48, 87, 1, 0, 0),
(49, 78, 1, 0, 0),
(50, 36, 1, 0, 0),
(51, 2, 1, 0, 0),
(52, 76, 1, 0, 0),
(53, 110, 1, 0, 0),
(54, 113, 1, 0, 0),
(55, 78, 1, 0, 0),
(56, 113, 1, 0, 0),
(57, 52, 1, 0, 0),
(58, 78, 1, 0, 0),
(59, 108, 1, 0, 0),
(60, 68, 1, 0, 0),
(61, 76, 1, 0, 0),
(62, 78, 1, 0, 0),
(63, 78, 1, 0, 0),
(64, 76, 1, 0, 0),
(65, 78, 1, 0.12, 0),
(66, 76, 1, 0.5, 0),
(66, 114, 1, 0, 0),
(67, 76, 2, 0.5, 0),
(67, 111, 3, 0, 0),
(68, 114, 1, 0, 0),
(69, 76, 1, 0.5, 0),
(70, 76, 2, 0.5, 0),
(70, 78, 3, 0.12, 0),
(70, 113, 1, 0, 0),
(71, 113, 1, 0, 0),
(72, 69, 2, 0, 0),
(73, 113, 1, 0, 0),
(74, 113, 1, 0, 0),
(75, 114, 1, 0, 0),
(76, 35, 1, 0, 0),
(77, 111, 1, 0, 0),
(77, 112, 1, 0, 0),
(77, 114, 7, 0, 0),
(78, 99, 3, 0.5, 0),
(79, 98, 4, 0.5, 0),
(79, 109, 1, 0, 0),
(80, 1, 1, 0, 0),
(81, 39, 1, 0, 0),
(82, 1, 3, 0, 0),
(83, 113, 1, 0, 0),
(84, 120, 3, 0, 0),
(85, 120, 3, 0, 0),
(86, 114, 1, 0, 0),
(87, 120, 2, 0, 0),
(88, 121, 1, 0, 0),
(89, 123, 3, 0, 0),
(90, 122, 1, 0, 0),
(91, 123, 3, 0, 0),
(109, 123, 1, 0, 22),
(110, 118, 3, 0, 57500),
(111, 114, 3, 0, 240000),
(111, 118, 2, 0, 65000),
(112, 121, 1, 0, 210000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietphieunhap`
--

CREATE TABLE `chitietphieunhap` (
  `mapn` int(11) NOT NULL,
  `masp` int(11) NOT NULL,
  `soluong` int(11) NOT NULL,
  `gianhap` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietphieunhap`
--

INSERT INTO `chitietphieunhap` (`mapn`, `masp`, `soluong`, `gianhap`) VALUES
(13, 1, 15, 100000),
(13, 2, 18, 120000),
(13, 3, 12, 200000),
(13, 6, 20, 150000),
(13, 8, 14, 100000),
(13, 9, 16, 120000),
(13, 10, 11, 200000),
(13, 11, 19, 150000),
(13, 12, 13, 100000),
(13, 13, 17, 120000),
(13, 14, 10, 200000),
(13, 15, 15, 150000),
(13, 16, 18, 100000),
(13, 17, 12, 120000),
(13, 18, 20, 200000),
(13, 19, 14, 150000),
(13, 20, 16, 100000),
(13, 21, 11, 120000),
(13, 22, 19, 200000),
(13, 23, 13, 150000),
(13, 24, 17, 100000),
(13, 25, 10, 120000),
(13, 26, 15, 200000),
(13, 27, 18, 150000),
(13, 28, 12, 100000),
(13, 29, 20, 120000),
(13, 30, 14, 200000),
(13, 31, 16, 150000),
(13, 32, 11, 100000),
(13, 33, 19, 120000),
(13, 34, 13, 200000),
(13, 35, 17, 150000),
(13, 36, 10, 100000),
(13, 37, 15, 120000),
(13, 38, 18, 200000),
(13, 39, 12, 150000),
(13, 40, 20, 100000),
(13, 41, 14, 120000),
(13, 42, 16, 200000),
(13, 43, 11, 150000),
(13, 44, 19, 100000),
(13, 45, 13, 120000),
(13, 46, 17, 200000),
(13, 47, 10, 150000),
(13, 48, 15, 100000),
(13, 49, 18, 120000),
(13, 50, 12, 200000),
(13, 51, 20, 150000),
(13, 52, 14, 100000),
(13, 53, 16, 120000),
(13, 54, 11, 200000),
(13, 55, 19, 150000),
(13, 56, 13, 100000),
(13, 57, 17, 120000),
(13, 58, 10, 200000),
(13, 59, 15, 150000),
(13, 60, 18, 100000),
(13, 61, 12, 120000),
(13, 62, 20, 200000),
(13, 63, 14, 150000),
(13, 64, 16, 100000),
(13, 65, 11, 120000),
(13, 66, 19, 200000),
(13, 67, 13, 150000),
(13, 68, 17, 100000),
(13, 69, 10, 120000),
(13, 70, 15, 200000),
(13, 71, 18, 150000),
(13, 72, 12, 100000),
(13, 73, 20, 120000),
(13, 74, 14, 200000),
(13, 75, 16, 150000),
(13, 76, 11, 100000),
(13, 77, 19, 120000),
(13, 78, 13, 200000),
(13, 79, 17, 150000),
(13, 80, 10, 100000),
(13, 81, 15, 120000),
(13, 82, 18, 200000),
(13, 83, 12, 150000),
(13, 84, 20, 100000),
(13, 85, 14, 120000),
(13, 86, 16, 200000),
(13, 87, 11, 150000),
(13, 88, 19, 100000),
(13, 89, 13, 120000),
(13, 90, 17, 200000),
(13, 91, 10, 150000),
(13, 92, 15, 100000),
(13, 93, 18, 120000),
(13, 94, 12, 200000),
(13, 95, 20, 150000),
(13, 96, 14, 100000),
(13, 97, 16, 120000),
(13, 98, 11, 200000),
(13, 99, 19, 150000),
(13, 100, 13, 100000),
(13, 101, 17, 120000),
(13, 102, 10, 200000),
(13, 103, 15, 150000),
(13, 104, 18, 100000),
(13, 105, 12, 120000),
(13, 106, 20, 200000),
(13, 107, 14, 150000),
(13, 108, 16, 100000),
(13, 109, 11, 120000),
(13, 110, 19, 200000),
(13, 111, 13, 150000),
(13, 112, 17, 100000),
(13, 113, 10, 120000),
(13, 114, 15, 200000),
(14, 1, 10, 108000),
(15, 1, 20, 100000),
(15, 41, 20, 100000),
(15, 76, 20, 100000),
(15, 80, 20, 100000),
(15, 102, 20, 100000),
(16, 118, 10, 50000),
(17, 119, 5, 100000),
(18, 1, 100, 12854),
(19, 120, 10, 10),
(20, 120, 10, 15),
(21, 1, 10, 29416),
(22, 1, 9, 42000),
(23, 1, 9, 51481),
(24, 1, 10, 61305),
(25, 1, 15, 71756),
(26, 121, 12, 150000),
(27, 122, 5, 150000),
(28, 123, 10, 100),
(29, 123, 200, 14);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

CREATE TABLE `danhmuc` (
  `madm` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tendm` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trangthai` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`madm`, `tendm`, `trangthai`) VALUES
('DM001', 'Phiêu lưu', 0),
('DM69c0aa7b03380', 'Kinh dị', 0),
('DM69c2aeee4abcb', 'Tiểu thuyết', 0),
('DM69c361238e081', 'Văn chương', 0),
('Lichsu', 'Lịch sử', 1),
('Tamly', 'Tâm lý', 1),
('Thieunhi', 'Thiếu nhi', 1),
('Tongiao', 'Tôn giáo', 1),
('tt', 'Trinh thám', 1),
('Vanhoc', 'Văn học', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

CREATE TABLE `donhang` (
  `madh` int(11) NOT NULL,
  `makh` int(11) DEFAULT NULL,
  `ngaydat` datetime DEFAULT current_timestamp(),
  `diachi` varchar(200) NOT NULL,
  `sdt` varchar(100) NOT NULL,
  `tongtien` double NOT NULL,
  `thanhtoan` varchar(50) DEFAULT NULL,
  `trangthaidon` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `donhang`
--

INSERT INTO `donhang` (`madh`, `makh`, `ngaydat`, `diachi`, `sdt`, `tongtien`, `thanhtoan`, `trangthaidon`) VALUES
(1, 1, '2024-01-18 14:30:00', '123 Đường ABC, Quận 1, TP.HCM', '0987654321', 500000, 'MOMO', 1),
(2, 2, '2024-01-18 14:30:00', '123 Đường ABC, Quận 1, TP.HCM', '0987654321', 995000, 'MOMO', 0),
(3, 1, '2026-01-19 11:00:35', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 200000, 'VN Pay', 1),
(4, 1, '2026-01-19 11:04:01', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0912334324', 50000, 'COD', 2),
(5, 1, '2026-01-19 11:16:35', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 190000, 'COD', 2),
(6, 1, '2026-01-19 11:19:25', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 70000, 'COD', 2),
(7, 1, '2026-01-19 12:06:09', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 870000, 'VN Pay', 0),
(8, 1, '2026-01-19 15:21:43', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 310000, 'VN Pay', 0),
(9, 1, '2026-01-22 02:47:59', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 190000, 'COD', 3),
(10, 1, '2026-01-22 06:28:00', '678 Chợ Cầu, Xã Long Hòa, Đà Nẵng', '0123456789', 75000, 'VN Pay', 0),
(11, 1, '2026-01-22 06:39:36', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 355000, 'MOMO', 0),
(12, 1, '2026-01-26 03:08:29', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 140800, 'COD', 2),
(13, 1, '2026-01-28 16:36:25', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 175000, 'MOMO', 1),
(14, 1, '2026-01-29 08:34:08', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 240000, 'COD', 4),
(15, 1, '2026-01-29 08:41:03', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 60000, 'COD', 5),
(16, 1, '2026-01-29 08:42:39', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 72500, 'VN Pay', 0),
(17, 1, '2026-01-29 16:34:23', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 70000, 'COD', 5),
(18, 1, '2026-01-31 02:12:06', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 80000, 'MOMO', 0),
(19, 1, '2026-01-31 02:12:27', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 65000, 'COD', 3),
(20, 1, '2026-02-03 20:18:38', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 330000, 'COD', 4),
(21, 1, '2026-02-10 06:11:11', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'MOMO', 0),
(22, 1, '2026-02-10 06:11:37', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'VN Pay', 0),
(23, 1, '2026-02-10 06:19:46', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 150000, 'VN Pay', 0),
(24, 1, '2026-02-10 06:26:15', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'VN Pay', 0),
(25, 1, '2026-02-10 06:29:30', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 150000, 'VN Pay', 0),
(26, 1, '2026-02-10 06:42:46', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 110000, 'VN Pay', 0),
(27, 1, '2026-02-10 06:48:59', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 300000, 'VN Pay', 0),
(28, 1, '2026-02-10 06:49:59', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 165000, 'VN Pay', 0),
(29, 1, '2026-02-10 06:52:39', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 193600, 'VN Pay', 0),
(30, 1, '2026-02-10 06:54:45', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 240000, 'VN Pay', 0),
(31, 1, '2026-02-10 06:57:18', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 120000, 'VN Pay', 2),
(32, 1, '2026-02-10 07:00:06', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 720000, 'VN Pay', 0),
(33, 1, '2026-02-10 07:08:15', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 240000, 'VN Pay', 0),
(34, 1, '2026-02-10 07:09:40', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'VN Pay', 0),
(35, 1, '2026-02-10 07:22:57', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 206000, 'COD', 2),
(36, 1, '2026-02-10 07:25:40', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'COD', 2),
(37, 1, '2026-02-10 07:26:18', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'COD', 2),
(38, 1, '2026-02-10 07:27:26', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 240000, 'COD', 2),
(39, 1, '2026-02-10 07:33:42', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 120000, 'MOMO', 1),
(40, 1, '2026-02-10 07:35:22', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 120000, 'MOMO', 1),
(41, 1, '2026-02-10 07:36:58', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'VN Pay', 0),
(42, 1, '2026-02-10 07:37:36', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'VN Pay', 0),
(43, 1, '2026-02-10 07:41:46', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 120000, 'VN Pay', 0),
(44, 1, '2026-02-10 09:59:27', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 240000, 'VN Pay', 1),
(45, 1, '2026-02-10 14:01:20', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 60000, 'VN Pay', 0),
(46, 1, '2026-02-10 14:03:25', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 110000, 'VN Pay', 0),
(47, 1, '2026-02-10 14:05:16', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'VN Pay', 0),
(48, 1, '2026-02-10 14:09:09', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 165000, 'VN Pay', 0),
(49, 1, '2026-02-10 14:11:39', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 193600, 'VN Pay', 0),
(50, 1, '2026-02-10 14:19:03', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 110000, 'VN Pay', 0),
(51, 1, '2026-02-10 14:19:55', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'VN Pay', 0),
(52, 1, '2026-02-10 14:24:08', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 60000, 'VN Pay', 0),
(53, 1, '2026-02-10 14:41:15', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 206000, 'VN Pay', 0),
(54, 1, '2026-02-10 14:55:06', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'VN Pay', 0),
(55, 1, '2026-02-10 15:01:06', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 193600, 'VN Pay', 0),
(56, 1, '2026-02-10 15:36:54', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'VN Pay', 1),
(57, 1, '2026-02-12 06:47:59', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 110000, 'VN Pay', 2),
(58, 1, '2026-02-12 07:03:13', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 193600, 'MOMO', 4),
(59, 1, '2026-02-12 07:07:58', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 120000, 'MOMO', 1),
(60, 1, '2026-02-12 07:17:39', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 120000, 'MOMO', 1),
(61, 1, '2026-02-12 07:42:24', '89 Trần Văn Giau, Xã Bình Chánh, Đà Nẵng', '0123456789', 60000, 'COD', 2),
(62, 1, '2026-02-13 05:51:43', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 193600, 'MOMO', 1),
(63, 1, '2026-02-13 11:02:54', '89 Trần Văn Giau, Xã Cần Thạnh, Nha Trang', '0123456789', 193600, 'MOMO', 1),
(64, 65, '2026-02-15 11:39:46', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0876456784', 60000, 'MOMO', 1),
(65, 65, '2026-02-15 12:06:18', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0845678983', 193600, 'COD', 2),
(66, 65, '2026-02-15 12:31:59', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0845678983', 300000, 'COD', 2),
(67, 65, '2026-02-15 12:33:42', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0845678983', 660000, 'COD', 3),
(68, 65, '2026-02-15 12:35:20', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0845678983', 240000, 'MOMO', 1),
(69, 65, '2026-02-15 13:52:49', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0845678983', 60000, 'COD', 2),
(70, 65, '2026-02-15 14:07:20', '217 Cây Bàng,Phường Thủ Thiêm,Hồ Chí Minh', '0845678983', 844800, 'COD', 2),
(71, 1, '2026-02-18 03:51:10', '89 Trần Văn Giau, Phường 2, Đà Nẵng', '0123456789', 144000, 'MOMO', 1),
(72, 1, '2026-02-18 04:00:47', '89 bờ kè vũng tàu, Phường 8, Vũng Tàu', '0123456789', 288000, 'COD', 2),
(73, 1, '2026-02-18 09:49:25', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'MOMO', 1),
(74, 1, '2026-02-24 07:46:50', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 144000, 'MOMO', 1),
(75, 1, '2026-02-24 07:50:04', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 240000, 'MOMO', 1),
(76, 1, '2026-03-01 07:50:24', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'MOMO', 1),
(77, 1, '2026-03-01 07:57:04', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0912334324', 1970000, 'COD', 3),
(78, 1, '2026-03-01 12:43:01', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 247500, 'MOMO', 1),
(79, 1, '2026-03-01 12:48:41', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 630000, 'VN Pay', 2),
(80, 1, '2026-03-11 14:04:55', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 14525, 'MOMO', 1),
(81, 1, '2026-03-11 18:24:22', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 180000, 'MOMO', 1),
(82, 1, '2026-03-12 08:25:14', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 43575, 'COD', 2),
(83, 1, '2026-03-12 15:50:51', '89 Trần Văn Giau, Tân Quy, jk', '0123456789', 144000, 'COD', 2),
(84, 66, '2026-03-05 01:30:10', 'ttt, tt, tt', '0909022966', 36, 'COD', 4),
(85, 66, '2026-03-10 01:35:10', 'qqq,Phường 1,Quy Nhơn', '0909022966', 36, 'COD', 5),
(86, 1, '2026-03-21 02:19:07', 'gdg, gfgdg, hghhgf', '0123456789', 240000, 'COD', 2),
(87, 1, '2026-03-24 12:05:15', '89 Trần Văn Giau, bkhh, hjkj', '0123456789', 36, 'COD', 2),
(88, 1, '2026-03-24 12:18:13', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 172500, 'COD', 5),
(89, 1, '2026-04-28 02:12:40', 'yyy, yyy, yyy', '0123456789', 450, 'COD', 4),
(90, 1, '2026-03-28 09:41:21', '89 Trần Văn Giau, Tân Quy, iu', '0123456789', 225000, 'MOMO', 1),
(91, 1, '2026-03-28 10:14:42', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 63, 'COD', 2),
(109, 1, '2026-03-28 11:12:40', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 22, 'COD', 2),
(110, 1, '2026-03-28 11:14:04', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 172500, 'COD', 2),
(111, 1, '2026-03-28 11:18:18', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 850000, 'COD', 2),
(112, 1, '2026-03-28 11:39:23', '118 Chùa Liên Hương,Phường Tân Kiểng,Cần Thơ', '0123456789', 210000, 'MOMO', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giohang`
--

CREATE TABLE `giohang` (
  `magio` int(11) NOT NULL,
  `masp` int(11) NOT NULL,
  `soluong` int(11) DEFAULT 1,
  `trangthai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `giohang`
--

INSERT INTO `giohang` (`magio`, `masp`, `soluong`, `trangthai`) VALUES
(2, 98, 3, 1),
(2, 109, 1, 1),
(2, 112, 6, 1),
(2, 113, 5, 1),
(14, 112, 1, 1),
(64, 114, 42, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `makh` int(11) NOT NULL,
  `hoten` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(50) NOT NULL,
  `sdt` varchar(15) NOT NULL,
  `sonha` varchar(200) NOT NULL,
  `trangthai` int(11) DEFAULT 1,
  `phuongxa` varchar(200) NOT NULL,
  `thanhpho` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`makh`, `hoten`, `email`, `sdt`, `sonha`, `trangthai`, `phuongxa`, `thanhpho`) VALUES
(1, 'Huỳnh Hữu Đức', 'ducsubaki192004@gmail.com', '0123456789', '118 Chùa Liên Hương', 1, 'Phường Tân Kiểng', 'Cần Thơ'),
(2, 'Nguyễn Văn Anh', 'anh123@gmail.com', '0814567821', '121 Mai Chí Thọ', 1, 'Phường An Khánh', 'Hồ Chí Minh'),
(14, 'Mai Anh Tài', 'tai123@gmail.com', '081345678', '234 Nam Kỳ Khởi Nghĩa', 1, 'Phường Tân Kiểng', 'Cần Thơ'),
(61, 'Hồ Quang Kiêng', 'kieng123@gmail.com', '0871565678', '123 Mai Văn Q', 1, 'Phường 12', 'Hải Phòng'),
(62, 'Huỳnh Cần Sa', 'sa123@gmail.com', '0875987321', '123 Mai Văn Q', 0, 'Phường 14', 'Buôn Ma Thuột'),
(63, 'Bành Thị To', 'to124@gmail.com', '0874567831', '123 Mai Văn Q', 1, 'Phường 12', 'Nha Trang'),
(64, 'admin', '', '', '', 1, '', ''),
(65, 'Trần Huỳnh Quang Huy', 'huy123@gmail.com', '0845678983', '217 Cây Bàng', 1, 'Phường Thủ Thiêm', 'Hồ Chí Minh'),
(66, 'qqq', 'qqq@qqq.qqq', '0909022966', 'qqq', 1, 'Phường 1', 'Quy Nhơn');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khuyenmai`
--

CREATE TABLE `khuyenmai` (
  `makm` int(11) NOT NULL,
  `tenkm` varchar(400) NOT NULL,
  `heso` double NOT NULL,
  `masp` int(11) NOT NULL,
  `ngaybatdau` date NOT NULL,
  `ngayketthuc` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `khuyenmai`
--

INSERT INTO `khuyenmai` (`makm`, `tenkm`, `heso`, `masp`, `ngaybatdau`, `ngayketthuc`) VALUES
(1, 'giảm giá sốc ngày quốc khánh', 0.1, 78, '2026-01-01', '2026-03-22'),
(2, 'giảm giá sốc', 0.2, 2, '2026-01-01', '2026-03-22'),
(3, 'khuyenmai', 0.12, 78, '2026-01-01', '2026-03-22'),
(4, 'khuyến mãi', 0.2, 14, '2026-01-01', '2026-03-22'),
(35, 'khuyến mãi', 0.5, 58, '2026-01-01', '2026-03-22'),
(36, 'khuyến mãi', 0.5, 42, '2026-01-01', '2026-03-22'),
(37, 'khuyến mãi', 0.5, 37, '2026-01-02', '2026-03-22'),
(38, 'khuyến mãi', 0.5, 57, '2026-01-02', '2026-03-22'),
(39, 'khuyến mãi', 0.5, 76, '2026-01-03', '2026-03-22'),
(40, 'khuyến mãi', 0.5, 9, '2026-01-03', '2026-03-22'),
(41, 'khuyến mãi', 0.5, 14, '2026-01-04', '2026-03-22'),
(42, 'khuyến mãi', 0.5, 42, '2026-01-05', '2026-03-22'),
(43, 'khuyến mãi', 0.5, 68, '2026-01-05', '2026-03-22'),
(44, 'khuyến mãi', 0.5, 12, '2026-01-06', '2026-03-22'),
(45, 'khuyến mãi', 0.5, 59, '2026-01-07', '2026-03-22'),
(46, 'khuyến mãi', 0.5, 56, '2026-01-08', '2026-03-22'),
(47, 'khuyến mãi', 0.5, 3, '2026-01-08', '2026-03-22'),
(48, 'khuyến mãi', 0.5, 46, '2026-01-09', '2026-03-22'),
(49, 'khuyến mãi', 0.5, 22, '2026-01-10', '2026-03-22'),
(50, 'khuyến mãi', 0.5, 71, '2026-01-10', '2026-03-22'),
(51, 'khuyến mãi', 0.5, 87, '2026-01-11', '2026-03-22'),
(52, 'khuyến mãi', 0.5, 23, '2026-01-12', '2026-03-22'),
(53, 'khuyến mãi', 0.5, 54, '2026-01-13', '2026-03-22'),
(54, 'khuyến mãi', 0.5, 99, '2026-01-14', '2026-03-22'),
(55, 'khuyến mãi', 0.5, 35, '2026-01-15', '2026-03-22'),
(56, 'khuyến mãi', 0.5, 75, '2026-01-16', '2026-03-22'),
(57, 'khuyến mãi', 0.5, 69, '2026-01-17', '2026-03-22'),
(58, 'khuyến mãi', 0.5, 21, '2026-01-18', '2026-03-22'),
(59, 'khuyến mãi', 0.5, 98, '2026-01-19', '2026-03-22'),
(60, 'khuyến mãi', 0.5, 26, '2026-01-20', '2026-03-22'),
(61, 'khuyến mãi', 0.5, 35, '2026-01-21', '2026-03-22'),
(62, 'khuyến mãi', 0.5, 98, '2026-01-22', '2026-03-22'),
(63, 'khuyến mãi', 0.5, 83, '2026-01-23', '2026-03-22'),
(64, 'khuyến mãi', 0.5, 20, '2026-01-24', '2026-03-22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieunhap`
--

CREATE TABLE `phieunhap` (
  `mapn` int(11) NOT NULL,
  `ngaynhap` date NOT NULL,
  `tongtien` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieunhap`
--

INSERT INTO `phieunhap` (`mapn`, `ngaynhap`, `tongtien`) VALUES
(13, '2026-02-03', 237030000),
(14, '2026-02-03', 1080000),
(15, '2024-01-01', 10000000),
(16, '2026-02-24', 500000),
(17, '2026-02-24', 500000),
(18, '2026-03-11', 1285400),
(19, '2026-03-01', 100),
(20, '2026-03-15', 150),
(21, '2026-03-21', 294160),
(22, '2026-03-21', 378000),
(23, '2026-03-28', 463329),
(24, '2026-03-28', 613050),
(25, '2026-03-06', 1076340),
(26, '2026-03-22', 1800000),
(27, '2026-03-24', 750000),
(28, '2026-03-01', 1000),
(29, '2026-05-01', 2800);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

CREATE TABLE `sanpham` (
  `masp` int(11) NOT NULL,
  `tensp` varchar(50) NOT NULL,
  `tacgia` varchar(50) NOT NULL,
  `danhmuc` varchar(50) NOT NULL,
  `gianhap` double NOT NULL DEFAULT 0,
  `gia` double NOT NULL DEFAULT 0,
  `tyle` int(11) NOT NULL DEFAULT 0,
  `tonkho` int(11) NOT NULL DEFAULT 0,
  `mota` varchar(1000) DEFAULT NULL,
  `link` longtext DEFAULT NULL,
  `nxb` varchar(200) NOT NULL,
  `namxb` int(11) NOT NULL,
  `sotrang` int(11) NOT NULL,
  `ngonngu` varchar(200) NOT NULL,
  `kichthuoc` varchar(200) NOT NULL,
  `trongluong` varchar(50) NOT NULL,
  `loaibia` varchar(50) NOT NULL,
  `trangthai` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`masp`, `tensp`, `tacgia`, `danhmuc`, `gianhap`, `gia`, `tyle`, `tonkho`, `mota`, `link`, `nxb`, `namxb`, `sotrang`, `ngonngu`, `kichthuoc`, `trongluong`, `loaibia`, `trangthai`) VALUES
(1, 'Mưa đỏ', 'Chu lai', 'Lichsu', 71756, 81084, 13, 156, 'Mô tả : Mưa Đỏ là một trong những tiểu thuyết chiến tranh đặc sắc nhất về 81 ngày đêm đỏ lửa tại Thành cổ Quảng Trị năm 1972. Không chỉ tái hiện sự khốc liệt của một trong những trận đánh ác liệt nhất lịch sử, tác phẩm còn mở ra một không gian nhân văn, nơi người đọc được chạm đến cả nỗi đau, sự hy sinh và khát vọng hòa bình', 'img/muado.jpg', 'Nhà xuất bản Chính trị Quốc gia', 2022, 497, 'Tiếng Việt', '15x21 cm', '272 g', 'Bìa bóng', 1),
(2, 'Cây cam ngọt của tôi', 'Jose Mauro De Vasconcelos', 'Tamly', 120000, 144000, 20, 18, 'Cây cam ngọt của tôi là tiểu thuyết kinh điển của José Mauro de Vasconcelos, kể về tuổi thơ đau khổ nhưng giàu trí tưởng tượng của cậu bé Zezé ở Brazil, nơi em tìm thấy an ủi và tình bạn kỳ diệu bên cây cam Pinkie và người bạn \"ông Bồ\" (Totoca), một câu chuyện cảm động về tình yêu thương, sự mất mát và sự trưởng thành, mang đến bài học sâu sắc về lòng thấu cảm', 'img/book2.webp', 'Nhà xuất bản Tổng hợp TP.HCM', 2021, 414, 'Tiếng Việt', '16x24 cm', '323 g', 'Bìa bóng', 1),
(3, 'Quá trẻ để chết', 'Đinh Hằng', 'Tamly', 200000, 240000, 20, 12, 'Quá trẻ để chết là một cuốn tự truyện/du ký về hành trình một mình xuyên Mỹ, kể về việc vượt qua nỗi đau tan vỡ tình yêu và trầm cảm, bằng cách khám phá cuộc sống, con người và thiên nhiên nước Mỹ, truyền cảm hứng về sự mạnh mẽ và lựa chọn hạnh phúc cá nhân. Tác phẩm nổi bật với văn phong giàu cảm xúc, hình ảnh, diễn tả chân thực những trải nghiệm và sự trưởng thành của tác giả trên hành trình đó.', 'img/3.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2015, 363, 'Tiếng Việt', '17x25 cm', '460 g', 'Bìa cứng', 1),
(6, 'Khi hơi thở hóa thinh không', 'Paul Kalanithi', 'Tamly', 150000, 165000, 10, 2, 'Khi hơi thở hóa thinh không\" (When Breath Becomes Air) là tự truyện của Paul Kalanithi, một bác sĩ phẫu thuật thần kinh tài năng người Mỹ gốc Ấn, người được chẩn đoán mắc ung thư phổi giai đoạn cuối ở tuổi 36, và ông viết cuốn sách này trong những ngày cuối đời để suy ngẫm về ý nghĩa cuộc sống và cái chết, chuyển từ vị thế người cứu bệnh nhân sang người bệnh. Cuốn sách mô tả chân thực hành trình từ sự nghiệp y khoa rực rỡ, quá trình đối mặt với căn bệnh nan y, đến triết lý sống và những trăn trở sâu sắc về việc \"cuộc sống nào đáng sống', 'img/newbook2.webp', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 243, 'Tiếng Việt', '15x21 cm', '334 g', 'Bìa bóng', 1),
(8, 'Sự im lặng của bầy cừu', 'Thomas Harris', 'Tamly', 100000, 120000, 20, 14, 'Sự Im Lặng Của Bầy Cừu (The Silence of the Lambs) của Thomas Harris là tiểu thuyết trinh thám kinh dị tâm lý đỉnh cao, kể về nữ đặc vụ FBI tập sự Clarice Starling hợp tác với bác sĩ tâm thần ăn thịt người Hannibal Lecter để truy bắt kẻ sát nhân hàng loạt Buffalo Bill, khám phá những góc tối tâm hồn, đối mặt với nỗi sợ hãi và đấu tranh giữa thiện-ác, tạo nên một câu chuyện căng thẳng, giật gân và ám ảnh sâu sắc về bản chất con người và ký ức', 'img/book4.webp', 'Nhà xuất bản Tổng hợp TP.HCM', 2015, 411, 'Tiếng Việt', '15x21 cm', '255 g', 'Bìa cứng', 1),
(9, 'Làm bạn với bầu trời', 'Thomas Harris', 'Thieunhi', 120000, 132000, 10, 16, 'Sách \"Làm bạn với bầu trời\" của Nguyễn Nhật Ánh kể về cậu bé Tèo bất hạnh bị liệt nửa người, nhưng luôn lạc quan, yêu đời và tìm thấy niềm vui qua bầu trời và thiên nhiên, dùng sự trong sáng, tình yêu thương để cảm hóa những người xung quanh, truyền tải thông điệp mạnh mẽ về nghị lực sống, tình người, và lên án sự ích kỷ của người lớn qua góc nhìn ngây thơ của những đứa trẻ, khiến người đọc cảm động và suy ngẫm', 'img/book3.jpg', 'Nhà xuất bản Kim Đồng', 2022, 356, 'Tiếng Việt', '15x21 cm', '484 g', 'Bìa mềm', 1),
(10, 'Lịch Sử Việt Nam Toàn Tập', 'Phan Huy Lê', 'Lichsu', 200000, 240000, 20, 11, 'Bộ sách đồ sộ nghiên cứu toàn diện lịch sử Việt Nam từ thời nguyên thủy đến hiện đại, với nhiều tư liệu quý giá.', 'img/su1.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2021, 166, 'Tiếng Việt', '14x20 cm', '490 g', 'Bìa mềm', 1),
(11, 'Đại Việt Sử Ký Toàn Thư', 'Ngô Sĩ Liên', 'Lichsu', 150000, 180000, 20, 0, 'Bộ quốc sử chính thống của nhà Hậu Lê, ghi chép lịch sử Việt Nam từ thời Hồng Bàng đến năm 1675.', 'img/su2.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2023, 227, 'Tiếng Việt', '14x20 cm', '409 g', 'Bìa cứng', 1),
(12, 'Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 'Lichsu', 100000, 120000, 20, 13, 'Khám phá lịch sử loài người từ thời đồ đá đến hiện đại với góc nhìn độc đáo và sâu sắc.', 'img/su3.png', 'Nhà xuất bản Chính trị Quốc gia', 2017, 210, 'Tiếng Việt', '13x19 cm', '293 g', 'Bìa mềm', 1),
(13, 'Lịch Sử Thế Giới', 'H.G. Wells', 'Lichsu', 120000, 132000, 10, 17, 'Tác phẩm kinh điển tóm lược lịch sử thế giới từ khởi thủy đến thế kỷ XX.', 'img/su4.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2017, 317, 'Tiếng Việt', '15x21 cm', '375 g', 'Bìa bóng', 1),
(14, 'Việt Nam Sử Lược', 'Trần Trọng Kim', 'Lichsu', 200000, 220000, 10, 10, 'Bộ sách giáo khoa lịch sử cơ bản và hệ thống đầu tiên bằng chữ quốc ngữ.', 'img/su5.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2022, 493, 'Tiếng Việt', '15x21 cm', '252 g', 'Bìa cứng', 1),
(15, 'Chiến Tranh Và Hòa Bình', 'Lev Tolstoy', 'Lichsu', 150000, 165000, 10, 15, 'Tiểu thuyết sử thi vĩ đại về xã hội Nga thời Napoleon.', 'img/su6.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2019, 428, 'Tiếng Việt', '14x20 cm', '371 g', 'Bìa bóng', 1),
(16, 'Hồ Chí Minh: Biên Niên Tiểu Sử', 'Viện Hồ Chí Minh', 'Lichsu', 100000, 120000, 20, 18, 'Bộ sách ghi chép chi tiết cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.', 'img/su7.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2020, 247, 'Tiếng Việt', '15x21 cm', '261 g', 'Bìa bóng', 1),
(17, 'Lịch Sử Tư Tưởng Phương Đông', 'Nguyễn Đăng Thục', 'Lichsu', 120000, 132000, 10, 12, 'Nghiên cứu về triết học và tư tưởng các nền văn minh phương Đông.', 'img/su8.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2018, 355, 'Tiếng Việt', '16x24 cm', '475 g', 'Bìa cứng', 1),
(18, 'Các Nền Văn Minh Thế Giới', 'Philip Steele', 'Lichsu', 200000, 240000, 20, 20, 'Giới thiệu về sự hình thành và phát triển của các nền văn minh lớn trên thế giới.', 'img/su9.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2016, 349, 'Tiếng Việt', '15x21 cm', '311 g', 'Bìa cứng', 1),
(19, 'Hồi Ký Chiến Tranh', 'Võ Nguyên Giáp', 'Lichsu', 150000, 180000, 20, 14, 'Hồi ký của Đại tướng Võ Nguyên Giáp về hai cuộc kháng chiến chống Pháp và Mỹ.', 'img/su10.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2023, 485, 'Tiếng Việt', '17x25 cm', '380 g', 'Bìa mềm', 1),
(20, 'Lịch Sử Trung Quốc', 'Jonathan Spence', 'Lichsu', 100000, 120000, 20, 16, 'Tổng quan lịch sử Trung Quốc từ thời cổ đại đến hiện đại.', 'img/su11.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2022, 212, 'Tiếng Việt', '14x20 cm', '325 g', 'Bìa bóng', 1),
(21, 'Đế Chế Mông Cổ', 'Jack Weatherford', 'Lichsu', 120000, 144000, 20, 11, 'Lịch sử về sự trỗi dậy và suy tàn của đế chế Mông Cổ hùng mạnh.', 'img/su12.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2017, 423, 'Tiếng Việt', '17x25 cm', '389 g', 'Bìa mềm', 1),
(22, 'Lịch Sử Nhật Bản', 'Kenneth G. Henshall', 'Lichsu', 200000, 220000, 10, 19, 'Khái quát lịch sử Nhật Bản từ thời kỳ đồ đá đến hiện đại.', 'img/su13.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2023, 219, 'Tiếng Việt', '13x19 cm', '287 g', 'Bìa bóng', 1),
(23, 'Thế Chiến Thứ Hai', 'Antony Beevor', 'Lichsu', 150000, 165000, 10, 13, 'Phân tích toàn diện về nguyên nhân, diễn biến và hậu quả của Thế chiến II.', 'img/su14.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2021, 437, 'Tiếng Việt', '17x25 cm', '291 g', 'Bìa cứng', 1),
(24, 'Lịch Sử Châu Âu', 'Norman Davies', 'Lichsu', 100000, 110000, 10, 17, 'Tổng quan lịch sử châu Âu từ thời tiền sử đến hiện đại.', 'img/su15.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2018, 170, 'Tiếng Việt', '13x19 cm', '241 g', 'Bìa cứng', 1),
(25, 'Cuộc Chiến Việt Nam', 'Stanley Karnow', 'Lichsu', 120000, 144000, 20, 10, 'Phân tích sâu sắc về cuộc chiến tranh Việt Nam từ nhiều góc độ.', 'img/su16.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2015, 495, 'Tiếng Việt', '16x24 cm', '257 g', 'Bìa mềm', 1),
(26, 'Lịch Sử Hoa Kỳ', 'Howard Zinn', 'Lichsu', 200000, 240000, 20, 15, 'Lịch sử nước Mỹ từ góc nhìn của những người bình thường và các nhóm thiểu số.', 'img/su17.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2022, 407, 'Tiếng Việt', '14x20 cm', '284 g', 'Bìa cứng', 1),
(27, 'Văn Minh Ai Cập Cổ Đại', 'Cyril Aldred', 'Lichsu', 150000, 165000, 10, 18, 'Khám phá nền văn minh rực rỡ của Ai Cập cổ đại với các kim tự tháp và pharaoh.', 'img/su18.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2021, 221, 'Tiếng Việt', '16x24 cm', '251 g', 'Bìa cứng', 1),
(28, 'La Mã: Đế Chế Và Di Sản', 'Edward Gibbon', 'Lichsu', 100000, 120000, 20, 12, 'Nghiên cứu về sự trỗi dậy và suy tàn của Đế chế La Mã.', 'img/su19.png', 'Nhà xuất bản Chính trị Quốc gia', 2018, 262, 'Tiếng Việt', '14x20 cm', '454 g', 'Bìa mềm', 1),
(29, 'Lịch Sử Phật Giáo Việt Nam', 'Lê Mạnh Thát', 'Lichsu', 120000, 144000, 20, 20, 'Khảo cứu về quá trình du nhập và phát triển của Phật giáo tại Việt Nam.', 'img/su20.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2016, 255, 'Tiếng Việt', '13x19 cm', '358 g', 'Bìa cứng', 1),
(30, 'Lịch Sử Đảng Cộng Sản Việt Nam', 'Hội đồng Trung ương', 'Lichsu', 200000, 220000, 10, 14, 'Tài liệu chính thức về quá trình hình thành và phát triển của Đảng Cộng sản Việt Nam.', 'img/su21.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2017, 237, 'Tiếng Việt', '15x21 cm', '326 g', 'Bìa bóng', 1),
(31, 'Cách Mạng Tháng Tám 1945', 'Trần Huy Liệu', 'Lichsu', 150000, 165000, 10, 16, 'Phân tích về cuộc Cách mạng Tháng Tám và sự ra đời của nước Việt Nam Dân chủ Cộng hòa.', 'img/su22.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2021, 232, 'Tiếng Việt', '13x19 cm', '292 g', 'Bìa cứng', 1),
(32, 'Điện Biên Phủ: 1954', 'Jules Roy', 'Lichsu', 100000, 120000, 20, 11, 'Ghi chép chi tiết về chiến dịch Điện Biên Phủ - trận đánh quyết định trong chiến tranh Đông Dương.', 'img/su23.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2021, 475, 'Tiếng Việt', '15x21 cm', '470 g', 'Bìa bóng', 1),
(33, 'Lịch Sử Khmer Đỏ', 'David P. Chandler', 'Lichsu', 120000, 132000, 10, 19, 'Nghiên cứu về chế độ Khmer Đỏ và thảm họa diệt chủng tại Campuchia.', 'img/su24.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2021, 192, 'Tiếng Việt', '14x20 cm', '277 g', 'Bìa mềm', 1),
(34, 'Lịch Sử Nga: Từ Sa Hoàng Đến Putin', 'Orlando Figes', 'Lichsu', 200000, 240000, 20, 13, 'Khái quát lịch sử nước Nga từ thời Sa hoàng đến thời đại Putin.', 'img/su25.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2022, 226, 'Tiếng Việt', '15x21 cm', '267 g', 'Bìa cứng', 1),
(35, 'Lịch Sử Ấn Độ', 'John Keay', 'Lichsu', 150000, 180000, 20, 17, 'Giới thiệu toàn diện về lịch sử và văn hóa Ấn Độ qua các thời kỳ.', 'img/su26.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2017, 235, 'Tiếng Việt', '14x20 cm', '236 g', 'Bìa cứng', 1),
(36, 'Thành Cát Tư Hãn Và Sự Hình Thành Thế Giới Hiện Đạ', 'Jack Weatherford', 'Lichsu', 100000, 110000, 10, 10, 'Phân tích ảnh hưởng của Thành Cát Tư Hãn đến lịch sử thế giới.', 'img/su27.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2016, 187, 'Tiếng Việt', '13x19 cm', '363 g', 'Bìa mềm', 1),
(37, 'Lịch Sử Hy Lạp Cổ Đại', 'Robin Waterfield', 'Lichsu', 120000, 144000, 20, 15, 'Khám phá nền văn minh Hy Lạp cổ đại - cái nôi của văn minh phương Tây.', 'img/su28.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2018, 232, 'Tiếng Việt', '13x19 cm', '407 g', 'Bìa mềm', 1),
(38, 'Lịch Sử Phật Giáo Thế Giới', 'Peter Harvey', 'Lichsu', 200000, 220000, 10, 18, 'Tổng quan về sự phát triển của Phật giáo trên toàn thế giới.', 'img/su29.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2023, 234, 'Tiếng Việt', '14x20 cm', '416 g', 'Bìa bóng', 1),
(39, 'Lịch Sử Các Cuộc Chiến Tranh', 'John Keegan', 'Lichsu', 150000, 180000, 20, 12, 'Phân tích các cuộc chiến tranh quan trọng trong lịch sử nhân loại từ cổ đại đến hiện đại.', 'img/su30.jfif', 'Nhà xuất bản Chính trị Quốc gia', 2019, 222, 'Tiếng Việt', '16x24 cm', '316 g', 'Bìa mềm', 1),
(40, 'Đắc Nhân Tâm', 'Dale Carnegie', 'Tamly', 100000, 120000, 20, 20, 'Cuốn sách kinh điển về nghệ thuật thu phục lòng người, giao tiếp và xây dựng mối quan hệ hiệu quả.', 'img/tl1.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 153, 'Tiếng Việt', '16x24 cm', '207 g', 'Bìa mềm', 1),
(41, 'Tâm Lý Học Đám Đông', 'Gustave Le Bon', 'Tamly', 120000, 132000, 10, 14, 'Phân tích về hành vi và tâm lý của đám đông, những đặc tính và ảnh hưởng của nó đến xã hội.', 'img/tl2.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2018, 217, 'Tiếng Việt', '16x24 cm', '486 g', 'Bìa cứng', 1),
(42, 'Đời Ngắn Đừng Ngủ Dài', 'Robin Sharma', 'Tamly', 200000, 240000, 20, 16, 'Những bài học về sống có ý nghĩa, tận dụng thời gian và phát triển bản thân.', 'img/tl3.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2018, 495, 'Tiếng Việt', '16x24 cm', '451 g', 'Bìa bóng', 1),
(43, 'Nhà Giả Kim', 'Paulo Coelho', 'Tamly', 150000, 180000, 20, 11, 'Câu chuyện ẩn dụ về hành trình tìm kiếm ước mơ và khám phá bản thân.', 'img/tl4.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2015, 330, 'Tiếng Việt', '15x21 cm', '376 g', 'Bìa cứng', 1),
(44, 'Tâm Lý Học Về Tiền', 'Morgan Housel', 'Tamly', 100000, 110000, 10, 19, 'Khám phá mối quan hệ giữa tâm lý, hành vi và tài chính cá nhân.', 'img/tl5.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 381, 'Tiếng Việt', '16x24 cm', '380 g', 'Bìa bóng', 1),
(45, 'Sức Mạnh Của Tiềm Thức', 'Joseph Murphy', 'Tamly', 120000, 144000, 20, 13, 'Khám phá sức mạnh của tiềm thức và cách vận dụng nó để đạt được thành công.', 'img/tl6.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 454, 'Tiếng Việt', '17x25 cm', '432 g', 'Bìa mềm', 1),
(46, 'Tư Duy Nhanh Và Chậm', 'Daniel Kahneman', 'Tamly', 200000, 220000, 10, 17, 'Phân tích hai hệ thống tư duy của con người và những thiên kiến nhận thức ảnh hưởng đến quyết định.', 'img/tl7.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2022, 370, 'Tiếng Việt', '15x21 cm', '440 g', 'Bìa cứng', 1),
(47, 'Đàn Ông Sao Hỏa Đàn Bà Sao Kim', 'John Gray', 'Tamly', 150000, 165000, 10, 10, 'Hiểu về sự khác biệt tâm lý giữa nam và nữ để xây dựng mối quan hệ tốt đẹp hơn.', 'img/tl8.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 347, 'Tiếng Việt', '13x19 cm', '264 g', 'Bìa cứng', 1),
(48, 'Dám Bị Ghét', 'Kishimi Ichiro & Koga Fumitake', 'Tamly', 100000, 110000, 10, 15, 'Áp dụng tâm lý học Adler để tìm kiếm hạnh phúc và tự do trong cuộc sống.', 'img/tl9.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 275, 'Tiếng Việt', '17x25 cm', '211 g', 'Bìa bóng', 1),
(49, 'Tâm Lý Học Hành Vi', 'Robert Cialdini', 'Tamly', 120000, 132000, 10, 18, 'Nghiên cứu về các nguyên tắc thuyết phục và ảnh hưởng của tâm lý lên hành vi.', 'img/tl10.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 282, 'Tiếng Việt', '14x20 cm', '397 g', 'Bìa mềm', 1),
(50, 'Hạnh Phúc Tại Tâm', 'Ajahn Brahm', 'Tamly', 200000, 220000, 10, 12, 'Những bài giảng về tìm kiếm hạnh phúc từ bên trong qua góc nhìn Phật giáo', 'img/tl11.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2015, 406, 'Tiếng Việt', '15x21 cm', '208 g', 'Bìa bóng', 1),
(51, 'Đọc Vị Bất Kỳ Ai', 'David J. Lieberman', 'Tamly', 150000, 180000, 20, 20, 'Công cụ để hiểu suy nghĩ và cảm xúc của người khác thông qua ngôn ngữ cơ thể.', 'img/tl12.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 227, 'Tiếng Việt', '14x20 cm', '202 g', 'Bìa mềm', 1),
(52, 'Tâm Lý Học Tội Phạm', 'John E. Douglas', 'Tamly', 100000, 110000, 10, 14, 'Phân tích tâm lý của các tội phạm và phương pháp điều tra tội phạm học.', 'img/tl13.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2016, 409, 'Tiếng Việt', '13x19 cm', '403 g', 'Bìa bóng', 1),
(53, 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm', 'Mark Manson', 'Tamly', 120000, 144000, 20, 16, 'Cách tiếp cận thực tế để sống một cuộc đời đáng giá bằng việc chọn lọc điều quan trọng.', 'img/tl14.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2016, 341, 'Tiếng Việt', '13x19 cm', '422 g', 'Bìa cứng', 1),
(54, 'Flow - Dòng Chảy', 'Mihaly Csikszentmihalyi', 'Tamly', 200000, 220000, 10, 11, 'Khám phá trạng thái tối ưu của tâm trí khi hoàn toàn đắm mình trong hoạt động.', 'img/tl15.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2015, 200, 'Tiếng Việt', '14x20 cm', '361 g', 'Bìa cứng', 1),
(55, 'Phi Lý Trí', 'Dan Ariely', 'Tamly', 150000, 180000, 20, 19, 'Khám phá những yếu tố phi lý trong hành vi và quyết định của con người.', 'img/tl16.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 158, 'Tiếng Việt', '15x21 cm', '485 g', 'Bìa cứng', 1),
(56, 'Tâm Lý Học Thành Công', 'Carol S. Dweck', 'Tamly', 100000, 120000, 20, 13, 'Phân tích về tư duy cố định và tư duy phát triển ảnh hưởng đến thành công.', 'img/tl17.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2022, 323, 'Tiếng Việt', '13x19 cm', '379 g', 'Bìa bóng', 1),
(57, 'Đừng Lo Lắng Về Chuyện Nhỏ', 'Richard Carlson', 'Tamly', 120000, 132000, 10, 17, 'Cách giảm bớt căng thẳng và tìm thấy bình yên trong cuộc sống hàng ngày.', 'img/tl18.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 377, 'Tiếng Việt', '15x21 cm', '471 g', 'Bìa bóng', 1),
(58, 'Tâm Lý Học Về Hạnh Phúc', 'Sonja Lyubomirsky', 'Tamly', 200000, 220000, 10, 10, 'Nghiên cứu khoa học về hạnh phúc và cách nuôi dưỡng cảm xúc tích cực.', 'img/tl19.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2017, 157, 'Tiếng Việt', '14x20 cm', '264 g', 'Bìa mềm', 1),
(59, 'Bản Đồ Tư Duy', 'Tony Buzan', 'Tamly', 150000, 165000, 10, 15, 'Phương pháp tư duy hình ảnh để tăng cường trí nhớ, sáng tạo và hiệu quả học tập.', 'img/tl20.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 339, 'Tiếng Việt', '13x19 cm', '350 g', 'Bìa cứng', 1),
(60, 'Tâm Lý Học Lãnh Đạo', 'John C. Maxwell', 'Tamly', 100000, 110000, 10, 18, 'Nguyên tắc tâm lý trong việc lãnh đạo và phát triển đội ngũ hiệu quả.', 'img/tl21.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2020, 160, 'Tiếng Việt', '13x19 cm', '401 g', 'Bìa bóng', 1),
(61, 'Sống Thực Tế Giữa Đời Thực Dụng', 'Mimi Thùy Linh', 'Tamly', 120000, 132000, 10, 12, 'Góc nhìn thực tế về tâm lý sống trong xã hội hiện đại.', 'img/tl22.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2018, 300, 'Tiếng Việt', '17x25 cm', '257 g', 'Bìa mềm', 1),
(62, 'Tâm Lý Học Tích Cực', 'Martin Seligman', 'Tamly', 200000, 240000, 20, 20, 'Nền tảng của tâm lý học tích cực và cách áp dụng để có cuộc sống viên mãn.', 'img/tl23.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2022, 200, 'Tiếng Việt', '14x20 cm', '282 g', 'Bìa cứng', 1),
(63, 'Nghệ Thuật Yêu', 'Erich Fromm', 'Tamly', 150000, 180000, 20, 14, 'Phân tích triết học và tâm lý về bản chất của tình yêu và các mối quan hệ.', 'img/tl24.png', 'Nhà xuất bản Tổng hợp TP.HCM', 2023, 348, 'Tiếng Việt', '13x19 cm', '381 g', 'Bìa bóng', 1),
(64, 'Tâm Lý Học Trong Quảng Cáo', 'Robert Heath', 'Tamly', 100000, 110000, 10, 16, 'Ứng dụng tâm lý học trong tiếp thị và quảng cáo để thuyết phục khách hàng.', 'img/tl25.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2018, 236, 'Tiếng Việt', '13x19 cm', '264 g', 'Bìa cứng', 1),
(65, 'Hiểu Về Trái Tim', 'Minh Niệm', 'Tamly', 120000, 132000, 10, 11, 'Thiền và tâm lý học ứng dụng để chữa lành và hiểu rõ bản thân.', 'img/tl26.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2022, 428, 'Tiếng Việt', '14x20 cm', '373 g', 'Bìa bóng', 1),
(66, 'Tâm Lý Học Về Sự Sáng Tạo', 'Mihaly Csikszentmihalyi', 'Tamly', 200000, 240000, 20, 19, 'Nghiên cứu về quá trình sáng tạo và tâm lý của những người sáng tạo.', 'img/tl27.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2022, 498, 'Tiếng Việt', '15x21 cm', '343 g', 'Bìa bóng', 1),
(67, 'Cà Phê Cùng Tony', 'Tony Buổi Sáng', 'Tamly', 150000, 165000, 10, 13, 'Những câu chuyện và bài học về tư duy, lối sống và phát triển bản thân.', 'img/tl28.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2016, 492, 'Tiếng Việt', '15x21 cm', '284 g', 'Bìa mềm', 1),
(68, 'Tâm Lý Học Trong Phòng Tập', 'Shawn Achor', 'Tamly', 100000, 120000, 20, 17, 'Cách rèn luyện tâm trí để đạt hiệu suất cao trong công việc và cuộc sống.', 'img/tl29.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 303, 'Tiếng Việt', '15x21 cm', '397 g', 'Bìa cứng', 1),
(69, 'Đánh Thức Con Người Phi Thường Trong Bạn', 'Anthony Robbins', 'Tamly', 120000, 144000, 20, 10, 'Phương pháp làm chủ cảm xúc, cơ thể và tài chính để đạt đỉnh cao.', 'img/tl30.jfif', 'Nhà xuất bản Tổng hợp TP.HCM', 2019, 232, 'Tiếng Việt', '15x21 cm', '474 g', 'Bìa bóng', 1),
(70, 'Doraemon - Truyện Dài', 'Fujiko F. Fujio', 'Thieunhi', 200000, 240000, 20, 15, 'Bộ truyện tranh nổi tiếng về chú mèo máy đến từ tương lai cùng những cuộc phiêu lưu kỳ thú với Nobita và nhóm bạn.', 'img/tn1.jfif', 'Nhà xuất bản Kim Đồng', 2017, 218, 'Tiếng Việt', '14x20 cm', '428 g', 'Bìa bóng', 1),
(71, 'Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 'Thieunhi', 150000, 180000, 20, 18, 'Câu chuyện về cậu bé phù thủy Harry Potter bước vào thế giới phép thuật tại trường Hogwarts.', 'img/tn2.jfif', 'Nhà xuất bản Kim Đồng', 2021, 286, 'Tiếng Việt', '17x25 cm', '340 g', 'Bìa cứng', 1),
(72, 'Tôi Là Bê Tô', 'Nguyễn Nhật Ánh', 'Thieunhi', 100000, 110000, 10, 12, 'Câu chuyện dí dỏm về chú chó Bê Tô với góc nhìn hài hước về thế giới loài người.', 'img/tn3.jfif', 'Nhà xuất bản Kim Đồng', 2018, 195, 'Tiếng Việt', '15x21 cm', '357 g', 'Bìa bóng', 1),
(73, 'Thần Thoại Hy Lạp (Dành Cho Thiếu Nhi)', 'Geraldine McCaughrean', 'Thieunhi', 120000, 132000, 10, 20, 'Tập hợp những câu chuyện thần thoại Hy Lạp hấp dẫn được kể lại phù hợp với độc giả nhỏ tuổi.', 'img/tn4.jfif', 'Nhà xuất bản Kim Đồng', 2021, 230, 'Tiếng Việt', '17x25 cm', '359 g', 'Bìa mềm', 1),
(74, 'Charlotte và Wilbur', 'E.B. White', 'Thieunhi', 200000, 220000, 10, 14, 'Câu chuyện cảm động về tình bạn giữa chú lợn Wilbur và cô nhện Charlotte trên nông trại.', 'img/tn5.jfif', 'Nhà xuất bản Kim Đồng', 2015, 413, 'Tiếng Việt', '16x24 cm', '244 g', 'Bìa bóng', 1),
(75, 'Kính Vạn Hoa', 'Nguyễn Nhật Ánh', 'Thieunhi', 150000, 180000, 20, 16, 'Bộ truyện về tuổi học trò với những trò nghịch ngợm, tình bạn và kỷ niệm đáng nhớ.', 'img/tn6.jfif', 'Nhà xuất bản Kim Đồng', 2015, 196, 'Tiếng Việt', '15x21 cm', '268 g', 'Bìa cứng', 1),
(76, 'Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 'Thieunhi', 100000, 120000, 20, 11, 'Tác phẩm kinh điển về chuyến phiêu lưu của Hoàng tử bé qua các hành tinh với những triết lý sâu sắc.', 'img/tn7.jfif', 'Nhà xuất bản Kim Đồng', 2016, 190, 'Tiếng Việt', '13x19 cm', '214 g', 'Bìa mềm', 1),
(77, 'Chuyện Con Mèo Dạy Hải Âu Bay', 'Luis Sepúlveda', 'Thieunhi', 120000, 132000, 10, 19, 'Câu chuyện ấm áp về chú mèo Zorba nhận nuôi và dạy chú hải âu non tập bay.', 'img/tn8.jfif', 'Nhà xuất bản Kim Đồng', 2023, 314, 'Tiếng Việt', '16x24 cm', '448 g', 'Bìa mềm', 1),
(78, 'Matilda', 'Roald Dahl', 'Thieunhi', 200000, 220000, 10, 13, 'Câu chuyện về cô bé Matilda thông minh với năng lực đặc biệt và tinh thần mạnh mẽ.', 'img/tn9.jfif', 'Nhà xuất bản Kim Đồng', 2019, 407, 'Tiếng Việt', '14x20 cm', '272 g', 'Bìa cứng', 1),
(79, 'Alice Ở Xứ Sở Diệu Kỳ', 'Lewis Carroll', 'Thieunhi', 150000, 165000, 10, 17, 'Cuộc phiêu lưu kỳ thú của cô bé Alice vào thế giới thần tiên đầy phép màu.', 'img/tn10.jfif', 'Nhà xuất bản Kim Đồng', 2023, 469, 'Tiếng Việt', '15x21 cm', '266 g', 'Bìa mềm', 1),
(80, 'Không Gia Đình', 'Hector Malot', 'Thieunhi', 100000, 120000, 20, 10, 'Hành trình của cậu bé Rémi không gia đình đi khắp nước Pháp với gánh xiếc thú.', 'img/tn11.jfif', 'Nhà xuất bản Kim Đồng', 2023, 461, 'Tiếng Việt', '15x21 cm', '483 g', 'Bìa mềm', 1),
(81, 'Những Tấm Lòng Cao Cả', 'Edmondo De Amicis', 'Thieunhi', 120000, 132000, 10, 15, 'Những câu chuyện cảm động về tình thầy trò, bạn bè và gia đình trong môi trường học đường.', 'img/tn12.jfif', 'Nhà xuất bản Kim Đồng', 2023, 184, 'Tiếng Việt', '16x24 cm', '362 g', 'Bìa cứng', 1),
(82, 'Pippi Tất Dài', 'Astrid Lindgren', 'Thieunhi', 200000, 220000, 10, 18, 'Cuộc sống tự do, phiêu lưu của cô bé Pippi với sức mạnh phi thường và trái tim nhân hậu.', 'img/tn13.jfif', 'Nhà xuất bản Kim Đồng', 2018, 382, 'Tiếng Việt', '13x19 cm', '497 g', 'Bìa cứng', 1),
(83, 'Chú Sâu Háu Ăn', 'Eric Carle', 'Thieunhi', 150000, 180000, 20, 12, 'Câu chuyện giáo dục về vòng đời của chú sâu biến thành bướm, giúp trẻ học đếm và các ngày trong tuần.', 'img/tn14.jfif', 'Nhà xuất bản Kim Đồng', 2022, 199, 'Tiếng Việt', '13x19 cm', '329 g', 'Bìa cứng', 1),
(84, 'Totto-chan Bên Cửa Sổ', 'Tetsuko Kuroyanagi', 'Thieunhi', 100000, 120000, 20, 20, 'Câu chuyện có thật về cô bé Totto-chan và ngôi trường đặc biệt nơi trẻ em được tự do phát triển.', 'img/tn15.jfif', 'Nhà xuất bản Kim Đồng', 2023, 351, 'Tiếng Việt', '13x19 cm', '256 g', 'Bìa cứng', 1),
(85, 'Kinh Thánh Tân Ước', 'Nhiều tác giả', 'Tongiao', 120000, 132000, 10, 14, 'Bộ sách thiêng liêng của đạo Thiên Chúa, ghi lại cuộc đời và lời dạy của Chúa Giêsu và các tông đồ.', 'img/tg1.png', 'Nhà xuất bản Tôn giáo', 2018, 444, 'Tiếng Việt', '17x25 cm', '316 g', 'Bìa bóng', 1),
(86, 'Kinh Phật Cho Người Tại Gia', 'Thích Nhất Hạnh', 'Tongiao', 200000, 220000, 10, 16, 'Tuyển tập các bài kinh Phật giáo cơ bản được giải thích rõ ràng, phù hợp cho Phật tử tại gia tu tập hàng ngày.', 'img/tg2.jfif', 'Nhà xuất bản Tôn giáo', 2022, 201, 'Tiếng Việt', '14x20 cm', '443 g', 'Bìa mềm', 1),
(87, 'Đạo Hồi: Niềm Tin Và Thực Hành', 'Karen Armstrong', 'Tongiao', 150000, 165000, 10, 11, 'Giới thiệu toàn diện về đạo Hồi, từ lịch sử, giáo lý đến các nghi thức thực hành của tín đồ Hồi giáo.', 'img/tg3.jfif', 'Nhà xuất bản Tôn giáo', 2015, 309, 'Tiếng Việt', '13x19 cm', '472 g', 'Bìa cứng', 1),
(88, 'Kinh Coran (Bản Dịch Tiếng Việt)', 'Nhóm dịch giả', 'Tongiao', 100000, 110000, 10, 19, 'Bản dịch Kinh Coran sang tiếng Việt, sách thiêng liêng của đạo Hồi, cùng lời giải thích ý nghĩa.', 'img/tg4.jfif', 'Nhà xuất bản Tôn giáo', 2016, 333, 'Tiếng Việt', '14x20 cm', '390 g', 'Bìa cứng', 1),
(89, 'Tâm Kinh Bát Nhã Giảng Giải', 'Thích Thanh Từ', 'Tongiao', 120000, 144000, 20, 13, 'Giảng giải chi tiết về Tâm Kinh Bát Nhã - một trong những bộ kinh quan trọng nhất của Phật giáo Đại thừa.', 'img/tg5.jfif', 'Nhà xuất bản Tôn giáo', 2017, 191, 'Tiếng Việt', '16x24 cm', '298 g', 'Bìa cứng', 1),
(90, 'Giáo Lý Công Giáo', 'Hội đồng Giám mục Việt Nam', 'Tongiao', 200000, 240000, 20, 17, 'Sách trình bày toàn bộ giáo lý của đạo Công giáo, dùng cho việc học hỏi và giảng dạy đức tin.', 'img/tg6.jfif', 'Nhà xuất bản Tôn giáo', 2016, 294, 'Tiếng Việt', '16x24 cm', '201 g', 'Bìa mềm', 1),
(91, 'Đạo Cao Đài Và Con Đường Tâm Linh', 'Hồ Văn Tường', 'Tongiao', 150000, 165000, 10, 10, 'Giới thiệu về đạo Cao Đài - một tôn giáo độc đáo của Việt Nam, từ lịch sử hình thành đến giáo lý và nghi lễ.', 'img/tg7.jfif', 'Nhà xuất bản Tôn giáo', 2018, 361, 'Tiếng Việt', '17x25 cm', '431 g', 'Bìa mềm', 1),
(92, 'Lời Vàng Của Phật', 'Thích Minh Châu', 'Tongiao', 100000, 110000, 10, 15, 'Tuyển tập những lời dạy quý báu của Đức Phật được sắp xếp theo chủ đề, dễ hiểu và dễ thực hành.', 'img/tg8.jfif', 'Nhà xuất bản Tôn giáo', 2016, 361, 'Tiếng Việt', '15x21 cm', '367 g', 'Bìa cứng', 1),
(93, 'Thiền Trong Đạo Phật', 'Thích Nhất Hạnh', 'Tongiao', 120000, 144000, 20, 18, 'Hướng dẫn thực hành thiền theo truyền thống Phật giáo, giúp an tịnh tâm hồn và phát triển trí tuệ.', 'img/tg9.jfif', 'Nhà xuất bản Tôn giáo', 2016, 391, 'Tiếng Việt', '17x25 cm', '429 g', 'Bìa bóng', 1),
(94, 'Đạo Phật Và Khoa Học', 'Thích Tuệ Sỹ', 'Tongiao', 200000, 220000, 10, 12, 'Phân tích mối tương quan giữa giáo lý Phật giáo và những khám phá của khoa học hiện đại.', 'img/tg10.jfif', 'Nhà xuất bản Tôn giáo', 2017, 461, 'Tiếng Việt', '15x21 cm', '354 g', 'Bìa mềm', 1),
(95, 'Lịch Sử Phật Giáo Việt Nam', 'Lê Mạnh Thát', 'Tongiao', 150000, 165000, 10, 20, 'Nghiên cứu toàn diện về quá trình du nhập, phát triển và ảnh hưởng của Phật giáo tại Việt Nam.', 'img/tg11.jfif', 'Nhà xuất bản Tôn giáo', 2022, 188, 'Tiếng Việt', '14x20 cm', '418 g', 'Bìa bóng', 1),
(96, 'Đạo Hindu: Từ Cội Nguồn Đến Hiện Đại', 'Klaus K. Klostermaier', 'Tongiao', 100000, 120000, 20, 14, 'Giới thiệu về đạo Hindu - một trong những tôn giáo lâu đời nhất thế giới với hệ thống triết học phong phú.', 'img/tg12.jfif', 'Nhà xuất bản Tôn giáo', 2022, 481, 'Tiếng Việt', '14x20 cm', '212 g', 'Bìa mềm', 1),
(97, 'Phật Giáo Nguyên Thủy: Con Đường Giải Thoát', 'Nyanatiloka', 'Tongiao', 120000, 132000, 10, 16, 'Giới thiệu về Phật giáo Nguyên thủy (Theravada) với các giáo lý cơ bản và phương pháp tu tập.', 'img/tg13.jfif', 'Nhà xuất bản Tôn giáo', 2017, 223, 'Tiếng Việt', '13x19 cm', '272 g', 'Bìa bóng', 1),
(98, 'Tứ Diệu Đế - Nền Tảng Đạo Phật', 'Thích Chơn Thiện', 'Tongiao', 200000, 240000, 20, 11, 'Giảng giải sâu sắc về Tứ Diệu Đế - bốn chân lý cao quý làm nền tảng cho toàn bộ giáo lý Phật giáo.', 'img/tg14.jfif', 'Nhà xuất bản Tôn giáo', 2021, 319, 'Tiếng Việt', '14x20 cm', '203 g', 'Bìa mềm', 1),
(99, 'Đạo Làm Con Trong Nho Giáo', 'Nguyễn Hiến Lê', 'Tongiao', 150000, 165000, 10, 19, 'Giới thiệu về chữ Hiếu và các nguyên tắc đạo đức trong Nho giáo, ảnh hưởng sâu sắc đến văn hóa Á Đông.', 'img/tg15.jfif', 'Nhà xuất bản Tôn giáo', 2022, 399, 'Tiếng Việt', '13x19 cm', '482 g', 'Bìa cứng', 1),
(100, 'Truyện Kiều', 'Nguyễn Du', 'Vanhoc', 100000, 110000, 10, 13, 'Kiệt tác văn học Việt Nam kể về cuộc đời đầy gian truân của Thúy Kiều, với ngôn ngữ thơ Nôm đỉnh cao và giá trị nhân văn sâu sắc.', 'img/vh1.jfif', 'Nhà xuất bản Văn học', 2018, 170, 'Tiếng Việt', '13x19 cm', '305 g', 'Bìa cứng', 1),
(101, 'Chiếc Lược Ngà', 'Nguyễn Quang Sáng', 'Vanhoc', 120000, 144000, 20, 17, 'Tập truyện ngắn nổi tiếng với tác phẩm cùng tên kể về tình cha con trong chiến tranh, cảm động và đầy tính nhân văn.', 'img/vh2.jfif', 'Nhà xuất bản Văn học', 2016, 253, 'Tiếng Việt', '13x19 cm', '415 g', 'Bìa mềm', 1),
(102, 'Chí Phèo', 'Nam Cao', 'Vanhoc', 200000, 220000, 10, 10, 'Truyện ngắn kinh điển về bi kịch của người nông dân bị tha hóa và khát vọng được làm người lương thiện.', 'img/102.webp', 'Nhà xuất bản Tổng Hợp TPHCM', 2024, 178, 'Tiếng Anh', '15x20 cm', '370 g', 'Bìa cứng', 1),
(103, 'Số Đỏ', 'Vũ Trọng Phụng', 'Vanhoc', 150000, 180000, 20, 15, 'Tiểu thuyết trào phúng xuất sắc, phê phán xã hội thượng lưu thành thị Việt Nam những năm 1930 với nhân vật Xuân tóc đỏ đầy ấn tượng.', 'img/103.webp', 'Nhà xuất bản Văn học', 2018, 188, 'Tiếng Việt', '14x20 cm', '211 g', 'Bìa cứng', 1),
(104, 'Tắt Đèn', 'Ngô Tất Tố', 'Vanhoc', 100000, 110000, 10, 18, 'Tác phẩm hiện thực phê phán xuất sắc về cuộc sống cùng cực của người nông dân Việt Nam dưới ách thực dân phong kiến.', 'img/vh5.jfif', 'Nhà xuất bản Văn học', 2021, 392, 'Tiếng Việt', '13x19 cm', '419 g', 'Bìa mềm', 1),
(105, 'Bỉ Vỏ', 'Nguyên Hồng', 'Vanhoc', 120000, 144000, 20, 12, 'Tiểu thuyết về cuộc đời của cô gái tên Bưởi - một \"bỉ vỏ\" với những thăng trầm, đau khổ và khát vọng sống.', 'img/vh6.jfif', 'Nhà xuất bản Văn học', 2021, 438, 'Tiếng Việt', '13x19 cm', '223 g', 'Bìa mềm', 1),
(106, 'Vợ Nhặt', 'Kim Lân', 'Vanhoc', 200000, 240000, 20, 20, 'Truyện ngắn đặc sắc về tình người và khát vọng sống trong nạn đói năm 1945, với hình tượng \"vợ nhặt\" độc đáo.', 'img/vh7.jfif', 'Nhà xuất bản Văn học', 2016, 272, 'Tiếng Việt', '15x21 cm', '497 g', 'Bìa bóng', 1),
(107, 'Đất Nước Đứng Lên', 'Nguyên Ngọc', 'Vanhoc', 150000, 165000, 10, 14, 'Tiểu thuyết về cuộc kháng chiến của người dân Tây Nguyên với nhân vật anh hùng Núp, giàu chất sử thi và tinh thần dân tộc.', 'img/vh8.jfif', 'Nhà xuất bản Văn học', 2021, 210, 'Tiếng Việt', '17x25 cm', '418 g', 'Bìa mềm', 1),
(108, 'Vang Bóng Một Thời', 'Nguyễn Tuân', 'Vanhoc', 100000, 120000, 20, 16, 'Tập truyện ngắn đặc sắc về những con người tài hoa, những nét đẹp văn hóa đang dần mai một của một thời vang bóng.', 'img/vh9.jfif', 'Nhà xuất bản Văn học', 2017, 499, 'Tiếng Việt', '14x20 cm', '248 g', 'Bìa mềm', 1),
(109, 'Những Ngày Thơ Ấu', 'Nguyên Hồng', 'Vanhoc', 120000, 150000, 25, 11, 'Hồi ký xúc động về tuổi thơ nhiều cay đắng và tình mẫu tử thiêng liêng, viết bằng giọng văn chân thành, giàu cảm xúc.', 'img/vh10.jfif', 'Nhà xuất bản Văn học', 2015, 175, 'Tiếng Việt', '13x19 cm', '306 g', 'Bìa cứng', 1),
(110, 'Tuổi Thơ Dữ Dội', 'Phùng Quán', 'Vanhoc', 200000, 206000, 3, 19, 'Bộ tiểu thuyết đồ sộ về những chiến sĩ thiếu niên trong đội Thiếu niên trinh sát với lòng yêu nước và sự dũng cảm phi thường.', 'img/vh11.jfif', 'Nhà xuất bản Văn học', 2015, 194, 'Tiếng Việt', '14x20 cm', '364 g', 'Bìa cứng', 1),
(111, 'Mùa Lá Rụng Trong Vườn', 'Ma Văn Kháng', 'Vanhoc', 150000, 180000, 20, 13, 'Tiểu thuyết về sự biến đổi của gia đình truyền thống trong xã hội hiện đại, với những giá trị đạo đức đang bị thử thách', 'img/vh12.jfif', 'Nhà xuất bản Văn học', 2017, 334, 'Tiếng Việt', '17x25 cm', '430 g', 'Bìa mềm', 1),
(112, 'Cánh Đồng Bất Tận', 'Nguyễn Ngọc Tư', 'Vanhoc', 100000, 110000, 10, 17, 'Tập truyện ngắn với giọng văn đặc trưng Nam Bộ, khắc họa cuộc sống và số phận con người vùng sông nước với nhiều day dứt', 'img/vh13.jfif', 'Nhà xuất bản Văn học', 2022, 292, 'Tiếng Việt', '15x21 cm', '420 g', 'Bìa bóng', 1),
(113, 'Nỗi Buồn Chiến Tranh', 'Bảo Ninh', 'Vanhoc', 120000, 144000, 20, 10, 'Tiểu thuyết đặc sắc về chiến tranh từ góc nhìn của người lính, với những ám ảnh, mất mát và nỗi buồn sâu thẳm', 'img/vh14.jfif', 'Nhà xuất bản Văn học', 2017, 361, 'Tiếng Việt', '14x20 cm', '335 g', 'Bìa cứng', 1),
(114, 'Mảnh Đất Lắm Người Nhiều Ma', 'Nguyễn Khắc Trường', 'Vanhoc', 200000, 260000, 30, 15, 'Tiểu thuyết phản ánh xã hội nông thôn Việt Nam thời kỳ đổi mới với những mâu thuẫn, bi kịch và sự chuyển mình', 'img/114.jpg', 'Nhà xuất bản Văn học', 2016, 186, 'Tiếng Việt', '13x19 cm', '364 g', 'Bìa mềm', 1),
(118, 'Tâm Lý học giáo dục', 'Nguyễn Thị Tứ', 'Tamly', 50000, 70000, 40, 10, 'Sách tâm lý học giáo dục chuyên nghiên cứu về tinh thần, hành vi, và quá trình nhận thức của con người trong môi trường học tập. Nội dung tập trung vào các phương pháp giảng dạy hiệu quả, động lực học tập, sự phát triển tâm lý của học sinh, quản lý lớp học và các chiến lược hỗ trợ học tập cá nhân hóa', 'img/118.jfif', 'Nhà xuất bản Tổng Hợp TPHCM', 2023, 111, 'Tiếng Việt', '15x20 cm', '370 g', 'Bìa mềm', 1),
(119, 'Tâm Lý học trẻ em', 'Như Mai', 'Tamly', 100000, 0, 0, 5, 'Thấu hiểu và hỗ trợ trẻ tự kỷ: Cẩm nang dành cho phụ huynh và giáo viên để nhận diện, can thiệp và đồng hành cùng trẻ có nhu cầu đặc biệt.\r\nNgười Đức dạy con học các quy tắc: Phân tích các tình huống trẻ có hành vi khó bảo và cách thiết lập kỷ luật dựa trên tình yêu thương.', 'img/119.jfif', 'Nhà xuất bản Tổng Hợp TPHCM', 2022, 12, 'Tiếng Việt', '15x20 cm', '565 g', 'Bìa mềm', 1),
(120, 'Người Ếch', 'Shichiri Nakayama', 'tt', 15, 18, 20, 20, 'Một kẻ giết người mang mặt nạ ếch, để lại hiện trường đầy những dấu hiệu kỳ lạ. Một thanh tra bị cuốn vào vụ án với những bí ẩn không lời giải. Đâu là sự thật, đâu là lời dối trá? Khi cuộc săn đuổi trở thành một trò chơi sinh tử, liệu ai sẽ là kẻ chiến thắng?', 'img/120.jpg', 'Nhà xuất bản dân trí', 2023, 127, 'Tiếng Việt', '15x21 cm', '334 g', 'Bìa cứng', 1),
(121, 'Phiêu Lưu Chữ', 'Hoàng Văn Khoa', 'DM001', 150000, 225000, 50, 12, 'Tiểu thuyết đương đại Việt Nam nói riêng là thế giới đa chiều kích. Tận dụng khả năng chưa đông cứng của tiểu thuyết, táo bạo trong thể nghiệm bút pháp hậu hiện đại, nhiều cây bút đã mang đến cho độc giả những bữa tiệc văn chương với thực đơn đầy tính mời mọc.', 'img/121.webp', 'Nhà xuất bản Tổng Hợp TPHCM', 2023, 122, 'Tiếng Việt', '14x20 cm', '565 g', 'Bìa bóng', 1),
(122, 'Sĩ Số Lớp Vắng 0', 'Emma Hạ My', 'DM69c0aa7b03380', 150000, 225000, 50, 5, '“SĨ SỐ LỚP VẮNG 0” là cuốn sách được chắp bút bởi EMMA HẠ MY - chủ sở hữu kênh Youtube “Truyện của Emma” đăng tải những câu chuyện kinh dị tự sáng tác bằng hình ảnh hoạt họa do chính tác giả thực hiện. Cuốn sách bao gồm “Vệt Phấn Trên Bảng Đen” và 9 truyện ngắn khác CHƯA TỪNG xuất hiện trên kênh của Emma Hạ My.', 'img/122.webp', 'Nhà xuất bản dân trí', 2023, 11, 'Tiếng Việt', '15x21 cm', '565 g', 'Bìa mềm', 1),
(123, 'Tôn Giáo và Nhân Sinh', 'Hòa thượng Thành Nghiêm', 'Tongiao', 14, 22, 60, 210, 'Đường đời muôn nẻo khiếm khuyết Bàn tiếp về đường đời muôn nẻo khiếm khuyết Nhân cách thăng hóa trong nỗi cô đơn Cõi đời hiu quạnh', 'img/123.jpg', 'Nhà xuất bản tôn giáo', 2022, 123, 'Tiếng Việt', '14x20 cm', '370 g', 'Bìa cứng', 1),
(124, 'Đoàn Binh Tây Tiến', 'Quang Dũng', 'DM69c361238e081', 0, 0, 0, 0, 'Cảm xúc về một thời “Chiến trường đi chẳng tiếc đời xanh” của nhà thơ Quang Dũng trong bài thơ Tây Tiến dường như chưa đủ với ông. Tấm lòng thiết tha của tác giả những ngày hào hùng ấy đã dẫn đến thiên hồi ký “Đoàn Võ trang Tuyên truyền Biên khu Lào - Việt” (Đoàn binh Tây Tiến) ông viết mấy năm sau. Hơn là một phiên bản văn xuôi của bài thơ, tập hồi ký cho chúng ta biết thêm nhiều điều cụ thể về hoạt động của binh đoàn khi ấy, cũng như về các chiến sĩ Việt - Lào, những người cầm súng và cả những người cầm kèn trong Đoàn Võ trang Tuyên truyền cùng tham gia vào sứ mạng giải phóng đất nước mình và nước bạn khỏi ách thực dân xâm lược', 'img/124.webp', 'Nhà xuất bản dân trí', 2023, 678, 'Tiếng Việt', '15x20 cm', '565 g', 'Bìa mềm', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `makhach` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `trangthai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`makhach`, `username`, `password`, `trangthai`) VALUES
(1, 'huuduc123', '123456', 1),
(2, 'anh12345@gmail.com', '12345', 1),
(14, 'tai12345@gmail.com', '12345', 1),
(61, 'kieng123@gmail.com', '123456', 1),
(62, 'sa123@gmail.com', '123456', 1),
(63, 'to124@gmail.com', '123456', 1),
(64, 'admin', 'admin12345', 1),
(65, 'huy123@gmail.com', '123456', 1),
(66, 'qqq@qqq.qqq', '123456', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD PRIMARY KEY (`madh`,`masp`),
  ADD KEY `masp` (`masp`);

--
-- Chỉ mục cho bảng `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  ADD PRIMARY KEY (`mapn`,`masp`),
  ADD KEY `masp` (`masp`);

--
-- Chỉ mục cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`madm`);

--
-- Chỉ mục cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`madh`),
  ADD KEY `makh` (`makh`);

--
-- Chỉ mục cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`magio`,`masp`),
  ADD KEY `masp` (`masp`);

--
-- Chỉ mục cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`makh`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  ADD PRIMARY KEY (`makm`),
  ADD KEY `masp` (`masp`);

--
-- Chỉ mục cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD PRIMARY KEY (`mapn`);

--
-- Chỉ mục cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`masp`),
  ADD KEY `danhmuc` (`danhmuc`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`makhach`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `donhang`
--
ALTER TABLE `donhang`
  MODIFY `madh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `makh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  MODIFY `makm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  MODIFY `mapn` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `masp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `chitietdonhang_ibfk_1` FOREIGN KEY (`madh`) REFERENCES `donhang` (`madh`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitietdonhang_ibfk_2` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  ADD CONSTRAINT `chitietphieunhap_ibfk_1` FOREIGN KEY (`mapn`) REFERENCES `phieunhap` (`mapn`),
  ADD CONSTRAINT `chitietphieunhap_ibfk_2` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`);

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`makh`) REFERENCES `khachhang` (`makh`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`magio`) REFERENCES `khachhang` (`makh`) ON DELETE CASCADE,
  ADD CONSTRAINT `giohang_ibfk_2` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  ADD CONSTRAINT `khuyenmai_ibfk_1` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`);

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`danhmuc`) REFERENCES `danhmuc` (`madm`);

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `có` FOREIGN KEY (`makhach`) REFERENCES `khachhang` (`makh`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
