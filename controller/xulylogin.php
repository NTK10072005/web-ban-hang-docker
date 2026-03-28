<?php
// ==================== LOGIN AUTHENTICATION CONTROLLER ====================
// File: controller/checklogin.php
// Xử lý đăng nhập và tạo session

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
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, false, 'Method not allowed');
}

// 4. Kết nối database
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

try {
    // 6. Lấy dữ liệu từ POST request
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // 7. Validate input
    if (empty($username) || empty($password)) {
        sendResponse(400, false, 'Username và password không được để trống');
    }
    
    // 8. Kiểm tra tài khoản trong database
    $query = "SELECT tk.*, kh.*
              FROM taikhoan tk 
              INNER JOIN khachhang kh ON tk.makhach = kh.makh
              WHERE tk.username = ? AND tk.password = ? AND kh.trangthai = 1";
    
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // 9. Đăng nhập thành công
        session_start();
        $userData = [];
        $addresses = [];
        $customerInfo = null;
        
        while ($row = $result->fetch_assoc()) {
            // Lưu thông tin khách hàng (chỉ lần đầu)
            if ($customerInfo === null) {
                $customerInfo = [
                    'idkhach' => $row['makh'],
                    'tenkhach' => $row['hoten'],
                    'email' => $row['email'],
                    'sdt' => $row['sdt'],
                    'username'=>$row['username'],
                    'password'=>$row['password'],
                    'diachi' => $row['sonha'] . "," . $row['phuongxa'] . "," . $row['thanhpho'], 
                    'sonha'=>$row['sonha'],
                    'phuongxa'=>$row['phuongxa'],
                    'thanhpho'=>$row['thanhpho'],
                    'trangthai' => $row['trangthai']
                ];
            }   
        }
        
        // 10. Tạo session
        $_SESSION['logged_in'] = true;
        $_SESSION['idkhach'] = $customerInfo['idkhach'];
        $_SESSION['tenkhach'] = $customerInfo['tenkhach'];
        $_SESSION['email'] = $customerInfo['email'];
        $_SESSION['sdt'] = $customerInfo['sdt'];
        $_SESSION['username'] = $customerInfo['username'];
        $_SESSION['password'] = $customerInfo['password'];
        $_SESSION['login_time'] = time();
        $_SESSION['address'] = $customerInfo['diachi'];
        $_SESSION['sonha'] = $customerInfo['sonha'];
        $_SESSION['phuongxa'] = $customerInfo['phuongxa'];
        $_SESSION['thanhpho'] = $customerInfo['thanhpho'];



        // 11. Chuẩn bị dữ liệu trả về
        $responseData = [
             'session_info' => [
                'idkhach' => $_SESSION['idkhach'],
                'tenkhach' => $_SESSION['tenkhach'],
                'email' => $_SESSION['email'],
                'sdt' => $_SESSION['sdt'],
                'username'=>$_SESSION['username'],
                'password'=>$_SESSION['password'],
                'login_time' => $_SESSION['login_time'],
                'diachi'=>$_SESSION['address']
             ]
           
        ];
        
        sendResponse(200, true, 'Đăng nhập thành công', $responseData);
        
    } else {
        // 12. Đăng nhập thất bại
        sendResponse(401, false, 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
    
} catch (Exception $e) {
    sendResponse(500, false, 'Lỗi server: ' . $e->getMessage());
}

/**
 * Gửi response JSON chuẩn
 */
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