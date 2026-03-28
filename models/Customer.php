<?php
// File: models/Customer.php

class Customer {
    private $conn;
    private $table_name = "khachhang";
    
    // Thuộc tính của khách hàng
    public $makh;
    public $hoten;
    public $email;
    public $sdt;
    public $sonha;
    public $phuongxa;
    public $thanhpho;
    public $trangthai;
    public $username;
    public $password;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // ==================== CRUD METHODS ====================
    
    // Đọc tất cả khách hàng
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY makh DESC";
        return $this->conn->query($query);
    }
    
    // Đọc một khách hàng theo ID
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE makh = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->makh);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row) {
            $this->hoten = $row['hoten'];
            $this->email = $row['email'];
            $this->sdt = $row['sdt'];
            $this->sonha= $row['sonha'];
            $this->phuongxa= $row['phuongxa'];
            $this->thanhpho= $row['thanhpho'];

            $this->trangthai = $row['trangthai'];
            return true;
        }
        return false;
    }
    public function inserttaikhoan() {
    $query = "INSERT INTO taikhoan 
              (makhach, username, password,trangthai) 
              VALUES (?, ?, ?,?)";
    
    $stmt = $this->conn->prepare($query);
    
    if (!$stmt) {
        error_log("Prepare failed: " . $this->conn->error);
        return false;
    }
    
    // Làm sạch dữ liệu
    $this->makh = htmlspecialchars(strip_tags($this->makh));
    $this->username = htmlspecialchars(strip_tags($this->username));
    $this->password = htmlspecialchars(strip_tags($this->password));
    $this->trangthai = 1;

    // Hash mật khẩu trước khi lưu (khuyến nghị dùng bcrypt)
    
    // Bind parameters - giả định makhach là INT, username và password là VARCHAR
    $stmt->bind_param(
        "issi",
        $this->makh,
        $this->username,
        $this->password,
        $this->trangthai
    );
    
    if ($stmt->execute()) {
        return true; // Trả về ID của bản ghi vừa tạo
    } else {
        error_log("Execute failed: " . $stmt->error);
        return false;
    }
}
public function searchAdvanced($hoten = null, $trangthai = null, $username = null) {
    // Xây dựng câu truy vấn với LEFT JOIN
    $query = "SELECT kh.*, tk.username 
              FROM " . $this->table_name . " kh
              LEFT JOIN taikhoan tk ON kh.makh = tk.makhach
              WHERE 1=1";
    
    // Mảng chứa các tham số
    $params = array();
    $types = "";
    
    // Thêm điều kiện tìm kiếm theo họ tên
    if (!empty($hoten) && trim($hoten) !== '') {
        $query .= " AND kh.hoten LIKE ?";
        $params[] = "%" . $this->conn->real_escape_string(trim($hoten)) . "%";
        $types .= "s";
    }
    
    // Thêm điều kiện tìm kiếm theo trạng thái
    // Chỉ thêm điều kiện nếu $trangthai không null, không phải chuỗi rỗng, và hợp lệ (0 hoặc 1)
    if ($trangthai !== null && $trangthai !== '' && in_array($trangthai, ['0', '1', 0, 1], true)) {
        $query .= " AND kh.trangthai = ?";
        $params[] = (int)$trangthai;
        $types .= "i";
    }
    
    // Thêm điều kiện tìm kiếm theo username
    if (!empty($username) && trim($username) !== '') {
        $query .= " AND tk.username LIKE ?";
        $params[] = "%" . $this->conn->real_escape_string(trim($username)) . "%";
        $types .= "s";
    }
    
    // Sắp xếp theo mã khách hàng giảm dần (mới nhất trước)
    $query .= " ORDER BY kh.makh DESC";
    
    // Chuẩn bị statement
    $stmt = $this->conn->prepare($query);
    
    if (!$stmt) {
        error_log("SQL Error: " . $this->conn->error);
        return false;
    }
    
    // Nếu có tham số, bind vào statement
    if (!empty($params)) {
        // Sử dụng call_user_func_array để bind nhiều tham số
        $stmt->bind_param($types, ...$params);
    }
    
    // Thực thi truy vấn
    if (!$stmt->execute()) {
        error_log("Execute Error: " . $stmt->error);
        return false;
    }
    
    // Trả về kết quả
    return $stmt->get_result();
}


    // Tạo khách hàng mới
    public function create() {
    $query = "INSERT INTO " . $this->table_name . "
            (hoten, email, sdt, sonha, trangthai, phuongxa, thanhpho)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $this->conn->prepare($query);
    
    // Làm sạch dữ liệu
    $this->hoten = htmlspecialchars(strip_tags($this->hoten));
    $this->email = htmlspecialchars(strip_tags($this->email));
    $this->sdt = htmlspecialchars(strip_tags($this->sdt));
    $this->sonha = htmlspecialchars(strip_tags($this->sonha));
    $this->phuongxa = htmlspecialchars(strip_tags($this->phuongxa));
    $this->thanhpho = htmlspecialchars(strip_tags($this->thanhpho));
    $this->trangthai = htmlspecialchars(strip_tags($this->trangthai));
    
    // Bind parameters
    $stmt->bind_param(
        "ssssiss",
        $this->hoten,
        $this->email,
        $this->sdt,
        $this->sonha,
        $this->trangthai,
        $this->phuongxa,
        $this->thanhpho
    );
    
    if ($stmt->execute()) {
        // Lấy ID khách hàng vừa tạo
        $this->makh = $stmt->insert_id;
        
        // Gọi phương thức inserttaikhoan với $this->
        return $this->inserttaikhoan();  // ✅ ĐÃ SỬA
    }
    return false;
}
    // Cập nhật khách hàng
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    hoten = ?,
                    email = ?,
                    sdt = ?,
                    sonha = ?,
                    phuongxa = ?,
                    thanhpho = ?,
                    trangthai = ?
                WHERE
                    makh = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->hoten = htmlspecialchars(strip_tags($this->hoten));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->sdt = htmlspecialchars(strip_tags($this->sdt));
        $this->sonha = htmlspecialchars(strip_tags($this->sonha));
        $this->phuongxa = htmlspecialchars(strip_tags($this->phuongxa));
        $this->thanhpho = htmlspecialchars(strip_tags($this->thanhpho));
        $this->trangthai = htmlspecialchars(strip_tags($this->trangthai));
        $this->makh = htmlspecialchars(strip_tags($this->makh));
        
        // Bind parameters
        $stmt->bind_param(
            "ssssssii",
            $this->hoten,
            $this->email,
            $this->sdt,
            $this->sonha,
            $this->phuongxa,
            $this->thanhpho,
            $this->trangthai,
            $this->makh
        );
        
        return $stmt->execute();
    }
    // Class TaiKhoan
public function updatePassword($makh, $matkhau_moi) {
    // Kiểm tra tham số đầu vào
    if (empty($makh)) {
        return false;
    }
     if (empty($matkhau_moi)) {
        return true;
    }
    
    // Chuẩn bị câu lệnh SQL
    $query = "UPDATE taikhoan 
              SET password = ? 
              WHERE makhach = ?";
    
    $stmt = $this->conn->prepare($query);
    
    if (!$stmt) {
        return false;
    }
    
        

    // Bind parameters
    $stmt->bind_param("si",$matkhau_moi, $makh);
    
    // Thực thi
    $stmt->execute();
    return true;
}
    // Xóa khách hàng (soft delete - chỉ cập nhật trạng thái)
    public function delete() {
        $query = "UPDATE " . $this->table_name . " SET trangthai = 0 WHERE makh = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->makh);
        
        return $stmt->execute();
    }
    
    // Xóa vĩnh viễn
    public function deletePermanent() {
        $query = "DELETE FROM " . $this->table_name . " WHERE makh = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->makh);
        
        return $stmt->execute();
    }
    
    // Tìm kiếm khách hàng
    public function search($keywords) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE (hoten LIKE ? OR email LIKE ? OR sdt LIKE ?)
                AND trangthai = 1
                ORDER BY makh DESC";
        
        $stmt = $this->conn->prepare($query);
        
        $keywords = "%{$keywords}%";
        $stmt->bind_param("ssss", $keywords, $keywords, $keywords, $keywords);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Phân trang khách hàng
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE trangthai = 1
                ORDER BY makh DESC
                LIMIT ?, ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $from_record_num, $records_per_page);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Đếm tổng số khách hàng
    public function count() {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE trangthai = 1";
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();
        
        return $row['total_rows'];
    }
    
    // Lấy khách hàng theo email
    public function readByEmail($email) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE email = ? AND trangthai = 1
                ORDER BY makh DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Lấy khách hàng theo số điện thoại
    public function readByPhone($sdt) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE sdt LIKE ? AND trangthai = 1
                ORDER BY makh DESC";
        
        $stmt = $this->conn->prepare($query);
        $sdt = "%{$sdt}%";
        $stmt->bind_param("s", $sdt);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Kiểm tra email đã tồn tại chưa
    public function emailExists($email, $excludeId = null) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE email = ?";
        
        if ($excludeId) {
            $query .= " AND makh != ?";
        }
        
        $stmt = $this->conn->prepare($query);
        
        if ($excludeId) {
            $stmt->bind_param("si", $email, $excludeId);
        } else {
            $stmt->bind_param("s", $email);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        return $row['count'] > 0;
    }
    
    // Lấy thống kê khách hàng theo trạng thái
    public function getStatsByStatus() {
        $query = "SELECT 
                    trangthai,
                    COUNT(*) as count,
                    CASE 
                        WHEN trangthai = 1 THEN 'Hoạt động'
                        WHEN trangthai = 0 THEN 'Không hoạt động'
                        ELSE 'Khác'
                    END as status_name
                FROM " . $this->table_name . "
                GROUP BY trangthai
                ORDER BY trangthai DESC";
        
        $result = $this->conn->query($query);
        $stats = array();
        
        while ($row = $result->fetch_assoc()) {
            $stats[] = $row;
        }
        
        return $stats;
    }
}
?>