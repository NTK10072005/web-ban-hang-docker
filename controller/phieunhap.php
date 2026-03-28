<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../models/Phieunhap.php';

$database = new Database();
$db = $database->getConnection();
$phieunhap = new Phieunhap($db);

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGetRequest();
            break;
        case 'POST':
            handlePostRequest();
            break;
        default:
            sendResponse(405, false, 'Method not allowed');
    }
} catch (Exception $e) {
    sendResponse(500, false, 'Lỗi Server: ' . $e->getMessage());
}

// ==================== XỬ LÝ GET ====================
function handleGetRequest() {
    global $phieunhap;
    
    $action = $_GET['action'] ?? '';
    $mapn = $_GET['mapn'] ?? '';
    $ngayBatDau = $_GET['ngaybatdau'] ?? '';
    $ngayKetThuc = $_GET['ngayketthuc'] ?? '';

    switch ($action) {
        case 'list':
            $result = $phieunhap->layTatCaPhieuNhap();
            $data = [];
            while ($row = $result->fetch_assoc()) { $data[] = $row; }
            sendResponse(200, true, 'Danh sách phiếu nhập', $data);
            break;

        case 'chitiet':
            if (empty($mapn)) {
                sendResponse(400, false, 'Thiếu mã phiếu nhập (mapn)');
                return;
            }
            $phieunhap->mapn = (int)$mapn;
            $info = $phieunhap->layPhieuNhapTheoMa();
            
            if (!$info) {
                sendResponse(404, false, 'Không tìm thấy phiếu nhập');
                return;
            }

            $res_ct = $phieunhap->layChiTietPhieuNhap();
            $chitiet = [];
            while ($row = $res_ct->fetch_assoc()) { $chitiet[] = $row; }
            
            $info['chitiet'] = $chitiet;
            sendResponse(200, true, 'Chi tiết phiếu nhập', $info);
            break;
        case 'search':
            

        // Gọi hàm tìm kiếm trong model
        $result = $phieunhap->timKiemPhieuNhapTheoNgay($ngayBatDau, $ngayKetThuc);
        if ($result === false) {
            sendResponse(500, false, 'Lỗi khi tìm kiếm phiếu nhập');
            return;
        }

        $data = [];
        while ($row = $result->fetch_assoc()) { 
            $data[] = $row; 
        }

        sendResponse(200, true, 'Kết quả tìm kiếm phiếu nhập', $data);
        break;
        default:
            sendResponse(400, false, 'Action không hợp lệ');
    }
}

// ==================== XỬ LÝ POST ====================
function handlePostRequest() {
    global $phieunhap;
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['chitiet']) || !is_array($data['chitiet'])) {
        sendResponse(400, false, 'Dữ liệu sản phẩm nhập không hợp lệ');
        return;
    }

    $phieunhap->chitiet = $data['chitiet'];
    $phieunhap->ngaynhap = $data['chitiet'][0]['ngaynhap'] ?? null;

    if ($phieunhap->themPhieuNhap()) {
        sendResponse(200, true, 'Nhập hàng và cập nhật giá vốn thành công', [
            "mapn" => $phieunhap->mapn,
            "tongtien" => $phieunhap->tongtien
        ]);
    } else {
        sendResponse(500, false, 'Thất bại khi lưu phiếu nhập');
    }
}

// ==================== HÀM TIỆN ÍCH ====================
function sendResponse($statusCode, $success, $message, $data = null) {
    http_response_code($statusCode);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data,
        "timestamp" => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>