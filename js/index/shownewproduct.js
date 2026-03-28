
        // Hàm lấy và hiển thị 4 sản phẩm mới nhất
       // Hàm lấy và hiển thị 4 sản phẩm mới nhất
async function loadNewestProducts() {
    try {
        console.log('Đang tải sản phẩm mới nhất...');

        // Gọi API
        const response = await fetch('http://localhost/web2/controller/product.php');
        const data = await response.json();

        if (data.success) {
            const allProducts = data.data.data;
            console.log(`Đã tải ${allProducts.length} sản phẩm`);

            // Sắp xếp: sản phẩm có giảm giá trước, giảm dần theo hệ số giảm giá
            const sortedProducts = [...allProducts].sort((a, b) => {
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

            // Lấy 4 sản phẩm đầu tiên
            const newestProducts = sortedProducts.slice(0, 4);

            // Hiển thị sản phẩm
            displayNewestProducts(newestProducts);
        } else {
            console.error('API lỗi:', data.message);
        }
    } catch (error) {
        console.error('Lỗi kết nối API:', error);
    }
}
        // Hàm hiển thị 4 sản phẩm
        function displayNewestProducts(products) {
    const productRow = document.querySelector('.featured-product .row');

    if (!productRow) {
        console.error('Không tìm thấy container sản phẩm');
        return;
    }

    // Xóa nội dung cũ
    productRow.innerHTML = '';

    // Tạo HTML cho từng sản phẩm
    products.forEach(product => {
        // Sửa đường dẫn ảnh nếu bị sai định dạng
        let imageSrc = product.link || 'img/default-book.jpg';
        imageSrc = imageSrc
            .replace(/\.webg$/, '.webp')
            .replace(/\.img$/, '.jpg')
            .replace(/\.jpgf$/, '.jpg');

        const productHTML = `
            <div class="col-lg-3 col-md-6">
                <div class="new-product-item" data-product-id="${product.masp}">
                    <div class="new-product-image">
                        <img src="${imageSrc}" alt="${product.tensp}" onerror="this.src='img/default-book.jpg'">
                    </div>
                    <div class="new-product-title">${product.tensp}</div>
                    ${renderNewProductPrice(product)}
                    <div class="freeship-badge">Freeship</div>

                    <div class="new-product-actions">
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

        productRow.innerHTML += productHTML;
    });

    console.log('Đã hiển thị 4 sản phẩm mới nhất');
}

        // Chạy khi trang tải xong
        document.addEventListener('DOMContentLoaded', function () {
            loadNewestProducts();
        });

