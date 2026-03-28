 // Hàm hiển thị giá với giảm giá
function renderProductPrice(product) {
    const price = parseInt(product.gia);
    const discount = parseFloat(product.hesogiamgia) || 0;
    
    if (discount > 0) {
        // Tính giá sau giảm
        const discountedPrice = Math.round(price * (1 - discount));
        const formattedOriginalPrice = price.toLocaleString('vi-VN') + ' đ';
        const formattedDiscountedPrice = discountedPrice.toLocaleString('vi-VN') + ' đ';
        const discountPercent = Math.round(discount * 100);
        
        return `
            <div class="product-price-container">
                <div class="original-price">${formattedOriginalPrice}</div>
                <div class="discounted-price">${formattedDiscountedPrice}</div>
                <div class="discount-badge">-${discountPercent}%</div>
            </div>
        `;
    } else {
        // Không giảm giá
        return `<div class="category-product-price">${price.toLocaleString('vi-VN')} đ</div>`;
    }
}

// Hàm hiển thị giá cho sản phẩm mới nhất (tương tự)
function renderNewProductPrice(product) {
    const price = parseInt(product.gia);
    const discount = parseFloat(product.hesogiamgia) || 0;
    
    if (discount > 0) {
        const discountedPrice = Math.round(price * (1 - discount));
        const formattedOriginalPrice = price.toLocaleString('vi-VN') + ' đ';
        const formattedDiscountedPrice = discountedPrice.toLocaleString('vi-VN') + ' đ';
        const discountPercent = Math.round(discount * 100);
        
        return `
            <div class="product-price-container">
                <div class="original-price">${formattedOriginalPrice}</div>
                <div class="discounted-price">${formattedDiscountedPrice}</div>
                <div class="discount-badge">-${discountPercent}%</div>
            </div>
        `;
    } else {
        return `<div class="new-product-price">${price.toLocaleString('vi-VN')} đ</div>`;
    }
}
        // Mảng lưu toàn bộ sản phẩm và biến quản lý trạng thái
        let allProducts = [];
        let currentCategory = 'Tất cả';
        let currentPage = 1;
        const productsPerPage = 9; // Trở lại 6 sản phẩm mỗi trang

        // Đối tượng ánh xạ tên danh mục từ API sang tên hiển thị
        

        let categoryMapping = {}; 

// 2. Hàm lấy danh mục từ API và render giao diện
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost/web2/controller/danhmuc.php?action=all');
        const response2 = await fetch('http://localhost/web2/controller/danhmuc.php?action=alladmin');

        const data = await response.json();
        const data2 = await response2.json();

        if (data.success && data2.success) {
            const categories = data.data;
            const categoriesAdmin = data2.data;

            // 1. CẬP NHẬT MAPPING TRƯỚC (Để các file khác luôn có dữ liệu dùng)
            categoriesAdmin.forEach(cat => {
                categoryMapping[cat.madm] = cat.tendm;   
            });
            console.log('Mapping danh mục đã cập nhật:', categoryMapping);

            // 2. KIỂM TRA CONTAINER TRƯỚC KHI RENDER GIAO DIỆN
            const categoryContainer = document.querySelector('.category-filter ul');
            
            if (categoryContainer) { // Chỉ chạy nếu tìm thấy thẻ trong HTML
                categoryContainer.innerHTML = '<li><a href="javascript:void(0)" class="cat-btn active" role="button">Tất cả</a></li>';

                categories.forEach(cat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="javascript:void(0)" class="cat-btn" role="button">${cat.tendm}</a>`;
                    categoryContainer.appendChild(li);
                });
                
                // Sau khi render xong nút, phải gán lại sự kiện click
                initializeCategoryEvents();
            } else {
                console.warn('Không tìm thấy .category-filter ul trong HTML, bỏ qua render giao diện danh mục.');
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
    }
}

        // 1. Hàm lấy dữ liệu từ API
        async function fetchProducts() {
    try {
        const response = await fetch('http://localhost/web2/controller/product.php');
        const data = await response.json();

        if (data.success) {
            allProducts = data.data.data;
            // Khởi tạo hiển thị (đã bao gồm fetchCategories bên trong)
            await initializeDisplay();
        } else {
            console.error('API trả về lỗi:', data.message);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API sản phẩm:', error);
    }
}
        // 2. Hàm lọc sản phẩm theo danh mục
       // 2. Hàm lọc sản phẩm theo danh mục
// 2. Hàm lọc sản phẩm theo danh mục
function filterProductsByCategory(category) {
    let filteredProducts;
    if (category === 'Tất cả') {
        filteredProducts = allProducts;
    } else {
        // Tìm key trong mapping dựa trên tên hiển thị
        const categoryKey = Object.keys(categoryMapping).find(
            key => categoryMapping[key] === category
        );
        filteredProducts = allProducts.filter(product => product.danhmuc === categoryKey);
    }

    // Sắp xếp: sản phẩm có giảm giá trước, giảm dần theo hệ số giảm giá
    return filteredProducts.sort((a, b) => {
        const aDiscount = parseFloat(a.hesogiamgia) || 0;
        const bDiscount = parseFloat(b.hesogiamgia) || 0;
        
        // Nếu cả hai đều có giảm giá, sắp xếp giảm dần theo hệ số giảm giá
        if (aDiscount > 0 && bDiscount > 0) {
            return bDiscount - aDiscount; // Giảm nhiều hơn lên trước
        }
        
        // Nếu chỉ a có giảm giá, a lên trước
        if (aDiscount > 0 && bDiscount === 0) return -1;
        
        // Nếu chỉ b có giảm giá, b lên trước
        if (aDiscount === 0 && bDiscount > 0) return 1;
        
        // Cả hai đều không giảm giá, sắp xếp theo ID giảm dần
        return b.masp - a.masp;
    });
}

        // 3. Hàm tạo HTML cho một sản phẩm
       // 3. Hàm tạo HTML cho một sản phẩm
function createProductHTML(product) {
    // Lấy tên danh mục hiển thị
    const categoryName = categoryMapping[product.danhmuc] || product.danhmuc;

    // Sửa đường dẫn ảnh
    let imageSrc = product.link || 'img/default-book.jpg';
    imageSrc = imageSrc
        .replace(/\.webg$/, '.webp')
        .replace(/\.img$/, '.jpg')
        .replace(/\.jpgf$/, '.jpg');

    return `
        <div class="col-lg-4 col-md-6">
            <div class="category-product-item" data-product-id="${product.masp}">
                <div class="category-product-image">
                    <img src="${imageSrc}" alt="${product.tensp}" onerror="this.src='img/default-book.jpg'">
                </div>
                <div class="category-product-title">${product.tensp}</div>
                ${renderProductPrice(product)}
                <div class="category-freeship-badge">Freeship</div>
                
                <div class="product-actions">
                    <a href="#" class="action-btn add-cart" title="Thêm vào giỏ hàng" onclick="addToCart('${product.masp}')">
                        <i class="fa fa-shopping-cart"></i>
                    </a>
                    <a href="#" class="action-btn buy-now" title="Mua ngay" onclick="openBuyNowModal('${product.masp}'); return false;">
                        <i class="fab fa-cc-visa"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

        // 4. Hàm hiển thị sản phẩm theo trang
        // Biến trạng thái toàn cục mới
let currentMinPrice = 0;
let currentMaxPrice = 1000000;
let currentSortMode = 'default';
function handleRangeInput() {
    const minInput = document.getElementById('rangeMin');
    const maxInput = document.getElementById('rangeMax');
    
    // Ép kiểu về số nguyên
    let minVal = parseInt(minInput.value);
    let maxVal = parseInt(maxInput.value);

    // Đảm bảo nút Min không kéo vượt quá nút Max
    if (minVal > maxVal - 50000) { 
        if (this.id === 'rangeMin') {
            minInput.value = maxVal - 50000;
            minVal = maxVal - 50000;
        } else {
            maxInput.value = minVal + 50000;
            maxVal = minVal + 50000;
        }
    }

    currentMinPrice = minVal;
    currentMaxPrice = maxVal;

    // Cập nhật hiển thị con số
    document.getElementById('minPriceDisplay').textContent = minVal.toLocaleString('vi-VN') + 'đ';
    document.getElementById('maxPriceDisplay').textContent = maxVal.toLocaleString('vi-VN') + 'đ';

    // Gọi hàm hiển thị sản phẩm để lọc lại
    displayProducts(1);
}
document.getElementById('rangeMin').addEventListener('input', handleRangeInput);
document.getElementById('rangeMax').addEventListener('input', handleRangeInput);
// 1. Cập nhật hàm hiển thị sản phẩm (Pipeline xử lý dữ liệu)
function displayProducts(page = 1) {
    const container = document.querySelector('#product-page1 .row');
    if (!container) return;

    // BƯỚC A: Lọc theo Danh mục trước
    let categoryFiltered = filterProductsByCategory(currentCategory);

    // KIỂM TRA 1: Nếu danh mục hoàn toàn không có sản phẩm nào
    if (categoryFiltered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="fas fa-book-open mb-3" style="font-size: 40px; color: #ccc;"></i>
                <p>Danh mục này hiện chưa có sản phẩm nào.</p>
            </div>`;
        updatePagination(0, 1);
        return; // Dừng luôn, không cần lọc giá hay phân trang nữa
    }

    // BƯỚC B: Lọc theo Giá từ danh sách đã lọc theo danh mục
    let finalFiltered = categoryFiltered.filter(product => {
        const price = parseInt(product.gia);
        const discount = parseFloat(product.hesogiamgia) || 0;
        const finalPrice = discount > 0 ? Math.round(price * (1 - discount)) : price;
        return finalPrice >= currentMinPrice && finalPrice <= currentMaxPrice;
    });

    // KIỂM TRA 2: Có sản phẩm trong danh mục nhưng không khớp khoảng giá
    if (finalFiltered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="fas fa-filter mb-3" style="font-size: 40px; color: #ccc;"></i>
                <p>Không có sản phẩm nào trong danh mục này phù hợp với mức giá bạn chọn.</p>
            </div>`;
        updatePagination(0, 1);
        return;
    }

    // BƯỚC C: Sắp xếp (sử dụng mảng finalFiltered)
    if (currentSortMode === 'az') {
        finalFiltered.sort((a, b) => a.tensp.localeCompare(b.tensp));
    } else if (currentSortMode === 'za') {
        finalFiltered.sort((a, b) => b.tensp.localeCompare(a.tensp));
    } else if (currentSortMode === 'low-high' || currentSortMode === 'high-low') {
        finalFiltered.sort((a, b) => {
            const priceA = parseInt(a.gia) * (1 - (parseFloat(a.hesogiamgia) || 0));
            const priceB = parseInt(b.gia) * (1 - (parseFloat(b.hesogiamgia) || 0));
            return currentSortMode === 'low-high' ? priceA - priceB : priceB - priceA;
        });
    }

    // BƯỚC D: Phân trang và hiển thị
    const startIndex = (page - 1) * productsPerPage;
    const productsToShow = finalFiltered.slice(startIndex, startIndex + productsPerPage);

    container.innerHTML = '';
    productsToShow.forEach(product => {
        container.innerHTML += createProductHTML(product);
    });

    updatePagination(finalFiltered.length, page);
    currentPage = page;
}

// 3. Lắng nghe sự kiện Combobox sắp xếp
document.getElementById('sortProducts').addEventListener('change', function(e) {
    currentSortMode = e.target.value;
    displayProducts(1);
});

// 4. Khởi tạo lại khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo các sự kiện được gán sau khi API đã load xong trong fetchProducts()
});

        // 5. Hàm cập nhật phân trang với dấu "..."
        function updatePagination(totalProducts, currentPage) {
            const paginationContainer = document.querySelector('.pagination');
            if (!paginationContainer) return;

            const totalPages = Math.ceil(totalProducts / productsPerPage);

            // Debug log
            console.log(`Debug Pagination: ${totalProducts} sản phẩm, ${totalPages} trang, trang hiện tại: ${currentPage}`);

            // Xóa nội dung cũ
            paginationContainer.innerHTML = '';

            // Tạo nút Previous
            const prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'page-btn page-prev';
            prevBtn.setAttribute('aria-label', 'Trang trước');
            prevBtn.innerHTML = '«';
            prevBtn.disabled = currentPage === 1;
            if (currentPage === 1) {
                prevBtn.classList.add('is-disabled');
            }
            prevBtn.onclick = () => {
                if (currentPage > 1) displayProducts(currentPage - 1);
            };
            paginationContainer.appendChild(prevBtn);

            // Logic hiển thị trang với dấu "..."
            if (totalPages <= 5) {
                // Nếu ít hơn hoặc bằng 5 trang, hiển thị tất cả
                console.log('Hiển thị tất cả trang (≤5)');
                for (let i = 1; i <= totalPages; i++) {
                    createPageButton(i, currentPage, paginationContainer);
                }
            } else {
                // Nếu nhiều hơn 5 trang, sử dụng logic với dấu "..."
                console.log('Sử dụng logic với dấu "..." (>5 trang)');
                if (currentPage <= 3) {
                    // Hiển thị: 1 2 3 4 ... last
                    console.log('Pattern: 1 2 3 4 ... last');
                    for (let i = 1; i <= 4; i++) {
                        createPageButton(i, currentPage, paginationContainer);
                    }
                    createEllipsis(paginationContainer);
                    createPageButton(totalPages, currentPage, paginationContainer);
                } else if (currentPage >= totalPages - 2) {
                    // Hiển thị: 1 ... (last-3) (last-2) (last-1) last
                    console.log('Pattern: 1 ... (last-3) (last-2) (last-1) last');
                    createPageButton(1, currentPage, paginationContainer);
                    createEllipsis(paginationContainer);
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        createPageButton(i, currentPage, paginationContainer);
                    }
                } else {
                    // Hiển thị: 1 ... (current-1) current (current+1) ... last
                    console.log('Pattern: 1 ... (current-1) current (current+1) ... last');
                    createPageButton(1, currentPage, paginationContainer);
                    createEllipsis(paginationContainer);
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        createPageButton(i, currentPage, paginationContainer);
                    }
                    createEllipsis(paginationContainer);
                    createPageButton(totalPages, currentPage, paginationContainer);
                }
            }

            // Tạo nút Next
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'page-btn page-next';
            nextBtn.setAttribute('aria-label', 'Trang sau');
            nextBtn.innerHTML = '»';
            nextBtn.disabled = currentPage === totalPages;
            if (currentPage === totalPages) {
                nextBtn.classList.add('is-disabled');
            }
            nextBtn.onclick = () => {
                if (currentPage < totalPages) displayProducts(currentPage + 1);
            };
            paginationContainer.appendChild(nextBtn);
        }

        // Hàm tạo nút trang
        function createPageButton(pageNumber, currentPage, container) {
            const pageBtn = document.createElement('button');
            pageBtn.type = 'button';
            pageBtn.className = `page-btn ${pageNumber === currentPage ? 'active' : ''}`;
            pageBtn.textContent = pageNumber;
            pageBtn.onclick = () => displayProducts(pageNumber);
            container.appendChild(pageBtn);
        }

        // Hàm tạo dấu "..."
        function createEllipsis(container) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            ellipsis.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                color: #666;
                font-weight: 600;
                margin: 0 4px;
            `;
            container.appendChild(ellipsis);
        }

        // 6. Hàm xử lý khi chọn danh mục
        function selectCategory(element) {
            // Xóa class active từ tất cả các nút
            document.querySelectorAll('.cat-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Thêm class active cho nút được chọn
            element.classList.add('active');

            // Cập nhật danh mục hiện tại
            currentCategory = element.textContent.trim();

            // Hiển thị lại sản phẩm (về trang 1)
            displayProducts(1);
        }

        // 7. Hàm khởi tạo sự kiện cho các nút danh mục
        function initializeCategoryEvents() {
            const categoryButtons = document.querySelectorAll('.cat-btn');
            categoryButtons.forEach(button => {
                button.onclick = function () {
                    selectCategory(this);
                };
            });
        }

        // 8. Hàm khởi tạo hiển thị ban đầu
       async function initializeDisplay() {
    // Bước 1: Tải danh mục trước để có categoryMapping
    await fetchCategories();
    
    // Bước 2: Hiển thị sản phẩm (lúc này mapping đã có dữ liệu)
    displayProducts(1);
}

        // 9. Function test phân trang (tạm thời để debug)
        function testPaginationWithFakeData() {
            console.log('Testing pagination with fake data...');

            // Tạo 50 sản phẩm giả để test phân trang (50/6 = 8.33 → 9 trang)
            const fakeProducts = [];
            for (let i = 1; i <= 50; i++) {
                fakeProducts.push({
                    masp: i,
                    tensp: `Sản phẩm test ${i}`,
                    tacgia: `Tác giả ${i}`,
                    danhmuc: 'Test',
                    gia: 100000 + (i * 10000),
                    mota: `Mô tả sản phẩm ${i}`,
                    link: 'img/book1.webp',
                    trangthai: 1
                });
            }

            // Cập nhật filteredProducts và hiển thị
            filteredProducts = fakeProducts;
            displayProducts(1);

            console.log(`Created ${fakeProducts.length} fake products for testing`);
            console.log(`With ${productsPerPage} products per page = ${Math.ceil(fakeProducts.length / productsPerPage)} pages`);
        }

        // Expose function to global scope for testing
        window.testPaginationWithFakeData = testPaginationWithFakeData;
        function showMessage(message, type = 'success') {
    // Tạo thông báo nếu chưa có
    let messageDiv = document.getElementById('updateMessage');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'updateMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        document.body.appendChild(messageDiv);
    }

    // Thiết lập màu sắc theo loại thông báo
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    // Thêm nút đóng
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button id="closeMessage" style="
            background: none;
            border: none;
            color: inherit;
            font-size: 18px;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
        ">&times;</button>
    `;

    // Hiển thị thông báo
    messageDiv.style.display = 'flex';

    // Sự kiện đóng thông báo
    document.getElementById('closeMessage').addEventListener('click', () => {
        messageDiv.style.display = 'none';
    });

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        if (messageDiv.style.display !== 'none') {
            messageDiv.style.display = 'none';
        }
    }, 5000);
}

        // 9. Hàm thêm vào giỏ hàng (mẫu)
        async function addToCart(productId) {
           event.preventDefault();
           if (!window.userGlobalData || !window.userGlobalData.success) {
        showMessage('Vui lòng đăng nhập để sử dụng giỏ hàng', 'error'); // Nên để type là 'error' hoặc 'warning'
        return; // Dừng hàm
    }
            const magio =   window.userGlobalData.data.idkhach;
            const formData = new FormData();
            formData.append('magio',magio);
            formData.append('masp',productId);
            formData.append('soluong',1);
             try {
        // Gửi request đến API (thay YOUR_API_URL bằng URL thực tế)
        const response =  await fetch('http://localhost/web2/controller/cart.php', {
            method: 'POST',
            body: formData
        });
        
        const result =  await response.json();
        
        // Xử lý kết quả
        if (result.success) {
            showMessage('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            
            // Đợi 1.5 giây rồi chuyển hướng
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1500);
        } else {
            // Hiển thị thông báo lỗi từ server
            const errorMessage = result.message || 'Cập nhật thất bại!';
            showMessage(`❌ ${errorMessage}`, 'error');
        }
        
    } catch (error) {
        // Xử lý lỗi
        console.error('Error:', error);
        showMessage(`❌ Đã xảy ra lỗi: ${error.message}`, 'error');
    }

        }

        // 10. Khởi động khi trang được tải
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Đang tải dữ liệu sản phẩm...');
            fetchProducts();
        });