<?php
class CategoryModel {
    private $db;

    public function __construct($db_connection) {
        $this->db = $db_connection;
    }

    private function generateNextId() {
    $prefix = "DM";
    return uniqid($prefix);
}

    public function getAllAdmin() {
        // Lấy tất cả danh mục để Admin quản lý
        $query = "SELECT * FROM danhmuc where trangthai=1 ORDER BY madm DESC";
        $result = $this->db->query($query);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
     public function getAllAdmin2() {
        // Lấy tất cả danh mục để Admin quản lý
        $query = "SELECT * FROM danhmuc ORDER BY madm DESC";
        $result = $this->db->query($query);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create($tendanhmuc) {
        $madm = $this->generateNextId();
        $query = "INSERT INTO danhmuc (madm, tendm, trangthai) VALUES (?, ?, 1)";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("ss", $madm, $tendanhmuc);
        return $stmt->execute();
    }

    public function update($madm, $tendanhmuc) {
        $query = "UPDATE danhmuc SET tendm = ? WHERE madm = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("ss", $tendanhmuc, $madm);
        return $stmt->execute();
    }

    public function updateStatus($madm, $status) {
        // Đây chính là hàm "Xóa" hoặc "Khôi phục"
        $query = "UPDATE danhmuc SET trangthai = ? WHERE madm = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("is", $status, $madm);
        return $stmt->execute();
    }
}