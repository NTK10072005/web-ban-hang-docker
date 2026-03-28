<?php
// ==================== CUSTOMER API CONTROLLER (CHỈ JSON) ====================
// File: controller/customer.php
// Chỉ xử lý logic và trả về JSON, không render HTML

// 1. Cấu hình CORS và JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
session_start();
// 2. Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Kết nối database
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// 4. Tạo đối tượng Customer
require_once '../models/Customer.php';
$customer = new Customer($db);

// 5. Lấy HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// 6. Xử lý request
try {
    switch ($method) {
        // ========== GET ========== (Lấy dữ liệu)
        case 'GET':
            handleGetRequest();
            break;
            
        // ========== POST ========== (Thêm/Sửa từ form-data)
        case 'POST':
            handlePostRequest();
            break;
            
        // ========== DELETE ========== (Xóa)
        case 'DELETE':
            handleDeleteRequest();
            break;
            
        default:
            sendResponse(405, false, 'Method not allowed');
    }
    
} catch (Exception $e) {
    sendResponse(500, false, 'Server error: ' . $e->getMessage());
}

// ==================== CÁC HÀM XỬ LÝ ====================

/**
 * Xử lý GET request
 */
function handleGetRequest() {
    global $customer;
    
    $action = $_GET['action'] ?? '';
    $makh = $_GET['makh'] ?? null;
    $page = $_GET['page'] ?? 1;
    $keywords = $_GET['keywords'] ?? '';
    $email = $_GET['email'] ?? '';
    $sdt = $_GET['sdt'] ?? '';
    
    // Lấy một khách hàng theo ID
    if ($makh && empty($action)) {
        $customer->makh = $makh;
        
        if ($customer->readOne()) {
            sendResponse(200, true, 'Customer retrieved successfully', array(
                'makh' => $customer->makh,
                'hoten' => $customer->hoten,
                'email' => $customer->email,
                'sdt' => $customer->sdt,
                'sonha' => $customer->sonha,
                'phuongxa' => $customer->phuongxa,
                'thanhpho' => $customer->thanhpho,
                'diachi' => $customer->sonha . "," . $customer->phuongxa. "," . $customer->thanhpho, 



                'trangthai' => $customer->trangthai
            ));
        } else {
            sendResponse(404, false, 'Customer not found');
        }
        return;
    }
    
    // Lấy theo email
    if ($action === 'email' && !empty($email)) {
        $result = $customer->readByEmail($email);
        $customers = array();
        
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        
        sendResponse(200, true, 'Customers by email', array(
            'data' => $customers,
            'count' => count($customers)
        ));
        return;
    }
    
    // Lấy theo số điện thoại
    if ($action === 'phone' && !empty($sdt)) {
        $result = $customer->readByPhone($sdt);
        $customers = array();
        
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        
        sendResponse(200, true, 'Customers by phone', array(
            'data' => $customers,
            'count' => count($customers)
        ));
        return;
    }
    
    // Tìm kiếm khách hàng
    if ($action === 'search' && !empty($keywords)) {
        $result = $customer->search($keywords);
        $customers = array();
        
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        
        sendResponse(200, true, 'Search results', array(
            'data' => $customers,
            'count' => count($customers)
        ));
        return;
    }
    
    // Lấy thống kê theo trạng thái
    if ($action === 'stats') {
        $stats = $customer->getStatsByStatus();
        sendResponse(200, true, 'Customer statistics', array(
            'data' => $stats,
            'count' => count($stats)
        ));
        return;
    }
    
    // Kiểm tra email tồn tại
    if ($action === 'check-email' && !empty($email)) {
        $excludeId = $_GET['exclude_id'] ?? null;
        $exists = $customer->emailExists($email, $excludeId);
        
        sendResponse(200, true, 'Email check result', array(
            'email' => $email,
            'exists' => $exists,
            'available' => !$exists
        ));
        return;
    }
    // Tìm kiếm nâng cao khách hàng
if ($action === 'searchnangcao') {
    // Lấy các tham số tìm kiếm
    $hoten = $_GET['hoten'] ?? '';
    $trangthai = $_GET['trangthai'] ?? '';
    $username = $_GET['username'] ?? '';
    
    // Sử dụng hàm searchAdvanced
    $result = $customer->searchAdvanced($hoten, $trangthai, $username);
    
    if ($result === false) {
        sendResponse(500, false, 'Lỗi khi thực hiện tìm kiếm');
        return;
    }
    
    // Xử lý kết quả
    $customers = array();
    $i=0;
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
        $customers[$i]['trangthai']=(string)$row['trangthai'];
        $i++;
    }
    
    // Trả về JSON response
    sendResponse(200, true, 'Kết quả tìm kiếm nâng cao', array(
        'data' => $customers,
        'count' => count($customers),
        'filters' => array(
            'hoten' => $hoten,
            'trangthai' => (string)$trangthai,
            'username' => $username
        )
    ));
    return;
}
    
    // Phân trang
    if ($action === 'paging') {
        $from_record_num = ($limit * ($page - 1));
        $result = $customer->readPaging($from_record_num, $limit);
        $customers = array();
        
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        
        $total_rows = $customer->count();
        $total_pages = ceil($total_rows / $limit);
        
        sendResponse(200, true, 'Customers retrieved successfully', array(
            'data' => $customers,
            'pagination' => array(
                'current_page' => (int)$page,
                'per_page' => (int)$limit,
                'total_items' => $total_rows,
                'total_pages' => $total_pages
            )
        ));
        return;
    }
    
    // Lấy tất cả khách hàng (mặc định)
    $result = $customer->readAll();
    $customers = array();
    
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }
    
    sendResponse(200, true, 'Customers retrieved successfully', array(
        'data' => $customers,
        'count' => count($customers)
    ));
}

/**
 * Xử lý POST request (Thêm/Sửa khách hàng)
 */
function handlePostRequest() {
    global $customer;
    
    // Nhận dữ liệu từ form-data
    $makh = $_POST['makh'] ?? null;
    $hoten = $_POST['hoten'] ?? '';
    $email = $_POST['email'] ?? '';
    $sdt = $_POST['sdt'] ?? '';
    $sonha = $_POST['sonha'] ?? '';
    $phuongxa = $_POST['phuongxa'] ?? '';
    $thanhpho = $_POST['thanhpho'] ?? '';
    $newPassword= $_POST['newPassword'] ?? '';
    $username=$_POST['username']?? '';
    $password=$_POST['password']?? '';
    $trangthai = $_POST['trangthai'] ?? 1;
    
    
    
    // Phân biệt THÊM MỚI hay SỬA
    if (!empty($makh)) {
        // SỬA khách hàng
        $customer->makh = (int)$makh;
        
        // Kiểm tra khách hàng tồn tại
        if (!$customer->readOne()) {
            sendResponse(404, false, 'Customer not found');
            return;
        }
        
        // Gán giá trị
        $customer->hoten = htmlspecialchars(strip_tags($hoten));
        $customer->email = htmlspecialchars(strip_tags($email));
        $customer->sdt = htmlspecialchars(strip_tags($sdt));
        $customer->sonha = htmlspecialchars(strip_tags($sonha));
        $customer->phuongxa = htmlspecialchars(strip_tags($phuongxa));
        $customer->thanhpho = htmlspecialchars(strip_tags($thanhpho));
        $customer->trangthai = htmlspecialchars(strip_tags($trangthai));
        
        // Cập nhật khách hàng
        if ($customer->update() && $customer->updatePassword($customer->makh, $newPassword)) {
            $_SESSION['tenkhach'] = $customer->hoten;
            sendResponse(200, true, 'Customer updated successfully', array('makh' => $makh));
        } else {
            sendResponse(500, false, 'Failed to update customer');
        }
    } else {
        // THÊM khách hàng mới
        $customer->hoten = htmlspecialchars(strip_tags($hoten));
        $customer->email = htmlspecialchars(strip_tags($email));
        $customer->sdt = htmlspecialchars(strip_tags($sdt));
        $customer->sonha = htmlspecialchars(strip_tags($sonha));
        $customer->phuongxa = htmlspecialchars(strip_tags($phuongxa));
        $customer->thanhpho = htmlspecialchars(strip_tags($thanhpho));
        $customer->trangthai = htmlspecialchars(strip_tags($trangthai));
        $customer->username = htmlspecialchars(strip_tags($username));
        $customer->password = htmlspecialchars(strip_tags($password));

        $customer_id = $customer->create();
        
        if ($customer_id) {
            sendResponse(201, true, 'Customer created successfully', array('makh' => $customer_id));
        } else {
            sendResponse(500, false, 'Failed to create customer');
        }
    }
}

/**
 * Xử lý DELETE request
 */
function handleDeleteRequest() {
    global $customer;
    
    // Lấy ID từ query string
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    parse_str($query_string, $query_params);
    $makh = $query_params['makh'] ?? 0;
    $permanent = $query_params['permanent'] ?? false;
    
    if (empty($makh)) {
        sendResponse(400, false, 'Customer ID is required');
        return;
    }
    
    // Kiểm tra khách hàng tồn tại
    $customer->makh = $makh;
    if (!$customer->readOne()) {
        sendResponse(404, false, 'Customer not found');
        return;
    }
    
    // Xóa khách hàng (soft delete hoặc permanent)
    $success = false;
    if ($permanent) {
        $success = $customer->deletePermanent();
        $message = 'Customer permanently deleted successfully';
    } else {
        $success = $customer->delete();
        $message = 'Customer deleted successfully (soft delete)';
    }
    
    if ($success) {
        sendResponse(200, true, $message, array('makh' => $makh));
    } else {
        sendResponse(500, false, 'Failed to delete customer');
    }
}

/**
 * Validate dữ liệu khách hàng
 */
function validateCustomerData($hoten, $email, $sdt, $makh = null) {
    global $customer;
    $errors = array();
    
    if (empty($hoten)) {
        $errors[] = "Họ tên không được để trống";
    }
    
    if (empty($email)) {
        $errors[] = "Email không được để trống";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email không hợp lệ";
    } elseif ($customer->emailExists($email, $makh)) {
        $errors[] = "Email đã tồn tại trong hệ thống";
    }
    
    if (empty($sdt)) {
        $errors[] = "Số điện thoại không được để trống";
    } elseif (!preg_match('/^[0-9]{10,11}$/', $sdt)) {
        $errors[] = "Số điện thoại phải có 10-11 chữ số";
    }
    
    return $errors;
}

/**
 * Gửi response JSON chuẩn
 */
function sendResponse($statusCode, $success, $message, $data = array()) {
    http_response_code($statusCode);
    
    $response = array(
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    );
    
    if (!empty($data)) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}
?>