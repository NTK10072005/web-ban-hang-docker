<?php
// ==================== TONKHO API CONTROLLER ====================
// File: be/controllers/tonkho.php

// 1. Cấu hình CORS và JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// 4. Tạo đối tượng TonKho
require_once '../models/TonKho.php';
$tonkho = new TonKho($db);

// 5. Lấy HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// 6. Xử lý request
try {
    switch ($method) {
        // ========== GET ========== (Lấy báo cáo)
        case 'GET':
            handleGetRequest();
            break;
            
        default:
            sendResponse(405, false, 'Method not allowed');
    }
    
} catch (Exception $e) {
    sendResponse(500, false, 'Server error: ' . $e->getMessage());
}

/**
 * Xử lý GET request
 */
function handleGetRequest() {
    global $tonkho;
    
    $action = $_GET['action'] ?? '';
    $danhmuc = $_GET['danhmuc'] ?? '';
    $tensp = $_GET['tensp'] ?? '';

    if ($action === 'checktonkho') {
        $masp = isset($_GET['masp']) ? (int)$_GET['masp'] : 0;
        $soluong = isset($_GET['soluong']) ? (int)$_GET['soluong'] : 0;

        if ($masp <= 0 || $soluong <= 0) {
            sendResponse(400, false, 'Mã sản phẩm hoặc số lượng không hợp lệ');
            return;
        }

        $isAvailable = $tonkho->checkTonKhoSP($masp, $soluong);

        if ($isAvailable) {
            sendResponse(200, true, 'Sản phẩm còn đủ hàng');
        } else {
            sendResponse(200, false, 'Sản phẩm không đủ số lượng trong kho');
        }
        return;
    }
    // Tra cứu tồn kho theo ngày
    if ($action === 'tracuutonkho') {
        $ngay = $_GET['ngay'] ?? date('Y-m-d'); // Mặc định là ngày hôm nay
        
        // Validate ngày
        if (!validateDate($ngay)) {
            sendResponse(400, false, 'Ngày không hợp lệ. Định dạng: YYYY-MM-DD');
            return;
        }
        
        $result = $tonkho->tracuuTonKho($ngay, $danhmuc, $tensp);
        
        if ($result) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            
            sendResponse(200, true, 'Tra cứu tồn kho thành công', array(
                'data' => $data,
                'count' => count($data),
                'ngay_tracuu' => $ngay
            ));
        } else {
            sendResponse(500, false, 'Lỗi khi tra cứu tồn kho');
        }
        return;
    }
    
    // Báo cáo nhập xuất theo khoảng thời gian
    if ($action === 'baocao') {
        $ngaybatdau = $_GET['ngaybatdau'] ?? date('Y-m-01'); // Mặc định đầu tháng
        $ngayketthuc = $_GET['ngayketthuc'] ?? date('Y-m-d'); // Mặc định hôm nay
        $tensp = $_GET['tensp'] ?? '';
        // Validate ngày
        if (!validateDate($ngaybatdau) || !validateDate($ngayketthuc)) {
            sendResponse(400, false, 'Ngày không hợp lệ. Định dạng: YYYY-MM-DD');
            return;
        }
        
        // Kiểm tra ngày bắt đầu <= ngày kết thúc
        if (strtotime($ngaybatdau) > strtotime($ngayketthuc)) {
            sendResponse(400, false, 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
            return;
        }
        
        $result = $tonkho->baoCaoNhapXuatPrepared($ngaybatdau, $ngayketthuc,$tensp);
        
        if ($result) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            
            sendResponse(200, true, 'Báo cáo nhập xuất thành công', array(
                'data' => $data,
                'count' => count($data),
                'ngay_batdau' => $ngaybatdau,
                'ngay_ketthuc' => $ngayketthuc
            ));
        } else {
            sendResponse(500, false, 'Lỗi khi lấy báo cáo nhập xuất');
        }
        return;
    }
    if($action=='lichsuchitiet'){
            $masp = $_GET['masp'] ?? 0;
        $tungay = $_GET['ngaybatdau'] ?? '';
        $denngay = $_GET['ngayketthuc'] ?? '';

        if (!$masp || !$tungay || !$denngay) {
            echo json_encode(['success' => false, 'message' => 'Thiếu tham số']);
            return;
        }

        try {
            $nhap = $tonkho->getLichSuNhap($masp, $tungay, $denngay);
            $xuat = $tonkho->getLichSuXuat($masp, $tungay, $denngay);

            echo json_encode([
                'success' => true,
                'data' => [
                    'nhap' => $nhap,
                    'xuat' => $xuat
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
    else{
    // Nếu không có action hợp lệ
    sendResponse(400, false, 'Action không hợp lệ. Các action hỗ trợ: tracuutonkho, baocao');
}
}


/**
 * Kiểm tra định dạng ngày YYYY-MM-DD
 */
function validateDate($date, $format = 'Y-m-d') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
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