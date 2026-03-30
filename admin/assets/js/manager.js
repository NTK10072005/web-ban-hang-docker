///////////////////////////////////QUẢN LÝ KHÁCH HÀNG/////////////////////////////////////////////////
const CustomerManagement = {
    allCustomers: [],
    currentPage: 1,
    itemsPerPage: 5,

    async loaddatakhachhang() {
        try {
            const response = await fetch('http://localhost/web2/controller/customer.php');
            const result = await response.json();

            if (result.success) {
                this.allCustomers = result.data.data;
                this.renderCustomerManagementPage();
            } else {
                this.showError('Không thể tải dữ liệu khách hàng');
            }
        } catch (error) {
            this.showError('Đã xảy ra lỗi khi kết nối đến server');
        }
    },

    renderCustomerManagementPage() {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
            <nav style="margin-bottom: 1.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); background-color: white;">
                <ol style="list-style: none; margin: 0; padding: 0;">
                    <li style="color: #e91e63; font-size: 1rem; font-weight: 600;">Quản lý khách hàng</li>
                </ol>
            </nav>
            <div style="margin-bottom:1.2rem;text-align:right;">
                <button class="btn-add" onclick="CustomerManagement.showAddCustomerForm()">
                    <i class="material-icons-round">add_box</i> Thêm tài khoản
                </button>
            </div>
            <div class="search-section">
                <div class="search-group">
                    <label class="search-label" for="customer-name">Tìm theo họ tên</label>
                    <input type="text" id="customer-name" class="search-input" placeholder="Nhập họ tên...">
                </div>
                
                <div class="search-group">
                    <label class="search-label" for="customer-account">Tìm theo tài khoản</label>
                    <input type="text" id="customer-account" class="search-input" placeholder="Nhập tài khoản...">
                </div>
                
                <div class="search-group">
                    <label class="search-label" for="customer-status">Trạng thái</label>
                    <select id="customer-status" class="search-select">
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Đã khóa</option>
                    </select>
                </div>
                
                <button class="btn-search" id="search-btn" onclick="CustomerManagement.handleSearch()">
                    <i class="material-icons-round">search</i> Tìm kiếm
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Tài khoản</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="customers-table-body"></tbody>
            </table>

            <div class="pagination" id="pagination-container"></div>
            <div class="pagination-info" id="pagination-info"></div>
        `;
        
        this.renderCustomers();
        this.renderPagination();
    },

    renderCustomers() {
        const tableBody = document.getElementById('customers-table-body');
        tableBody.innerHTML = '';
        
        if (this.allCustomers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">Không có dữ liệu</td></tr>';
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.allCustomers.length);
        const currentCustomers = this.allCustomers.slice(startIndex, endIndex);
        
        currentCustomers.forEach((customer, index) => {
            const row = document.createElement('tr');
            const stt = startIndex + index + 1;
            const status = customer.trangthai === "1" ? "active" : "locked";
            const statusClass = status === "active" ? "status-active" : "status-locked";
            const statusIcon = status === "active" ? "check_circle" : "lock";
            const statusText = status === "active" ? "Hoạt động" : "Đã khóa";
            const fullAddress = `${customer.thanhpho}`;
            const username = customer.email;
            
            row.innerHTML = `
                <td>${stt}</td>
                <td>${customer.hoten}</td>
                <td>${username}</td>
                <td>${customer.sdt}</td>
                <td>${fullAddress}</td>
                <td><span class="status-badge ${statusClass}"><i class="material-icons-round">${statusIcon}</i>${statusText}</span></td>
                <td>
                    <div class="actions">
                        ${status === "active" ? `<button class="btn btn-delete" onclick="CustomerManagement.editTrangThai(${customer.makh}, 0)">Khóa</button>` : `<button class="btn btn-edit" onclick="CustomerManagement.editTrangThai(${customer.makh}, 1)">Hủy Khóa</button>`}
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        this.updatePaginationInfo();
    },

    renderPagination() {
        const paginationElement = document.getElementById('pagination-container');
        paginationElement.innerHTML = '';
        
        const totalPages = Math.ceil(this.allCustomers.length / this.itemsPerPage);
        
        if (totalPages <= 1) return;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.id = 'prev-btn';
        prevBtn.innerHTML = '<i class="material-icons-round">chevron_left</i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderCustomers();
                this.renderPagination();
            }
        };
        paginationElement.appendChild(prevBtn);
        
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                this.createPageButton(paginationElement, i);
            }
        } else {
            this.createPageButton(paginationElement, 1);
            
            if (this.currentPage > 3) {
                const dots1 = document.createElement('span');
                dots1.textContent = '...';
                dots1.style.padding = '0 8px';
                dots1.style.display = 'inline-block';
                dots1.style.color = '#666';
                paginationElement.appendChild(dots1);
            }
            
            let startPage = Math.max(2, this.currentPage - 1);
            let endPage = Math.min(totalPages - 1, this.currentPage + 1);
            
            if (this.currentPage <= 3) {
                startPage = 2;
                endPage = Math.min(4, totalPages - 1);
            } else if (this.currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
                endPage = totalPages - 1;
            }
            
            for (let i = startPage; i <= endPage; i++) {
                this.createPageButton(paginationElement, i);
            }
            
            if (this.currentPage < totalPages - 2) {
                const dots2 = document.createElement('span');
                dots2.textContent = '...';
                dots2.style.padding = '0 8px';
                dots2.style.display = 'inline-block';
                dots2.style.color = '#666';
                paginationElement.appendChild(dots2);
            }
            
            this.createPageButton(paginationElement, totalPages);
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.id = 'next-btn';
        nextBtn.innerHTML = '<i class="material-icons-round">chevron_right</i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderCustomers();
                this.renderPagination();
            }
        };
        paginationElement.appendChild(nextBtn);
    },

    createPageButton(container, pageNumber) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        if (pageNumber === this.currentPage) btn.classList.add('active');
        btn.textContent = pageNumber;
        btn.onclick = () => {
            this.currentPage = pageNumber;
            this.renderCustomers();
            this.renderPagination();
        };
        container.appendChild(btn);
    },

    updatePaginationInfo() {
        const paginationInfo = document.getElementById('pagination-info');
        if (this.allCustomers.length === 0) {
            paginationInfo.textContent = 'Hiển thị 0-0 của 0 khách hàng';
            return;
        }
        
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.allCustomers.length);
        paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} của ${this.allCustomers.length} khách hàng`;
    },

    showError(message) {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `<div style="text-align: center; padding: 3rem; color: #e91e63;">${message}</div>`;
    },

    showAddCustomerForm() {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
            <nav style="margin-bottom: 1.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); background-color: white;">
                <ol style="list-style: none; margin: 0; padding: 0;">
                    <li style="color: #e91e63; font-size: 1rem; font-weight: 600;">Thêm tài khoản khách hàng</li>
                </ol>
            </nav>
            
            <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <form id="add-customer-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Họ tên *</label>
                            <input type="text" id="hoten" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Email *</label>
                            <input type="email" id="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Số điện thoại *</label>
                            <input type="tel" id="sdt" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Tỉnh/Thành phố *</label>
                            <select id="thanhpho" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                <option value="">Chọn tỉnh/thành phố</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Cần Thơ">Cần Thơ</option>
                                <option value="Hải Phòng">Hải Phòng</option>
                                <option value="Nha Trang">Nha Trang</option>
                                <option value="Đà Lạt">Đà Lạt</option>
                                <option value="Vũng Tàu">Vũng Tàu</option>
                                <option value="Huế">Huế</option>
                                <option value="Buôn Ma Thuột">Buôn Ma Thuột</option>
                                <option value="Vinh">Vinh</option>
                                <option value="Quy Nhơn">Quy Nhơn</option>
                                <option value="Long Xuyên">Long Xuyên</option>
                                <option value="Thái Nguyên">Thái Nguyên</option>
                                <option value="Nam Định">Nam Định</option>
                                <option value="Rạch Giá">Rạch Giá</option>
                                <option value="Thái Bình">Thái Bình</option>
                                <option value="Thanh Hóa">Thanh Hóa</option>
                                <option value="Hạ Long">Hạ Long</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Phường/Xã *</label>
                            <select id="phuongxa" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                <option value="">Chọn phường/xã</option>
                                <option value="Phường 1">Phường 1</option>
                                <option value="Phường 2">Phường 2</option>
                                <option value="Phường 3">Phường 3</option>
                                <option value="Phường 4">Phường 4</option>
                                <option value="Phường 5">Phường 5</option>
                                <option value="Phường 6">Phường 6</option>
                                <option value="Phường 7">Phường 7</option>
                                <option value="Phường 8">Phường 8</option>
                                <option value="Phường 9">Phường 9</option>
                                <option value="Phường 10">Phường 10</option>
                                <option value="Phường 11">Phường 11</option>
                                <option value="Phường 12">Phường 12</option>
                                <option value="Phường 13">Phường 13</option>
                                <option value="Phường 14">Phường 14</option>
                                <option value="Phường 15">Phường 15</option>
                                <option value="Phường 16">Phường 16</option>
                                <option value="Phường 17">Phường 17</option>
                                <option value="Phường 18">Phường 18</option>
                                <option value="Phường 19">Phường 19</option>
                                <option value="Phường 20">Phường 20</option>
                                <option value="Phường An Khánh">Phường An Khánh</option>
                                <option value="Phường An Lợi Đông">Phường An Lợi Đông</option>
                                <option value="Phường An Phú">Phường An Phú</option>
                                <option value="Phường Bình An">Phường Bình An</option>
                                <option value="Phường Bình Khánh">Phường Bình Khánh</option>
                                <option value="Phường Bình Trưng Đông">Phường Bình Trưng Đông</option>
                                <option value="Phường Bình Trưng Tây">Phường Bình Trưng Tây</option>
                                <option value="Phường Cát Lái">Phường Cát Lái</option>
                                <option value="Phường Long Bình">Phường Long Bình</option>
                                <option value="Phường Long Phước">Phường Long Phước</option>
                                <option value="Phường Long Thạnh Mỹ">Phường Long Thạnh Mỹ</option>
                                <option value="Phường Long Trường">Phường Long Trường</option>
                                <option value="Phường Phú Hữu">Phường Phú Hữu</option>
                                <option value="Phường Phước Bình">Phường Phước Bình</option>
                                <option value="Phường Phước Long A">Phường Phước Long A</option>
                                <option value="Phường Phước Long B">Phường Phước Long B</option>
                                <option value="Phường Tân Hưng">Phường Tân Hưng</option>
                                <option value="Phường Tân Kiểng">Phường Tân Kiểng</option>
                                <option value="Phường Tân Phong">Phường Tân Phong</option>
                                <option value="Phường Tân Phú">Phường Tân Phú</option>
                                <option value="Phường Tân Quy">Phường Tân Quy</option>
                                <option value="Phường Tân Thuận Đông">Phường Tân Thuận Đông</option>
                                <option value="Phường Tân Thuận Tây">Phường Tân Thuận Tây</option>
                                <option value="Phường Thảo Điền">Phường Thảo Điền</option>
                                <option value="Phường Chợ Quán">Phường Chợ Quán</option>
                                <option value="Phường Thủ Thiêm">Phường Thủ Thiêm</option>
                                <option value="Phường Trường Thạnh">Phường Trường Thạnh</option>
                                <option value="Xã Bình Chánh">Xã Bình Chánh</option>
                                <option value="Xã Cần Thạnh">Xã Cần Thạnh</option>
                                <option value="Xã Long Hòa">Xã Long Hòa</option>
                                <option value="Xã Lý Nhơn">Xã Lý Nhơn</option>
                                <option value="Xã Nhơn Đức">Xã Nhơn Đức</option>
                                <option value="Xã Phú Xuân">Xã Phú Xuân</option>
                                <option value="Xã Vĩnh Lộc A">Xã Vĩnh Lộc A</option>
                                <option value="Xã Vĩnh Lộc B">Xã Vĩnh Lộc B</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Số nhà *</label>
                            <input type="text" id="sonha" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Mật khẩu *</label>
                            <input type="password" id="matkhau" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #344767;">Xác nhận mật khẩu *</label>
                            <input type="password" id="xacnhan_matkhau" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1.5rem;">
                        <button type="button" onclick="CustomerManagement.loaddatakhachhang()" style="padding: 0.75rem 1.5rem; border: 1px solid #ddd; border-radius: 6px; background: #e0e0e0; color: #344767; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                            <i class="material-icons-round" style="font-size: 18px; vertical-align: middle; margin-right: 5px;">arrow_back</i>
                            Quay về
                        </button>
                        <button type="submit" style="padding: 0.75rem 1.5rem; border: none; border-radius: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                            <i class="material-icons-round" style="font-size: 18px; vertical-align: middle; margin-right: 5px;">add</i>
                            Thêm tài khoản
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Thêm sự kiện submit cho form
        document.getElementById('add-customer-form').addEventListener('submit', (e) => this.handleAddCustomer(e));
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^[0-9]{10,11}$/;
        return re.test(phone);
    },

    async handleAddCustomer(event) {
        event.preventDefault();
        
        // Lấy giá trị từ form
        const hoten = document.getElementById('hoten').value.trim();
        const email = document.getElementById('email').value.trim();
        const sdt = document.getElementById('sdt').value.trim();
        const thanhpho = document.getElementById('thanhpho').value;
        const phuongxa = document.getElementById('phuongxa').value;
        const sonha = document.getElementById('sonha').value.trim();
        const matkhau = document.getElementById('matkhau').value;
        const xacnhan_matkhau = document.getElementById('xacnhan_matkhau').value;
        
        // Kiểm tra mật khẩu
        if (matkhau !== xacnhan_matkhau) {
            this.showNotification('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
            return;
        }
        
        // Kiểm tra độ dài mật khẩu
        if (matkhau.length < 6) {
            this.showNotification('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự', 'error');
            return;
        }
        if (!this.validateEmail(email)) {
            this.showNotification('Lỗi', 'Email không hợp lệ! Vui lòng nhập đúng định dạng email.', 'error');
            document.getElementById('email').focus();
            return;
        }
        if (!this.validatePhone(sdt)) {
            this.showNotification('Lỗi', 'Số điện thoại phải có 10-11 chữ số!', 'error');
            document.getElementById('sdt').focus();
            return;
        }
        
        // Tạo FormData
        const formData = new FormData();
        formData.append('hoten', hoten);
        formData.append('email', email);
        formData.append('sdt', sdt);
        formData.append('thanhpho', thanhpho);
        formData.append('phuongxa', phuongxa);
        formData.append('sonha', sonha);
        formData.append('password', matkhau);
        formData.append('username', email.split('@')[0]);

        try {
            // Gửi request đến API
            const response = await fetch('http://localhost/web2/controller/customer.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Hiển thị thông báo thành công
                this.showNotification('Thành công', 'Thêm tài khoản thành công', 'success');
                
                // Đợi 1.5 giây rồi quay về danh sách
                setTimeout(() => {
                    this.loaddatakhachhang();
                }, 1500);
            } else {
                // Hiển thị thông báo lỗi
                this.showNotification('Thất bại', result.message || 'Không thể thêm tài khoản', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi thêm khách hàng:', error);
            this.showNotification('Lỗi', 'Đã xảy ra lỗi khi kết nối đến server', 'error');
        }
    },

    showNotification(title, message, type) {
        const notification = document.getElementById('notification');
        const notificationIcon = document.getElementById('notification-icon');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');
        
        // Đặt nội dung
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        
        // Đặt màu sắc và icon theo loại thông báo
        if (type === 'success') {
            notification.style.background = '#d4edda';
            notification.style.color = '#155724';
            notification.style.border = '1px solid #c3e6cb';
            notificationIcon.textContent = 'check_circle';
            notificationIcon.style.color = '#28a745';
        } else if (type === 'error') {
            notification.style.background = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.border = '1px solid #f5c6cb';
            notificationIcon.textContent = 'error';
            notificationIcon.style.color = '#dc3545';
        } else if (type === 'warning') {
            notification.style.background = '#fff3cd';
            notification.style.color = '#856404';
            notification.style.border = '1px solid #ffeaa7';
            notificationIcon.textContent = 'warning';
            notificationIcon.style.color = '#ffc107';
        } else {
            notification.style.background = '#d1ecf1';
            notification.style.color = '#0c5460';
            notification.style.border = '1px solid #bee5eb';
            notificationIcon.textContent = 'info';
            notificationIcon.style.color = '#17a2b8';
        }
        
        // Hiển thị thông báo
        notification.style.display = 'block';
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    },

    showConfirmationModal(customer, newStatus) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Xác nhận thay đổi</h3>
                    <button class="modal-close" onclick="CustomerManagement.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p id="modal-message"></p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="CustomerManagement.closeModal()">Hủy</button>
                    <button class="btn-confirm" onclick="CustomerManagement.confirmStatusChange()">Đồng ý</button>
                </div>
            </div>
        `;
        
        // Thêm CSS cho modal
        const style = document.createElement('style');
        style.textContent = `
            .modal-header h3 {
                margin: 0;
                color: #344767;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            }
            .modal-header {
                padding: 1rem;
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            .modal-close {
                position: absolute;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6c757d;
            }
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                overflow: hidden;
            }
            .modal-body {
                padding: 1.5rem;
                font-size: 16px;
                color: #495057;
            }
            .modal-footer {
                padding: 1rem;
                background: #f8f9fa;
                border-top: 1px solid #dee2e6;
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }
            .btn-cancel {
                padding: 0.5rem 1rem;
                border: 1px solid #6c757d;
                border-radius: 4px;
                background: white;
                color: #6c757d;
                cursor: pointer;
            }
            .btn-confirm {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                background: linear-gradient(195deg, #e91e63, #9c27b0);
                color: white;
                cursor: pointer;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Lưu dữ liệu vào modal để sử dụng sau
        modal.dataset.makh = customer.makh;
        modal.dataset.hoten = customer.hoten;
        modal.dataset.email = customer.email;
        modal.dataset.sdt = customer.sdt;
        modal.dataset.phuongxa = customer.phuongxa;
        modal.dataset.thanhpho = customer.thanhpho;
        modal.dataset.sonha = customer.sonha;
        modal.dataset.trangthai = newStatus;

        // Thiết lập nội dung message
        const messageElement = modal.querySelector('#modal-message');
        if (newStatus === 0) {
            messageElement.textContent = 'Bạn có chắc chắn muốn khóa khách hàng này?';
        } else if (newStatus === 1) {
            messageElement.textContent = 'Bạn có chắc chắn muốn khôi phục khách hàng này?';
        }
    },

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    },

    async confirmStatusChange() {
        const modal = document.querySelector('.modal-overlay');
        if (!modal) return;
        
        const makh = modal.dataset.makh;
        const hoten = modal.dataset.hoten;
        const email = modal.dataset.email;
        const sdt = modal.dataset.sdt;
        const phuongxa = modal.dataset.phuongxa;
        const thanhpho = modal.dataset.thanhpho;
        const sonha = modal.dataset.sonha;
        const trangthai = modal.dataset.trangthai;
        
        try {
            // Tạo FormData
            const formData = new FormData();
            formData.append('hoten', hoten);
            formData.append('makh', makh);
            formData.append('email', email);
            formData.append('sdt', sdt);
            formData.append('sonha', sonha);
            formData.append('phuongxa', phuongxa);
            formData.append('thanhpho', thanhpho);
            formData.append('trangthai', trangthai);
            
            // Gọi API
            const response = await fetch('http://localhost/web2/controller/customer.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                // Hiển thị thông báo thành công
                this.showNotification('Thành công', 'Cập nhật trạng thái thành công!', 'success');
                
                // Tải lại dữ liệu
                this.loaddatakhachhang();
            } else {
                // Hiển thị thông báo thất bại
                this.showNotification('Thất bại', 'Cập nhật trạng thái thất bại!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            this.showNotification('Lỗi', 'Đã xảy ra lỗi khi kết nối đến server', 'error');
        } finally {
            this.closeModal();
        }
    },

    editTrangThai(makh, newStatus) {
        const customer = this.allCustomers.find(c => c.makh == makh);
        if (newStatus === 0) {
            this.showConfirmationModal(customer, newStatus);
        } else if (newStatus === 1) {
            this.showConfirmationModal(customer, newStatus);
        }
    },

    async handleSearch() {
        // Lấy giá trị từ các trường tìm kiếm
        const nameFilter = document.getElementById('customer-name').value.trim();
        const accountFilter = document.getElementById('customer-account').value.trim();
        const statusFilter = document.getElementById('customer-status').value;
        
        // Kiểm tra nếu cả 3 trường đều trống
       
        
        try {
            // Tạo URL với các tham số tìm kiếm
            let searchUrl = 'http://localhost/web2/controller/customer.php?action=searchnangcao';
            
            // Thêm các tham số nếu có giá trị
            if (nameFilter) {
                searchUrl += `&hoten=${encodeURIComponent(nameFilter)}`;
            }
            if (accountFilter) {
                searchUrl += `&username=${encodeURIComponent(accountFilter)}`;
            }
            if (statusFilter) {
                searchUrl += `&trangthai=${encodeURIComponent(statusFilter)}`;
            }
            // Gửi request GET đến API
            const response = await fetch(searchUrl, {
                method: 'GET'
            });
            
            const result = await response.json();
            if (result.success) {
                this.allCustomers = result.data.data;
                this.currentPage=1;
                this.renderCustomerManagementPage();
            } else {
                this.showError('Không thể tải dữ liệu khách hàng');
            }
        } catch (error) {
            this.showError('Đã xảy ra lỗi khi kết nối đến server');
        }
    }
};

///////////////////////////////////QUẢN LÝ ĐƠN HÀNG/////////////////////////////////////////////////
const OrderManagement = {
    allOrders: [],
    currentPage: 1,
    ordersPerPage: 5,

    async loaddatadonhang() {
        try {
            const response = await fetch('http://localhost/web2/controller/donhang.php?action=list', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Không thể kết nối đến máy chủ');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Có lỗi xảy ra khi tải dữ liệu');
            }

            this.allOrders = result.data.data || [];
            
            // Tạo HTML động cho trang quản lý đơn hàng
            this.renderOrderManagementPage();
            
            // Hiển thị dữ liệu trang đầu tiên
            this.displayOrders(this.currentPage);
            
            // Thêm sự kiện cho phân trang
            this.setupPagination();
            
            // Thêm sự kiện tìm kiếm
            this.setupSearchEvents();
            
        } catch (error) {
            console.error('Lỗi tải dữ liệu đơn hàng:', error);
            this.showNotification('error', 'Lỗi', error.message || 'Không thể tải dữ liệu đơn hàng');
        }
    },

    renderOrderManagementPage() {
        const main = document.querySelector('main');
        
        const orderManagementHTML = `
            <nav style="margin-bottom: 1.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); background-color: white;">
                <ol style="list-style: none; margin: 0; padding: 0;">
                    <li style="color: #e91e63; font-size: 1rem; font-weight: 600;">Quản lý đơn hàng</li>
                </ol>
            </nav>
            <!-- Search Form -->
            <div class="search-form" style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
                <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.5rem;">Tra cứu đơn hàng</h3>
                <div class="form-row" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 1rem;">
                    <div class="form-col" style="flex: 1; min-width: 200px;">
                        <div class="form-group">
                            <label class="form-label" for="from-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Từ ngày</label>
                            <input type="date" id="from-date" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    <div class="form-col" style="flex: 1; min-width: 200px;">
                        <div class="form-group">
                            <label class="form-label" for="to-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Đến ngày</label>
                            <input type="date" id="to-date" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    <div class="form-col" style="flex: 1; min-width: 200px;">
                        <div class="form-group">
                            <label class="form-label" for="order-status" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Tình trạng đơn hàng</label>
                            <select id="order-status" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white;">
                                <option value="">Tất cả trạng thái</option>
                                <option value="0">Chưa thanh toán</option>
                                <option value="1">Đã thanh toán</option>
                                <option value="2">Đang xử lý</option>
                                <option value="3">Đang giao</option>
                                <option value="4">Đã giao</option>
                                <option value="5">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-actions" style="display: flex; gap: 10px;">
                    <button class="btn-search" id="search-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">search</i> Tìm kiếm
                    </button>
                    <button class="btn-reset" id="reset-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">refresh</i> Đặt lại
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                         <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody id="orders-table-body">
                    <!-- Dữ liệu sẽ được điền động ở đây -->
                </tbody>
            </table>

            <!-- Phân trang -->
            <div class="pagination" id="pagination-container">
                <!-- Phân trang sẽ được tạo động -->
            </div>
            <div class="pagination-info" id="pagination-info">
                <!-- Thông tin phân trang sẽ được điền động -->
            </div>
        `;
        
        main.innerHTML = orderManagementHTML;
    },

    displayOrders(page) {
        this.currentPage = page;
        const startIndex = (page - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        const ordersToDisplay = this.allOrders.slice(startIndex, endIndex);
        
        const tableBody = document.getElementById('orders-table-body');
        
        if (!ordersToDisplay.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: #666;">
                        <i class="material-icons-round" style="font-size: 48px; color: #ddd; margin-bottom: 10px;">inbox</i>
                        <div>Không có đơn hàng nào</div>
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        
        ordersToDisplay.forEach((order, index) => {
            const stt = startIndex + index + 1;
            const formattedDate = this.formatDateTime(order.ngaydat);
            const formattedPrice = this.formatCurrency(order.tongtien);
            
            // Xác định trạng thái đơn hàng
            const statusInfo = this.getStatusInfo(order.trangthaidon);
            
            tableHTML += `
                <tr>
                    <td>${stt}</td>
                    <td>#DH${String(order.madh).padStart(3, '0')}</td>
                    <td>
                        ${order.tenkhachhang || 'Không có tên'}<br>
                        <small style="color:#888;">${order.tong_sanpham || 0} sản phẩm</small>
                    </td>
                    <td>${order.sdt || 'Không có số điện thoại'}</td>
                    <td>${formattedDate}</td>
                    <td>${formattedPrice}</td>
                    <td>${order.thanhtoan || 'Không có địa chỉ'}</td>
                    <td>
                        <span class="status-badge ${statusInfo.class}">
                            <i class="material-icons-round">${statusInfo.icon}</i>
                            ${statusInfo.text}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn btn-view" onclick="OrderManagement.viewOrder(${order.madh})" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: none; background: #1976d2; color: white; font-size: 13px; cursor: pointer;">
                                <i class="material-icons-round" style="font-size: 16px;">visibility</i>Xem
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
        
        // Cập nhật thông tin phân trang
        this.updatePaginationInfo();
    },

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    },

    getStatusInfo(statusCode) {
        const statusMap = {
            0: { text: 'Chưa thanh toán', class: 'status-unpaid', icon: 'money_off' },
            1: { text: 'Đã thanh toán', class: 'status-paid', icon: 'paid' },
            2: { text: 'Đang xử lý', class: 'status-pending', icon: 'pending' },
            3: { text: 'Đang giao', class: 'status-delivering', icon: 'local_shipping' },
            4: { text: 'Đã giao', class: 'status-delivered', icon: 'check_circle' },
            5: { text: 'Đã hủy', class: 'status-cancelled', icon: 'cancel' }
        };
        
        return statusMap[statusCode] || { text: 'Không xác định', class: 'status-unknown', icon: 'help' };
    },
    extractCityFromAddress(address) {
if (!address) return '';
const parts = address.split(',');
return parts[parts.length - 1].trim();
},

    setupPagination() {
        const totalPages = Math.ceil(this.allOrders.length / this.ordersPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = `
            <button class="pagination-btn" id="prev-btn" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="material-icons-round">chevron_left</i>
            </button>
        `;
        
        // Hiển thị các nút trang
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        
        paginationHTML += `
            <button class="pagination-btn" id="next-btn" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="material-icons-round">chevron_right</i>
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Thêm sự kiện cho các nút phân trang
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.displayOrders(this.currentPage - 1);
                this.setupPagination();
            }
        });
        
        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.displayOrders(this.currentPage + 1);
                this.setupPagination();
            }
        });
        
        // Thêm sự kiện cho các nút trang số
        document.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                this.displayOrders(page);
                this.setupPagination();
            });
        });
    },

    updatePaginationInfo() {
        const totalOrders = this.allOrders.length;
        const startIndex = (this.currentPage - 1) * this.ordersPerPage + 1;
        const endIndex = Math.min(startIndex + this.ordersPerPage - 1, totalOrders);
        
        const infoElement = document.getElementById('pagination-info');
        infoElement.innerHTML = `Hiển thị ${startIndex}-${endIndex} của ${totalOrders} đơn hàng`;
    },

     setupSearchEvents() {
        const searchBtn = document.getElementById('search-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSearch());
        }
    },

    async performSearch() {
        // Lấy giá trị từ các trường tìm kiếm
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    const status = document.getElementById('order-status').value;
    
    // Kiểm tra xem có ít nhất một tiêu chí được chọn không
   
    
    // Kiểm tra nếu có từ ngày và đến ngày thì từ ngày phải <= đến ngày
    if (fromDate && toDate && fromDate > toDate) {
        this.showNotification('error', 'Lỗi', 'Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
        return;
    }
    
    // Xây dựng URL với các tham số
    let searchUrl = 'http://localhost/web2/controller/donhang.php?action=timkiem';
    
    // Thêm các tham số nếu có giá trị
    if (fromDate) {
        searchUrl += `&tungay=${encodeURIComponent(fromDate)}`;
    }
    
    if (toDate) {
        searchUrl += `&denngay=${encodeURIComponent(toDate)}`;
    }
    
    // LƯU Ý: Sử dụng 'trangthaidon' thay vì 'trangthai' theo controller đã sửa
    if (status) {
        searchUrl += `&trangthaidon=${encodeURIComponent(status)}`;
    }
    try {
        const response = await fetch(searchUrl, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        console.log('Search result:', result); // Debug
        
        if (result.success) {
           this.allOrders = result.data.data || [];
            this.currentPage=1;
            // Tạo HTML động cho trang quản lý đơn hàng
            this.renderOrderManagementPage();
            // Hiển thị dữ liệu trang đầu tiên
            this.displayOrders(this.currentPage);
            
            // Thêm sự kiện cho phân trang
            this.setupPagination();
            
            // Thêm sự kiện tìm kiếm
            this.setupSearchEvents();
            
            // Hiển thị thông báo thành công
            this.showNotification('success', 'Thành công', 
                `Tìm thấy ${this.allOrders.length} đơn hàng phù hợp với tiêu chí`);
            
        } else {
            throw new Error(result.message || 'Có lỗi xảy ra khi tìm kiếm');

        }
        
    } catch (error) {
        console.error('Lỗi tìm kiếm đơn hàng:', error);
        this.showNotification('error', 'Lỗi', 'Không thể kết nối đến máy chủ');
    }
    },

    resetSearch() {
        // Reset tìm kiếm
        document.getElementById('from-date').value = '';
        document.getElementById('to-date').value = '';
        document.getElementById('order-status').value = '';
        
        // Load lại dữ liệu ban đầu
        this.loaddatadonhang();
    },

    

    addStatusStyles() {
        if (!document.getElementById('order-status-styles')) {
            const style = document.createElement('style');
            style.id = 'order-status-styles';
            style.textContent = `
                .status-unpaid {
                background-color: rgba(255, 152, 0, 0.1);
                color: #ef6c00;
                border: 1px solid #ffb74d;
            }
            .status-paid {
                background-color: rgba(76, 175, 80, 0.1);
                color: #2e7d32;
                border: 1px solid #81c784;
            }
            .status-pending {
                background-color: rgba(255, 193, 7, 0.1);
                color: #ff8f00;
                border: 1px solid #ffd54f;
            }
            .status-processing {
                background-color: rgba(33, 150, 243, 0.1);
                color: #1565c0;
                border: 1px solid #64b5f6;
            }
            .status-delivering {
                background-color: rgba(156, 39, 176, 0.1);
                color: #7b1fa2;
                border: 1px solid #ba68c8;
            }
            .status-delivered {
                background-color: rgba(76, 175, 80, 0.1);
                color: #2e7d32;
                border: 1px solid #81c784;
            }
            .status-completed {
                background-color: rgba(76, 175, 80, 0.1);
                color: #2e7d32;
                border: 1px solid #81c784;
            }
            .status-cancelled {
                background-color: rgba(244, 67, 54, 0.1);
                color: #c62828;
                border: 1px solid #ef9a9a;
            }
            .status-unknown {
                background-color: rgba(158, 158, 158, 0.1);
                color: #616161;
                border: 1px solid #bdbdbd;
            }
            `;
            document.head.appendChild(style);
        }
    },
    viewOrder: async function(orderId) {
    try {
        // Gọi API lấy chi tiết đơn hàng
        const response = await fetch(`http://localhost/web2/controller/donhang.php?action=chitiet&madh=${orderId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Không thể kết nối đến máy chủ');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
        }

        // Lấy dữ liệu đơn hàng
        const orderData = result.data;
        
        // Hiển thị giao diện chi tiết đơn hàng
        this.renderOrderDetail(orderData);
        
    } catch (error) {
        console.error('Lỗi tải chi tiết đơn hàng:', error);
        this.showNotification('error', 'Lỗi', error.message || 'Không thể tải chi tiết đơn hàng');
    }
},

renderOrderDetail: function(orderData) {
    const main = document.querySelector('main');
    
    // Định dạng các giá trị
    const formattedDate = this.formatDateTime(orderData.ngaydat);
    const formattedTotal = this.formatCurrency(orderData.tongtien);
    const statusInfo = this.getStatusInfo(orderData.trangthaidon);
    const formattedOrderId = `#DH${String(orderData.madh).padStart(3, '0')}`;
    
    // Tạo HTML cho danh sách sản phẩm
    let productRows = '';
    let totalProducts = 0;
    let totalQuantity = 0;
    
    if (orderData.chitiet && orderData.chitiet.length > 0) {
        orderData.chitiet.forEach((item, index) => {
            totalProducts++;
            totalQuantity += item.soluong;
            const formattedPrice = this.formatCurrency(item.gia);
            const formattedItemTotal = this.formatCurrency(item.thanhtien);
            
            productRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>#SP${String(item.masp).padStart(3, '0')}</td>
                    <td class="text-center">
                        <img src="../${item.link}" alt="${item.tensp}" class="product-image" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>${item.tensp}</td>
                    <td class="text-center">${item.soluong}</td>
                    <td class="text-right">${formattedPrice}</td>
                    <td class="text-right">${item.giamgia}</td>

                    <td class="text-right">${formattedItemTotal}</td>
                </tr>
            `;
        });
    } else {
        productRows = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                    Không có sản phẩm trong đơn hàng
                </td>
            </tr>
        `;
    }
    
    // Map trạng thái đơn hàng sang các option trong form
    const statusMapToOptionValue = {
        2: 'pending',    // Chờ xử lý -> pending
        3: 'shipped',    // Đang giao -> shipped
        4: 'delivered',  // Đã giao -> delivered
        5: 'cancelled'   // Đã hủy -> cancelled
    };
    
    const currentStatusValue = statusMapToOptionValue[orderData.trangthaidon] || '';
    
    // Tạo giao diện chi tiết đơn hàng
    const orderDetailHTML = `
        <nav style="margin-bottom: 1.5rem; background:white; padding:1rem 1.5rem; border-radius:0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <span style="color:#e91e63; font-weight:600;">Chi tiết đơn hàng</span>
        </nav>

        <div class="card" style="background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
            <div class="card-header" style="background: linear-gradient(195deg, #e91e63, #c2185b); color: white; padding: 1.25rem 1.5rem;">
                <h3 style="margin: 0; font-size: 1.2rem;">Thông tin đơn hàng ${formattedOrderId}</h3>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
                <!-- Thông tin khách hàng -->
                <div class="info-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.25rem; font-size: 1.1rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem;">Thông tin khách hàng</h3>
                    <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Họ và tên</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${orderData.tenkhachhang || 'Không có thông tin'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Số điện thoại</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${orderData.sdt || 'Không có thông tin'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Email</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${orderData.email || 'Không có thông tin'}</div>
                        </div>
                        <div class="info-item" style="grid-column: 1 / -1;">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Địa chỉ</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${orderData.diachi || 'Không có thông tin'}</div>
                        </div>
                    </div>
                </div>

                <!-- Thông tin đơn hàng -->
                <div class="info-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.25rem; font-size: 1.1rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem;">Thông tin đơn hàng</h3>
                    <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Mã đơn hàng</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${formattedOrderId}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Ngày đặt hàng</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${formattedDate}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Phương thức thanh toán</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${orderData.thanhtoan || 'Không xác định'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Trạng thái</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">
                                <span class="status-badge ${statusInfo.class}" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 14px;">
                                    <i class="material-icons-round" style="font-size: 16px;">${statusInfo.icon}</i>
                                    ${statusInfo.text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form cập nhật trạng thái -->
                <div class="info-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.25rem; font-size: 1.1rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem;">Cập nhật trạng thái</h3>
                    <form id="statusForm">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="statusSelect" class="form-label" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #344767;">Chọn trạng thái mới</label>
                            <select class="form-control" id="statusSelect" name="status" style="width: 100%; max-width: 300px; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                <option value="">Chọn trạng thái</option>
                                <option value="2" ${currentStatusValue === 'pending' ? 'selected' : ''}>Đang xử lý</option>
                               <option value="3" ${currentStatusValue === 'shipped' ? 'selected' : ''}>Đang giao </option>
                                <option value="4" ${currentStatusValue === 'delivered' ? 'selected' : ''}>Đã giao</option>
                                <option value="5" ${currentStatusValue === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-success" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;" onclick="OrderManagement.updateOrderStatus(${orderData.madh})">
                                <i class="material-icons-round" style="font-size: 18px;">save</i> Cập nhật trạng thái
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Danh sách sản phẩm -->
                <div class="info-section">
                    <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.25rem; font-size: 1.1rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem;">Danh sách sản phẩm</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">STT</th>
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Mã sản phẩm</th>
                                <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Hình ảnh</th>
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Tên sản phẩm</th>
                                <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Số lượng</th>
                                <th style="padding: 12px 15px; text-align: right; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Đơn giá</th>
                                 <th style="padding: 12px 15px; text-align: right; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Giảm giá(%)</th>

                                <th style="padding: 12px 15px; text-align: right; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                        </tbody>
                    </table>

                    <!-- Tổng kết -->
                    <div class="summary-card" style="background: #f8f9fa; border-radius: 8px; padding: 1.25rem; max-width: 400px; margin-left: auto;">
                        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                            <span style="color: #666;">Tổng số mặt hàng:</span>
                            <span style="font-weight: 500; color: #344767;">${totalProducts}</span>
                        </div>
                        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                            <span style="color: #666;">Tổng số lượng:</span>
                            <span style="font-weight: 500; color: #344767;">${totalQuantity}</span>
                        </div>
                        <div class="summary-row summary-total" style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 17px;">
                            <span style="font-weight: 600; color: #344767;">Tổng tiền hàng:</span>
                            <span style="font-weight: 700; color: #e91e63;">${formattedTotal}</span>
                        </div>
                    </div>
                </div>

                <!-- Nút hành động -->
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem;">
                    <button onclick="OrderManagement.goBackToList()" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">arrow_back</i> Quay về
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Cập nhật nội dung main
    main.innerHTML = orderDetailHTML;
    

},

goBackToList: function() {
    // Kiểm tra xem có đang trong luồng "Xem từ lịch sử" không?
    if (InventoryManagement.isFromHistory && InventoryManagement.lastHistoryContext) {
        InventoryManagement.isFromHistory = false; // Reset cờ

        // Mở lại tab Báo cáo tồn kho
        InventoryManagement.currentTab = 'inventory-report';
        InventoryManagement.loaddatatonkho();
        
        // Đợi 100ms để giao diện render xong rồi mới mở lại Modal
        setTimeout(() => {
            InventoryManagement.viewProductHistory(
                InventoryManagement.lastHistoryContext.id, 
                InventoryManagement.lastHistoryContext.name
            );
        }, 100);
    } else {
        // Nếu vào xem đơn hàng bình thường thì quay về danh sách đơn hàng
        this.loaddatadonhang();
    }
},
showNotification: function(type, title, message) {
    // Tạo thông báo tạm thời (có thể thay thế bằng thư viện thông báo của bạn)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(195deg, #4caf50, #388e3c)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(195deg, #f44336, #d32f2f)';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(195deg, #ff9800, #f57c00)';
    } else {
        notification.style.background = 'linear-gradient(195deg, #2196f3, #1976d2)';
    }
    
    notification.innerHTML = `
        <div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;">${title}</div>
        <div style="font-size: 14px;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
},
// Thêm hàm này vào object OrderManagement (trong phần renderOrderDetail)
updateOrderStatus: async function(orderId) {
    try {
        // Lấy giá trị trạng thái từ select
        const statusSelect = document.getElementById('statusSelect');
        const selectedStatus = statusSelect.value;
        
        // Kiểm tra nếu chưa chọn trạng thái
        if (!selectedStatus) {
            this.showNotification('warning', 'Cảnh báo', 'Vui lòng chọn trạng thái!');
            statusSelect.focus();
            return;
        }
        
        // Tạo đối tượng FormData
        const formData = new FormData();
        formData.append('action', 'sua');
        formData.append('madh', orderId);
        formData.append('trangthaidon', selectedStatus);
        
        // Gửi request đến API
        const response = await fetch('http://localhost/web2/controller/donhang.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            // Hiển thị thông báo thành công
            this.showNotification('success', 'Thành công', 'Cập nhật trạng thái đơn hàng thành công!');
            
            // Tải lại chi tiết đơn hàng sau 1.5 giây
            setTimeout(() => {
                this.viewOrder(orderId);
            }, 1500);
        } else {
            // Hiển thị thông báo thất bại
            this.showNotification('error', 'Lỗi','Không thể cập nhật vì trạng thái đơn hàng đã qua hoặc có trạng thái chưa thanh toán!');
        }
        
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        this.showNotification('error', 'Lỗi', 'Đã xảy ra lỗi khi kết nối đến server');
    }
}
};
///////////////////////////////////QUẢN LÝ SẢN PHẨM/////////////////////////////////////////////////
const ProductManagement = {
    allProducts: [],
    categories: [],
    currentPage: 1,
    itemsPerPage: 5,
    async fetchCategories() {
        try {
            const response = await fetch('http://localhost/web2/controller/danhmuc.php?action=alladmin');
            const result = await response.json();
            if (result.success) {
                this.categories = result.data;
            }
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    },
    async loaddatasanpham() {
        try {
            // Tải danh mục trước
            await this.fetchCategories();
            const response = await fetch('http://localhost/web2/controller/product.php?action=all', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Không thể kết nối đến máy chủ');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Có lỗi xảy ra khi tải dữ liệu');
            }

            this.allProducts = result.data.data || [];
            this.renderProductManagementPage();
            
        } catch (error) {
            console.error('Lỗi tải dữ liệu sản phẩm:', error);
            this.showNotification('error', 'Lỗi', error.message || 'Không thể tải dữ liệu sản phẩm');
        }
    },
generateCategoryOptions(selectedMadm = "") {
        return this.categories.map(cat => 
            `<option value="${cat.madm}" ${cat.madm === selectedMadm ? 'selected' : ''}>${cat.tendm}</option>`
        ).join('');
    },
    renderProductManagementPage() {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
            <nav style="margin-bottom:1rem;padding:0.75rem 1.5rem;border-radius:0.75rem;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);background:white;">
                <span style="color:#e91e63;font-size:1rem;font-weight:600;">Quản lý sản phẩm</span>
            </nav>

            <!-- Button Add Product -->
            <div style="margin-bottom:1.2rem;text-align:right;">
                <button class="btn-add" onclick="ProductManagement.showAddProductForm()">
                    <i class="material-icons-round">add_box</i> Thêm sản phẩm
                </button>
            </div>

            <!-- Search Section -->
            <div class="search-section">
                <div class="search-group">
                    <label class="search-label" for="product-name">Tìm theo tên</label>
                    <input type="text" id="product-name" class="search-input" placeholder="Nhập tên sản phẩm...">
                </div>
                
                <div class="search-group">
                    <label class="search-label" for="product-category">Tìm theo danh mục</label>
                    <select id="product-category" class="search-select">
                        <option value="">Tất cả danh mục</option>
                        ${this.generateCategoryOptions()}
                    </select>
                </div>
                
                <button class="btn-search" id="search-btn" onclick="ProductManagement.handleSearch()">
                    <i class="material-icons-round">search</i> Tìm kiếm
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Hình ảnh</th>
                        <th>Giá Bán</th>
                        <th>Giá Nhập</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="product-table-body">
                    <!-- Dữ liệu sẽ được điền động ở đây -->
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="pagination" id="pagination-container"></div>
            <div class="pagination-info" id="pagination-info"></div>
        `;
        
        this.renderProducts();
        this.renderPagination();
    },

    renderProducts() {
        const tableBody = document.getElementById('product-table-body');
        tableBody.innerHTML = '';
        
        if (this.allProducts.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Không có dữ liệu</td></tr>';
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.allProducts.length);
        const currentProducts = this.allProducts.slice(startIndex, endIndex);
        
        currentProducts.forEach((product, index) => {
            const row = document.createElement('tr');
            const stt = startIndex + index + 1;
            const status =( product.trangthai === "1" || product.trangthai === 1 )? "active" : "inactive";
            const statusClass = status === "active" ? "status-active" : "status-locked";
            const statusIcon = status === "active" ? "check_circle" : "block";
            const statusText = status === "active" ? "Hiển thị" : "Ẩn";
            const formattedPrice = this.formatCurrency(product.gia);
            const gianhap = this.formatCurrency(product.gianhap);
            const tonkho = this.formatCurrency(product.tonkho);

            
            // Map danh mục từ tiếng Anh sang tiếng Việt
           // Thay vì dùng categoryMap tĩnh, ta tìm trong this.categories
            const categoryObj = this.categories.find(c => c.madm === product.danhmuc);
            const categoryText = categoryObj ? categoryObj.tendm : product.danhmuc;
            
            row.innerHTML = `
                <td>${stt}</td>
                <td>
                    <div style="font-weight: 500; color: #344767;">${product.tensp}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">Tác giả: ${product.tacgia}</div>
                </td>
                <td>
                <img src="../${product.link}?t=${new Date().getTime()}" alt="${product.tensp}"
                         style="width:60px;height:80px;border-radius:6px;object-fit:cover;border:1px solid #eee;">
                </td>
                <td style="font-weight: 500; color: #e91e63;">
                    ${formattedPrice}
                </td>
                <td style="font-weight: 500; color: #e91e63;">
                    ${gianhap}
                </td>
                <td>
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                        ${categoryText}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px;">
                        <i class="material-icons-round" style="font-size: 14px;">${statusIcon}</i>
                        ${statusText}
                    </span>
                </td>
                <td>
                    <div class="actions" style="display: flex; gap: 8px;">
                        <button class="btn btn-edit" onclick="ProductManagement.editProduct(${product.masp})" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: none; background: #1976d2; color: white; font-size: 13px; cursor: pointer;">
                            <i class="material-icons-round" style="font-size: 16px;">edit</i>Sửa
                        </button>
                        ${status === "active" ?
                        `<button class="btn btn-delete" onclick="ProductManagement.deleteProduct(${product.masp})" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: none; background: #d32f2f; color: white; font-size: 13px; cursor: pointer;">
                    <i class="material-icons-round" style="font-size: 16px;">delete</i>Xóa
                </button>` :
                `<button class="btn btn-restore" onclick="ProductManagement.restoreProduct(${product.masp})" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: none; background: #4caf50; color: white; font-size: 13px; cursor: pointer;">
                    <i class="material-icons-round" style="font-size: 16px;">visibility</i>Hiện
                </button>`
        }
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        this.updatePaginationInfo();
    },

    formatCurrency(amount) {
        if (!amount) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    },
// Thêm vào trong ProductManagement object
restoreProduct: async function(productId) {
    try {
        // Gọi API với method PUT và action=restore
        const response = await fetch(`http://localhost/web2/controller/product.php?masp=${productId}&action=restore`, {
            method: 'PUT'
        });

        const result = await response.json();

        if (result.success) {
            this.showNotification('success', 'Thành công', 'Sản phẩm đã được hiển thị trở lại');
            // Tải lại dữ liệu để cập nhật bảng
            setTimeout(() => {
                this.loaddatasanpham();
            }, 1000);
        } else {
            this.showNotification('error', 'Thất bại', 'loi roi' || 'Không thể cập nhật trạng thái');
        }
    } catch (error) {
        console.error('Lỗi khi khôi phục sản phẩm:', error);
        this.showNotification('error', 'Lỗi', 'Đã xảy ra lỗi khi kết nối đến hệ thống');
    }
},
    renderPagination() {
        const paginationElement = document.getElementById('pagination-container');
        paginationElement.innerHTML = '';
        
        const totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
        
        if (totalPages <= 1) return;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.id = 'prev-btn';
        prevBtn.innerHTML = '<i class="material-icons-round">chevron_left</i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderProducts();
                this.renderPagination();
            }
        };
        paginationElement.appendChild(prevBtn);
        
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                this.createPageButton(paginationElement, i);
            }
        } else {
            this.createPageButton(paginationElement, 1);
            
            if (this.currentPage > 3) {
                const dots1 = document.createElement('span');
                dots1.textContent = '...';
                dots1.style.padding = '0 8px';
                dots1.style.display = 'inline-block';
                dots1.style.color = '#666';
                paginationElement.appendChild(dots1);
            }
            
            let startPage = Math.max(2, this.currentPage - 1);
            let endPage = Math.min(totalPages - 1, this.currentPage + 1);
            
            if (this.currentPage <= 3) {
                startPage = 2;
                endPage = Math.min(4, totalPages - 1);
            } else if (this.currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
                endPage = totalPages - 1;
            }
            
            for (let i = startPage; i <= endPage; i++) {
                this.createPageButton(paginationElement, i);
            }
            
            if (this.currentPage < totalPages - 2) {
                const dots2 = document.createElement('span');
                dots2.textContent = '...';
                dots2.style.padding = '0 8px';
                dots2.style.display = 'inline-block';
                dots2.style.color = '#666';
                paginationElement.appendChild(dots2);
            }
            
            this.createPageButton(paginationElement, totalPages);
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.id = 'next-btn';
        nextBtn.innerHTML = '<i class="material-icons-round">chevron_right</i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderProducts();
                this.renderPagination();
            }
        };
        paginationElement.appendChild(nextBtn);
    },

    createPageButton(container, pageNumber) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        if (pageNumber === this.currentPage) btn.classList.add('active');
        btn.textContent = pageNumber;
        btn.onclick = () => {
            this.currentPage = pageNumber;
            this.renderProducts();
            this.renderPagination();
        };
        container.appendChild(btn);
    },

    updatePaginationInfo() {
        const paginationInfo = document.getElementById('pagination-info');
        if (this.allProducts.length === 0) {
            paginationInfo.textContent = 'Hiển thị 0-0 của 0 sản phẩm';
            return;
        }
        
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.allProducts.length);
        paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} của ${this.allProducts.length} sản phẩm`;
    },

    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(195deg, #4caf50, #388e3c)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(195deg, #f44336, #d32f2f)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(195deg, #ff9800, #f57c00)';
        } else {
            notification.style.background = 'linear-gradient(195deg, #2196f3, #1976d2)';
        }
        
        notification.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;">${title}</div>
            <div style="font-size: 14px;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    },

    showAddProductForm() {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
         <nav style="margin-bottom:1.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);background-color:white;">
            <ol style="list-style:none;margin:0;padding:0;">
                <li style="color:#e91e63;font-size:1rem;font-weight:600;">Thêm sản phẩm mới</li>
            </ol>
        </nav>

        <div style="width:100%;padding:1.5rem;">
            <div class="card" style="background:white;border-radius:0.75rem;box-shadow:0 4px 6px rgba(0,0,0,0.1);margin-bottom:1.5rem;">
                <div class="card-header" style="padding:1.5rem 1.5rem 0.5rem;">
                    <h4 style="margin:0;font-weight:600;margin-bottom:0.5rem;color:#344767;">Thông tin sản phẩm</h4>
                    <p style="margin:0;color:#6c757d;font-size:0.875rem;">Nhập các thông tin của sản phẩm</p>
                </div>

                <div class="card-body" style="padding:1.5rem;">
                    <div id="success-alert" class="alert alert-success" style="display:none;padding:1rem;border-radius:0.5rem;margin-bottom:1rem;background-color:#d4edda;color:#155724;border:1px solid #c3e6cb;">
                        <strong>Thành công!</strong> Sản phẩm đã được thêm thành công.
                    </div>
                    <div id="error-alert" class="alert alert-danger" style="display:none;padding:1rem;border-radius:0.5rem;margin-bottom:1rem;background-color:#f8d7da;color:#721c24;border:1px solid #f5c6cb;">
                        <strong>Lỗi!</strong> Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.
                    </div>

                    <form id="addProductForm">
                        <div style="display:flex;flex-wrap:wrap;margin:0 -15px;">
                            <!-- Left column - Thông tin chính -->
                            <div style="flex:0 0 66.666667%;max-width:66.666667%;padding:0 15px;">
                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="productName" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Tên sản phẩm <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="productName" name="productName" placeholder="Nhập tên sản phẩm" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                                
                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="productAuthor" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Tác giả <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="productAuthor" name="productAuthor" placeholder="Nhập tên tác giả" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="productCategory" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Danh mục <span style="color:#dc3545;">*</span></label>
                                    <select class="form-control" id="productCategory" name="productCategory" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;background:white;">
                                        <option value="">Chọn danh mục</option>
                                        ${this.generateCategoryOptions()}
                                    </select>
                                </div>

                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="productDescription" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Mô tả sản phẩm</label>
                                    <textarea class="form-control" id="productDescription" name="productDescription" rows="4" placeholder="Nhập mô tả chi tiết về sản phẩm" style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;"></textarea>
                                </div>

                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="nxb" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Nhà xuất bản <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="nxb" name="nxb" placeholder="Nhập tên nhà xuất bản" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="namxb" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Năm xuất bản <span style="color:#dc3545;">*</span></label>
                                    <input type="number" class="form-control" id="namxb" name="namxb" placeholder="Nhập năm xuất bản" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                                
                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="sotrang" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Số trang <span style="color:#dc3545;">*</span></label>
                                    <input type="number" class="form-control" id="sotrang" name="sotrang" placeholder="Nhập số trang" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                                
                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="ngonngu" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Ngôn ngữ <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="ngonngu" name="ngonngu" placeholder="Nhập ngôn ngữ" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="kichthuoc" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Kích thước <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="kichthuoc" name="kichthuoc" placeholder="Nhập kích thước" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="trongluong" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Trọng lượng <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="trongluong" name="trongluong" placeholder="Nhập trọng lượng" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="loaibia" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Loại bìa <span style="color:#dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="loaibia" name="loaibia" placeholder="Nhập loại bìa" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                            </div>

                           <!-- Right column - Hình ảnh -->
              <div style="flex:0 0 33.333333%;max-width:33.333333%;padding:0 15px;">
                <div class="form-group image-group">
                  <label class="form-label">Hình ảnh sản phẩm</label>
                  
                  <!-- Container căn giữa cho ảnh -->
                  <div class="image-container">
                    <!-- Hiển thị ảnh preview -->
                    <div class="image-preview" onclick="document.getElementById('productImage').click()">
                      <div class="image-upload-text">
                        <i class="material-icons" style="font-size:48px;color:#dee2e6;margin-bottom:0.5rem;">add_photo_alternate</i>
                        <div>Chọn ảnh cho sản phẩm</div>
                      </div>
                      <img id="imagePreview" src="" alt="Preview" style="display:none;">
                    </div>
                    
                    <!-- Input file ẩn -->
                    <input type="file" class="form-control" id="productImage" name="productImage" accept="image/*" style="display:none;">
                  </div>
                </div>
              </div>
            </div>


                        <div style="display:flex;justify-content:center;gap:1rem;margin-top:2rem;padding-top:2rem;border-top:1px solid #dee2e6;">
                            <button type="button" class="btn btn-secondary" onclick="ProductManagement.loaddatasanpham()" style="display:inline-flex;align-items:center;padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;font-weight:600;cursor:pointer;transition:all 0.2s;text-decoration:none;font-size:0.875rem;background-color:#6c757d;color:white;">
                                <i class="material-icons" style="font-size:1rem;margin-right:0.5rem;vertical-align:middle;">arrow_back</i>
                                Quay về
                            </button>
                            <button type="button" class="btn btn-gradient" style="display:inline-flex;align-items:center;padding:0.75rem 2rem;border:none;border-radius:0.5rem;font-weight:600;cursor:pointer;transition:all 0.2s;background:linear-gradient(195deg,#ec407a,#d81b60);color:white;" onclick="ProductManagement.handleAddProduct()">
                                <i class="material-icons" style="font-size:1rem;margin-right:0.5rem;vertical-align:middle;">add_circle</i>
                                Thêm sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
        document.getElementById('productImage').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const preview = document.getElementById('imagePreview');
      const imagePreviewContainer = document.querySelector('.image-preview');
      const uploadText = document.querySelector('.image-upload-text');
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          preview.src = ev.target.result;
          preview.style.display = 'block';
          uploadText.style.display = 'none';
          imagePreviewContainer.style.borderColor = '#28a745';
          imagePreviewContainer.style.backgroundColor = '#f8fff9';
        };
        reader.readAsDataURL(file);
      } else {
        preview.style.display = 'none';
        uploadText.style.display = 'block';
        imagePreviewContainer.style.borderColor = '#dee2e6';
        imagePreviewContainer.style.backgroundColor = '#f8f9fa';
      }
    });
    },
    
    handleAddProduct: async function() {
    // Lấy giá trị từ các trường
    const productName = document.getElementById('productName').value.trim();
    const productAuthor = document.getElementById('productAuthor').value.trim();
    const productCategory = document.getElementById('productCategory').value;
    const productDescription = document.getElementById('productDescription').value.trim();
    const productImage = document.getElementById('productImage').files[0];
    const nxb = document.getElementById('nxb').value.trim();
    const namxb = document.getElementById('namxb').value.trim();
    const sotrang = document.getElementById('sotrang').value.trim();
    const ngonngu = document.getElementById('ngonngu').value.trim();
    const kichthuoc = document.getElementById('kichthuoc').value.trim();
    const trongluong = document.getElementById('trongluong').value.trim();
    const loaibia = document.getElementById('loaibia').value.trim();

    // Kiểm tra các trường bắt buộc
    if (!productName) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập tên sản phẩm');
        document.getElementById('productName').focus();
        return;
    }
    if (!productAuthor) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập tên tác giả');
        document.getElementById('productAuthor').focus();
        return;
    }
    if (!productCategory) {
        this.showNotification('error', 'Lỗi', 'Vui lòng chọn danh mục');
        document.getElementById('productCategory').focus();
        return;
    }
    if (!productImage) {
        this.showNotification('error', 'Lỗi', 'Vui lòng chọn hình ảnh sản phẩm');
        document.getElementById('productImage').focus();
        return;
    }
        if (!nxb) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập nhà xuất bản');
        document.getElementById('nxb').focus();
        return;
    }
    if (!namxb) {       
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập năm xuất bản');
        document.getElementById('namxb').focus();
        return;
    }
    if (!sotrang) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập số trang');
        document.getElementById('sotrang').focus();
        return;
    }
    if (!ngonngu) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập ngôn ngữ');
        document.getElementById('ngonngu').focus();
        return;
    }
    if (!kichthuoc) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập kích thước');
        document.getElementById('kichthuoc').focus();
        return;
    }
    if (!trongluong) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập trọng lượng');
        document.getElementById('trongluong').focus();
        return;
    }
    if (!loaibia) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập loại bìa');
        document.getElementById('loaibia').focus();
        return;
    }


    // Tạo FormData
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('tensp', productName);
    formData.append('tacgia', productAuthor);
    formData.append('danhmuc', productCategory);
    formData.append('mota', productDescription);
    formData.append('anhsp', productImage);
    formData.append('nxb', nxb);
    formData.append('namxb', namxb);
    formData.append('sotrang', sotrang);
    formData.append('ngonngu', ngonngu);
    formData.append('kichthuoc', kichthuoc);
    formData.append('trongluong', trongluong);
    formData.append('loaibia', loaibia);
    // Gửi request
    try {
        const response = await fetch('http://localhost/web2/controller/product.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            this.showNotification('success', 'Thành công', 'Thêm sản phẩm thành công');
            // Đợi 1.5 giây rồi quay về danh sách
            setTimeout(() => {
                this.loaddatasanpham();
            }, 1500);
        } else {
            this.showNotification('error', 'Lỗi', result.message || 'Không thể thêm sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        this.showNotification('error', 'Lỗi', 'Đã xảy ra lỗi khi kết nối đến server');
    }
},
    

    editProduct: async function(productId) {
        try {
            // 1. Gọi API lấy chi tiết sản phẩm
            const response = await fetch(`http://localhost/web2/controller/product.php?masp=${productId}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Không thể kết nối đến máy chủ');
            }

            const result = await response.json();

            if (!result.success) {
                this.showNotification('error', 'Lỗi', result.message || 'Không thể tải thông tin sản phẩm');
                return;
            }

            const product = result.data;

            // 2. Đổ dữ liệu vào giao diện và cập nhật thẻ <main>
            const mainElement = document.querySelector('main');
            
            mainElement.innerHTML = `
                <nav style="margin-bottom: 1.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); background-color: white;">
                  <div>
                    <b style="color:#e91e63;">Cập nhật sản phẩm</b>
                  </div>
                </nav>

                <div style="padding-top: 1.5rem; padding-bottom: 1.5rem;">
                  <div class="card" style="background:white; border-radius:0.75rem; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                    <div class="card-header" style="padding:1.5rem 1.5rem 0.5rem;">
                      <h4 style="margin: 0; font-weight: 600; margin-bottom: 0.5rem; color: #344767;">Thông tin sản phẩm</h4>
                      <p style="margin: 0; color: #6c757d; font-size: 0.875rem;">Cập nhật các thông tin của sản phẩm</p>
                    </div>
                    <div class="card-body" style="padding:1.5rem;">
                      <form id="updateProductForm">
                        <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
                          <div style="flex: 0 0 66.666667%; max-width: 66.666667%; padding-right: 15px; padding-left: 15px;">
                            <div class="form-group" style="margin-bottom:1.5rem;">
                              <label for="productName" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Tên sản phẩm <span style="color: #dc3545;">*</span></label>
                              <input type="text" class="form-control" id="productName" name="productName" value="${product.tensp}" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;">
                            </div>

                            <div class="form-group" style="margin-bottom:1.5rem;">
                              <label for="productAuthor" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Tác giả <span style="color: #dc3545;">*</span></label>
                              <input type="text" class="form-control" id="productAuthor" name="productAuthor" value="${product.tacgia}" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;">
                            </div>

                            <div class="form-group" style="margin-bottom:1.5rem;">
                              <label for="productCategory" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Danh mục <span style="color: #dc3545;">*</span></label>
                              <select class="form-control" id="productCategory" name="productCategory" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem; background:white;">
                                <option value="">Chọn danh mục</option>
                               ${this.generateCategoryOptions(product.danhmuc)} <!-- DANH MỤC ĐỘNG VỚI SELECTED -->
                              </select>
                            </div>

                            <div class="form-group" style="margin-bottom:1.5rem;">
                              <label for="productDescription" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Mô tả sản phẩm</label>
                              <textarea class="form-control" id="productDescription" name="productDescription" rows="4" style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;">${product.mota}</textarea>
                            </div>

                            
                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="nxb" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Nhà xuất bản <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.nhaxuatban}" type="text" class="form-control" id="nxb" name="nxb" placeholder="Nhập tên nhà xuất bản" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="namxb" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Năm xuất bản <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.namxuatban}" type="number" class="form-control" id="namxb" name="namxb" placeholder="Nhập năm xuất bản" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                                
                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="sotrang" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Số trang <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.sotrang}" type="number" class="form-control" id="sotrang" name="sotrang" placeholder="Nhập số trang" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                                
                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="ngonngu" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Ngôn ngữ <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.ngonngu}" type="text" class="form-control" id="ngonngu" name="ngonngu" placeholder="Nhập ngôn ngữ" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                 <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="kichthuoc" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Kích thước <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.kichthuoc}" type="text" class="form-control" id="kichthuoc" name="kichthuoc" placeholder="Nhập kích thước" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="trongluong" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Trọng lượng <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.trongluong}" type="text" class="form-control" id="trongluong" name="trongluong" placeholder="Nhập trọng lượng" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>

                                <div class="form-group" style="margin-bottom:1.5rem;">
                                    <label for="loaibia" class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Loại bìa <span style="color:#dc3545;">*</span></label>
                                    <input value="${product.loaibia}" type="text" class="form-control" id="loaibia" name="loaibia" placeholder="Nhập loại bìa" required style="width:100%;padding:0.75rem;border:1px solid #d2d6da;border-radius:0.5rem;font-size:0.875rem;transition:all 0.2s;">
                                </div>
                          </div>

                          <div style="flex: 0 0 33.333333%; max-width: 33.333333%; padding-right: 15px; padding-left: 15px;">
                            <div class="form-group image-group">
                              <label class="form-label" style="display:block;margin-bottom:0.5rem;font-weight:600;color:#344767;">Hình ảnh sản phẩm</label>
                              <div class="image-container" style="text-align:center;">
                                <div class="image-preview" style="margin-bottom:1rem; border:1px solid #ddd; padding:5px; border-radius:8px;">
                                  <img id="imagePreview" src="../${product.link}?t=${new Date().getTime()}" alt="Hình ảnh sản phẩm" style="max-width:100%; height:auto; border-radius:4px;">
                                </div>
                                <button type="button" class="btn btn-change-image" onclick="document.getElementById('productImage').click()" style="padding:0.5rem 1rem; background:#1a73e8; color:white; border:none; border-radius:4px; cursor:pointer;">
                                  <i class="material-icons" style="font-size: 1rem; margin-right: 0.5rem; vertical-align: middle;">edit</i>
                                  Thay đổi hình ảnh
                                </button>
                                <input type="file" id="productImage" name="productImage" accept="image/*" style="display: none;">
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #dee2e6;">
                          <button type="button" class="btn btn-secondary" onclick="ProductManagement.loaddatasanpham()" style="padding:0.75rem 1.5rem; background:#6c757d; color:white; border:none; border-radius:0.5rem; cursor:pointer;">
                            <i class="material-icons" style="font-size: 1rem; margin-right: 0.5rem; vertical-align: middle;">arrow_back</i>
                            Quay về
                          </button>
                          <button type="button" class="btn btn-gradient" style="padding: 0.75rem 2rem; font-weight: 600; background:linear-gradient(195deg,#ec407a,#d81b60); color:white; border:none; border-radius:0.5rem; cursor:pointer;" onclick="ProductManagement.handleUpdateProduct(${product.masp},'${product.link}')">
                            <i class="material-icons" style="font-size: 1rem; margin-right: 0.5rem; vertical-align: middle;">save</i>
                            Lưu thay đổi
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
            `;

            // 3. Thêm sự kiện để xem trước ảnh khi người dùng chọn file mới
            document.getElementById('productImage').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(ev) {
                        document.getElementById('imagePreview').src = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

        } catch (error) {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            this.showNotification('error', 'Lỗi', `${error.message}`);
        }
    },
handleUpdateProduct: async function(productId,lk) {
        // 1. Lấy các phần tử form
        const productName = document.getElementById('productName').value.trim();
        const productAuthor = document.getElementById('productAuthor').value.trim();
        const productCategory = document.getElementById('productCategory').value;
        const productDescription = document.getElementById('productDescription').value.trim();
        const productImage = document.getElementById('productImage').files[0];
        const nxb = document.getElementById('nxb').value.trim();
        const namxb = document.getElementById('namxb').value.trim();
        const sotrang = document.getElementById('sotrang').value.trim();
        const ngonngu = document.getElementById('ngonngu').value.trim();
        const kichthuoc = document.getElementById('kichthuoc').value.trim();
        const trongluong = document.getElementById('trongluong').value.trim();
        const loaibia = document.getElementById('loaibia').value.trim();
        // 2. Kiểm tra điền đầy đủ thông tin (Validation)
        // Lưu ý: Đối với cập nhật, file ảnh thường là không bắt buộc (nếu không chọn thì giữ ảnh cũ)
        // Nhưng theo yêu cầu của bạn là "kiểm tra nhập file", tôi sẽ thêm vào kiểm tra.
        if (!productName || !productAuthor || !productCategory || !nxb || !namxb || !sotrang || !ngonngu || !kichthuoc || !trongluong || !loaibia) {
            this.showNotification('warning', 'Thông báo', 'Vui lòng nhập đầy đủ các trường thông tin bắt buộc (*)');
            return;
        }

        // 3. Tạo FormData để gửi dữ liệu
        const formData = new FormData();
        formData.append('masp', productId); // Gửi masp để controller biết là cập nhật (Update)
        formData.append('tensp', productName);
        formData.append('tacgia', productAuthor);
        formData.append('danhmuc', productCategory);
        formData.append('mota', productDescription);
        formData.append('link', lk);
        formData.append('nxb', nxb);
        formData.append('namxb', namxb);
        formData.append('sotrang', sotrang);
        formData.append('ngonngu', ngonngu);
        formData.append('kichthuoc', kichthuoc);
        formData.append('trongluong', trongluong);
        formData.append('loaibia', loaibia);


        // Nếu người dùng có chọn file mới thì mới append vào
        if (productImage) {
            formData.append('anhsp', productImage);
        }

        try {
            // 4. Gọi API với method POST
            const response = await fetch('http://localhost/web2/controller/product.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Kết nối server thất bại');
            }
            
            const result = await response.json();

            // 5. Xử lý kết quả trả về
            if (result.success) {
                this.showNotification('success', 'Thành công', 'Cập nhật sản phẩm thành công!');
                
                // Đợi một chút để người dùng kịp nhìn thông báo rồi quay về danh sách
                setTimeout(() => {
                    this.loaddatasanpham();
                }, 4000);
            } else {
                this.showNotification('error', 'Thất bại', result.message || 'Cập nhật sản phẩm thất bại');
            }

        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            this.showNotification('error', 'Lỗi', `${error.message}`);
        }
    },
   // Thêm vào trong ProductManagement object, sau hàm handleSearch()

showDeleteConfirmation: function(productId) {
    // Tìm thông tin sản phẩm từ allProducts
    const product = this.allProducts.find(p => p.masp == productId);
    if (!product) return;

    // Tạo modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="background: white; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 450px; width: 90%; animation: modalFadeIn 0.3s;">
            <div class="modal-header" style="padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                    <div style="background: linear-gradient(195deg, #f44336, #d32f2f); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="material-icons-round" style="color: white; font-size: 20px;">warning</i>
                    </div>
                    <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #344767;">Xác nhận xóa</h3>
                </div>
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                    Thao tác này sẽ xóa sản phẩm. Bạn có chắc chắn muốn tiếp tục?
                </p>
            </div>
            
            <div class="modal-body" style="padding: 1.5rem;">
                <div style="display: flex; gap: 15px; background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <img src="../${product.link}?t=${new Date().getTime()}" 
                         alt="${product.tensp}" 
                         style="width: 60px; height: 80px; object-fit: cover; border-radius: 6px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #344767; margin-bottom: 4px;">${product.tensp}</div>
                        <div style="font-size: 13px; color: #666; margin-bottom: 2px;">Tác giả: ${product.tacgia}</div>
                        <div style="font-size: 13px; color: #666;">Danh mục: ${product.danhmuc}</div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer" style="padding: 1rem 1.5rem 1.5rem; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-cancel" style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; background: white; color: #666; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                    Hủy bỏ
                </button>
                <button class="btn-confirm" style="padding: 10px 20px; border: none; border-radius: 6px; background: linear-gradient(195deg, #f44336, #d32f2f); color: white; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                    <i class="material-icons-round" style="font-size: 18px; vertical-align: middle; margin-right: 5px;">delete</i>
                    Xóa sản phẩm
                </button>
            </div>
        </div>
    `;

    // Thêm CSS cho modal
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .btn-cancel:hover {
            background: #f5f5f5 !important;
        }
        
        .btn-confirm:hover {
            background: linear-gradient(195deg, #d32f2f, #b71c1c) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Thêm sự kiện cho nút hủy
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        modal.remove();
    });
    
    // Thêm sự kiện cho nút xác nhận
    modal.querySelector('.btn-confirm').addEventListener('click', () => {
        this.confirmDelete(productId);
        modal.remove();
    });
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
},

async confirmDelete(productId) {
    try {
        // Gọi API DELETE
        const response = await fetch(`http://localhost/web2/controller/product.php?masp=${productId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hiển thị thông báo thành công
            this.showNotification('success', 'Thành công', 'Xóa sản phẩm thành công');
            
            // Tải lại dữ liệu sản phẩm
            setTimeout(() => {
                this.loaddatasanpham();
            }, 1000);
        } else {
            // Hiển thị thông báo thất bại
            this.showNotification('error', 'Thất bại', result.message || 'Không thể xóa sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        this.showNotification('error', 'Lỗi', 'Đã xảy ra lỗi khi kết nối đến server');
    }
},

// Sửa lại hàm deleteProduct hiện tại
deleteProduct: async function(productId) {
    // Gọi hàm hiển thị modal xác nhận
    this.showDeleteConfirmation(productId);
},

    async handleSearch() {
        const nameFilter = document.getElementById('product-name').value.trim();
        const categoryFilter = document.getElementById('product-category').value;
        
       
        
        try {
            let searchUrl = 'http://localhost/web2/controller/product.php?action=searchnangcaoadmin';
            
            if (nameFilter) {
                searchUrl += `&tensp=${encodeURIComponent(nameFilter)}`;
            }
            if (categoryFilter) {
                searchUrl += `&category=${encodeURIComponent(categoryFilter)}`;
            }
            //alert(searchUrl);
            const response = await fetch(searchUrl, {
                method: 'GET'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.allProducts = result.data.data || [];
                this.currentPage = 1;
                this.renderProductManagementPage();

            } else {
                this.showNotification('error', 'Lỗi', result.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm sản phẩm:', error);
            this.showNotification('error', 'Lỗi', `${error.message}`);
        }
    }
};
///////////////////////////////////QUẢN LÝ PHIẾU NHẬP/////////////////////////////////////////////////
const ImportManagement = {
    allImports: [],
    currentPage: 1,
    itemsPerPage: 5,

    async loaddataphieunhap() {
        try {
            const response = await fetch('http://localhost/web2/controller/phieunhap.php?action=list', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Không thể kết nối đến máy chủ');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Có lỗi xảy ra khi tải dữ liệu');
            }

            this.allImports = result.data || [];
            this.renderImportManagementPage();
            
        } catch (error) {
            console.error('Lỗi tải dữ liệu phiếu nhập:', error);
            this.showNotification('error', 'Lỗi', error.message || 'Không thể tải dữ liệu phiếu nhập');
        }
    },

    renderImportManagementPage() {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
            <nav style="margin-bottom: 1.5rem; background:white; padding:1rem 1.5rem; border-radius:0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <span style="color:#e91e63; font-weight:600;">Quản lý phiếu nhập hàng</span>
            </nav>

            <!-- Button Add Import -->
            <div style="margin-bottom:1.2rem;text-align:right;">
                <button class="btn-add" onclick="ImportManagement.showAddImportForm()">
                    <i class="material-icons-round">add_box</i> Thêm phiếu nhập
                </button>
            </div>

            <!-- Search Form -->
            <div class="search-form" style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
                <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.5rem;">Tra cứu phiếu nhập</h3>
                <div class="form-row" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 1rem;">
                    <div class="form-col" style="flex: 1; min-width: 200px;">
                        <div class="form-group">
                            <label class="form-label" for="from-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Từ ngày</label>
                            <input type="date" id="from-date" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    <div class="form-col" style="flex: 1; min-width: 200px;">
                        <div class="form-group">
                            <label class="form-label" for="to-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Đến ngày</label>
                            <input type="date" id="to-date" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                </div>
                <div class="form-actions" style="display: flex; gap: 10px;">
                    <button class="btn-search" id="search-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">search</i> Tìm kiếm
                    </button>
                    <button class="btn-reset" id="reset-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">refresh</i> Đặt lại
                    </button>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <thead>
                    <tr style="background: linear-gradient(195deg, #e91e63, #c2185b); color: white;">
                        <th style="padding: 15px; text-align: left; font-weight: 600; font-size: 14px;">STT</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; font-size: 14px;">Mã phiếu</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; font-size: 14px;">Ngày nhập</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; font-size: 14px;">Số lượng sản phẩm</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; font-size: 14px;">Tổng giá trị</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600; font-size: 14px;">Thao tác</th>
                    </tr>
                </thead>
                <tbody id="imports-table-body">
                    <!-- Dữ liệu sẽ được điền động ở đây -->
                </tbody>
            </table>

            <!-- Phân trang -->
            <div class="pagination" id="pagination-container" style="display: flex; justify-content: center; align-items: center; gap: 5px; margin: 20px 0;"></div>
            <div class="pagination-info" id="pagination-info" style="text-align: center; color: #666; font-size: 14px; margin-top: 10px;"></div>
        `;
        
        this.renderImports();
        this.renderPagination();
        this.setupSearchEvents();
    },

    renderImports() {
        const tableBody = document.getElementById('imports-table-body');
        tableBody.innerHTML = '';
        
        if (this.allImports.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                        <i class="material-icons-round" style="font-size: 48px; color: #ddd; margin-bottom: 10px;">inbox</i>
                        <div>Không có phiếu nhập nào</div>
                    </td>
                </tr>
            `;
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.allImports.length);
        const currentImports = this.allImports.slice(startIndex, endIndex);
        
        currentImports.forEach((importItem, index) => {
            const row = document.createElement('tr');
            const stt = startIndex + index + 1;
            const formattedDate = this.formatDate(importItem.ngaynhap_formatted || importItem.ngaynhap);
            const formattedPrice = this.formatCurrency(importItem.tongtien);
            const importCode = `#PN${String(importItem.mapn).padStart(3, '0')}`;
            
            row.innerHTML = `
                <td style="padding: 15px; border-bottom: 1px solid #eee; color: #344767;">${stt}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: 600; color: #e91e63;">${importCode}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; color: #344767;">${formattedDate}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; color: #344767;">
                    <div>${importItem.tong_soluong || 0} sản phẩm</div>
                    <small style="color: #888;">${importItem.tong_mathang || 0} mặt hàng</small>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: 600; color: #4caf50;">${formattedPrice}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <div class="actions" style="display: flex; gap: 8px;">
                        <button class="btn btn-view" onclick="ImportManagement.viewImport(${importItem.mapn})" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: none; background: #1976d2; color: white; font-size: 13px; cursor: pointer;">
                            <i class="material-icons-round" style="font-size: 16px;">visibility</i>Xem
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        this.updatePaginationInfo();
    },

  formatDate(dateString) {
    if (!dateString) return 'Không xác định';
    
    // Nếu dateString là "01/02/2026 00:00" (dd/mm/yyyy HH:mm)
    // Chỉ lấy phần ngày tháng năm: "01/02/2026"
    const datePart = dateString.split(' ')[0];
    
    // Chuyển đổi từ "dd/mm/yyyy" sang "dd-mm-yyyy"
    const [day, month, year] = datePart.split('/');
    
    // Kiểm tra hợp lệ
    if (day && month && year) {
        return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
    }
    
    return 'Không xác định';
},

    formatCurrency(amount) {
        if (!amount) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    },

    renderPagination() {
        const paginationElement = document.getElementById('pagination-container');
        paginationElement.innerHTML = '';
        
        const totalPages = Math.ceil(this.allImports.length / this.itemsPerPage);
        
        if (totalPages <= 1) return;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.id = 'prev-btn';
        prevBtn.innerHTML = '<i class="material-icons-round">chevron_left</i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderImports();
                this.renderPagination();
            }
        };
        paginationElement.appendChild(prevBtn);
        
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                this.createPageButton(paginationElement, i);
            }
        } else {
            this.createPageButton(paginationElement, 1);
            
            if (this.currentPage > 3) {
                const dots1 = document.createElement('span');
                dots1.textContent = '...';
                dots1.style.padding = '0 8px';
                dots1.style.display = 'inline-block';
                dots1.style.color = '#666';
                paginationElement.appendChild(dots1);
            }
            
            let startPage = Math.max(2, this.currentPage - 1);
            let endPage = Math.min(totalPages - 1, this.currentPage + 1);
            
            if (this.currentPage <= 3) {
                startPage = 2;
                endPage = Math.min(4, totalPages - 1);
            } else if (this.currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
                endPage = totalPages - 1;
            }
            
            for (let i = startPage; i <= endPage; i++) {
                this.createPageButton(paginationElement, i);
            }
            
            if (this.currentPage < totalPages - 2) {
                const dots2 = document.createElement('span');
                dots2.textContent = '...';
                dots2.style.padding = '0 8px';
                dots2.style.display = 'inline-block';
                dots2.style.color = '#666';
                paginationElement.appendChild(dots2);
            }
            
            this.createPageButton(paginationElement, totalPages);
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.id = 'next-btn';
        nextBtn.innerHTML = '<i class="material-icons-round">chevron_right</i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderImports();
                this.renderPagination();
            }
        };
        paginationElement.appendChild(nextBtn);
    },

    createPageButton(container, pageNumber) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: white;
            color: #666;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        
        if (pageNumber === this.currentPage) {
            btn.style.background = 'linear-gradient(195deg, #e91e63, #c2185b)';
            btn.style.color = 'white';
            btn.style.border = 'none';
        }
        
        btn.textContent = pageNumber;
        btn.onclick = () => {
            this.currentPage = pageNumber;
            this.renderImports();
            this.renderPagination();
        };
        container.appendChild(btn);
    },

    updatePaginationInfo() {
        const paginationInfo = document.getElementById('pagination-info');
        if (this.allImports.length === 0) {
            paginationInfo.textContent = 'Hiển thị 0-0 của 0 phiếu nhập';
            return;
        }
        
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.allImports.length);
        paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} của ${this.allImports.length} phiếu nhập`;
    },

    setupSearchEvents() {
        const searchBtn = document.getElementById('search-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSearch());
        }
    },

    async performSearch() {
        const fromDate = document.getElementById('from-date').value;
        const toDate = document.getElementById('to-date').value;
        
        // Kiểm tra nếu cả 2 trường đều trống
        if (!fromDate && !toDate) {
            this.showNotification('warning', 'Thông báo', 'Vui lòng chọn ít nhất một tiêu chí tìm kiếm!');
            return;
        }
        
        // Kiểm tra nếu có từ ngày và đến ngày thì từ ngày phải <= đến ngày
        if (fromDate && toDate && fromDate > toDate) {
            this.showNotification('error', 'Lỗi', 'Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
            return;
        }
        
        // Xây dựng URL với các tham số
        let searchUrl = 'http://localhost/web2/controller/phieunhap.php?action=search';
        
        // Thêm các tham số nếu có giá trị
        if (fromDate) {
            searchUrl += `&ngaybatdau=${encodeURIComponent(fromDate)}`;
        }
        
        if (toDate) {
            searchUrl += `&ngayketthuc=${encodeURIComponent(toDate)}`;
        }
        try {
            const response = await fetch(searchUrl, {
                method: 'GET'
            });

            

            const result = await response.json();
            
            if (result.success) {
                this.allImports = result.data || [];
                this.currentPage = 1;
                this.renderImports();
                this.renderPagination();
                
                // Hiển thị thông báo thành công
                this.showNotification('success', 'Thành công', 
                    `Tìm thấy ${this.allImports.length} phiếu nhập phù hợp với tiêu chí`);
            } else {
                throw new Error(result.message || 'Có lỗi xảy ra khi tìm kiếm');
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm phiếu nhập:', error);
            this.showNotification('error', 'Lỗi', `Không thể kết nối đến máy chủ ${error.message}`);
        }
    },

    resetSearch() {
        // Reset tìm kiếm
        document.getElementById('from-date').value = '';
        document.getElementById('to-date').value = '';
        
        // Load lại dữ liệu ban đầu
        this.loaddataphieunhap();
    },

    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(195deg, #4caf50, #388e3c)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(195deg, #f44336, #d32f2f)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(195deg, #ff9800, #f57c00)';
        } else {
            notification.style.background = 'linear-gradient(195deg, #2196f3, #1976d2)';
        }
        
        notification.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;">${title}</div>
            <div style="font-size: 14px;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    },

   async viewImport(importId) {
    try {
        // Gọi API lấy chi tiết phiếu nhập
        const response = await fetch(`http://localhost/web2/controller/phieunhap.php?action=chitiet&mapn=${importId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Không thể kết nối đến máy chủ');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Có lỗi xảy ra khi tải chi tiết phiếu nhập');
        }

        const importData = result.data;
        this.renderImportDetail(importData);
        
    } catch (error) {
        console.error('Lỗi tải chi tiết phiếu nhập:', error);
        this.showNotification('error', 'Lỗi', error.message || 'Không thể tải chi tiết phiếu nhập');
    }
},

renderImportDetail(importData) {
    const mainElement = document.querySelector('main');
    
    // Định dạng các giá trị
    const formattedDate = this.formatDate(importData.ngaynhap_formatted || importData.ngaynhap);
    const formattedTotal = this.formatCurrency(importData.tongtien);
    const importCode = `#PN${String(importData.mapn).padStart(3, '0')}`;
    
    // Tính tổng số lượng sản phẩm
    let totalQuantity = 0;
    let totalProducts = importData.chitiet ? importData.chitiet.length : 0;
    
    // Tạo HTML cho danh sách sản phẩm
    let productRows = '';
    
    if (importData.chitiet && importData.chitiet.length > 0) {
        importData.chitiet.forEach((item, index) => {
            totalQuantity += parseInt(item.soluong) || 0;
            const formattedPrice = this.formatCurrency(item.gianhap);
            const formattedItemTotal = this.formatCurrency(item.gianhap * item.soluong);
            
            productRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="product-info" style="display: flex; align-items: center; gap: 1rem;">
                            <img src="../${item.link}?t=${new Date().getTime()}" alt="${item.tensp}" class="product-image" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
                            <div class="product-details">
                                <div class="product-name" style="font-weight: 500; color: #344767;">${item.tensp}</div>
                                <div class="product-author" style="font-size: 12px; color: #666;">Tác giả: ${item.tacgia}</div>
                            </div>
                        </div>
                    </td>
                    <td class="text-right" style="text-align: right; font-weight: 500; color: #4caf50;">${formattedPrice}</td>
                    <td class="text-center" style="text-align: center; color: #344767;">${item.soluong}</td>
                    <td class="text-right" style="text-align: right; font-weight: 600; color: #e91e63;">${formattedItemTotal}</td>
                </tr>
            `;
        });
    } else {
        productRows = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                    Không có sản phẩm trong phiếu nhập
                </td>
            </tr>
        `;
    }
    
    const importDetailHTML = `
        <nav style="margin-bottom: 1.5rem; background:white; padding:1rem 1.5rem; border-radius:0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <span style="color:#e91e63; font-weight:600;">Chi tiết phiếu nhập hàng</span>
        </nav>

        <div class="card" style="background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 1.5rem;">
            <div class="card-header" style="background: linear-gradient(195deg, #e91e63, #c2185b); color: white; padding: 1.25rem 1.5rem;">
                <h3 style="margin: 0; font-size: 1.2rem;">Thông tin phiếu nhập ${importCode}</h3>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
                <!-- Thông tin chung -->
                <div class="info-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.25rem; font-size: 1.1rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem;">Thông tin chung</h3>
                    <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Mã phiếu nhập</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${importCode}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Ngày nhập</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${formattedDate}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" style="font-size: 14px; color: #888; margin-bottom: 4px;">Tổng số lượng sản phẩm</div>
                            <div class="info-value" style="font-size: 16px; font-weight: 500; color: #344767;">${totalQuantity} sản phẩm</div>
                        </div>
                    </div>
                </div>

                <!-- Danh sách sản phẩm -->
                <div class="info-section">
                    <h3 style="margin-top: 0; color: #344767; margin-bottom: 1.25rem; font-size: 1.1rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem;">Danh sách sản phẩm nhập</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">STT</th>
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Sản phẩm</th>
                                <th style="padding: 12px 15px; text-align: right; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Giá nhập</th>
                                <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Số lượng</th>
                                <th style="padding: 12px 15px; text-align: right; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #495057;">Tổng cộng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                        </tbody>
                    </table>

                    <!-- Tổng kết -->
                    <div class="summary-card" style="background: #f8f9fa; border-radius: 8px; padding: 1.25rem; max-width: 400px; margin-left: auto;">
                        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                            <span style="color: #666;">Tổng số sản phẩm:</span>
                            <span style="font-weight: 500; color: #344767;">${totalProducts}</span>
                        </div>
                        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                            <span style="color: #666;">Tổng số lượng nhập:</span>
                            <span style="font-weight: 500; color: #344767;">${totalQuantity}</span>
                        </div>
                        <div class="summary-row summary-total" style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 17px;">
                            <span style="font-weight: 600; color: #344767;">Tổng giá trị phiếu nhập:</span>
                            <span style="font-weight: 700; color: #e91e63;">${formattedTotal}</span>
                        </div>
                    </div>
                </div>

                <!-- Nút hành động -->
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem;">
                    <button onclick="ImportManagement.goBackToList()" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">arrow_back</i> Quay về
                    </button>
                </div>
            </div>
        </div>
    `;
    
    mainElement.innerHTML = importDetailHTML;
},

goBackToList: function() {
    if (InventoryManagement.isFromHistory && InventoryManagement.lastHistoryContext) {
        InventoryManagement.isFromHistory = false; 

        InventoryManagement.currentTab = 'inventory-report';
        InventoryManagement.loaddatatonkho();
        
        setTimeout(() => {
            InventoryManagement.viewProductHistory(
                InventoryManagement.lastHistoryContext.id, 
                InventoryManagement.lastHistoryContext.name
            );
        }, 100);
    } else {
        this.loaddataphieunhap();
    }
},

    showAddImportForm() {
    const mainElement = document.querySelector('main');
    
    mainElement.innerHTML = `
        <nav style="margin-bottom: 1.5rem; background:white; padding:1rem 1.5rem; border-radius:0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <span style="color:#e91e63; font-weight:600;">Thêm phiếu nhập hàng</span>
        </nav>

        <div class="card" style="background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 1.5rem;">
            <div class="card-header" style="background: linear-gradient(195deg, #e91e63, #c2185b); color: white; padding: 1.25rem 1.5rem;">
                <h3 style="margin: 0; font-size: 1.2rem;">Thông tin phiếu nhập</h3>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
                <div class="form-row" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div class="form-col" style="flex: 1; min-width: 200px;">
                        <div class="form-group">
                            <label class="form-label" for="import-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Ngày nhập *</label>
                            
                            <input type="date" id="import-date" name="import-date" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; color: #344767;">
                        </div>
                    </div>
                   
                </div>

                <div class="form-group" style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <label class="form-label" style="font-size: 14px; font-weight: 500; color: #344767;">Danh sách sản phẩm nhập</label>
                        <button type="button" class="btn btn-success" id="add-product-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                            <i class="material-icons-round" style="font-size: 18px;">add</i> Thêm sản phẩm
                        </button>
                    </div>
                    
                    <div id="products-container" style="margin-bottom: 1.5rem;">
                        <!-- Product rows will be added here dynamically -->
                    </div>
                </div>

                <div class="summary-card" style="background: #f8f9fa; border-radius: 8px; padding: 1.25rem; max-width: 400px; margin-left: auto; margin-bottom: 2rem;">
                    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                        <span style="color: #666;">Tổng số sản phẩm:</span>
                        <span id="total-products" style="font-weight: 500; color: #344767;">0</span>
                    </div>
                    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px;">
                        <span style="color: #666;">Tổng số lượng:</span>
                        <span id="total-quantity" style="font-weight: 500; color: #344767;">0</span>
                    </div>
                    <div class="summary-row summary-total" style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 17px;">
                        <span style="font-weight: 600; color: #344767;">Tổng giá trị:</span>
                        <span id="total-value" style="font-weight: 700; color: #e91e63;">0 VNĐ</span>
                    </div>
                </div>

                <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1.5rem;">
                    <button type="button" class="btn btn-secondary" onclick="ImportManagement.loaddataphieunhap()" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">cancel</i> Hủy bỏ
                    </button>
                    <button type="button" class="btn btn-primary" id="save-import" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #2196f3, #1976d2); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <i class="material-icons-round" style="font-size: 18px;">save</i> Lưu phiếu nhập
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            .custom-select {
                position: relative;
                width: 100%;
            }
            
            .select-selected {
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 10px 12px;
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .select-selected:after {
                content: "▼";
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
            }
            
            .select-selected.select-arrow-active:after {
                content: "▲";
            }
            
            .select-items {
                position: absolute;
                background-color: white;
                top: 100%;
                left: 0;
                right: 0;
                z-index: 99;
                border: 1px solid #ddd;
                border-radius: 6px;
                max-height: 300px;
                overflow-y: auto;
                margin-top: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .select-hide {
                display: none;
            }
            
            .select-items div {
                padding: 10px 12px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .select-items div:hover {
                background-color: #f5f5f5;
            }
            
            .product-option {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .product-image {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 4px;
            }
            
            .product-info {
                flex: 1;
            }
            
            .product-name {
                font-weight: 500;
                color: #344767;
                margin-bottom: 2px;
            }
            
            .product-author {
                font-size: 12px;
                color: #666;
            }
            
            .search-container {
                padding: 10px 12px;
                border-bottom: 1px solid #eee;
            }
            
            .search-input {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .no-results {
                padding: 15px;
                text-align: center;
                color: #666;
                font-style: italic;
            }
            
            .product-row {
                display: grid;
                grid-template-columns: 3fr 1fr 1fr 1fr auto;
                gap: 15px;
                align-items: center;
                padding: 15px;
                background: #fafafa;
                border-radius: 8px;
                margin-bottom: 15px;
                border: 1px solid #eee;
            }
            
            @media (max-width: 768px) {
                .product-row {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
            }
            
            .product-select, .product-price, .product-quantity, .product-total {
                display: flex;
                flex-direction: column;
            }
            
            .form-control {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .price-input, .quantity-input {
                text-align: right;
            }
            
            .product-total {
                font-weight: 600;
                color: #e91e63;
                text-align: right;
            }
            
            .product-actions {
                display: flex;
                justify-content: center;
            }
            
            .btn-danger {
                background: linear-gradient(195deg, #f44336, #d32f2f);
                color: white;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        </style>
    `;
    
    // Set today's date as default
    const today = new Date();
    // Chuyển đổi sang định dạng YYYY-MM-DD theo giờ địa phương
const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

document.getElementById('import-date').value = localDate;
    // Load product data from API
    this.loadProductData();
},

formatDateForDisplay(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
},

async loadProductData() {
    try {
        const response = await fetch('http://localhost/web2/controller/product.php?action=all', {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Không thể kết nối đến máy chủ');
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Transform API data to match our expected format
            this.productData = {};
            result.data.data.forEach(product => {
                this.productData[product.masp] = {
                    name: product.tensp,
                    author: product.tacgia,
                    image: product.link ? `../${product.link}` : '../img/default-book.jpg'
                };
            });
            
            // Add first product row
            const productsContainer = document.getElementById('products-container');
            const firstProductRow = this.createProductRow();
            productsContainer.appendChild(firstProductRow);
            
            // Initialize custom select for first row
            const firstCustomSelect = firstProductRow.querySelector('.custom-select');
            this.initializeCustomSelect(firstCustomSelect);
            
            // Add event listeners to first row
            this.addRowEventListeners(firstProductRow);
            
            this.calculateTotals();
            
            // Add event listener to add product button
            document.getElementById('add-product-btn').addEventListener('click', () => this.addNewProductRow());
            
            // Add event listener to save import button
            document.getElementById('save-import').addEventListener('click', () => this.handleSaveImport());
            window.addEventListener('click', function(e) {
    // Nếu click không nằm trong .custom-select, đóng tất cả dropdown
    if (!e.target.closest('.custom-select')) {
        ImportManagement.closeAllSelect();
    }
});
        } else {
            this.showNotification('error', 'Lỗi', 'Không thể tải dữ liệu sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu sản phẩm:', error);
        this.showNotification('error', 'Lỗi', 'Không thể kết nối đến máy chủ');
    }
},

createProductRow() {
    const productRow = document.createElement('div');
    productRow.className = 'product-row';
    productRow.innerHTML = `
        <div class="product-select">
            <div class="custom-select">
                <select class="form-control product-select" style="display: none;">
                    <option value="">Chọn sản phẩm</option>
                    ${Object.entries(this.productData || {}).map(([id, product]) => 
                        `<option value="${id}">${product.name}</option>`
                    ).join('')}
                </select>
                <div class="select-selected">
                    <div class="product-option">
                        <div class="product-info">
                            <div class="product-name">Chọn sản phẩm</div>
                        </div>
                    </div>
                </div>
                <div class="select-items select-hide">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Tìm kiếm sản phẩm...">
                    </div>
                    <div data-value="">
                        <div class="product-option">
                            <div class="product-info">
                                <div class="product-name">Chọn sản phẩm</div>
                            </div>
                        </div>
                    </div>
                    ${Object.entries(this.productData || {}).map(([id, product]) => `
                        <div data-value="${id}">
                            <div class="product-option">
                                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='../img/default-book.jpg'">
                                <div class="product-info">
                                    <div class="product-name">${product.name}</div>
                                    <div class="product-author">Tác giả: ${product.author}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="product-price">
            <input type="text" class="form-control price-input" placeholder="Giá nhập" min="0">
        </div>
        <div class="product-quantity">
            <input type="number" class="form-control quantity-input" placeholder="Số lượng" min="1">
        </div>
        <div class="product-total">
            0 VNĐ
        </div>
        <div class="product-actions">
            <button type="button" class="btn btn-danger remove-product">
                <i class="material-icons-round">delete</i>
            </button>
        </div>
    `;
    
    return productRow;
},

initializeCustomSelect(customSelect) {
    const selected = customSelect.querySelector('.select-selected');
    const items = customSelect.querySelector('.select-items');
    const originalSelect = customSelect.querySelector('select');
    const searchInput = items.querySelector('.search-input');
    
    // Set initial selected value
    this.updateSelected(selected, originalSelect);
    
    // Toggle dropdown
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        this.nextElementSibling.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
        
        if (!this.nextElementSibling.classList.contains('select-hide')) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const options = items.querySelectorAll('div[data-value]');
        let hasVisibleResults = false;
        
        options.forEach(option => {
            if (option.getAttribute('data-value') === "") {
                option.style.display = 'flex';
                return;
            }
            
            const productName = option.querySelector('.product-name').textContent.toLowerCase();
            const productAuthor = option.querySelector('.product-author')?.textContent.toLowerCase() || '';
            
            if (productName.includes(filter) || productAuthor.includes(filter)) {
                option.style.display = 'flex';
                hasVisibleResults = true;
            } else {
                option.style.display = 'none';
            }
        });
        
        let noResultsMsg = items.querySelector('.no-results');
        if (!hasVisibleResults) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.textContent = 'Không tìm thấy sản phẩm phù hợp';
                items.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
    
    // Handle item selection
    items.querySelectorAll('div[data-value]').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const product = ImportManagement.productData[value];
            
            originalSelect.value = value;
            ImportManagement.updateSelected(selected, originalSelect, product?.image, product?.author);
            
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
            
            // Clear search input after selection
            searchInput.value = '';
            
            // Reset all options to visible
            items.querySelectorAll('div[data-value]').forEach(option => {
                option.style.display = 'flex';
            });
            
            // Remove no results message if exists
            const noResultsMsg = items.querySelector('.no-results');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
            
            // Calculate totals after product selection
            ImportManagement.calculateTotals();
        });
    });
},

updateSelected(selectedElement, selectElement, imageUrl, author) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const productOption = selectedElement.querySelector('.product-option');
    
    if (selectElement.value === "") {
        productOption.innerHTML = `
            <div class="product-info">
                <div class="product-name">Chọn sản phẩm</div>
            </div>
        `;
    } else {
        const product = this.productData[selectElement.value];
        productOption.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${selectedOption.text}" class="product-image" onerror="this.src='../img/default-book.jpg'">` : ''}
            <div class="product-info">
                <div class="product-name">${selectedOption.text}</div>
                ${author ? `<div class="product-author">${author}</div>` : ''}
            </div>
        `;
    }
},

closeAllSelect() {
    const selectItems = document.querySelectorAll('.select-items');
    const selectSelected = document.querySelectorAll('.select-selected');
    
    selectItems.forEach(item => {
        item.classList.add('select-hide');
        const searchInput = item.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
            item.querySelectorAll('div[data-value]').forEach(option => {
                option.style.display = 'flex';
            });
            
            const noResultsMsg = item.querySelector('.no-results');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    });
    
    selectSelected.forEach(selected => {
        selected.classList.remove('select-arrow-active');
    });
},

addRowEventListeners(row) {
    const priceInput = row.querySelector('.price-input');
    const quantityInput = row.querySelector('.quantity-input');
    
    priceInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
        const value = this.value;
        if (value) {
            this.value = parseInt(value).toLocaleString('vi-VN');
        }
        ImportManagement.calculateTotals();
    });
    
    quantityInput.addEventListener('input', () => this.calculateTotals());
    
    row.querySelector('.remove-product').addEventListener('click', function() {
        row.remove();
        ImportManagement.calculateTotals();
    });
},

addNewProductRow() {
    const productsContainer = document.getElementById('products-container');
    const productRow = this.createProductRow();
    productsContainer.appendChild(productRow);
    
    const customSelect = productRow.querySelector('.custom-select');
    this.initializeCustomSelect(customSelect);
    
    this.addRowEventListeners(productRow);
    this.calculateTotals();
},

calculateTotals() {
    let totalProducts = 0;
    let totalQuantity = 0;
    let totalValue = 0;
    
    document.querySelectorAll('.product-row').forEach(row => {
        const priceInput = row.querySelector('.price-input');
        const quantityInput = row.querySelector('.quantity-input');
        
        const price = parseFloat(priceInput.value.replace(/\./g, '')) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        const total = price * quantity;
        
        row.querySelector('.product-total').textContent = this.formatCurrency(total);
        
        totalProducts++;
        totalQuantity += quantity;
        totalValue += total;
    });
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-quantity').textContent = totalQuantity;
    document.getElementById('total-value').textContent = this.formatCurrency(totalValue);
},

formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' VNĐ';
},

async handleSaveImport() {
    const chitiet = [];
    let hasErrors = false;
    
    // 1. Validate date
    const importDate = document.getElementById('import-date').value;
    if (!importDate) {
        this.showNotification('error', 'Lỗi', 'Vui lòng chọn ngày nhập');
        return;
    }
    
    // 2. Collect and validate product data
    const rows = document.querySelectorAll('.product-row');
    
    if (rows.length === 0) {
        this.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một sản phẩm');
        return;
    }

    rows.forEach((row, index) => {
        const productSelect = row.querySelector('select');
        const priceInput = row.querySelector('.price-input');
        const quantityInput = row.querySelector('.quantity-input');
        
        const masp = productSelect.value;
        const gianhap = parseFloat(priceInput.value.replace(/\./g, '')) || 0;
        const soluong = parseInt(quantityInput.value) || 0;

        // Validate each row
        if (!masp) {
            this.showNotification('error', 'Lỗi', `Hàng ${index + 1}: Chưa chọn sản phẩm`);
            hasErrors = true;
            return;
        }
        
        if (gianhap <= 0) {
            this.showNotification('error', 'Lỗi', `Hàng ${index + 1}: Giá nhập phải lớn hơn 0`);
            hasErrors = true;
            return;
        }
        
        if (soluong <= 0) {
            this.showNotification('error', 'Lỗi', `Hàng ${index + 1}: Số lượng phải lớn hơn 0`);
            hasErrors = true;
            return;
        }
        
        // Add to details array
        chitiet.push({
            masp: masp,
            gianhap: gianhap,
            soluong: soluong,
            ngaynhap: importDate,
        });
    });
    
    if (hasErrors) return;
    try {
        // Create FormData
         const requestData = {
            chitiet: chitiet
        };
        
        // Send request to API
        const response = await fetch('http://localhost/web2/controller/phieunhap.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.showNotification('success', 'Thành công', 'Thêm phiếu nhập thành công');
            
            // Wait 1.5 seconds then return to import list
            setTimeout(() => {
                this.loaddataphieunhap();
            }, 1500);
        } else {
            this.showNotification('error', 'Thất bại', result.message || 'Không thể thêm phiếu nhập');
        }
        
    } catch (error) {
        console.error('Lỗi khi thêm phiếu nhập:', error);
        this.showNotification('error', 'Lỗi', 'Đã xảy ra lỗi khi kết nối đến server');
    }
}
};
const PriceManagement = {
    allProducts: [],
    categories: [],
    currentPage: 1,
    itemsPerPage: 5,
    currentTab: 'product-profit',

    async fetchCategories() {
        try {
            const response = await fetch('http://localhost/web2/controller/danhmuc.php?action=alladmin');
            const result = await response.json();
            if (result.success) {
                this.categories = result.data;
            }
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    },
    generateCategoryOptions() {
        return this.categories.map(cat => 
            `<option value="${cat.madm}">${cat.tendm}</option>`
        ).join('');
    },
    async loaddatagiaban() {
        try {
            await this.fetchCategories();
            const response = await fetch('http://localhost/web2/controller/product.php?action=all', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Không thể kết nối đến máy chủ');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Có lỗi xảy ra khi tải dữ liệu');
            }

            this.allProducts = result.data.data || [];
            this.renderPriceManagementPage();
            
        } catch (error) {
            console.error('Lỗi tải dữ liệu sản phẩm cho quản lý giá bán:', error);
            this.showNotification('error', 'Lỗi', error.message || 'Không thể tải dữ liệu sản phẩm');
        }
    },

    renderPriceManagementPage() {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
            <nav style="margin-bottom: 1.5rem; background:white; padding:1rem 1.5rem; border-radius:0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <span style="color:#e91e63; font-weight:600;">Quản lý giá bán</span>
            </nav>

            <div class="card" style="background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                <div class="card-header" style="background: linear-gradient(195deg, #e91e63, #c2185b); color: white; padding: 1.25rem 1.5rem;">
                    <h3 style="margin: 0; font-size: 1.2rem;">Quản lý tỷ lệ lợi nhuận và giá bán</h3>
                </div>
                <div class="card-body" style="padding: 1.5rem;">
                    <!-- Tabs -->
                    <div class="tabs" style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 1.5rem;">
                        <div class="tab ${this.currentTab === 'product-profit' ? 'active' : ''}" data-tab="product-profit" style="padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500; border-bottom: 2px solid ${this.currentTab === 'product-profit' ? '#e91e63' : 'transparent'}; transition: all 0.2s; ${this.currentTab === 'product-profit' ? 'color: #e91e63;' : 'color: #666;'}">
                            Tỷ lệ lợi nhuận theo sản phẩm
                        </div>
                        
                    </div>

                    <!-- Tab 1: Tỷ lệ lợi nhuận theo sản phẩm -->
                    <div class="tab-content ${this.currentTab === 'product-profit' ? 'active' : ''}" id="product-profit" style="display: ${this.currentTab === 'product-profit' ? 'block' : 'none'};">
                        <div class="search-form" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <div class="form-row" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 1rem;">
                                <div class="form-col" style="flex: 1; min-width: 250px;">
                                    <div class="form-group">
                                        <label class="form-label" for="product-search" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Tìm kiếm sản phẩm</label>
                                        <input type="text" id="product-search" class="form-control" placeholder="Nhập tên sản phẩm..." style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                    </div>
                                </div>
                                <div class="form-col" style="flex: 1; min-width: 250px;">
                                    <div class="form-group">
                                        <label class="form-label" for="product-category" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Danh mục</label>
                                        <select id="product-category" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                            <option value="">Tất cả danh mục</option>
                                            ${this.generateCategoryOptions()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="search-actions" style="display: flex; gap: 10px;">
                                <button class="btn btn-primary" id="search-product-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                    <i class="material-icons-round" style="font-size: 18px;">search</i> Tìm kiếm
                                </button>
                                <button class="btn btn-secondary" id="reset-product" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                    <i class="material-icons-round" style="font-size: 18px;">refresh</i> Đặt lại
                                </button>
                            </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">STT</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Sản phẩm</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Danh mục</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Giá nhập</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Tỷ lệ lợi nhuận (%)</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Giá bán</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="product-profit-table-body">
                                <!-- Dữ liệu sẽ được điền động ở đây -->
                            </tbody>
                        </table>

                        <!-- Phân trang -->
                        <div class="pagination" id="product-profit-pagination" style="display: flex; justify-content: center; align-items: center; gap: 5px; margin: 20px 0;"></div>
                        <div class="pagination-info" id="product-profit-info" style="text-align: center; color: #666; font-size: 14px; margin-top: 10px;"></div>
                    </div>

                    <!-- Tab 2: Tra cứu giá bán -->
                    <div class="tab-content ${this.currentTab === 'price-search' ? 'active' : ''}" id="price-search" style="display: ${this.currentTab === 'price-search' ? 'block' : 'none'};">
                        <div class="search-form" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <div class="form-row" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 1rem;">
                                <div class="form-col" style="flex: 1; min-width: 200px;">
                                    <div class="form-group">
                                        <label class="form-label" for="price-product-search" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Tìm kiếm sản phẩm</label>
                                        <input type="text" id="price-product-search" class="form-control" placeholder="Nhập tên sản phẩm..." style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                    </div>
                                </div>
                                <div class="form-col" style="flex: 1; min-width: 200px;">
                                    <div class="form-group">
                                        <label class="form-label" for="price-category" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Danh mục</label>
                                        <select id="price-category" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                            <option value="">Tất cả danh mục</option>
                                           ${this.generateCategoryOptions()}
                                        </select>
                                    </div>
                                </div>
                               
                            </div>
                            <div class="search-actions" style="display: flex; gap: 10px;">
                                <button class="btn btn-primary" id="search-price-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                    <i class="material-icons-round" style="font-size: 18px;">search</i> Tìm kiếm
                                </button>
                                <button class="btn btn-secondary" id="reset-price" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                    <i class="material-icons-round" style="font-size: 18px;">refresh</i> Đặt lại
                                </button>
                            </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">STT</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Sản phẩm</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Danh mục</th>
                                    <th style="padding: 15px; text-align: right; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Giá nhập</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Tỷ lệ lợi nhuận (%)</th>
                                    <th style="padding: 15px; text-align: right; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Giá bán</th>
                                </tr>
                            </thead>
                            <tbody id="price-search-table-body">
                                <!-- Dữ liệu sẽ được điền động ở đây -->
                            </tbody>
                        </table>

                        <!-- Phân trang -->
                        <div class="pagination" id="price-search-pagination" style="display: flex; justify-content: center; align-items: center; gap: 5px; margin: 20px 0;"></div>
                        <div class="pagination-info" id="price-search-info" style="text-align: center; color: #666; font-size: 14px; margin-top: 10px;"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
        this.renderProducts();
    },
// Thêm hàm này vào trong PriceManagement
async handleSearchTab1() {
    const nameFilter = document.getElementById('product-search').value.trim();
    const categoryFilter = document.getElementById('product-category').value;

    

    try {
        // 1. Xây dựng URL
        let searchUrl = `http://localhost/web2/controller/product.php?action=searchnangcaoadmin`;
        if (nameFilter) searchUrl += `&tensp=${encodeURIComponent(nameFilter)}`;
        if (categoryFilter) searchUrl += `&category=${encodeURIComponent(categoryFilter)}`;

        // 2. Gọi API
        const response = await fetch(searchUrl, { method: 'GET' });
        const result = await response.json();

        if (result.success) {
            // 3. Cập nhật dữ liệu mới từ server vào allProducts
            this.allProducts = result.data.data || [];
            
            // 4. Reset về trang 1 và render lại
            this.currentPage = 1;
            this.renderProducts(); 
            
            this.showNotification('success', 'Thành công', `Tìm thấy ${this.allProducts.length} sản phẩm`);
        } else {
           
            this.showNotification('error', 'Thông báo', result.message || 'Không tìm thấy sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
        this.showNotification('error', 'Lỗi', 'Không thể kết nối đến server');
    }
},
// Thêm vào trong PriceManagement
async handleSearchTab2() {
    const nameFilter = document.getElementById('price-product-search').value.trim();
    const categoryFilter = document.getElementById('price-category').value;

    try {
        // 1. Xây dựng URL gọi API (tên và danh mục)
        let searchUrl = `http://localhost/web2/controller/product.php?action=searchnangcaoadmin`;
        if (nameFilter) searchUrl += `&tensp=${encodeURIComponent(nameFilter)}`;
        if (categoryFilter) searchUrl += `&category=${encodeURIComponent(categoryFilter)}`;
        const response = await fetch(searchUrl, { method: 'GET' });
        const result = await response.json();

        if (result.success) {
            let data = result.data.data || [];
            this.allProducts = data;
            this.currentPage = 1;
            this.renderProducts();
            
            this.showNotification('success', 'Thành công', `Tìm thấy ${this.allProducts.length} sản phẩm phù hợp`);
        } else {
            this.allProducts = [];
            this.renderProducts();
            this.showNotification('error', 'Thông báo', result.message || 'Không tìm thấy sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi tìm kiếm Tab 2:', error);
        this.showNotification('error', 'Lỗi', 'Không thể kết nối đến server');
    }
},
    setupEventListeners() {
        // Sự kiện chuyển tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Sửa lại sự kiện tìm kiếm tab 1
    document.getElementById('search-product-btn')?.addEventListener('click', () => {
        this.handleSearchTab1(); // Gọi hàm lấy dữ liệu từ API
    });

    // Sửa lại sự kiện reset tab 1 (để load lại toàn bộ dữ liệu ban đầu)
    document.getElementById('reset-product')?.addEventListener('click', () => {
        document.getElementById('product-search').value = '';
        document.getElementById('product-category').value = '';
        this.loaddatagiaban(); // Load lại toàn bộ sản phẩm từ API ban đầu
    });

       document.getElementById('search-price-btn')?.addEventListener('click', () => {
        this.handleSearchTab2(); // Gọi API thay vì chỉ render cục bộ
    });

    // Cập nhật Sự kiện reset tab 2
    document.getElementById('reset-price')?.addEventListener('click', () => {
        document.getElementById('price-product-search').value = '';
        document.getElementById('price-category').value = '';
        this.loaddatagiaban(); // Load lại toàn bộ dữ liệu từ server
    });
    },

    switchTab(tabId) {
        this.currentTab = tabId;
        this.currentPage = 1;
        
        // Cập nhật active tab
        document.querySelectorAll('.tab').forEach(tab => {
            const isActive = tab.getAttribute('data-tab') === tabId;
            tab.classList.toggle('active', isActive);
            tab.style.borderBottomColor = isActive ? '#e91e63' : 'transparent';
            tab.style.color = isActive ? '#e91e63' : '#666';
        });

        // Hiển thị tab content tương ứng
        document.querySelectorAll('.tab-content').forEach(content => {
            const isActive = content.id === tabId;
            content.style.display = isActive ? 'block' : 'none';
            content.classList.toggle('active', isActive);
        });

        // Render lại dữ liệu
        this.renderProducts();
    },

    renderProducts() {
        if (this.currentTab === 'product-profit') {
            this.renderProductProfitTable();
        } else if (this.currentTab === 'price-search') {
            this.renderPriceSearchTable();
        }
    },

    renderProductProfitTable() {
        const tableBody = document.getElementById('product-profit-table-body');
        tableBody.innerHTML = '';
        
        // Lọc dữ liệu
        const filteredProducts = this.allProducts;
        
        if (filteredProducts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                        <i class="material-icons-round" style="font-size: 48px; color: #ddd; margin-bottom: 10px;">inventory_2</i>
                        <div>Không tìm thấy sản phẩm phù hợp</div>
                    </td>
                </tr>
            `;
            return;
        }

        // Tính toán phân trang
        const totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, filteredProducts.length);
        const currentProducts = filteredProducts.slice(startIndex, endIndex);

        currentProducts.forEach((product, index) => {
            const row = document.createElement('tr');
            const stt = startIndex + index + 1;
            
            // Map danh mục từ tiếng Anh sang tiếng Việt
            const categoryObj = this.categories.find(c => c.madm === product.danhmuc);
            const categoryText = categoryObj ? categoryObj.tendm : product.danhmuc;
             const gianhap = this.formatCurrency(parseInt(product.gianhap) || 0);
            const giaban = this.formatCurrency(parseInt(product.gia) || 0);

            row.innerHTML = `
                <td style="padding: 15px; border-bottom: 1px solid #eee; color: #344767;">${stt}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                     <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="../${product.link}" alt="${product.tensp}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
                            <div>
                    <div style="font-weight: 500; color: #344767;">${product.tensp}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">Tác giả: ${product.tacgia}</div>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                        ${categoryText}
                    </span>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-weight: 500; color: #e91e63;">
                    ${gianhap}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="display: inline-block; width: 120px; position: relative;">
                        <input type="number" 
                               class="percentage-input" 
                               data-masp="${product.masp}"
                               value="${product.tyle || 0}" 
                               min="0" 
                               max="100" 
                               step="0.1" 
                               style="width: 100%; padding: 8px 30px 8px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; text-align: center;">
                        <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #666;">%</span>
                    </div>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600; color: #4caf50;">
                    ${giaban}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
                    <div class="actions">
                        <button class="btn btn-success btn-sm save-profit-btn" 
                                data-masp="${product.masp}"
                                style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 4px; border: none; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; font-size: 13px; cursor: pointer;">
                            <i class="material-icons-round" style="font-size: 16px;">save</i> Lưu
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        // Thêm sự kiện cho nút lưu
       document.querySelectorAll('.save-profit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Thay e.target bằng e.currentTarget
        const masp = e.currentTarget.getAttribute('data-masp'); 
        this.saveProfitRate(masp);
    });
});

        // Render phân trang
        this.renderPagination('product-profit-pagination', totalPages);
        this.updatePaginationInfo('product-profit-info', filteredProducts.length, startIndex, endIndex);
    },

    renderPriceSearchTable() {
        const tableBody = document.getElementById('price-search-table-body');
        tableBody.innerHTML = '';
        
        // Lọc dữ liệu
        const filteredProducts = this.allProducts;
        
        if (filteredProducts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                        <i class="material-icons-round" style="font-size: 48px; color: #ddd; margin-bottom: 10px;">search</i>
                        <div>Không tìm thấy sản phẩm phù hợp</div>
                    </td>
                </tr>
            `;
            return;
        }

        // Tính toán phân trang
        const totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, filteredProducts.length);
        const currentProducts = filteredProducts.slice(startIndex, endIndex);

        currentProducts.forEach((product, index) => {
            const row = document.createElement('tr');
            const stt = startIndex + index + 1;
            
            // Map danh mục từ tiếng Anh sang tiếng Việt
           const categoryObj = this.categories.find(c => c.madm === product.danhmuc);
            const categoryText = categoryObj ? categoryObj.tendm : product.danhmuc;
            
            // Định dạng giá
            const gianhap = this.formatCurrency(parseInt(product.gianhap) || 0);
            const tyle = parseFloat(product.tyle) || 0;
            const giaban = this.formatCurrency(parseInt(product.gia) || 0);
            
            row.innerHTML = `
                <td style="padding: 15px; border-bottom: 1px solid #eee; color: #344767;">${stt}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                 <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="../${product.link}" alt="${product.tensp}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
                            <div>
                    <div style="font-weight: 500; color: #344767;">${product.tensp}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">Tác giả: ${product.tacgia}</div>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                        ${categoryText}
                    </span>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500; color: #e91e63;">
                    ${gianhap}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; color: #344767;">
                    ${tyle}%
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #4caf50;">
                    ${giaban}
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        // Render phân trang
        this.renderPagination('price-search-pagination', totalPages);
        this.updatePaginationInfo('price-search-info', filteredProducts.length, startIndex, endIndex);
    },

    filterProductsForTab1() {
        const searchText = document.getElementById('product-search')?.value.toLowerCase() || '';
        const category = document.getElementById('product-category')?.value || '';
        
        return this.allProducts.filter(product => {
            const matchesSearch = product.tensp.toLowerCase().includes(searchText) || 
                                 product.tacgia.toLowerCase().includes(searchText);
            const matchesCategory = !category || product.danhmuc === category;
            
            return matchesSearch && matchesCategory;
        });
    },

    filterProductsForTab2() {
        const searchText = document.getElementById('price-product-search')?.value.toLowerCase() || '';
        const category = document.getElementById('price-category')?.value || '';
        const priceRange = document.getElementById('price-range')?.value || '';
        
        return this.allProducts.filter(product => {
            const matchesSearch = product.tensp.toLowerCase().includes(searchText) || 
                                 product.tacgia.toLowerCase().includes(searchText);
            const matchesCategory = !category || product.danhmuc === category;
            const matchesPriceRange = this.checkPriceRange(product, priceRange);
            
            return matchesSearch && matchesCategory && matchesPriceRange;
        });
    },

    checkPriceRange(product, priceRange) {
        if (!priceRange) return true;
        
        const gia = parseInt(product.gia) || 0;
        const [min, max] = priceRange.split('-').map(Number);
        
        return gia >= min && gia <= max;
    },

    renderPagination(containerId, totalPages) {
        const paginationElement = document.getElementById(containerId);
        paginationElement.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="material-icons-round">chevron_left</i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: white;
            color: #666;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderProducts();
            }
        };
        paginationElement.appendChild(prevBtn);
        
        // Logic hiển thị nút trang
        if (totalPages <= 4) {
            // Hiển thị tất cả trang
            for (let i = 1; i <= totalPages; i++) {
                this.createPaginationButton(paginationElement, i, totalPages);
            }
        } else {
            // Luôn hiển thị trang đầu
            this.createPaginationButton(paginationElement, 1, totalPages);
            
            // Thêm dấu ... nếu cần
            if (this.currentPage > 3) {
                const dots1 = document.createElement('span');
                dots1.textContent = '...';
                dots1.style.padding = '0 8px';
                dots1.style.display = 'inline-block';
                dots1.style.color = '#666';
                paginationElement.appendChild(dots1);
            }
            
            // Tính toán các trang cần hiển thị ở giữa
            let startPage = Math.max(2, this.currentPage - 1);
            let endPage = Math.min(totalPages - 1, this.currentPage + 1);
            
            // Điều chỉnh nếu ở đầu hoặc cuối
            if (this.currentPage <= 3) {
                startPage = 2;
                endPage = Math.min(4, totalPages - 1);
            } else if (this.currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
                endPage = totalPages - 1;
            }
            
            // Thêm các trang giữa
            for (let i = startPage; i <= endPage; i++) {
                this.createPaginationButton(paginationElement, i, totalPages);
            }
            
            // Thêm dấu ... nếu cần
            if (this.currentPage < totalPages - 2) {
                const dots2 = document.createElement('span');
                dots2.textContent = '...';
                dots2.style.padding = '0 8px';
                dots2.style.display = 'inline-block';
                dots2.style.color = '#666';
                paginationElement.appendChild(dots2);
            }
            
            // Luôn hiển thị trang cuối
            if (totalPages > 1) {
                this.createPaginationButton(paginationElement, totalPages, totalPages);
            }
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="material-icons-round">chevron_right</i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: white;
            color: #666;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderProducts();
            }
        };
        paginationElement.appendChild(nextBtn);
    },

    createPaginationButton(container, pageNumber, totalPages) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: white;
            color: #666;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        
        if (pageNumber === this.currentPage) {
            btn.style.background = 'linear-gradient(195deg, #e91e63, #c2185b)';
            btn.style.color = 'white';
            btn.style.border = 'none';
        }
        
        btn.textContent = pageNumber;
        btn.onclick = () => {
            this.currentPage = pageNumber;
            this.renderProducts();
        };
        container.appendChild(btn);
    },

    updatePaginationInfo(elementId, totalItems, startIndex, endIndex) {
        const paginationInfo = document.getElementById(elementId);
        if (totalItems === 0) {
            paginationInfo.textContent = 'Hiển thị 0-0 của 0 sản phẩm';
            return;
        }
        
        const startItem = startIndex + 1;
        paginationInfo.textContent = `Hiển thị ${startItem}-${endIndex} của ${totalItems} sản phẩm`;
    },

    async saveProfitRate(masp) {
    // 1. Tìm input chứa giá trị tỷ lệ lợi nhuận cho sản phẩm có masp tương ứng
    const inputElement = document.querySelector(`input.percentage-input[data-masp="${masp}"]`);
    
    if (!inputElement) {
        this.showNotification('error', 'Lỗi', 'Không tìm thấy thông tin sản phẩm');
        return;
    }
    const rawValue = inputElement.value; // Lấy giá trị chuỗi chưa ép kiểu
   const tyle = Number(rawValue); // Chuyển sang kiểu số (ví dụ: 10.5)

    // Kiểm tra nếu không phải là số HOẶC không phải là số nguyên
    if (isNaN(tyle) || !Number.isInteger(tyle)) {
        this.showNotification('error', 'Lỗi', 'Vui lòng nhập tỷ lệ lợi nhuận hợp lệ (số nguyên)');
        inputElement.focus();
        return;
    }

    if (tyle <=0 || tyle > 100) {
        this.showNotification('error', 'Lỗi', 'Tỷ lệ lợi nhuận phải từ 1% đến 100%');
        inputElement.focus();
        return;
    }
    
    // 5. Hiển thị trạng thái loading cho nút lưu
    const saveButton = document.querySelector(`button.save-profit-btn[data-masp="${masp}"]`);
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="material-icons-round">hourglass_empty</i> Đang lưu...';
    saveButton.disabled = true;
    
    try {
        // 6. Gọi API với method PUT
        const response = await fetch(`http://localhost/web2/controller/product.php?masp=${masp}&tyle=${tyle}`, {
            method: 'PUT'
        });

        // 7. Kiểm tra response
        if (!response.ok) {
            throw new Error(`vui lòng nhập hàng để điều chỉnh giá bán`);
        }

        const result = await response.json();
        
        // 8. Xử lý kết quả
        if (result.success) {
            // Hiển thị thông báo thành công
            this.showNotification('success', 'Thành công', 'Cập nhật tỷ lệ lợi nhuận thành công');
            
            // Cập nhật giá trị trong input để hiển thị số nguyên đã lưu
            inputElement.value = tyle;
            
            this.loaddatagiaban();
            
        } else {
            // Hiển thị thông báo lỗi từ server
            this.showNotification('error', 'Thất bại', result.message || 'Vui lòng nhập hàng');
        }
        
    } catch (error) {
        console.error('Lỗi khi lưu tỷ lệ lợi nhuận:', error);
        this.showNotification('error', 'Lỗi', error.message );
          inputElement.value = 0;
    } finally {
        // 9. Khôi phục trạng thái nút lưu
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
       
    }

    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    },

    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(195deg, #4caf50, #388e3c)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(195deg, #f44336, #d32f2f)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(195deg, #ff9800, #f57c00)';
        } else {
            notification.style.background = 'linear-gradient(195deg, #2196f3, #1976d2)';
        }
        
        notification.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;">${title}</div>
            <div style="font-size: 14px;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
};
///////////////////////////////////QUẢN LÝ TỒN KHO/////////////////////////////////////////////////
const InventoryManagement = {
    inventoryData: [],
    stockAlertData: [],
    reportData: [],
    categories: [],
    globalMinStock: 5,
    currentTab: 'inventory-search',
    // Thêm vào đầu object InventoryManagement, sau các biến khai báo:
reportCurrentPage: 1,
reportItemsPerPage: 5,
reportTotalPages: 1,
inventoryCurrentPage: 1,
    inventoryItemsPerPage: 5,
    inventoryTotalPages: 1,
    lastHistoryContext: null, 
    isFromHistory: false,

    async fetchCategories() {
        try {
            const response = await fetch('http://localhost/web2/controller/danhmuc.php?action=alladmin');
            const result = await response.json();
            if (result.success) {
                this.categories = result.data;
            }
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    },

    // 2. Tạo các thẻ option động cho các thẻ select
    generateCategoryOptions() {
        return this.categories.map(cat => 
            `<option value="${cat.madm}">${cat.tendm}</option>`
        ).join('');
    },
    async loaddatatonkho() {
        await this.fetchCategories();
        this.renderInventoryManagementPage();
        this.setupEventListeners();
        // Load initial data for current tab
        if (this.currentTab === 'stock-alert') {
            await this.loadStockAlertData();
        }
    },

    renderInventoryManagementPage() {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;
        
        mainElement.innerHTML = `
            <nav style="margin-bottom: 1.5rem; background:white; padding:1rem 1.5rem; border-radius:0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <span style="color:#e91e63; font-weight:600;">Quản lý tồn kho</span>
            </nav>

            <div style="background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 1.5rem;">
                <div style="background: linear-gradient(195deg, #e91e63, #c2185b); color: white; padding: 1.25rem 1.5rem;">
                    <h3 style="margin: 0; font-size: 1.2rem;">Quản lý số lượng tồn kho sản phẩm</h3>
                </div>
                <div style="padding: 1.5rem;">
                    <!-- Tabs -->
                    <div class="tabs" style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 1.5rem;">
                        <div class="tab ${this.currentTab === 'inventory-search' ? 'active' : ''}" 
                             data-tab="inventory-search" 
                             style="padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500; border-bottom: 2px solid ${this.currentTab === 'inventory-search' ? '#e91e63' : 'transparent'}; transition: all 0.2s; ${this.currentTab === 'inventory-search' ? 'color: #e91e63;' : 'color: #666;'}">
                            Tra cứu tồn kho theo loại sản phẩm
                        </div>
                        <div class="tab ${this.currentTab === 'stock-alert' ? 'active' : ''}" 
                             data-tab="stock-alert" 
                             style="padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500; border-bottom: 2px solid ${this.currentTab === 'stock-alert' ? '#e91e63' : 'transparent'}; transition: all 0.2s; ${this.currentTab === 'stock-alert' ? 'color: #e91e63;' : 'color: #666;'}">
                            Cảnh báo tồn kho
                        </div>
                        <div class="tab ${this.currentTab === 'inventory-report' ? 'active' : ''}" 
                             data-tab="inventory-report" 
                             style="padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500; border-bottom: 2px solid ${this.currentTab === 'inventory-report' ? '#e91e63' : 'transparent'}; transition: all 0.2s; ${this.currentTab === 'inventory-report' ? 'color: #e91e63;' : 'color: #666;'}">
                            Báo cáo nhập - xuất
                        </div>
                    </div>

                    <!-- Tab 1: Tra cứu tồn kho -->
                  <div class="tab-content" id="inventory-search" style="display: ${this.currentTab === 'inventory-search' ? 'block' : 'none'};">
    <div class="search-form" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <div class="form-row" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 1rem;">
            <div class="form-col" style="flex: 1; min-width: 200px;">
                <div class="form-group">
                    <label class="form-label" for="date-search" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Thời điểm</label>
                    <input type="date" id="date-search" class="form-control" value="${this.getTodayDate()}" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                </div>
            </div>

            <div class="form-col" style="flex: 1; min-width: 200px;">
                <div class="form-group">
                    <label class="form-label" for="date-search" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Tên sản phẩm</label>
                    <input type="text" id="product-name" class="form-control" placeholder="Nhập tên sản phẩm" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                </div>
            </div>
            
            <div class="form-col" style="flex: 1; min-width: 200px;">
                <div class="form-group">
                    <label class="form-label" for="product-category" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Danh mục</label>
                    <select id="product-category" class="form-control" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white;">
                        <option value="">Tất cả</option>
                       ${this.generateCategoryOptions()} <!-- GỌI DANH MỤC ĐỘNG -->
                    </select>
                </div>
            </div>
        </div>

        <div class="search-actions" style="display: flex; gap: 10px;">
            <button class="btn btn-primary" id="search-inventory-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                <i class="material-icons-round" style="font-size: 18px;">search</i> Tìm kiếm
            </button>
            <button class="btn btn-secondary" id="reset-search" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                <i class="material-icons-round" style="font-size: 18px;">refresh</i> Đặt lại
            </button>
        </div>
    </div>

<table id="inventory-table" style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <thead>
        <tr style="background: #f8f9fa;">
            <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">STT</th>
            <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Sản phẩm</th>
            <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Danh mục</th>
            <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Số lượng tồn</th>
        </tr>
    </thead>
    <tbody id="inventory-table-body">
        <tr>
            <td colspan="4" style="text-align: center; padding: 2rem; color: #666;">
                Vui lòng chọn ngày, danh mục và nhấn "Tìm kiếm"
            </td>
        </tr>
    </tbody>
</table>
                    </div>

                    <!-- Tab 2: Cảnh báo tồn kho -->
                    <div class="tab-content" id="stock-alert" style="display: ${this.currentTab === 'stock-alert' ? 'block' : 'none'};"> 
                    <div id="alert-message" style="display: none; background: #fff3e0; border: 1px solid #ffb74d; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <i class="material-icons-round" style="color: #f57c00; font-size: 24px;">warning</i>
                                <div id="alert-title" style="font-weight: 600; color: #e65100; font-size: 16px;"></div>
                            </div>
                            <p id="alert-description" style="margin: 0; color: #666;">
                                Vui lòng kiểm tra và nhập thêm hàng cho các sản phẩm dưới đây để đảm bảo không gián đoạn kinh doanh.
                            </p>
                        </div>

                        <div class="summary-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="summary-card" style="background: white; border-radius: 8px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
                                <div id="total-products" class="summary-value" style="font-size: 2rem; font-weight: 700; color: #2196f3; margin-bottom: 0.5rem;">0</div>
                                <div class="summary-label" style="font-size: 14px; color: #666;">Tổng số sản phẩm</div>
                            </div>
                            <div class="summary-card" style="background: white; border-radius: 8px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
                                <div id="in-stock-products" class="summary-value" style="font-size: 2rem; font-weight: 700; color: #4caf50; margin-bottom: 0.5rem;">0</div>
                                <div class="summary-label" style="font-size: 14px; color: #666;">Sản phẩm tồn kho</div>
                            </div>
                            <div class="summary-card" style="background: white; border-radius: 8px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; border-color: #ff9800;">
                                <div id="low-stock-products" class="summary-value" style="font-size: 2rem; font-weight: 700; color: #ff9800; margin-bottom: 0.5rem;">0</div>
                                <div class="summary-label" style="font-size: 14px; color: #666;">Sắp hết hàng</div>
                            </div>
                            <div class="summary-card" style="background: white; border-radius: 8px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; border-color: #f44336;">
                                <div id="out-of-stock-products" class="summary-value" style="font-size: 2rem; font-weight: 700; color: #f44336; margin-bottom: 0.5rem;">0</div>
                                <div class="summary-label" style="font-size: 14px; color: #666;">Đã hết hàng</div>
                            </div>
                        </div>
                         <div style="background: white; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #eee; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <i class="material-icons-round" style="color: #e91e63;">settings_suggest</i>
        <span style="font-weight: 500; color: #344767;">Mức tồn tối thiểu:</span>
        <input type="number" id="global-min-stock-input" value="${this.globalMinStock}" 
               style="width: 100px; padding: 8px 12px; border: 1px solid #d2d6da; border-radius: 6px; text-align: center; font-weight: 600;">
        <button onclick="InventoryManagement.applyGlobalMinStock()" 
                style="background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 9px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 5px; transition: all 0.2s;">
            <i class="material-icons-round" style="font-size: 18px;">save</i> Lưu
        </button>
    </div>
                        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">STT</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Sản phẩm</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Danh mục</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Số lượng tồn</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Mức tồn tối thiểu</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Trạng thái</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="stock-alert-table-body">
                                <tr>
                                    <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Tab 3: Báo cáo nhập - xuất -->
                    <div class="tab-content" id="inventory-report" style="display: ${this.currentTab === 'inventory-report' ? 'block' : 'none'};">
                        <div class="search-form" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <div class="form-row" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 1rem;">
                                
                            <div class="form-col" style="flex: 1; min-width: 200px;">
                                    <div class="form-group">
                                        <label class="form-label" for="from-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Tên sản phẩm</label>
                                        <input type="text" id="product-name2" class="form-control" placeholder="Nhập tên sản phẩm" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                    </div>
                                </div>
                            <div class="form-col" style="flex: 1; min-width: 200px;">
                                    <div class="form-group">
                                        <label class="form-label" for="from-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Từ ngày</label>
                                        <input type="date" id="from-date" class="form-control" value="${this.getFirstDayOfMonth()}" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                    </div>
                                </div>
                                <div class="form-col" style="flex: 1; min-width: 200px;">
                                    <div class="form-group">
                                        <label class="form-label" for="to-date" style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: #344767;">Đến ngày</label>
                                        <input type="date" id="to-date" class="form-control" value="${this.getTodayDate()}" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                    </div>
                                </div>
                            </div>
                            <div class="search-actions" style="display: flex; gap: 10px;">
                                <button class="btn btn-primary" id="search-report-btn" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #4caf50, #388e3c); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                    <i class="material-icons-round" style="font-size: 18px;">search</i> Tìm kiếm
                                </button>
                                <button class="btn btn-secondary" id="reset-report" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(195deg, #757575, #616161); color: white; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                    <i class="material-icons-round" style="font-size: 18px;">refresh</i> Đặt lại
                                </button>
                            </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">STT</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Sản phẩm</th>
                                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Danh mục</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Tổng số lượng nhập</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Tổng số lượng xuất</th>
                                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #e0e0e0;">Thao tác</th>

                                </tr>
                            </thead>
                            <tbody id="report-table-body">
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                                        Vui lòng chọn khoảng thời gian và nhấn "Tìm kiếm" để xem báo cáo
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Tab 1: Tra cứu tồn kho
        document.getElementById('search-inventory-btn')?.addEventListener('click', () => this.searchInventory());
        document.getElementById('reset-search')?.addEventListener('click', () => this.resetInventorySearch());

        // Tab 3: Báo cáo
        document.getElementById('search-report-btn')?.addEventListener('click', () => this.searchReport());
        document.getElementById('reset-report')?.addEventListener('click', () => this.resetReportSearch());
    },

    applyGlobalMinStock() {
        const inputVal = document.getElementById('global-min-stock-input').value;
        const newValue = parseInt(inputVal);
        
        if (isNaN(newValue) || newValue < 0) {
            this.showNotification('error', 'Lỗi', 'Vui lòng nhập một số nguyên dương');
            return;
        }

        this.globalMinStock = newValue;
        this.renderStockAlertTable();
        this.renderStockAlertSummary();
        this.showNotification('success', 'Thành công', `Đã áp dụng mức tồn tối thiểu ${newValue} cho tất cả sản phẩm`);
    },

    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update active tab UI
        document.querySelectorAll('.tab').forEach(tab => {
            const isActive = tab.getAttribute('data-tab') === tabId;
            tab.style.borderBottomColor = isActive ? '#e91e63' : 'transparent';
            tab.style.color = isActive ? '#e91e63' : '#666';
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = content.id === tabId ? 'block' : 'none';
        });

        // Load data for the selected tab
        this.loadTabData();
    },

    loadTabData() {
        switch(this.currentTab) {
            case 'inventory-search':
                // Không tự động tải, chờ người dùng nhấn tìm kiếm
                break;
            case 'stock-alert':
                this.loadStockAlertData();
                break;
            case 'inventory-report':
                // Không tự động tải, chờ người dùng nhấn tìm kiếm
                break;
        }
    },

    getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    getFirstDayOfMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-01`;
    },

    // Tab 1: Tra cứu tồn kho
   // Tab 1: Tra cứu tồn kho
    async searchInventory() {
        const dateInput = document.getElementById('date-search');
        const dateValue = dateInput.value;
        const danhmuc = document.getElementById('product-category').value;
        const tensp= document.getElementById('product-name').value.trim().toLowerCase();
        if (!dateValue) {
            this.showNotification('error', 'Lỗi', 'Vui lòng chọn ngày tra cứu');
            return;
        }
        
        try {
            // Gọi URL theo yêu cầu của bạn
            const response = await fetch(`http://localhost/web2/controller/tonkho.php?action=tracuutonkho&ngay=${dateValue}&danhmuc=${danhmuc}&tensp=${tensp}`);
            
            if (!response.ok) throw new Error('Không thể kết nối đến server');
            
            const result = await response.json();
            
            if (result.success) {
                // Đổ dữ liệu từ mảng result.data.data vào
                this.inventoryData = result.data.data || [];
                this.inventoryCurrentPage = 1; 
                this.inventoryTotalPages = Math.ceil(this.inventoryData.length / this.inventoryItemsPerPage);
                
                this.renderInventoryTableWithPagination();
                this.renderInventoryPagination();
                
                this.showNotification('success', 'Thành công', `Tìm thấy ${this.inventoryData.length} sản phẩm`);
            } else {
                this.showNotification('error', 'Lỗi', result.message || 'Không có dữ liệu');
                this.renderEmptyInventoryTable(result.message);
            }
        } catch (error) {
            console.error('Lỗi tra cứu:', error);
            this.showNotification('error', 'Lỗi', 'Không thể kết nối đến server');
        }
    },

    renderInventoryTableWithPagination() {
        const tableBody = document.getElementById('inventory-table-body');
        if (!tableBody) return;

        if (this.inventoryData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem;">Không có dữ liệu</td></tr>`;
            return;
        }

        const startIndex = (this.inventoryCurrentPage - 1) * this.inventoryItemsPerPage;
        const endIndex = Math.min(startIndex + this.inventoryItemsPerPage, this.inventoryData.length);
        const currentPageData = this.inventoryData.slice(startIndex, endIndex);


        let html = '';
        currentPageData.forEach((item, index) => {
            const stt = startIndex + index + 1;
            const tonKho = parseInt(item.ton_kho) || 0;
            const categoryObj = this.categories.find(c => c.madm === item.danhmuc);
            const categoryText = categoryObj ? categoryObj.tendm : item.danhmuc;
            html += `
                <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #eee;">${stt}</td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="../${item.link}" alt="${item.tensp}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
                            <div>
                                <div style="font-weight: 600; color: #344767;">${item.tensp}</div>
                                <div style="font-size: 12px; color: #888;">Tác giả: ${item.tacgia}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee;">${categoryText}</td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
                        <span style="font-weight: 700; color: ${tonKho <= 15 ? '#f44336' : '#4caf50'}">${tonKho}</span>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    },

    renderInventoryPagination() {
    const table = document.getElementById('inventory-table');
    if (!table) return;

    // Xóa phân trang cũ
    const oldPag = table.nextElementSibling;
    if (oldPag && oldPag.classList.contains('inventory-pagination')) oldPag.remove();

    if (this.inventoryTotalPages <= 1) return;

    const container = document.createElement('div');
    container.className = 'pagination-container inventory-pagination';
    container.style.cssText = `
        display: flex; 
        justify-content: center; 
        align-items: center;
        gap: 5px; 
        margin-top: 1rem; 
        padding: 1rem;
        background: white;
        border-radius: 8px;
    `;

    let html = '';

    // Nút Trang trước (Prev)
    html += `
        <button onclick="InventoryManagement.changeInventoryPage(${this.inventoryCurrentPage - 1})" 
            style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; ${this.inventoryCurrentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}" 
            ${this.inventoryCurrentPage === 1 ? 'disabled' : ''}>
            <i class="material-icons-round" style="font-size: 18px; vertical-align: middle;">chevron_left</i>
        </button>
    `;

    // Logic tính toán các số trang hiển thị
    const delta = 1; // Số trang hiển thị bên cạnh trang hiện tại (Ví dụ: [2] 3 [4])
    const range = [];
    for (let i = 1; i <= this.inventoryTotalPages; i++) {
        if (
            i === 1 || // Luôn hiện trang đầu
            i === this.inventoryTotalPages || // Luôn hiện trang cuối
            (i >= this.inventoryCurrentPage - delta && i <= this.inventoryCurrentPage + delta) // Hiện trang xung quanh trang hiện tại
        ) {
            range.push(i);
        }
    }

    let l;
    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                // Nếu khoảng cách là 2, hiện số ở giữa luôn
                html += this.renderPageButton(l + 1);
            } else if (i - l !== 1) {
                // Nếu khoảng cách lớn hơn 2, hiện dấu "..."
                html += `<span style="padding: 8px 4px; color: #666;">...</span>`;
            }
        }
        html += this.renderPageButton(i);
        l = i;
    }

    // Nút Trang sau (Next)
    html += `
        <button onclick="InventoryManagement.changeInventoryPage(${this.inventoryCurrentPage + 1})" 
            style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; ${this.inventoryCurrentPage === this.inventoryTotalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}" 
            ${this.inventoryCurrentPage === this.inventoryTotalPages ? 'disabled' : ''}>
            <i class="material-icons-round" style="font-size: 18px; vertical-align: middle;">chevron_right</i>
        </button>
    `;

    container.innerHTML = html;
    table.parentNode.insertBefore(container, table.nextSibling);
},

// Hàm phụ trợ để tạo HTML cho nút số trang
renderPageButton(pageNumber) {
    const isActive = this.inventoryCurrentPage === pageNumber;
    return `
        <button onclick="InventoryManagement.changeInventoryPage(${pageNumber})" 
            style="padding: 8px 14px; border: 1px solid ${isActive ? '#e91e63' : '#ddd'}; 
            background: ${isActive ? '#e91e63' : 'white'}; 
            color: ${isActive ? 'white' : '#333'}; 
            font-weight: ${isActive ? '600' : '400'};
            border-radius: 4px; cursor: pointer; transition: all 0.2s;">
            ${pageNumber}
        </button>
    `;
},

    changeInventoryPage(page) {
        if (page < 1 || page > this.inventoryTotalPages) return;
        this.inventoryCurrentPage = page;
        this.renderInventoryTableWithPagination();
        this.renderInventoryPagination();
    },

   resetInventorySearch() {
    // 1. Đặt lại giá trị các ô nhập liệu
    document.getElementById('date-search').value = this.getTodayDate();
    const categorySelect = document.getElementById('product-category');
    if (categorySelect) categorySelect.selectedIndex = 0;
    document.getElementById('product-name').value = '';
    // 2. Cập nhật nội dung bảng và sửa lỗi căn giữa (colspan="4")
    const tableBody = document.getElementById('inventory-table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: #666;">
                    Vui lòng chọn ngày và nhấn "Tìm kiếm" để xem dữ liệu
                </td>
            </tr>
        `;
    }

    // 3. Tìm và xóa phần phân trang nếu đang tồn tại
    const table = document.getElementById('inventory-table');
    if (table) {
        const oldPag = table.nextElementSibling;
        if (oldPag && oldPag.classList.contains('inventory-pagination')) {
            oldPag.remove();
        }
    }

    // 4. Reset lại trạng thái dữ liệu trong code
    this.inventoryCurrentPage = 1;
    this.inventoryData = [];
},

    // Tab 2: Cảnh báo tồn kho
    async loadStockAlertData() {
        try {
            const response = await fetch('http://localhost/web2/controller/product.php?action=all');
            
            if (!response.ok) {
                throw new Error('Không thể kết nối đến server');
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.stockAlertData = result.data.data || [];
                this.renderStockAlertSummary();
                this.renderStockAlertTable();
            } else {
                this.showNotification('error', 'Lỗi', 'Không thể tải dữ liệu sản phẩm');
                this.renderEmptyStockAlertTable(result.message);
            }
        } catch (error) {
            console.error('Lỗi tải dữ liệu cảnh báo:', error);
            this.showNotification('error', 'Lỗi', 'Không thể kết nối đến server');
            this.renderEmptyStockAlertTable('Không thể kết nối đến server');
        }
    },

    renderStockAlertSummary() {
    const totalProducts = this.stockAlertData.length;
    let inStockProducts = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    
    this.stockAlertData.forEach(product => {
        const tonkho = parseInt(product.tonkho) || 0;
        
        // LẤY MỨC TỐI THIỂU ĐỘNG: Nếu có trong Map thì dùng, không thì mặc định là 5
        const minThreshold =this.globalMinStock;
        
        if (tonkho > 0) {
            inStockProducts++;
            // So sánh với mức tối thiểu vừa lấy được ở trên
            if (tonkho <= minThreshold) {
                lowStockProducts++;
            }
        } else {
            // Tồn kho = 0 thì luôn là hết hàng
            outOfStockProducts++;
        }
    });
    
    // Cập nhật con số lên giao diện
    const totalEl = document.getElementById('total-products');
    const inStockEl = document.getElementById('in-stock-products');
    const lowStockEl = document.getElementById('low-stock-products');
    const outOfStockEl = document.getElementById('out-of-stock-products');
    
    if (totalEl) totalEl.textContent = totalProducts;
    if (inStockEl) inStockEl.textContent = inStockProducts;
    if (lowStockEl) lowStockEl.textContent = lowStockProducts;
    if (outOfStockEl) outOfStockEl.textContent = outOfStockProducts;

    // Cập nhật luôn cái dòng thông báo "CẢNH BÁO..."
    const alertTitle = document.getElementById('alert-title');
    const alertSection = document.getElementById('alert-message');
    if (alertTitle && alertSection) {
        if (lowStockProducts > 0 || outOfStockProducts > 0) {
            alertTitle.textContent = `CẢNH BÁO: Có ${lowStockProducts} sản phẩm sắp hết hàng và ${outOfStockProducts} sản phẩm đã hết hàng`;
            alertSection.style.display = 'block';
        } else {
            alertSection.style.display = 'none';
        }
    }
},

renderStockAlertTable() {
    const tableBody = document.getElementById('stock-alert-table-body');
    if (!tableBody) return;

    if (this.stockAlertData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Đang tải dữ liệu...</td></tr>';
        return;
    }

    let html = '';
    this.stockAlertData.forEach((product, index) => {
        const tonkho = parseInt(product.tonkho) || 0;
        const categoryObj = this.categories.find(c => c.madm === product.danhmuc);
        const categoryText = categoryObj ? categoryObj.tendm : product.danhmuc;
        
        // SỬ DỤNG GIÁ TRỊ CHUNG
        const minThreshold = this.globalMinStock;

        if (tonkho > minThreshold) return;

        const stt = index + 1;
        let statusIcon = tonkho === 0 ? 'error' : 'warning';
        let statusText = tonkho === 0 ? 'Hết hàng' : 'Sắp hết hàng';
        let statusColor = tonkho === 0 ? '#c62828' : '#ef6c00';
        let statusBg = tonkho === 0 ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)';

        html += `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">${stt}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="../${product.link}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
                        <div>
                            <div style="font-weight: 500; color: #344767;">${product.tensp}</div>
                            <div style="font-size: 12px; color: #666;">Tác giả: ${product.tacgia}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">${categoryText}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">${tonkho}</td>
                
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; color: #666; font-weight: 500;">
                    ${minThreshold}
                </td>

                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; background: ${statusBg}; color: ${statusColor};">
                        <i class="material-icons-round" style="font-size: 14px;">${statusIcon}</i>${statusText}
                    </span>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
                    <button class="btn btn-warning" onclick="InventoryManagement.importProduct(${product.masp})" style="padding: 6px 10px; border-radius: 6px; border: none; background: orange; color: white; cursor: pointer;">
                        Nhập hàng
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html || '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Tất cả sản phẩm đều đủ số lượng tồn kho</td></tr>';
    this.renderStockAlertSummary();
},

    renderEmptyStockAlertTable(message) {
        const tableBody = document.getElementById('stock-alert-table-body');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                        ${message || 'Không có dữ liệu'}
                    </td>
                </tr>
            `;
        }
    },
// Thêm hàm này vào trong object InventoryManagement
updateLocalMinStock(productId, value) {
    const newValue = parseInt(value);
    if (isNaN(newValue) || newValue < 0) return;

    // Lưu vào bộ nhớ tạm của trang
    this.minStockMap[productId] = newValue;

    // Vẽ lại bảng để cập nhật danh sách cảnh báo (có thể sản phẩm sẽ mất đi hoặc hiện ra tùy con số mới)
    this.renderStockAlertTable();
    
    this.showNotification('info', 'Thông báo', 'Đã thay đổi mức tồn tối thiểu cho sản phẩm');
},
    importProduct(productId) {
        // Redirect to import management
        if (typeof ImportManagement !== 'undefined' && ImportManagement.showAddImportForm) {
            ImportManagement.showAddImportForm();
            this.showNotification('info', 'Thông tin', 'Đã chuyển đến màn hình nhập hàng. Vui lòng chọn sản phẩm cần nhập.');
        } else {
            this.showNotification('warning', 'Cảnh báo', 'Chức năng nhập hàng chưa sẵn sàng. Vui lòng thử lại sau.');
        }
    },

    // Tab 3: Báo cáo nhập - xuất
    async searchReport() {
        const fromDate = document.getElementById('from-date').value;
        const toDate = document.getElementById('to-date').value;
        const productName = document.getElementById('product-name2').value.trim().toLowerCase();
        if (!fromDate || !toDate) {
            this.showNotification('error', 'Lỗi', 'Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc');
            return;
        }
        
        if (fromDate > toDate) {
            this.showNotification('error', 'Lỗi', 'Ngày bắt đầu không thể lớn hơn ngày kết thúc');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost/web2/controller/tonkho.php?action=baocao&ngaybatdau=${fromDate}&ngayketthuc=${toDate}&tensp=${productName}`);
            //alert(`http://localhost/web2/controller/tonkho.php?action=baocao&ngaybatdau=${fromDate}&ngayketthuc=${toDate}&tensp=${productName}`);
            
            const result = await response.json();
            
           if (result.success) {
    this.reportData = result.data.data || [];
    this.reportCurrentPage = 1; // Reset về trang đầu
    this.reportTotalPages = Math.ceil(this.reportData.length / this.reportItemsPerPage);
     this.renderReportTableWithPagination();
    this.renderReportPagination();
    this.showNotification('success', 'Thành công', `Đã tìm thấy ${this.reportData.length} sản phẩm trong báo cáo`);
} else {
                this.showNotification('error', 'Lỗi', result.message || 'Không thể tải dữ liệu báo cáo');
                this.renderEmptyReportTable(result.message);
            }
        } catch (error) {
            console.error('Lỗi tải báo cáo:', error);
            this.showNotification('error', 'Lỗi', 'Không thể kết nối đến server');
            this.renderEmptyReportTable('Không thể kết nối đến server');
        }
    },

 // Đổi tên hàm renderReportTable() thành renderReportTableWithPagination()
renderReportTableWithPagination() {
    const tableBody = document.getElementById('report-table-body');
    
    if (!tableBody) return;
    
    if (this.reportData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                    Không có dữ liệu báo cáo trong khoảng thời gian đã chọn
                </td>
            </tr>
        `;
        return;
    }
    
    // Tính toán dữ liệu cho trang hiện tại
    const startIndex = (this.reportCurrentPage - 1) * this.reportItemsPerPage;
    const endIndex = Math.min(startIndex + this.reportItemsPerPage, this.reportData.length);
    const currentPageData = this.reportData.slice(startIndex, endIndex);
    
    let html = '';
    
    
    
    // Số thứ tự bắt đầu cho trang hiện tại
    const startStt = startIndex + 1;
    
    currentPageData.forEach((item, index) => {
        const stt = startStt + index;
       const categoryObj = this.categories.find(c => c.madm === item.danhmuc);
            const categoryText = categoryObj ? categoryObj.tendm : item.danhmuc;
        
        const soLuongNhap = parseInt(item.SoLuongNhap) || 0;
        const soLuongXuat = parseInt(item.SoLuongXuat) || 0;
        
        html += `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #eee; color: #344767;">${stt}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="../${item.link}" alt="${item.tensp}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
                        <div>
                            <div style="font-weight: 500; color: #344767;">${item.tensp}</div>
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">Tác giả: ${item.tacgia}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">${categoryText}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600; color: #4caf50;">${soLuongNhap}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600; color: #e91e63;">${soLuongXuat}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
            <button class="btn btn-info" onclick="InventoryManagement.viewProductHistory(${item.ID_SanPham}, '${item.tensp.replace(/'/g, "\\'")}')" 
                style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: none; background: #00bcd4; color: white; font-size: 13px; cursor: pointer;">
                <i class="material-icons-round" style="font-size: 16px;">history</i> Lịch sử
            </button>
        </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
},
async viewProductHistory(productId, productName) {
    // Lấy đúng giá trị từ các input trong tab Báo cáo tồn kho để khớp với kết quả bảng
    const container = document.getElementById('inventory-report');
    const fromDate = container.querySelector('#from-date').value;
    const toDate = container.querySelector('#to-date').value;
this.lastHistoryContext = { id: productId, name: productName };
    if (!fromDate || !toDate) {
        this.showNotification('warning', 'Thông báo', 'Vui lòng chọn khoảng thời gian trước');
        return;
    }

    try {
        const response = await fetch(`http://localhost/web2/controller/tonkho.php?action=lichsuchitiet&masp=${productId}&ngaybatdau=${fromDate}&ngayketthuc=${toDate}`);
        const result = await response.json();

        if (result.success) {
            // Theo API bạn gửi, dữ liệu nằm trực tiếp trong result.data
            // result.data = { nhap: [...], xuat: [...] }
            this.showHistoryModal(productName, result.data);
        } else {
            this.showNotification('error', 'Lỗi', result.message || 'Không thể tải lịch sử sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi fetch lịch sử:', error);
        this.showNotification('error', 'Lỗi', error.message);
    }
},
closeHistoryAndViewDetail(type, id) {
        this.isFromHistory = true; // Bật cờ đánh dấu
        
        const historyModal = document.getElementById('history-modal');
        if (historyModal) historyModal.remove();

        if (type === 'import') {
            ImportManagement.viewImport(id);
        } else if (type === 'export') {
            OrderManagement.viewOrder(id);
        }
    },
formatCurrency(amount) {
        if (!amount) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    },
showHistoryModal(productName, data) {
    // 1. Kiểm tra và lấy mảng dữ liệu (đề phòng trường hợp null/undefined)
    const nhapList = (data && data.nhap) ? data.nhap : [];
    const xuatList = (data && data.xuat) ? data.xuat : [];

    // 2. Tạo nội dung hàng cho bảng Nhập
    const importRows = nhapList.length > 0 ? nhapList.map((item, i) => `
        <tr>
           <tr>
        <td style="padding:12px; border-bottom:1px solid #eee;">${i + 1}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; font-weight:600; color:#e91e63; text-align:left;">#PN${String(item.mapn).padStart(3, '0')}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:left;">${this.formatDateStandard(item.ngay)}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:center; font-weight:600;">${item.soluong}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:right; color:#4caf50; font-weight:500;">${this.formatCurrency(item.gia)}</td>
    <td style="padding:12px; border-bottom:1px solid #eee; text-align:center;">
            <button onclick="InventoryManagement.closeHistoryAndViewDetail('import', ${item.mapn})" 
                    style="background: #e91e63; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">
                <i class="material-icons-round" style="font-size: 18px;">visibility</i>
            </button>
        </td>
        </tr>
        </tr>
    `).join('') : '<tr><td colspan="5" style="text-align:center; padding:30px; color:#999; font-style:italic;">Không có lịch sử nhập kho trong giai đoạn này</td></tr>';

    // 3. Tạo nội dung hàng cho bảng Xuất
    const exportRows = xuatList.length > 0 ? xuatList.map((item, i) => `
        <tr>
           <td style="padding:12px; border-bottom:1px solid #eee;">${i + 1}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; font-weight:600; color:#1976d2; text-align:left;">#DH${String(item.madh).padStart(3, '0')}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:left;">${this.formatDateStandard(item.ngay)}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:center; font-weight:600;">${item.soluong}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:center; font-weight:600;">${this.formatCurrency(item.tongtien)}</td>
        <td style="padding:12px; border-bottom:1px solid #eee; text-align:center;">
            <button onclick="InventoryManagement.closeHistoryAndViewDetail('export', ${item.madh})" 
                    style="background: #1976d2; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">
                <i class="material-icons-round" style="font-size: 18px;">visibility</i>
            </button>
        </td>
        </tr>
    `).join('') : '<tr><td colspan="4" style="text-align:center; padding:30px; color:#999; font-style:italic;">Không có lịch sử xuất kho trong giai đoạn này</td></tr>';

    // 4. Xây dựng cấu trúc Modal
    const modal = document.createElement('div');
    modal.id = 'history-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); display: flex; justify-content: center;
        align-items: center; z-index: 10000; backdrop-filter: blur(4px);
    `;

    modal.innerHTML = `
        <div style="background: white; width: 95%; max-width: 850px; max-height: 85vh; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: slideUp 0.3s ease-out;">
            <div style="padding: 1.25rem 1.5rem; background: #344767; color: white; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600;">Lịch sử nhập-xuất cho sản phẩm: ${productName}</h3>
                <button onclick="document.getElementById('history-modal').remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 28px; line-height: 1;">&times;</button>
            </div>
            
            <div style="padding: 1.5rem; overflow-y: auto; flex: 1; background: #fdfdfd;">
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: #2e7d32; border-bottom: 2px solid #e8f5e9; padding-bottom: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                        <i class="material-icons-round">download</i> Lịch sử nhập hàng
                    </h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background: #f8f9fa; color: #7b809a; text-transform: uppercase; font-size: 12px;">
                                <th style="padding:12px; text-align:left;">STT</th>
                                <th style="padding:12px; text-align:left;">Mã phiếu nhập</th>
                                <th style="padding:12px; text-align:left;">Ngày nhập</th>
                                <th style="padding:12px; text-align:center;">Số lượng nhập</th>
                                <th style="padding:12px; text-align:right;">Giá nhập</th>
                                <th style="padding:12px; text-align:center;">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>${importRows}</tbody>
                    </table>
                </div>

                <div>
                    <h4 style="color: #c62828; border-bottom: 2px solid #ffebee; padding-bottom: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                        <i class="material-icons-round">upload</i> Lịch sử xuất hàng 
                    </h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background: #f8f9fa; color: #7b809a; text-transform: uppercase; font-size: 12px;">
                                <th style="padding:12px; text-align:left;">STT</th>
                                <th style="padding:12px; text-align:left;">Mã đơn hàng</th>
                                <th style="padding:12px; text-align:left;">Ngày bán</th>
                                <th style="padding:12px; text-align:center;">Số lượng bán</th>
                                <th style="padding:12px; text-align:center;">Tổng tiền</th>

                                <th style="padding:12px; text-align:center;">Chi tiết</th>

                            </tr>
                        </thead>
                        <tbody>${exportRows}</tbody>
                    </table>
                </div>
            </div>
            
            <div style="padding: 1rem 1.5rem; background: #f8f9fa; text-align: right; border-top: 1px solid #eee;">
                <button onclick="document.getElementById('history-modal').remove()" style="padding: 8px 24px; border-radius: 6px; border: 1px solid #d2d6da; background: white; color: #344767; font-weight: 600; cursor: pointer; transition: all 0.2s;">Đóng</button>
            </div>
        </div>
    `;

    // Thêm animation CSS nếu chưa có
    if (!document.getElementById('modal-animation-style')) {
        const style = document.createElement('style');
        style.id = 'modal-animation-style';
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Đóng khi nhấn Esc
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
},
formatDateStandard(dateStr) {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
},
// Thêm hàm mới để render phân trang
renderReportPagination() {
    const table = document.querySelector('#inventory-report table');
    if (!table) return;
    
    // Xóa phần phân trang cũ nếu có
    const oldPagination = table.nextElementSibling;
    if (oldPagination && oldPagination.classList.contains('pagination-container')) {
        oldPagination.remove();
    }
    
    if (this.reportTotalPages <= 1) return;
    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    paginationContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-top: 1.5rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    `;
    
    let paginationHTML = '';
    
    // Nút Trang trước
    paginationHTML += `
        <button class="pagination-btn ${this.reportCurrentPage === 1 ? 'disabled' : ''}" 
                onclick="InventoryManagement.changeReportPage(${this.reportCurrentPage - 1})"
                style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; ${this.reportCurrentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
            <i class="material-icons-round" style="font-size: 18px;">chevron_left</i>
        </button>
    `;
    
    // Trang đầu
    if (this.reportCurrentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" 
                    onclick="InventoryManagement.changeReportPage(1)"
                    style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
                1
            </button>
        `;
    }
    
    // Dấu "..." nếu cần
    if (this.reportCurrentPage > 3) {
        paginationHTML += `
            <span style="padding: 8px 4px;">...</span>
        `;
    }
    
    // Các trang xung quanh trang hiện tại
    const startPage = Math.max(2, this.reportCurrentPage - 1);
    const endPage = Math.min(this.reportTotalPages - 1, this.reportCurrentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== this.reportTotalPages) {
            paginationHTML += `
                <button class="pagination-btn ${this.reportCurrentPage === i ? 'active' : ''}" 
                        onclick="InventoryManagement.changeReportPage(${i})"
                        style="padding: 8px 12px; border: 1px solid ${this.reportCurrentPage === i ? '#e91e63' : '#ddd'}; 
                               background: ${this.reportCurrentPage === i ? '#e91e63' : 'white'}; 
                               color: ${this.reportCurrentPage === i ? 'white' : '#333'}; 
                               border-radius: 4px; cursor: pointer;">
                    ${i}
                </button>
            `;
        }
    }
    
    // Dấu "..." nếu cần
    if (this.reportCurrentPage < this.reportTotalPages - 2) {
        paginationHTML += `
            <span style="padding: 8px 4px;">...</span>
        `;
    }
    
    // Trang cuối
    if (this.reportTotalPages > 1 && this.reportCurrentPage < this.reportTotalPages) {
        paginationHTML += `
            <button class="pagination-btn" 
                    onclick="InventoryManagement.changeReportPage(${this.reportTotalPages})"
                    style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
                ${this.reportTotalPages}
            </button>
        `;
    }
    
    // Nút Trang sau
    paginationHTML += `
        <button class="pagination-btn ${this.reportCurrentPage === this.reportTotalPages ? 'disabled' : ''}" 
                onclick="InventoryManagement.changeReportPage(${this.reportCurrentPage + 1})"
                style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; ${this.reportCurrentPage === this.reportTotalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
            <i class="material-icons-round" style="font-size: 18px;">chevron_right</i>
        </button>
    `;
    
    // Thông tin tổng số trang
    paginationHTML += `
        <div style="margin-left: 15px; font-size: 14px; color: #666;">
            Trang ${this.reportCurrentPage} / ${this.reportTotalPages}
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    table.parentNode.insertBefore(paginationContainer, table.nextSibling);
},

// Thêm hàm chuyển trang
changeReportPage(page) {
    if (page < 1 || page > this.reportTotalPages) return;
    
    this.reportCurrentPage = page;
    this.renderReportTableWithPagination();
    this.renderReportPagination();
}
,
    renderEmptyReportTable(message) {
        const tableBody = document.getElementById('report-table-body');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                        ${message || 'Không có dữ liệu'}
                    </td>
                </tr>
            `;
        }
    },

    resetReportSearch() {
    document.getElementById('from-date').value = this.getFirstDayOfMonth();
    document.getElementById('to-date').value = this.getTodayDate();
    document.getElementById('product-name2').value = '';
    this.reportCurrentPage = 1;
    
    // Xóa phân trang cũ
    const table = document.querySelector('#inventory-report table');
    if (table) {
        const oldPagination = table.nextElementSibling;
        if (oldPagination && oldPagination.classList.contains('pagination-container')) {
            oldPagination.remove();
        }
    }
    
    document.getElementById('report-table-body').innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                Vui lòng chọn khoảng thời gian và nhấn "Tìm kiếm" để xem báo cáo
            </td>
        </tr>
    `;
},

    showNotification(type, title, message) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        `;
        
        // Add animation styles if not already present
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(195deg, #4caf50, #388e3c)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(195deg, #f44336, #d32f2f)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(195deg, #ff9800, #f57c00)';
        } else {
            notification.style.background = 'linear-gradient(195deg, #2196f3, #1976d2)';
        }
        
        notification.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;">${title}</div>
            <div style="font-size: 14px;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
};

// Hàm global cho quản lý tồn kho
// Hàm phụ trợ để xử lý việc tô sáng nút
function updateActiveButton(clickedBtn) {
    // Tìm tất cả các nút sidebar và xóa class 'active-btn'
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => btn.classList.remove('active-btn'));

    // Nếu có truyền vào element (trường hợp click trực tiếp) thì thêm class vào
    if (clickedBtn) {
        clickedBtn.classList.add('active-btn');
    }
}/////////////////////////////////// QUẢN LÝ DANH MỤC /////////////////////////////////////////////////
const CategoryManagement = {
    allCategories: [],
    currentPage: 1,
    itemsPerPage: 5,

    async loaddatadanhmuc() {
        try {
            const response = await fetch('http://localhost/web2/controller/danhmuc.php?action=alladmin');
            const result = await response.json();
            if (result.success) {
                this.allCategories = result.data;
                this.renderCategoryManagementPage();
            }
        } catch (error) {
            this.showError(`Lỗi: ${error.message}`);
        }
    },
renderPagination() {
    const paginationElement = document.getElementById('category-pagination');
    const totalPages = Math.ceil(this.allCategories.length / this.itemsPerPage);
    paginationElement.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            this.currentPage = i;
            this.renderCategories();
            this.renderPagination();
        };
        paginationElement.appendChild(btn);
    }
},
    renderCategoryManagementPage() {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `
            <nav style="margin-bottom: 1.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background-color: white;">
                <span style="color: #e91e63; font-weight: 600;">Quản lý danh mục</span>
            </nav>
            <div style="margin-bottom:1.2rem; text-align:right;">
                <button class="btn-add" onclick="CategoryManagement.showCategoryForm()">
                    <i class="material-icons-round">add_box</i> Thêm danh mục mới
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã danh mục</th>
                        <th>Tên danh mục</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="category-table-body"></tbody>
            </table>
            <div class="pagination" id="category-pagination"></div>
        `;
        this.renderCategories();
        this.renderPagination();
    },

    renderCategories() {
        const tableBody = document.getElementById('category-table-body');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const currentItems = this.allCategories.slice(startIndex, startIndex + this.itemsPerPage);

        tableBody.innerHTML = currentItems.map((dm, index) => {
            const statusActive = dm.trangthai == "1";
            return `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td style="font-weight:600; color:#e91e63;">${dm.madm}</td>
                    <td>${dm.tendm}</td>
                    <td>
                        <span class="status-badge ${statusActive ? 'status-active' : 'status-locked'}">
                            <i class="material-icons-round">${statusActive ? 'check_circle' : 'lock'}</i>
                            ${statusActive ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn btn-edit" onclick="CategoryManagement.showCategoryForm('${dm.madm}', '${dm.tendm}')">Sửa</button>
                            ${statusActive 
                                ? `<button class="btn btn-delete" onclick="CategoryManagement.toggleStatus('${dm.madm}', 0)">Khóa</button>`
                                : `<button class="btn btn-edit" style="background:#4caf50" onclick="CategoryManagement.toggleStatus('${dm.madm}', 1)">Mở khóa</button>`
                            }
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showCategoryForm(madm = '', tendanhmuc = '') {
    const isEdit = madm !== '';
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = `
        <nav style="margin-bottom: 1.5rem; padding: 1rem; background:white; border-radius:12px;">
            <span style="color:#e91e63; font-weight:600;">${isEdit ? 'Chỉnh sửa' : 'Thêm mới'} danh mục</span>
        </nav>
        <div style="max-width: 500px; margin: 2rem auto; background:white; padding:2rem; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <form id="category-form">
                <div class="form-group" style="margin-bottom:1.5rem;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Tên danh mục *</label>
                    <input type="text" id="form-tendanhmuc" value="${tendanhmuc}" required style="width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:6px;">
                </div>
                <div style="display:flex; justify-content: flex-end; gap:10px;">
                    <button type="button" class="btn-reset" onclick="CategoryManagement.loaddatadanhmuc()" style="background:#757575; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer;">Hủy</button>
                    <button type="submit" class="btn-search" style="background:linear-gradient(195deg, #4caf50, #388e3c); color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer;">Lưu</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('category-form').onsubmit = async (e) => {
        e.preventDefault();
        
        // Hiện trạng thái đang lưu (optional)
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerText = "Đang lưu...";
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append('tendanhmuc', document.getElementById('form-tendanhmuc').value.trim());
        if (isEdit) formData.append('madm', madm);

        try {
            // KIỂM TRA ĐƯỜNG DẪN NÀY: danhmuc.php hay category.php?
            const response = await fetch('http://localhost/web2/controller/danhmuc.php', { 
                method: 'POST', 
                body: formData 
            });

            // Nếu server trả về lỗi 404 hoặc 500
            if (!response.ok) {
                throw new Error(`Server trả về lỗi ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                this.showNotification('success', 'Thành công', result.message || 'Đã lưu danh mục');
                this.loaddatadanhmuc(); // Quay lại danh sách
            } else {
                // Trường hợp Backend trả về success: false
                this.showNotification('error', 'Thất bại', result.message || 'Không thể lưu danh mục');
                submitBtn.innerText = "Lưu";
                submitBtn.disabled = false;
            }
        } catch (error) {
            // Bắt lỗi parse JSON hoặc lỗi kết nối
            console.error("Lỗi chi tiết:", error);
            this.showNotification('error', 'Lỗi hệ thống', `${error.message}`);
            submitBtn.innerText = "Lưu";
            submitBtn.disabled = false;
        }
    };
},

    async toggleStatus(madm, newStatus) {
        const actionText = newStatus === 0 ? "khóa" : "mở khóa";
        if (!confirm(`Bạn có chắc chắn muốn ${actionText} danh mục này?`)) return;

        try {
            const response = await fetch(`http://localhost/web2/controller/danhmuc.php?madm=${madm}&status=${newStatus}`, {
                method: 'PUT'
            });
            const result = await response.json();
            if (result.success) {
                this.showNotification('success', 'Thành công', result.message);
                this.loaddatadanhmuc();
            }
        } catch (error) {
            this.showNotification('error', 'Lỗi', 'Không thể cập nhật trạng thái');
        }
    },

    showNotification(type, title, message) {
        InventoryManagement.showNotification(type, title, message);
    },

    showError(msg) {
        document.querySelector('main').innerHTML = `<div style="text-align: center; padding: 3rem; color: #e91e63;">${msg}</div>`;
    }
};

// Hàm global để sidebar gọi
function loaddatadanhmuc(el) {
    updateActiveButton(el);
    CategoryManagement.loaddatadanhmuc();
}

// Cập nhật các hàm global để nhận tham số 'el' (element)
function loaddatakhachhang(el) {
    updateActiveButton(el);
    CustomerManagement.loaddatakhachhang();
}

function loaddatadonhang(el) {
    updateActiveButton(el);
    OrderManagement.loaddatadonhang();
}

function loaddatasanpham(el) {
    updateActiveButton(el);
    ProductManagement.loaddatasanpham();
}

function loaddataphieunhap(el) {
    updateActiveButton(el);
    ImportManagement.loaddataphieunhap();
}

function loaddatagiaban(el) {
    updateActiveButton(el);
    PriceManagement.loaddatagiaban();
}

function loaddatatonkho(el) {
    updateActiveButton(el);
    InventoryManagement.loaddatatonkho();
}

// THIẾT LẬP KHI TRANG VỪA TẢI XONG
window.addEventListener('DOMContentLoaded', (event) => {
    // Tự động click vào nút đầu tiên (Quản lý khách hàng) khi vừa vào trang
    const firstBtn = document.querySelector('.sidebar-btn');
    if (firstBtn) {
        loaddatakhachhang(firstBtn);
    }
});
// Khởi tạo styles khi tải
OrderManagement.addStatusStyles();
///////////////////////////////////HÀM GLOBAL CHO SIDEBAR/////////////////////////////////////////////////

// Hàm global cho quản lý khách hàng
////////////////////////////////CÁC HÀM TOÀN CỤC CẦN THIẾT/////////////////////////////////////////////////
// Các hàm này đã được tích hợp vào các module tương ứng, không cần hàm toàn cục riêng biệt