# Website bán hàng triển khai bằng Docker

Đồ án môn **Quản trị mạng máy tính** — đề tài **Triển khai Docker trên Windows**.

Repository: https://github.com/NTK10072005/web-ban-hang-docker

## 1. Giới thiệu

Project triển khai website bán hàng sử dụng **PHP + Apache** và **MySQL** bằng Docker Compose. Mục tiêu là tạo môi trường chạy thống nhất, dễ khởi động lại và có thể kiểm thử trên **Windows (Docker Desktop)**, **Ubuntu Local** hoặc **Ubuntu VPS**.

> Đây là cấu hình phục vụ học tập và demo, **không phải cấu hình production an toàn**. MySQL hiện cho phép mật khẩu root rỗng và cổng 3306 được publish ra máy host. Không triển khai nguyên trạng trên VPS công khai.

## 2. Công nghệ sử dụng

| Thành phần            | Công nghệ / cấu hình                          |
| --------------------- | --------------------------------------------- |
| Web server            | Apache, PHP 8.1 (`php:8.1-apache`)            |
| PHP extensions        | `mysqli`, `pdo`, `pdo_mysql`, `curl`          |
| Apache                | Bật `mod_rewrite`                             |
| Database              | MySQL 8.0                                     |
| Database mặc định     | `web2`                                        |
| Công cụ triển khai    | Docker, Docker Compose                        |
| Cổng truy cập website | `8080` trên máy host → `80` trong container   |
| Cổng MySQL            | `3306` trên máy host → `3306` trong container |
| Lưu trữ MySQL         | Named volume `db_data`                        |

## 3. Kiến trúc hệ thống

```text
Trình duyệt trên máy host
         |
         | http://localhost:8080
         v
  Host port 8080 -> Container port 80
         |
         v
+-----------------------------------------+
|        Docker Compose network           |
|                                         |
|  +----------------+   +---------------+ |
|  | web            |-->| db            | |
|  | PHP + Apache   |   | MySQL 8.0     | |
|  | Port 80        |   | Port 3306     | |
|  +----------------+   +---------------+ |
|       ^                       ^         |
+-------|-----------------------|---------+
        |                       |
  Bind mount                 Named volume
  ./:/var/www/html          db_data:/var/lib/mysql
```

Hai service giao tiếp qua mạng mặc định của Docker Compose. Trong cấu hình PHP, **hostname MySQL là `db`**, không phải `localhost` (khi PHP chạy bên trong container `web`).

### Vai trò hai file Docker

- **`Dockerfile`**: tạo image cho dịch vụ web từ `php:8.1-apache`, cài thư viện và PHP extensions cần thiết, bật Apache `mod_rewrite`.
- **`docker-compose.yml`**: định nghĩa hai service `web` và `db`, cấu hình build, port mapping, bind mount, volume và thứ tự khởi động.

Mã nguồn được bind mount từ thư mục repository vào `/var/www/html` trong container web. Các file SQL hoặc script khởi tạo (nếu có) được lấy từ thư mục `database/` và mount vào `/docker-entrypoint-initdb.d`.

## 4. Yêu cầu trước khi chạy

- Đã cài **Git**.
- Đã cài **Docker** và hỗ trợ lệnh `docker compose`.
- **Windows:** Docker Desktop đang chạy, sử dụng **Linux containers** (thông thường qua WSL 2).
- **Ubuntu Local/VPS:** Docker Engine và Docker Compose plugin đang hoạt động.
- Cổng **8080** chưa bị ứng dụng khác chiếm dụng. Cổng **3306** cũng cần trống với cấu hình Compose hiện tại.

Kiểm tra Docker:

```bash
docker --version
docker compose version
```

## 5. Cài đặt và chạy project

Các lệnh sau sử dụng được trong PowerShell trên Windows hoặc Terminal trên Ubuntu (nếu tài khoản đã có quyền chạy Docker):

**Bước 1 — Clone repository**

```bash
git clone https://github.com/NTK10072005/web-ban-hang-docker.git
cd web-ban-hang-docker
```

**Bước 2 — Kiểm tra cấu hình**

```bash
docker compose config
```

**Bước 3 — Build và khởi chạy**

```bash
docker compose up -d --build
```

Ở lần đầu, Docker cần tải image và khởi tạo database; hãy chờ MySQL sẵn sàng trước khi thử chức năng liên quan đến dữ liệu.

**Bước 4 — Xem trạng thái container**

```bash
docker compose ps
```

**Bước 5 — Truy cập website**

- Trên máy chạy Docker: **http://localhost:8080**
- Trên Ubuntu VPS: `http://<IP_PUBLIC_VPS>:8080` nếu cổng 8080 được publish, firewall cho phép và máy chủ có thể truy cập từ bên ngoài. Chỉ mở cổng cần thiết và bảo vệ ứng dụng trước khi cho truy cập Internet.

## 6. Kiểm tra hoạt động

### Kiểm tra log

```bash
docker compose logs --tail=100 web
docker compose logs --tail=100 db
```

### Kiểm tra kết nối tên service trong mạng Docker

```bash
docker compose exec web getent hosts db
```

### Kiểm tra các bảng trong MySQL

Lệnh dưới đây tương ứng với **cấu hình demo hiện tại** (MySQL root không có mật khẩu):

```bash
docker compose exec db mysql -uroot -e "USE web2; SHOW TABLES;"
```

Nếu danh sách bảng trống hoặc báo thiếu bảng, hãy kiểm tra nội dung thư mục `database/`, log của `db` và việc khởi tạo SQL.

### Kiểm tra lưu trữ dữ liệu

1. Thực hiện một thao tác ghi dữ liệu thử trên website (nếu chức năng cho phép).
2. Dừng và tạo lại các container:

```bash
docker compose down
docker compose up -d
```

3. Kiểm tra dữ liệu thử còn tồn tại hay không.

**Không dùng `docker compose down -v` để kiểm tra**, vì tùy chọn `-v` xóa named volume và có thể làm mất dữ liệu MySQL.

## 7. Các lệnh quản lý thường dùng

| Lệnh                           | Công dụng                                                            |
| ------------------------------ | -------------------------------------------------------------------- |
| `docker compose up -d --build` | Build và khởi động các service                                       |
| `docker compose ps`            | Xem trạng thái các service                                           |
| `docker compose logs -f`       | Theo dõi log                                                         |
| `docker compose stop`          | Dừng các container                                                   |
| `docker compose start`         | Khởi động lại container đã dừng                                      |
| `docker compose down`          | Dừng và xóa container/network của project, giữ named volume mặc định |
| `docker volume ls`             | Liệt kê Docker volumes                                               |
| `docker network ls`            | Liệt kê Docker networks                                              |

## 8. Lỗi thường gặp

**Không truy cập được `localhost:8080`:** Kiểm tra Docker Desktop/Engine đã chạy, `docker compose ps`, log của service `web` và xem cổng 8080 có bị chiếm dụng không.

**Không kết nối được database:** Kiểm tra service `db` đã sẵn sàng, cấu hình kết nối PHP dùng hostname `db`, database `web2` và thông tin đăng nhập khớp với cấu hình thực tế.

**Lỗi cổng 3306 đã được sử dụng:** Máy có thể đang chạy MySQL/XAMPP khác. Nếu không cần kết nối MySQL từ host, có thể bỏ phần `ports` của service `db` trong Compose; web vẫn truy cập được `db:3306` qua Docker network. Sau khi sửa cần chạy lại Compose.

**Không thấy dữ liệu mẫu:** Thư mục `database/` được dùng để khởi tạo MySQL **chỉ khi thư mục dữ liệu của MySQL còn trống**. Việc chạy lại `docker compose up` không tự import SQL vào volume đã tồn tại. Sao lưu dữ liệu trước khi cân nhắc khởi tạo lại.

**Chạy trên Ubuntu gặp lỗi file/đường dẫn:** Kiểm tra phân biệt chữ hoa–chữ thường trong tên file và quyền truy cập thư mục được mount.

## 9. Lưu ý bảo mật và giới hạn

- `MYSQL_ALLOW_EMPTY_PASSWORD: "yes"` chỉ phục vụ demo; **không dùng mật khẩu rỗng trên hệ thống public**.
- Cấu hình hiện publish cổng MySQL `3306` ra host. Trên VPS, nên bỏ port mapping này nếu không có nhu cầu truy cập MySQL từ ngoài Docker.

## 10. Tài liệu tham khảo

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Desktop trên Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

---
