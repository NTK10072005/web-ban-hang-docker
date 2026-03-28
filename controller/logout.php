<?php
// ==================== LOGOUT CONTROLLER ====================
// File: controller/logout.php
// Xử lý đăng xuất và xóa session

// 1. Cấu hình CORS và JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Chỉ cho phép POST method


// 4. Bắt đầu session
session_start();

try {
    // 5. Kiểm tra xem có session không
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        // Lưu thông tin trước khi xóa
        $loggedOutUser = $_SESSION['tenkhach'] ?? 'Unknown';
        
        // 6. Xóa tất cả session variables
        $_SESSION = array();
        
        // 7. Xóa session cookie nếu có
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        // 8. Hủy session
        session_destroy();
        
       header("Location: ../index.html");

    } else {
        // Chưa đăng nhập
        sendResponse(200, false, 'Chưa có session để đăng xuất');
    }
    
} catch (Exception $e) {
    sendResponse(500, false, 'Lỗi server: ' . $e->getMessage());
}

/**
 * Gửi response JSON chuẩn
 */
