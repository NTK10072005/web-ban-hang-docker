<?php
// ==================== LOGIN AUTHENTICATION CONTROLLER ====================
// File: controller/checklogin.php
// Xử lý đăng nhập và kiểm tra session

// 1. Cấu hình CORS và JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Bắt đầu session
session_start();

// 4. Kiểm tra session hiện tại (cho GET request)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Kiểm tra trạng thái đăng nhập hiện tại
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        // Đã đăng nhập - trả về thông tin session
        $sessionData = [
            'idkhach' => $_SESSION['idkhach'] ?? null,
            'tenkhach' => $_SESSION['tenkhach'] ?? null,
            'email' => $_SESSION['email'] ?? null,
            'username' => $_SESSION['username'] ?? null,
            'sdt' => $_SESSION['sdt'] ?? null,
            'diachi' => $_SESSION['address'] ?? null,
            'login_time' => $_SESSION['login_time'] ?? null,
                        'sonha' => $_SESSION['sonha'] ?? null,
            'phuongxa' => $_SESSION['phuongxa'] ?? null,
            'thanhpho' => $_SESSION['thanhpho'] ?? null,

            'session_duration' => isset($_SESSION['login_time']) ? (time() - $_SESSION['login_time']) : 0
        ];
        
        sendResponse(200, true, 'Đã đăng nhập', $sessionData);
    } else {
        // Chưa đăng nhập
        sendResponse(200, false, 'Chưa đăng nhập');
    }
}
function sendResponse($statusCode, $success, $message, $data = null) {
    http_response_code($statusCode);
    
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}
?>