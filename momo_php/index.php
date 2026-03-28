<?php
// ==================== CẤU HÌNH CỐ ĐỊNH ====================
$endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
$accessKey = 'F8BBA842ECF85';
$secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
$partnerCode = 'MOMO';
$redirectUrl = 'http://localhost/web2/momo_php/thank-you.php'; // ✅ ĐÃ SỬA
$ipnUrl = 'http://localhost/web2/momo_php/ipn.php';          // ✅ THÊM URL HỢP LỆ
$requestType = 'payWithMethod'; // ✅ ĐÃ SỬA
$lang = 'vi';
$autoCapture = true;
// =========================================================

function callMomoAPI($endpoint, $data) {
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen(json_encode($data)))
    );
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'result' => $result
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    if (!isset($input['orderId']) || !isset($input['amount'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Thiếu orderId hoặc amount']);
        exit;
    }
    
    $originalOrderId = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['orderId']); // ✅ Lọc ký tự an toàn
    $amount = intval($input['amount']); // ✅ Ép kiểu số nguyên
    
    if ($amount < 1000) {
        echo json_encode(['success' => false, 'message' => 'Số tiền tối thiểu 1,000 VND']);
        exit;
    }
    
    try {
        $requestId = time() . '';
        $orderId = $originalOrderId . '_' . time();
        $orderInfo = "Thanh toán đơn hàng #" . $originalOrderId;
        $extraData = '';
        
        // Tạo chữ ký - ĐÚNG thứ tự theo MoMo
        $rawHash = "accessKey=" . $accessKey . 
                   "&amount=" . $amount . 
                   "&extraData=" . $extraData . 
                   "&ipnUrl=" . $ipnUrl . 
                   "&orderId=" . $orderId . 
                   "&orderInfo=" . $orderInfo . 
                   "&partnerCode=" . $partnerCode . 
                   "&redirectUrl=" . $redirectUrl . 
                   "&requestId=" . $requestId . 
                   "&requestType=" . $requestType;
        
        $signature = hash_hmac("sha256", $rawHash, $secretKey);
        
        $data = [
            'partnerCode' => $partnerCode,
            'partnerName' => "Cửa hàng của bạn",
            'storeId' => 'Store001',
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'requestType' => $requestType,
            'ipnUrl' => $ipnUrl,
            'redirectUrl' => $redirectUrl,
            'lang' => $lang,
            'autoCapture' => $autoCapture,
            'extraData' => $extraData,
            'signature' => $signature
        ];
        
        $response = callMomoAPI($endpoint, $data);
        
        if ($response['status'] == 200) {
            $result = json_decode($response['result'], true);
            if ($result && $result['resultCode'] == 0) {
                echo json_encode([
                    'success' => true,
                    'payUrl' => $result['payUrl'],
                    'orderId' => $orderId,
                    'originalOrderId' => $originalOrderId,
                    'amount' => $amount,
                    'message' => 'Tạo link thanh toán thành công'
                ],JSON_UNESCAPED_UNICODE);
                exit;
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => $result['message'] ?? 'Có lỗi từ MoMo'
                ]);
                exit;
            }
        } else {
            
            $errorMsg = 'Lỗi kết nối (HTTP ' . $response['status'] . ')';
            if (!empty($response['result'])) {
                $err = json_decode($response['result'], true);
                if ($err) {
                    $errorMsg .= ' - MoMo says: ' . json_encode($err, JSON_UNESCAPED_UNICODE);
                }
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $errorMsg], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
        exit;
    }
    
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Chỉ hỗ trợ POST']);
    exit;
}
?>