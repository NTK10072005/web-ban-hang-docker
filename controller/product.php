<?php
// ==================== PRODUCT API CONTROLLER (CHỈ JSON) ====================
// File: be/controllers/product.php
// Chỉ xử lý logic và trả về JSON, không render HTML

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

// 4. Tạo đối tượng Product
require_once '../models/Product.php';
$product = new Product($db);

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
        case 'PUT':
            handlePutRequest();
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
    global $product;
    
    $action = $_GET['action'] ?? '';
    $masp = $_GET['masp'] ?? null;
    $page = $_GET['page'] ?? 1;
    $limit = $_GET['limit'] ?? 10;
    $keywords = $_GET['keywords'] ?? '';
    $category = $_GET['category'] ?? '';
    $author = $_GET['author'] ?? '';
    $tensp= $_GET['tensp'] ?? '';
   $giatu = (isset($_GET['giatu']) && $_GET['giatu'] !== '') ? (int)$_GET['giatu'] : null;
   $giaden = (isset($_GET['giaden']) && $_GET['giaden'] !== '') ? (int)$_GET['giaden'] : null;
    // Lấy một sản phẩm theo ID
    if ($masp && empty($action)) {
        $product->masp = $masp;
        
        if ($product->readOne()) {
            sendResponse(200, true, 'Product retrieved successfully', array(
                'masp' => $product->masp,
                'tensp' => $product->tensp,
                'tacgia' => $product->tacgia,
                'danhmuc' => $product->danhmuc,
                'gia' => $product->gia,
                'mota' => $product->mota,
                'link' => $product->link,
                'trangthai' => $product->trangthai,
                'giamgia'=>$product->giam,
                'nhaxuatban'=>$product->nxb,
                'namxuatban'=>$product->namxb,
                'sotrang'=>$product->sotrang,
                'ngonngu'=>$product->ngonngu,
                'kichthuoc'=>$product->kichthuoc,
                'trongluong'=>$product->trongluong,
                'loaibia'=>$product->hinhthuc
            ));
        } else {
            sendResponse(404, false, 'Product not found');
        }
        return;
    }
    
    // Lấy theo danh mục
    if ($action === 'category' && !empty($category)) {
        $result = $product->readByCategory($category);
        $products = array();
        
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        sendResponse(200, true, 'Products by category', array(
            'data' => $products,
            'count' => count($products)
        ));
        return;
    }
    
    // Lấy theo tác giả
    if ($action === 'author' && !empty($author)) {
        $result = $product->readByAuthor($author);
        $products = array();
        
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        sendResponse(200, true, 'Products by author', array(
            'data' => $products,
            'count' => count($products)
        ));
        return;
    }
    
    // Tìm kiếm sản phẩm
    if ($action === 'search' && !empty($keywords)) {
        $result = $product->search($keywords);
        $products = array();
        
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        sendResponse(200, true, 'Search results', array(
            'data' => $products,
            'count' => count($products)
        ));
        return;
    }
    if ($action === 'searchnangcao') {
        
    //echo $tensp;
        $result = $product->advancedSearch($tensp,$category,$giatu,$giaden);
        $products = array();
        
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        sendResponse(200, true, 'Search results', array(
            'data' => $products,
            'count' => count($products)
        ));
        return;
    }

    if ($action === 'searchnangcaoadmin') {
          
    //echo $tensp;
        $result = $product->advancedSearchadmin($tensp,$category,$giatu,$giaden);
        $products = array();
        
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        sendResponse(200, true, 'Search results', array(
            'data' => $products,
            'count' => count($products)
        ));
        return;
    }
    
    // Lấy tác giả
    if ($action === 'authors') {
        $authors = $product->getAuthors();
        sendResponse(200, true, 'Authors retrieved', array(
            'data' => $authors,
            'count' => count($authors)
        ));
        return;
    }
    
    // Phân trang
    if ($action === 'paging') {
        $from_record_num = ($limit * ($page - 1));
        $result = $product->readPaging($from_record_num, $limit);
        $products = array();
        
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        $total_rows = $product->count();
        $total_pages = ceil($total_rows / $limit);
        
        sendResponse(200, true, 'Products retrieved successfully', array(
            'data' => $products,
            'pagination' => array(
                'current_page' => (int)$page,
                'per_page' => (int)$limit,
                'total_items' => $total_rows,
                'total_pages' => $total_pages
            )
        ));
        return;
    }
     if ($action === 'all') {
         // Lấy tất cả sản phẩm (mặc định)
    $result = $product->readAll2();
    $products = array();
    
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    sendResponse(200, true, 'Products retrieved successfully', array(
        'data' => $products,
        'count' => count($products)
    ));
    }
    
    // Lấy tất cả sản phẩm (mặc định)
    $result = $product->readAll();
    $products = array();
    
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    sendResponse(200, true, 'Products retrieved successfully', array(
        'data' => $products,
        'count' => count($products)
    ));
}

/**
 * Xử lý POST request (Thêm sản phẩm mới)
 */
function handlePostRequest() {
    global $product;
    
    // Nhận dữ liệu từ form-data
    $masp = $_POST['masp'] ?? '';
    $tensp = $_POST['tensp'] ?? '';
    $tacgia = $_POST['tacgia'] ?? '';
    $danhmuc = $_POST['danhmuc'] ?? '';
    $gianhap = $_POST['gianhap'] ?? 0;
    $gia = $_POST['gia'] ?? 0;
    $tyle = $_POST['tyle'] ?? 0;
    $mota = $_POST['mota'] ?? '';
    $link = $_POST['link'] ?? '';
    $trangthai = $_POST['trangthai'] ?? 1;
    $trongluong = $_POST['trongluong'] ?? 0;
    $sotrang = $_POST['sotrang'] ?? '';
    $loaibia = $_POST['loaibia'] ?? '';
    $kichthuoc = $_POST['kichthuoc'] ?? '';
    $ngonngu = $_POST['ngonngu'] ?? '';
    $namxb = $_POST['namxb'] ?? '';
    $nxb = $_POST['nxb'] ?? '';
     // Gán giá trị
    $product->masp= htmlspecialchars(strip_tags($masp));
    $product->tensp = htmlspecialchars(strip_tags($tensp));
    $product->tacgia = htmlspecialchars(strip_tags($tacgia));
    $product->danhmuc = htmlspecialchars(strip_tags($danhmuc));
    $product->gianhap = htmlspecialchars(strip_tags($gianhap));
    $product->gia = htmlspecialchars(strip_tags($gia));
    $product->tyle = htmlspecialchars(strip_tags($tyle));
    $product->mota = htmlspecialchars(strip_tags($mota));
    $product->link = htmlspecialchars(strip_tags($link));
    $product->trangthai = htmlspecialchars(strip_tags($trangthai));
    $product->trongluong = htmlspecialchars(strip_tags($trongluong));
    $product->sotrang = htmlspecialchars(strip_tags($sotrang));
    $product->hinhthuc = htmlspecialchars(strip_tags($loaibia));
    $product->kichthuoc = htmlspecialchars(strip_tags($kichthuoc));
    $product->ngonngu = htmlspecialchars(strip_tags($ngonngu));
    $product->namxb = htmlspecialchars(strip_tags($namxb));
    $product->nxb = htmlspecialchars(strip_tags($nxb));
    // Phân biệt THÊM MỚI hay SỬA
    if (!empty($masp)) {
        // SỬA sản phẩm
        $product->masp = (int)$masp;
        // Lưu lại đường dẫn ảnh cũ để xử lý xóa
        $old_image_path = "../" . $product->link; 

        // 2. Kiểm tra nếu có upload ảnh mới
        if (isset($_FILES['anhsp']) && $_FILES['anhsp']['error'] == 0) {
            
            // a. Xóa ảnh cũ khỏi thư mục nếu file đó tồn tại
            if (file_exists($old_image_path) && is_file($old_image_path)) {
                unlink($old_image_path);
            }

            // b. Xử lý file mới
            $extension = pathinfo($_FILES['anhsp']['name'], PATHINFO_EXTENSION);
            $filename = $masp . "." . $extension; // Tên file là ID.duoifile
            $new_upload_path = "../img/" . $filename;

            if (move_uploaded_file($_FILES['anhsp']['tmp_name'], $new_upload_path)) {
                // Cập nhật đường dẫn mới vào object để chuẩn bị update Database
                $product->link = "img/" . $filename;
            }
        }
        // Cập nhật sản phẩm
        if ($product->update()) {
            sendResponse(200, true, 'Product updated successfully', array('masp' => $masp));
        } else {
            sendResponse(500, false, 'Failed to update product');
        }
    } else {
        // THÊM sản phẩm mới
       // 1. Lấy ID tiếp theo (Auto Increment) từ database
       $next_id = $product->getNextId();

        $duongdan = "";
        // 2. Kiểm tra và di chuyển file
        if (isset($_FILES['anhsp']) && $_FILES['anhsp']['error'] == 0) {
            $extension = pathinfo($_FILES['anhsp']['name'], PATHINFO_EXTENSION);
            $filename = $next_id . "." . $extension;
            
            // Di chuyển file vào thư mục image
            if (move_uploaded_file($_FILES['anhsp']['tmp_name'], "../img/" . $filename)) {
                // Lưu đường dẫn vào biến $duongdan
                $duongdan = "img/" . $filename;
            }
        }

        // Gán lại đường dẫn cho đối tượng product trước khi tạo
        $product->link = $duongdan;

        $product_id = $product->create();
        
        if ($product_id) {
            sendResponse(201, true, 'Product created successfully', array('masp' => $product_id));
        } else {
            sendResponse(500, false, 'Failed to create product');
        }
    }
}

function handlePutRequest() {
    global $product;
    
    // Lấy dữ liệu từ URL parameters
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    parse_str($query_string, $query_params);
    $masp = $query_params['masp'] ?? 0;
    $tyle = $query_params['tyle'] ?? 0;
    $action = $query_params['action'] ?? '';
    // Validate input
   
    
    // Kiểm tra sản phẩm tồn tại
    $product->masp = $masp;
    if (!$product->readOne()) {
        sendResponse(404, false, 'Product not found');
        return;
    }
    if ($action === 'restore') {
       if ($product->restore()) {
            sendResponse(200, true, 'Sản phẩm đã được hiển thị trở lại');
        } else {
            sendResponse(500, false, 'Không thể khôi phục sản phẩm');
        }
        return;
    }
    // Gọi phương thức cập nhật giá theo tỷ lệ
    if ($product->updatePriceByTyle($tyle)) {
        sendResponse(200, true, 'Cập nhật thành công');
    } else {
        // Kiểm tra cụ thể lỗi
        if ($product->gianhap <= 0) {
            sendResponse(400, false, 'Vui lòng nhập hàng');
        } else {
            sendResponse(500, false, 'Failed to update price');
        }
    }
}
/**
 * Xử lý DELETE request
 */
function handleDeleteRequest() {
    global $product;
    
    // Lấy ID từ query string
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    parse_str($query_string, $query_params);
    $masp = $query_params['masp'] ?? 0;
    $permanent = $query_params['permanent'] ?? false;
    
    if (empty($masp)) {
        sendResponse(400, false, 'Product ID is required');
        return;
    }
    
    // Kiểm tra sản phẩm tồn tại
    $product->masp = $masp;
    if (!$product->readOne()) {
        sendResponse(404, false, 'Product not found');
        return;
    }
    
    // Xóa sản phẩm (soft delete hoặc permanent)
    $success = false;
    if ($permanent) {
        $success = $product->deletePermanent();
        $message = 'Product permanently deleted successfully';
    } else {
        $success = $product->delete();
        $message = 'Product deleted successfully (soft delete)';
    }
    
    if ($success) {
        sendResponse(200, true, $message, array('masp' => $masp));
    } else {
        sendResponse(500, false, 'Failed to delete product');
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
    
    echo json_encode($response);
    exit;
}
?>