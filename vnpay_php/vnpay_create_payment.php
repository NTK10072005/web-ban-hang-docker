<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
date_default_timezone_set('Asia/Ho_Chi_Minh');

require_once("./config.php");

// Lấy mã đơn hàng từ POST và kết hợp với giờ-phút-giây
$madh = $_POST['madh'];
$vnp_TxnRef = $madh . '_' . date('His'); // Kết hợp mã đơn hàng với giờ-phút-giây

$vnp_Amount = $_POST['amount']; // Số tiền thanh toán
$vnp_IpAddr = $_SERVER['REMOTE_ADDR']; //IP Khách hàng thanh toán

$inputData = array(
    "vnp_Version" => "2.1.0",
    "vnp_TmnCode" => $vnp_TmnCode,
    "vnp_Amount" => $vnp_Amount * 100,
    "vnp_Command" => "pay",
    "vnp_CreateDate" => date('YmdHis'),
    "vnp_CurrCode" => "VND",
    "vnp_IpAddr" => $vnp_IpAddr,
    "vnp_OrderInfo" => "Thanh toán hóa đơn DH#" . $madh,
    "vnp_OrderType" => "other",
    "vnp_ReturnUrl" => $vnp_Returnurl,
    "vnp_TxnRef" => $vnp_TxnRef,
    "vnp_ExpireDate" => $expire,
    "vnp_BankCode" => "",
    "vnp_Locale" => "vn"
);

// ... (Phần cấu hình inputData giữ nguyên)

ksort($inputData);
$query = "";
$i = 0;
$hashdata = "";
foreach ($inputData as $key => $value) {
    // CHỈ THÊM VÀO CHUỖI HASH NẾU GIÁ TRỊ KHÔNG RỖNG
    if ($value != "" && !is_null($value)) {
        if ($i == 1) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashdata .= urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
    }
    // Vẫn thêm vào query string để gửi đi, nhưng cần xử lý urlencode đúng cách
    $query .= urlencode($key) . "=" . urlencode($value) . '&';
}

$vnp_Url = $vnp_Url . "?" . $query;
if (isset($vnp_HashSecret)) {
    // Sử dụng hash_hmac với thuật toán sha512
    $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
    $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
}

header('Location: ' . $vnp_Url);
die();