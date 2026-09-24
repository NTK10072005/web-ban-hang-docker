<?php
// File: be/config/database.php

class Database {
    private $host = "db";
    private $db_name = "web2";
    private $username = "root";
    private $password = "";
    private $conn;
    
    public function getConnection() {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
        
        // Kiểm tra kết nối
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
        
        // Đặt charset UTF-8
        $this->conn->set_charset("utf8mb4");
        
        return $this->conn;
    }
}
?>