<?php
header('Content-Type: application/json');
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// 4. Tạo đối tượng Customer
require_once '../models/danhmuc.php';
$model = new CategoryModel($db);
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action == 'all') {
            echo json_encode(['success' => true, 'data' => $model->getAllAdmin()]);
        }
         if ($action == 'alladmin') {
            echo json_encode(['success' => true, 'data' => $model->getAllAdmin2()]);
        }
        break;

    case 'POST':
        $madm = $_POST['madm'] ?? '';
        $tendanhmuc = $_POST['tendanhmuc'] ?? '';
        
        if (!empty($madm)) {
            $res = $model->update($madm, $tendanhmuc);
            $msg = "Cập nhật danh mục thành công";
        } else {
            $res = $model->create($tendanhmuc);
            $msg = "Thêm danh mục mới thành công";
        }
        echo json_encode(['success' => $res, 'message' => $res ? $msg : "Có lỗi xảy ra"]);
        break;

    case 'PUT':
        // Xử lý thay đổi trạng thái (Khóa/Mở khóa)
        parse_str(file_get_contents("php://input"), $_PUT);
        $madm = $_GET['madm'] ?? '';
        $status = $_GET['status'] ?? 1;
        $res = $model->updateStatus($madm, $status);
        echo json_encode(['success' => $res, 'message' => $res ? "Cập nhật trạng thái thành công" : "Thất bại"]);
        break;
}