<?php
// ==================== CART API CONTROLLER (CHỈ JSON) ====================
// File: be/controllers/cart.php
// Xử lý API cho giỏ hàng

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

// 4. Tạo đối tượng Cart
require_once '../models/Cart.php';
$cart = new Cart($db);

// 5. Lấy HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// 6. Xử lý request
try {
    switch ($method) {
        // ========== GET ========== (Lấy thông tin giỏ hàng)
        case 'GET':
            handleGetRequest();
            break;
            
        // ========== POST ========== (Thêm/Cập nhật giỏ hàng)
        case 'POST':
            handlePostRequest();
            break;
            
        // ========== PUT ========== (Cập nhật số lượng)
        case 'PUT':
            handlePutRequest();
            break;
            
        // ========== DELETE ========== (Xóa sản phẩm)
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
    global $cart;
    
    $action = $_GET['action'] ?? '';
    $magio = $_GET['magio'] ?? '';
    
    if (empty($magio)) {
        sendResponse(400, false, 'Cart ID (magio) is required');
        return;
    }
    
    $cart->magio =(int)$magio;
    
    // Lấy thông tin tổng quan giỏ hàng (số lượng, tổng tiền)
    if ($action === 'summary') {
        $count = $cart->countItems();
        $total = $cart->getCartTotal();
        
        sendResponse(200, true, 'Cart summary retrieved', array(
            'summary' => array(
                'total_items' => (int)$count['total_items'],
                'total_quantity' => (int)$count['total_quantity'],
                'total_amount' => (float)$total
            )
        ));
        return;
    }
    
    // Lấy tất cả sản phẩm trong giỏ hàng (mặc định)
    $result = $cart->getCartItems();
    $items = array();
    $total_amount = 0;
    
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
        $total_amount += $row['thanhtien'];
    }
    
    // Lấy thông tin tổng quan
    $count = $cart->countItems();
    
    sendResponse(200, true, 'Cart items retrieved successfully', array(
        'data' => $items,
        'summary' => array(
            'total_items' => (int)$count['total_items'],
            'total_quantity' => (int)$count['total_quantity'],
            'total_amount' => (float)$total_amount
        )
    ));
}

/**
 * Xử lý POST request (Thêm sản phẩm vào giỏ hàng)
 */
function handlePostRequest() {
    global $cart;
    
    // Nhận dữ liệu JSON hoặc form-data
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    
    if ($contentType === 'application/json') {
        $data = json_decode(file_get_contents("php://input"), true);
    } else {
        $data = $_POST;
    }
    
    $magio = $data['magio'] ?? '';
    $masp = $data['masp'] ?? 0;
    $soluong = $data['soluong'] ?? 1; // Mặc định số lượng là 1
    
    // Validate dữ liệu
    $errors = validateCartData($magio, $masp, $soluong);
    
    if (!empty($errors)) {
        sendResponse(400, false, 'Validation failed', array('errors' => $errors));
        return;
    }
    
    // Gán giá trị cho cart object
    $cart->magio = htmlspecialchars(strip_tags($magio));
    $cart->masp = (int)$masp;
    $cart->soluong = (int)$soluong;
    $cart->trangthai = 1;
    
    // Thêm vào giỏ hàng
    $result = $cart->addToCart();
    
    if ($result) {
        // Lấy thông tin sản phẩm vừa thêm
        require_once '../models/Product.php';
        $product = new Product($GLOBALS['db']);
        $product->masp = $masp;
        $productInfo = $product->readOne() ? array(
            'masp' => $product->masp,
            'tensp' => $product->tensp,
            'gia' => $product->gia
        ) : null;
        
        sendResponse(200, true, 'Product added to cart successfully', array(
            'cart_id' => $magio,
            'product_id' => $masp,
            'quantity' => $soluong,
            'product_info' => $productInfo
        ));
    } else {
        sendResponse(500, false, 'Failed to add product to cart');
    }
}

/**
 * Xử lý PUT request (Cập nhật số lượng)
 */
function handlePutRequest() {
    global $cart;
    
    // Parse input data
    $input_data = json_decode(file_get_contents("php://input"), true);
    
    $magio = $input_data['magio'] ?? '';
    $masp = $input_data['masp'] ?? 0;
    $soluong = $input_data['soluong'] ?? 1;
    $action = $input_data['action'] ?? ''; // 'increase', 'decrease', or 'set'
    
    if (empty($magio) || empty($masp)) {
        sendResponse(400, false, 'Cart ID and Product ID are required');
        return;
    }
    
    $cart->magio = htmlspecialchars(strip_tags($magio));
    $cart->masp = (int)$masp;
    
    // Lấy số lượng hiện tại
    $existingItem = $cart->getCartItem();
    
    if (!$existingItem) {
        sendResponse(404, false, 'Product not found in cart');
        return;
    }
    
    $currentQuantity = $existingItem['soluong'];
    
    // Xử lý theo action
    switch ($action) {
        case 'increase':
            $newQuantity = $currentQuantity + 1;
            break;
        case 'decrease':
            $newQuantity = max(1, $currentQuantity - 1); // Tối thiểu là 1
            break;
        case 'set':
            $newQuantity = max(1, (int)$soluong); // Tối thiểu là 1
            break;
        default:
            // Nếu không có action, dùng số lượng từ request
            $newQuantity = max(1, (int)$soluong);
    }
    
    $cart->soluong = $newQuantity;
    
    if ($cart->updateCartItem()) {
        sendResponse(200, true, 'Cart updated successfully', array(
            'cart_id' => $magio,
            'product_id' => $masp,
            'old_quantity' => $currentQuantity,
            'new_quantity' => $newQuantity
        ));
    } else {
        sendResponse(500, false, 'Failed to update cart');
    }
}

/**
 * Xử lý DELETE request (Xóa sản phẩm khỏi giỏ hàng)
 */
function handleDeleteRequest() {
    global $cart;
    
    // Lấy tham số từ query string
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    parse_str($query_string, $query_params);
    
    $magio = $query_params['magio'] ?? '';
    $masp = $query_params['masp'] ?? 0;
    $clear_all = $query_params['clear_all'] ?? false;
    
    if (empty($magio)) {
        sendResponse(400, false, 'Cart ID is required');
        return;
    }
    
    $cart->magio = $magio;
    
    if ($clear_all) {
        // Xóa toàn bộ giỏ hàng
        if ($cart->clearCart()) {
            sendResponse(200, true, 'Cart cleared successfully', array(
                'cart_id' => $magio
            ));
        } else {
            sendResponse(500, false, 'Failed to clear cart');
        }
    } else {
        // Xóa một sản phẩm cụ thể
        if (empty($masp)) {
            sendResponse(400, false, 'Product ID is required');
            return;
        }
        
        $cart->masp = (int)$masp;
        
        if ($cart->removeFromCart()) {
            sendResponse(200, true, 'Product removed from cart', array(
                'cart_id' => $magio,
                'product_id' => $masp
            ));
        } else {
            sendResponse(500, false, 'Failed to remove product from cart');
        }
    }
}

/**
 * Validate dữ liệu giỏ hàng
 */
function validateCartData($magio, $masp, $soluong) {
    $errors = array();
    
    if (empty($magio)) {
        $errors[] = "Cart ID is required";
    }
    
    if (empty($masp)) {
        $errors[] = "Product ID is required";
    } elseif (!is_numeric($masp) || $masp <= 0) {
        $errors[] = "Product ID must be a positive number";
    }
    
    if (!is_numeric($soluong)) {
        $errors[] = "Quantity must be a positive number";
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
    
    echo json_encode($response,JSON_UNESCAPED_UNICODE);
    exit;
}
?>