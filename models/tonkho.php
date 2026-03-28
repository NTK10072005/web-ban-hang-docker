<?php
// File: be/models/TonKho.php

class TonKho {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Tra cứu tồn kho theo danh mục đến một ngày cụ thể
     * @param string $ngay Ngày tra cứu (YYYY-MM-DD)
     * @return mysqli_result|false
     */
    public function tracuuTonKho($ngay, $danhmuc, $tensp = "") {
    // 1. Escape các giá trị đầu vào để tránh SQL injection
    $ngay = $this->conn->real_escape_string($ngay);
    $danhmuc = $this->conn->real_escape_string($danhmuc);
    $tensp = $this->conn->real_escape_string($tensp);
    
    // 2. Xây dựng điều kiện lọc linh hoạt
    // Nếu $danhmuc rỗng, điều kiện (sp.danhmuc = '$danhmuc' OR '$danhmuc' = '') sẽ luôn đúng
    $whereClause = "WHERE (sp.danhmuc = '$danhmuc' OR '$danhmuc' = '')";
    
    // Thêm điều kiện tìm kiếm theo tên sản phẩm (tìm kiếm gần đúng)
    if ($tensp != "") {
        $whereClause .= " AND sp.tensp LIKE '%$tensp%'";
    }

    // 3. Xây dựng câu truy vấn
    $query = "SELECT 
                sp.masp,
                sp.tensp,
                sp.danhmuc,
                sp.tacgia,
                sp.link,
                (COALESCE(nhap.tong_nhap, 0) - COALESCE(xuat.tong_xuat, 0)) as ton_kho
              FROM sanpham sp 
              LEFT JOIN (
                SELECT ctpn.masp, SUM(ctpn.soluong) as tong_nhap 
                FROM chitietphieunhap ctpn 
                JOIN phieunhap pn ON ctpn.mapn = pn.mapn 
                WHERE pn.ngaynhap <= '$ngay' 
                GROUP BY ctpn.masp
              ) nhap ON sp.masp = nhap.masp 
              LEFT JOIN (
                SELECT cthd.masp, SUM(cthd.soluong) as tong_xuat 
                FROM chitietdonhang cthd 
                JOIN donhang hd ON cthd.madh = hd.madh 
                WHERE DATE(hd.ngaydat) <= '$ngay' AND (hd.trangthaidon=3 or hd.trangthaidon=4) 
                GROUP BY cthd.masp
              ) xuat ON sp.masp = xuat.masp 
              $whereClause
              ORDER BY sp.danhmuc, sp.masp";
    
    return $this->conn->query($query);
}
    
    /**
     * Báo cáo nhập xuất trong khoảng thời gian
     * @param string $ngaybatdau Ngày bắt đầu (YYYY-MM-DD)
     * @param string $ngayketthuc Ngày kết thúc (YYYY-MM-DD)
     * @return mysqli_result|false
     */
    public function baoCaoNhapXuat($ngaybatdau, $ngayketthuc) {
        // Làm sạch và validate ngày
        $ngaybatdau = $this->conn->real_escape_string($ngaybatdau);
        $ngayketthuc = $this->conn->real_escape_string($ngayketthuc);
        
        $query = "SELECT 
                    COALESCE(nhap.masp, xuat.masp) AS ID_SanPham,
                    COALESCE(nhap.SoLuongNhap, 0) AS SoLuongNhap,
                    COALESCE(xuat.SoLuongXuat, 0) AS SoLuongXuat
                  FROM (
                    SELECT ctpn.masp, SUM(ctpn.soluong) AS SoLuongNhap
                    FROM chitietphieunhap ctpn
                    INNER JOIN phieunhap pn ON pn.mapn = ctpn.mapn
                    WHERE pn.ngaynhap BETWEEN '" . $ngaybatdau . "' AND '" . $ngayketthuc . "'
                    GROUP BY ctpn.masp
                  ) AS nhap
                  LEFT JOIN (
                    SELECT cthd.masp, SUM(cthd.soluong) AS SoLuongXuat
                    FROM chitietdonhang cthd
                    INNER JOIN donhang hd ON hd.madh = cthd.madh
                    WHERE hd.ngaydat BETWEEN '" . $ngaybatdau . "' AND '" . $ngayketthuc . "'
                    GROUP BY cthd.masp
                  ) AS xuat ON nhap.masp = xuat.masp
                  ORDER BY COALESCE(nhap.masp, xuat.masp)";
        
        return $this->conn->query($query);
    }
    
    /**
     * Phiên bản dùng prepared statement (an toàn hơn)
     */
    public function tracuuTonKhoPrepared($ngay) {
        $query = "SELECT 
                    sp.danhmuc, 
                    COUNT(sp.masp) as so_luong_sanpham, 
                    SUM(COALESCE(nhap.tong_nhap, 0)) - SUM(COALESCE(xuat.tong_xuat, 0)) as ton_kho 
                  FROM sanpham sp 
                  LEFT JOIN (
                    SELECT ctpn.masp, SUM(ctpn.soluong) as tong_nhap 
                    FROM chitietphieunhap ctpn 
                    JOIN phieunhap pn ON ctpn.mapn = pn.mapn 
                    WHERE pn.ngaynhap <= ? 
                    GROUP BY ctpn.masp
                  ) nhap ON sp.masp = nhap.masp 
                  LEFT JOIN (
                    SELECT cthd.masp, SUM(cthd.soluong) as tong_xuat 
                    FROM chitietdonhang cthd 
                    JOIN donhang hd ON cthd.madh = hd.madh 
                    WHERE hd.ngaydat <= ? 
                    GROUP BY cthd.masp
                  ) xuat ON sp.masp = xuat.masp 
                  GROUP BY sp.danhmuc 
                  ORDER BY sp.danhmuc";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $ngay, $ngay);
        
        if ($stmt->execute()) {
            return $stmt->get_result();
        }
        
        return false;
    }
    
    /**
     * Phiên bản dùng prepared statement cho báo cáo
     */
    public function baoCaoNhapXuatPrepared($ngaybatdau, $ngayketthuc, $tensp = "") {
    // 1. Khởi tạo mảng chứa tham số và chuỗi định dạng kiểu dữ liệu (ssss)
    $params = [$ngaybatdau, $ngayketthuc, $ngaybatdau, $ngayketthuc];
    $types = "ssss";

    // 2. Xây dựng câu SQL cơ bản
    $query = "SELECT 
        sp.masp AS ID_SanPham,
        COALESCE(nhap.SoLuongNhap, 0) AS SoLuongNhap,
        COALESCE(xuat.SoLuongXuat, 0) AS SoLuongXuat,
        sp.tensp,
        sp.tacgia,
        sp.danhmuc,
        sp.link
    FROM sanpham sp
    LEFT JOIN (
        SELECT ctpn.masp, SUM(ctpn.soluong) AS SoLuongNhap
        FROM chitietphieunhap ctpn
        INNER JOIN phieunhap pn ON pn.mapn = ctpn.mapn
        WHERE pn.ngaynhap BETWEEN ? AND ?
        GROUP BY ctpn.masp
    ) AS nhap ON sp.masp = nhap.masp
    LEFT JOIN (
        SELECT cthd.masp, SUM(cthd.soluong) AS SoLuongXuat
        FROM chitietdonhang cthd
        INNER JOIN donhang hd ON hd.madh = cthd.madh
        WHERE DATE(hd.ngaydat) BETWEEN ? AND ? and (hd.trangthaidon=3 or hd.trangthaidon=4)
        GROUP BY cthd.masp
    ) AS xuat ON sp.masp = xuat.masp
    WHERE (nhap.masp IS NOT NULL OR xuat.masp IS NOT NULL)";

    // 3. Kiểm tra nếu có tên sản phẩm thì nối thêm điều kiện WHERE
    if (!empty($tensp)) {
        $query .= " AND sp.tensp LIKE ?";
        $params[] = "%" . $tensp . "%"; // Tìm kiếm theo kiểu chứa chuỗi
        $types .= "s";
    }

    $query .= " ORDER BY sp.masp;";

    // 4. Thực thi truy vấn
    $stmt = $this->conn->prepare($query);
    
    // Sử dụng toán tử ... để truyền mảng tham số vào bind_param
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        return $stmt->get_result();
    }
    
    return false;
}
// 1. Lịch sử NHẬP (Lấy mapn)
public function getLichSuNhap($masp, $tungay, $denngay) {
    $sql = "SELECT pn.mapn, pn.ngaynhap as ngay, ctpn.soluong, ctpn.gianhap as gia
            FROM chitietphieunhap ctpn
            JOIN phieunhap pn ON ctpn.mapn = pn.mapn
            WHERE ctpn.masp = ? 
            AND pn.ngaynhap BETWEEN ? AND ?
            ORDER BY pn.ngaynhap DESC";
    
    $stmt = $this->conn->prepare($sql);
    
    // "iss": i = integer (masp), s = string (tungay), s = string (denngay)
    $stmt->bind_param("iss", $masp, $tungay, $denngay);
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Trả về mảng dữ liệu giống fetchAll(PDO::FETCH_ASSOC)
    return $result->fetch_all(MYSQLI_ASSOC);
}

// 2. Lịch sử XUẤT (Lấy madh)
public function getLichSuXuat($masp, $tungay, $denngay) {
    $sql = "SELECT dh.madh, dh.ngaydat as ngay, ctdh.soluong,dh.tongtien
            FROM chitietdonhang ctdh
            JOIN donhang dh ON ctdh.madh = dh.madh
            WHERE ctdh.masp = ? 
            AND DATE(dh.ngaydat) BETWEEN ? AND ?
            AND (dh.trangthaidon=3 or dh.trangthaidon=4)
            ORDER BY dh.ngaydat DESC";
    
    $stmt = $this->conn->prepare($sql);
    
    // "iss": i = integer, s = string, s = string
    $stmt->bind_param("iss", $masp, $tungay, $denngay);
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_all(MYSQLI_ASSOC);
}
/**
 * Kiểm tra xem một sản phẩm còn đủ hàng hay không (Tối ưu)
 * @param int $masp Mã sản phẩm
 * @param int $soluong_can Số lượng khách muốn mua
 * @return bool True nếu đủ hàng, False nếu không đủ
 */
public function checkTonKhoSP($masp, $soluong_can) {
    // Chỉ truy vấn duy nhất cột tonkho từ bảng sanpham
    $query = "SELECT tonkho FROM sanpham WHERE masp = ? LIMIT 1";

    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $masp);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            // So sánh trực tiếp giá trị tồn kho có sẵn với số lượng cần
            return (int)$row['tonkho'] >= $soluong_can;
        }
    }

    return false; // Trả về false nếu không tìm thấy SP hoặc lỗi truy vấn
}
}
?>