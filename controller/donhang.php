<?php
// ==================== DONHANG API CONTROLLER ====================
// File: be/controllers/donhang.php
// Xử lý API cho đơn hàng

// 1. Cấu hình CORS và JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Kết nối database
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// 4. Tạo đối tượng Donhang
require_once '../models/Donhang.php';
$donhang = new Donhang($db);

// 5. Lấy HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// 6. Xử lý request
try {
    switch ($method) {
        // ========== GET ========== (Lấy thông tin đơn hàng)
        case 'GET':
            handleGetRequest();
            break;
            
        // ========== POST ========== (Thêm/Cập nhật đơn hàng)
        case 'POST':
            handlePostRequest();
            break;
            
        // ========== PUT ========== (Cập nhật thông tin)
        case 'PUT':
            handlePutRequest();
            break;
            
        // ========== DELETE ========== (Xóa đơn hàng)
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
/**
 * Xử lý GET request
 */
function handleGetRequest() {
    global $donhang;
    
    $action = $_GET['action'] ?? '';
    $madh = $_GET['madh'] ?? '';
    $makh = $_GET['makh'] ?? '';
    
    switch ($action) {
        // ========== ACTION: LIST - Lấy tất cả đơn hàng ==========
        case 'list':
            $result = $donhang->layTatCaDonhang();
            $orders = array();
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
            sendResponse(200, true, 'All orders retrieved successfully', array('data' => $orders));
            break;
            
        // ========== ACTION: KHACH - Lấy đơn hàng theo khách hàng ==========
        case 'khach':
            if (empty($makh)) {
                sendResponse(400, false, 'Customer ID (makh) is required');
                return;
            }
            $donhang->makh = (int)$makh;
            $result = $donhang->layDonhangTheoKhachHang();
            $orders = array();
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
            sendResponse(200, true, 'Customer orders retrieved successfully', array('data' => $orders));
            break;
            
        // ========== ACTION: CHITIET - Lấy chi tiết đơn hàng ==========
        case 'chitiet':
            if (empty($madh)) {
                sendResponse(400, false, 'Order ID (madh) is required');
                return;
            }
            $donhang->madh = $madh;
            $orderInfo = $donhang->layDonhangTheoMa();
            
            if (!$orderInfo) {
                sendResponse(404, false, 'Order not found');
                return;
            }
            
            $orderDetails = $donhang->layChiTietDonhang();
            $chitiet = array();
            while ($row = $orderDetails->fetch_assoc()) {
                $chitiet[] = $row;
            }
            
            $orderInfo['chitiet'] = $chitiet;
            sendResponse(200, true, 'Order details retrieved successfully', $orderInfo);
            break;
        case 'timkiem':
            handleTimKiemDonhang();
    break;
        // ========== DEFAULT: Xử lý khi không có action ==========
        default:
            if (!empty($madh)) {
                // Nếu có madh, lấy chi tiết đơn hàng
                $donhang->madh = $madh;
                $orderInfo = $donhang->layDonhangTheoMa();
                
                if (!$orderInfo) {
                    sendResponse(404, false, 'Order not found');
                    return;
                }
                
                $orderDetails = $donhang->layChiTietDonhang();
                $chitiet = array();
                while ($row = $orderDetails->fetch_assoc()) {
                    $chitiet[] = $row;
                }
                
                $orderInfo['chitiet'] = $chitiet;
                sendResponse(200, true, 'Order details retrieved successfully', $orderInfo);
            } else {
                sendResponse(400, false, 'Please provide action or Order ID');
            }
            break;
    }
}
function handleTimKiemDonhang() {
    global $donhang;
    
    // Lấy tham số từ query string
    $tungay = $_GET['tungay'] ?? '';
    $denngay = $_GET['denngay'] ?? '';
    $trangthai = isset($_GET['trangthaidon']) ? $_GET['trangthaidon'] : null;
    
    // Validate ngày (nếu có)
    if (!empty($tungay) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $tungay)) {
        sendResponse(400, false, 'Định dạng ngày bắt đầu không hợp lệ (YYYY-MM-DD)');
        return;
    }
    
    if (!empty($denngay) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $denngay)) {
        sendResponse(400, false, 'Định dạng ngày kết thúc không hợp lệ (YYYY-MM-DD)');
        return;
    }
    
    // Validate nếu có cả từ ngày và đến ngày
    if (!empty($tungay) && !empty($denngay) && $tungay > $denngay) {
        sendResponse(400, false, 'Ngày bắt đầu không thể sau ngày kết thúc');
        return;
    }
    
    // Kiểm tra trạng thái (nếu có)
    if ($trangthai !== null && $trangthai !== '') {
        if (!is_numeric($trangthai)) {
            sendResponse(400, false, 'Trạng thái phải là số nguyên');
            return;
        }
        $trangthai = (int)$trangthai;
    } else {
        $trangthai = null; // Không lọc theo trạng thái
    }
    
    // Thực hiện tìm kiếm
    $result = $donhang->timKiemDonhangTheoNgayVaTrangThai($tungay, $denngay, $trangthai);
    
    if (!$result) {
        sendResponse(500, false, 'Tìm kiếm thất bại');
        return;
    }
    
    $orders = array();
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    
    sendResponse(200, true, 'Tìm kiếm thành công', array(
        'data' => $orders,
        'count' => count($orders),
        'search_params' => array(
            'tungay' => $tungay,
            'denngay' => $denngay,
            'trangthai' => $trangthai
        )
    ));
}
/**
 * Xử lý POST request
 */
function handlePostRequest() {
    global $donhang;
    
    // Nhận dữ liệu từ client
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents("php://input"), true);
    } else {
        $data = $_POST;
    }
    
    $action = $data['action'] ?? '';
    
    switch ($action) {
        case 'them':
            handleThemDonhang($data);
            break;
        case 'sua':
            handleSuaTrangThaiDonHang($data);
            break;
        case 'suapay':
            handleSuaTrangThaiDonHangpay($data);
            break;
            
        default:
            sendResponse(400, false,$action);
    }
}

/**
 * Xử lý thêm đơn hàng mới
 */
function handleThemDonhang($data) {
    global $donhang;
    
    // Validate dữ liệu bắt buộc
    $required_fields = ['makh', 'ngaydat', 'diachi', 'sdt', 'tongtien'];
    $errors = array();
    
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            $errors[] = "$field is required";
        }
    }
    
    // Kiểm tra mảng chi tiết
    if (empty($data['chitiet']) || !is_array($data['chitiet'])) {
        $errors[] = "Order details (chitiet) is required and must be an array";
    }
    
    if (!empty($errors)) {
        sendResponse(400, false, 'Validation failed', array('errors' => $errors));
        return;
    }
    
    // Gán giá trị cho đơn hàng
    $donhang->makh = (int)$data['makh'];
    $donhang->ngaydat = $data['ngaydat'];
    $donhang->diachi = $data['diachi'];
    $donhang->sdt = $data['sdt'];
    $donhang->tongtien = (float)$data['tongtien'];
    $donhang->thanhtoan = $data['thanhtoan'] ?? '';
    $donhang->trangthaidon = $data['trangthaidon'] ?? 0; // Mặc định 0
    
    // Gán mảng chi tiết
    $chitiet = array();
    foreach ($data['chitiet'] as $item) {
        if (!empty($item['masp']) && !empty($item['soluong'])) {
            $chitiet[] = array(
                'masp' => (int)$item['masp'],
                'soluong' => (int)$item['soluong'],
                'giamgia' => isset($item['giamgia']) ? (float)$item['giamgia'] : 0,
                'gia' => isset($item['gia']) ? (int)$item['gia'] : 0
            );
        }
    }
    
    $donhang->chitiet = $chitiet;
    
    // Thực hiện thêm đơn hàng
    try {
        if ($donhang->themDonhang()) {
            sendResponse(200, true, 'Order created successfully', array(
                'madh' => $donhang->madh,
                'message' => 'Order has been created'
            ));
        } else {
            sendResponse(500, false, 'Failed to create order');
        }
    } catch (Exception $e) {
        sendResponse(500, false, 'Error: ' . $e->getMessage());
    }
}
/**
 * Xử lý cập nhật trạng thái đơn hàng
 */
function handleSuaTrangThaiDonHang($data) {
    global $donhang;
    
    // Kiểm tra dữ liệu đầu vào
    if (empty($data['madh']) || !isset($data['trangthaidon'])) {
        sendResponse(400, false, 'Order ID and order status are required');
        return;
    }
    
    $donhang->madh = $data['madh'];
    $donhang->trangthaidon = (int)$data['trangthaidon'];
    
    if ($donhang->capNhatTrangThaiDonHang()) {
        sendResponse(200, true, 'Order status updated successfully', array(
            'madh' => $donhang->madh,
            'trangthaidon' => $donhang->trangthaidon
        ));
    } else {
        sendResponse(500, false, 'Failed to update order status');
    }
}
function handleSuaTrangThaiDonHangpay($data) {
    global $donhang;
    
    // Kiểm tra dữ liệu đầu vào
    if (empty($data['madh']) || !isset($data['trangthaidon'])) {
        sendResponse(400, false, 'Order ID and order status are required');
        return;
    }
    
    $donhang->madh = $data['madh'];
    $donhang->trangthaidon = (int)$data['trangthaidon'];
    
    if ($donhang->capNhatTrangThaiDonHangpayment()) {
        sendResponse(200, true, 'Order status updated successfully', array(
            'madh' => $donhang->madh,
            'trangthaidon' => $donhang->trangthaidon
        ));
    } else {
        sendResponse(500, false, 'Failed to update order status');
    }
}

/**
 * Xử lý PUT request
 */
function handlePutRequest() {
    global $donhang;
    
    $input_data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($input_data['madh'])) {
        sendResponse(400, false, 'Order ID is required');
        return;
    }
    
    $donhang->madh = $input_data['madh'];
    
    // Cập nhật thông tin đơn hàng
    $donhang->diachi = $input_data['diachi'] ?? '';
    $donhang->sdt = $input_data['sdt'] ?? '';
    
    if ($donhang->capNhatThongTinDonhang()) {
        sendResponse(200, true, 'Order information updated successfully');
    } else {
        sendResponse(500, false, 'Failed to update order information');
    }
}

/**
 * Xử lý DELETE request
 */
function handleDeleteRequest() {
    global $donhang;
    
    // Lấy tham số từ query string
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    parse_str($query_string, $query_params);
    
    $madh = $query_params['madh'] ?? '';
    
    if (empty($madh)) {
        sendResponse(400, false, 'Order ID is required');
        return;
    }
    
    $donhang->madh = $madh;
    
    if ($donhang->xoaDonhang()) {
        sendResponse(200, true, 'Order deleted successfully', array(
            'madh' => $madh
        ));
    } else {
        sendResponse(500, false, 'Failed to delete order');
    }
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