<?php
// File: be/models/Product.php

class Product {
    private $conn;
    private $table_name = "sanpham";
    
    // Thuộc tính của sản phẩm
    public $masp;
    public $tensp;
    public $tacgia;
    public $danhmuc;
    public $gianhap;
    public $gia;
    public $tyle;
    public $mota;
    public $link;
    public $trangthai;
    public $giam;
    public $nxb;
    public $namxb;
    public $sotrang;
    public $ngonngu;
    public $kichthuoc;
    public $trongluong;
    public $hinhthuc;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // ==================== CRUD METHODS ====================
    
    // Đọc tất cả sản phẩm
    public function readAll() {
        $query = "SELECT 
    s.*,
    COALESCE(km.max_heso, 0) AS hesogiamgia
FROM sanpham s
LEFT JOIN (
    SELECT masp, MAX(heso) AS max_heso
    FROM khuyenmai
    WHERE CURDATE() BETWEEN ngaybatdau AND ngayketthuc
    GROUP BY masp
) km ON s.masp = km.masp
WHERE s.trangthai = 1 and s.gia>0
ORDER BY s.masp DESC";
        return $this->conn->query($query);
    }
/**
     * Lấy ID tự tăng (Auto Increment) tiếp theo của bảng sản phẩm
     */
    public function getNextId() {
        $query = "SELECT AUTO_INCREMENT 
                  FROM information_schema.TABLES 
                  WHERE TABLE_SCHEMA = DATABASE() 
                  AND TABLE_NAME = '" . $this->table_name . "'";
        
        $result = $this->conn->query($query);
        if ($result) {
            $row = $result->fetch_assoc();
            return $row['AUTO_INCREMENT'];
        }
        return null;
    }
    public function readAll2() {
        $query = "SELECT 
    s.*,
    COALESCE(km.max_heso, 0) AS hesogiamgia
FROM sanpham s
LEFT JOIN (
    SELECT masp, MAX(heso) AS max_heso
    FROM khuyenmai
    WHERE CURDATE() BETWEEN ngaybatdau AND ngayketthuc
    GROUP BY masp
) km ON s.masp = km.masp
ORDER BY s.masp DESC";
        return $this->conn->query($query);
    }
    
    // Đọc một sản phẩm theo ID
    public function readOne() {
        $query = "SELECT 
    s.*,
    COALESCE(MAX(km.heso), 0) AS hesogiamgia
FROM sanpham s
LEFT JOIN khuyenmai km ON s.masp = km.masp 
    AND CURDATE() BETWEEN km.ngaybatdau AND km.ngayketthuc
WHERE s.masp = ?
GROUP BY s.masp
LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->masp);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row) {
            $this->tensp = $row['tensp'];
            $this->tacgia = $row['tacgia'];
            $this->danhmuc = $row['danhmuc'];
            $this->gia = $row['gia'];
            $this->mota = $row['mota'];
            $this->link = $row['link'];
            $this->trangthai = $row['trangthai'];
            $this->giam=$row['hesogiamgia'];
            $this->gianhap=$row['gianhap'];
            $this->tyle=$row['tyle'];
            $this->nxb=$row['nxb'];
            $this->namxb=$row['namxb'];
            $this->sotrang=$row['sotrang'];
            $this->ngonngu=$row['ngonngu'];
            $this->kichthuoc=$row['kichthuoc'];
            $this->trongluong=$row['trongluong'];
            $this->hinhthuc=$row['loaibia'];
            return true;
        }
        return false;
    }
    
    // Tạo sản phẩm mới
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (tensp, tacgia, danhmuc,mota, link, trangthai, nxb, namxb, sotrang, ngonngu, kichthuoc, trongluong, loaibia)
                VALUES (?, ?, ?, ?,?,?,?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->tensp = htmlspecialchars(strip_tags($this->tensp));
        $this->tacgia = htmlspecialchars(strip_tags($this->tacgia));
        $this->danhmuc = htmlspecialchars(strip_tags($this->danhmuc));
        $this->mota = htmlspecialchars(strip_tags($this->mota));
        $this->link = htmlspecialchars(strip_tags($this->link));
        $this->trangthai = htmlspecialchars(strip_tags($this->trangthai));
        $this->nxb = htmlspecialchars(strip_tags($this->nxb));
        $this->namxb = htmlspecialchars(strip_tags($this->namxb));
        $this->sotrang = htmlspecialchars(strip_tags($this->sotrang));
        $this->ngonngu = htmlspecialchars(strip_tags($this->ngonngu));
        $this->kichthuoc = htmlspecialchars(strip_tags($this->kichthuoc));
        $this->trongluong = htmlspecialchars(strip_tags($this->trongluong));
        $this->hinhthuc = htmlspecialchars(strip_tags($this->hinhthuc));
        
        // Bind parameters
        $stmt->bind_param(
            "sssssssddssss",
            $this->tensp,
            $this->tacgia,
            $this->danhmuc,
            $this->mota,
            $this->link,
            $this->trangthai
            ,$this->nxb,
            $this->namxb,
            $this->sotrang,
            $this->ngonngu,
            $this->kichthuoc,
            $this->trongluong,
            $this->hinhthuc

        );
        
        if ($stmt->execute()) {
            return $stmt->insert_id;
        }
        return false;
    }
    
    // Cập nhật sản phẩm
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    tensp = ?,
                    tacgia = ?,
                    danhmuc = ?,
                    mota = ?,
                    trangthai = ?,
                    link=?,
                    nxb = ?,
                    namxb = ?,
                    sotrang = ?,
                    ngonngu = ?,
                    kichthuoc = ?,
                    trongluong = ?,
                    loaibia = ?
                WHERE
                    masp = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->tensp = htmlspecialchars(strip_tags($this->tensp));
        $this->tacgia = htmlspecialchars(strip_tags($this->tacgia));
        $this->danhmuc = htmlspecialchars(strip_tags($this->danhmuc));
        $this->gia = htmlspecialchars(strip_tags($this->gia));
        $this->mota = htmlspecialchars(strip_tags($this->mota));
        $this->link = htmlspecialchars(strip_tags($this->link));
        $this->trangthai = htmlspecialchars(strip_tags($this->trangthai));
        $this->masp = htmlspecialchars(strip_tags($this->masp));
        $this->nxb = htmlspecialchars(strip_tags($this->nxb));
        $this->namxb = htmlspecialchars(strip_tags($this->namxb));
        $this->sotrang = htmlspecialchars(strip_tags($this->sotrang));
        $this->ngonngu = htmlspecialchars(strip_tags($this->ngonngu));
        $this->kichthuoc = htmlspecialchars(strip_tags($this->kichthuoc));
        $this->trongluong = htmlspecialchars(strip_tags($this->trongluong));
        $this->hinhthuc = htmlspecialchars(strip_tags($this->hinhthuc));


        // Bind parameters
        $stmt->bind_param(
            "ssssissiissssi",
            $this->tensp,
            $this->tacgia,
            $this->danhmuc,
            $this->mota,
            $this->trangthai,
            $this->link,
            $this->nxb,
            $this->namxb,
            $this->sotrang,
            $this->ngonngu,
            $this->kichthuoc,
            $this->trongluong,
            $this->hinhthuc,
            $this->masp

        );
        
        return $stmt->execute();
    }
    
    // Xóa sản phẩm (soft delete - chỉ cập nhật trạng thái)
    public function delete() {
        $query = "UPDATE " . $this->table_name . " SET trangthai = 0 WHERE masp = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->masp);
        
        return $stmt->execute();
    }
    
    // Xóa vĩnh viễn
    public function deletePermanent() {
        $query = "DELETE FROM " . $this->table_name . " WHERE masp = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->masp);
        
        return $stmt->execute();
    }
    
    // Tìm kiếm sản phẩm
    public function search($keywords) {
    // Nếu keyword rỗng, ta để nó là chuỗi rỗng để SQL dễ xử lý
    $is_empty = empty($keywords) ? 1 : 0;
    $searchKey = "%{$keywords}%";

    $query = "SELECT 
        s.*,
        COALESCE(km.max_heso, 0) AS hesogiamgia
    FROM sanpham s
    LEFT JOIN (
        SELECT masp, MAX(heso) AS max_heso
        FROM khuyenmai
        WHERE CURDATE() BETWEEN ngaybatdau AND ngayketthuc
        GROUP BY masp
    ) km ON s.masp = km.masp
    WHERE (? = 1 OR s.tensp LIKE ?) -- Nếu ? thứ nhất là 1, vế sau sẽ được bỏ qua
        AND s.trangthai = 1 AND s.gia > 0
    ORDER BY s.masp DESC";

    $stmt = $this->conn->prepare($query);
    // Bind 2 tham số: biến kiểm tra rỗng và từ khóa
    $stmt->bind_param("is", $is_empty, $searchKey);
    $stmt->execute();
    
    return $stmt->get_result();
}
    public function advancedSearch($tensp = '', $danhmuc = '', $giatu = null, $giaden = null) {
    // Tạo mảng điều kiện và tham số bind
    $conditions = ["trangthai = 1"];
    $bindParams = [];
    $bindTypes = "";
    
    // Điều kiện tên sản phẩm (tìm kiếm tương đối)
    if (!empty($tensp)) {
        $conditions[] = "tensp LIKE ?";
        $bindParams[] = "%{$tensp}%";
        $bindTypes .= "s";
    }
    
    // Điều kiện danh mục (chính xác)
    if (!empty($danhmuc)) {
        $conditions[] = "danhmuc = ?";
        $bindParams[] = $danhmuc;
        $bindTypes .= "s";
    }
    
    // Điều kiện giá từ
    if ($giatu !== null && is_numeric($giatu)) {
        $conditions[] = "gia >= ?";
        $bindParams[] = $giatu;
        $bindTypes .= "d";
    }
    
    // Điều kiện giá đến
    if ($giaden !== null && is_numeric($giaden)) {
        $conditions[] = "gia <= ?";
        $bindParams[] = $giaden;
        $bindTypes .= "d";
    }
    
    // Xây dựng câu truy vấn
    $query = "SELECT 
    s.*,
    COALESCE(km.max_heso, 0) AS hesogiamgia
FROM sanpham s
LEFT JOIN (
    SELECT masp, MAX(heso) AS max_heso
    FROM khuyenmai
    WHERE CURDATE() BETWEEN ngaybatdau AND ngayketthuc
    GROUP BY masp
) km ON s.masp = km.masp
WHERE " . implode(" AND ", $conditions) . " and s.gia>0
ORDER BY s.masp DESC";
    
    // Chuẩn bị và thực thi truy vấn
    $stmt = $this->conn->prepare($query);
    
    if (!empty($bindParams)) {
        $stmt->bind_param($bindTypes, ...$bindParams);
    }
    
    $stmt->execute();
    return $stmt->get_result();
}

  public function advancedSearchadmin($tensp = '', $danhmuc = '', $giatu = null, $giaden = null) {
   // Tạo mảng điều kiện và tham số bind
    $conditions = ["1=1"];
   $bindParams = [];
    $bindTypes = "";
    
    // Điều kiện tên sản phẩm (tìm kiếm tương đối)
    if (!empty($tensp)) {
        $conditions[] = "tensp LIKE ?";
        $bindParams[] = "%{$tensp}%";
        $bindTypes .= "s";
    }
    
    // Điều kiện danh mục (chính xác)
    if (!empty($danhmuc)) {
        $conditions[] = "danhmuc = ?";
        $bindParams[] = $danhmuc;
        $bindTypes .= "s";
    }
    
    // Điều kiện giá từ
    if ($giatu !== null && is_numeric($giatu)) {
        $conditions[] = "gia >= ?";
        $bindParams[] = $giatu;
        $bindTypes .= "d";
    }
    
    // Điều kiện giá đến
    if ($giaden !== null && is_numeric($giaden)) {
        $conditions[] = "gia <= ?";
        $bindParams[] = $giaden;
        $bindTypes .= "d";
    }
    
    // Xây dựng câu truy vấn
    $query = "SELECT 
    s.*,
    COALESCE(km.max_heso, 0) AS hesogiamgia
FROM sanpham s
LEFT JOIN (
    SELECT masp, MAX(heso) AS max_heso
    FROM khuyenmai
    WHERE CURDATE() BETWEEN ngaybatdau AND ngayketthuc
    GROUP BY masp
) km ON s.masp = km.masp
WHERE " . implode(" AND ", $conditions) . "
ORDER BY s.masp DESC";
    
    // Chuẩn bị và thực thi truy vấn
    $stmt = $this->conn->prepare($query);
    
    if (!empty($bindParams)) {
        $stmt->bind_param($bindTypes, ...$bindParams);
    }
    
    $stmt->execute();
    return $stmt->get_result();
}
    // Phân trang sản phẩm
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE trangthai = 1
                ORDER BY masp DESC
                LIMIT ?, ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $from_record_num, $records_per_page);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Đếm tổng số sản phẩm
    public function count() {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE trangthai = 1";
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();
        
        return $row['total_rows'];
    }
    
    // Lấy sản phẩm theo danh mục
    public function readByCategory($category) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE danhmuc = ? AND trangthai = 1
                ORDER BY masp DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $category);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Lấy sản phẩm theo tác giả
    public function readByAuthor($author) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE tacgia LIKE ? AND trangthai = 1
                ORDER BY masp DESC";
        
        $stmt = $this->conn->prepare($query);
        $author = "%{$author}%";
        $stmt->bind_param("s", $author);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Lấy tất cả danh mục sản phẩm
    public function getCategories() {
        $query = "SELECT DISTINCT danhmuc FROM " . $this->table_name . " WHERE trangthai = 1 ORDER BY danhmuc";
        $result = $this->conn->query($query);
        
        $categories = array();
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['danhmuc'];
        }
        
        return $categories;
    }
    
    // Lấy tất cả tác giả
    public function getAuthors() {
        $query = "SELECT DISTINCT tacgia FROM " . $this->table_name . " WHERE trangthai = 1 ORDER BY tacgia";
        $result = $this->conn->query($query);
        
        $authors = array();
        while ($row = $result->fetch_assoc()) {
            $authors[] = $row['tacgia'];
        }
        
        return $authors;
    }
    public function updatePriceByTyle($tyle) {
    // 1. Kiểm tra nếu tyle hiện tại bằng tyle mới
    if ($this->gianhap <= 0) {
        return false; // Không thể tính giá mới
    }
    if ($this->tyle == $tyle) {
        return true; // Không cần cập nhật
    }
    
    // 2. Kiểm tra gianhap > 0
    
    
    // 3. Tính giá mới theo công thức: gia = gianhap * (100 + tyle) / 100
    $gia_moi = round($this->gianhap * (100 + $tyle) / 100);
    
    // 4. Cập nhật cả tyle và giá
    $query = "UPDATE " . $this->table_name . "
              SET tyle = ?, gia = ?
              WHERE masp = ? AND gianhap > 0";
    
    $stmt = $this->conn->prepare($query);
    
    // Làm sạch dữ liệu
    $tyle = htmlspecialchars(strip_tags($tyle));
    $gia_moi = htmlspecialchars(strip_tags($gia_moi));
    $this->masp = htmlspecialchars(strip_tags($this->masp));
    
    // Bind parameters
    $stmt->bind_param("idi", $tyle, $gia_moi, $this->masp);
    
    if ($stmt->execute()) {
        // Cập nhật lại thuộc tính của object
        $this->tyle = $tyle;
        $this->gia = $gia_moi;
        
        // Kiểm tra có dòng nào được cập nhật không
        return $stmt->affected_rows > 0;
    }
    
    return false;
}


public function restore() {
    $query = "UPDATE " . $this->table_name . " SET trangthai = 1 WHERE masp = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $this->masp);
    
    return $stmt->execute();
}
}
?>