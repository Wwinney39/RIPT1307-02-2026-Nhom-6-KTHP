import db from '../config/db';

export const orderService = {
    createOrderTransaction: async (userId: number, restaurantId: number, addressId: number, voucherCode?: string, items?: any[]) => {
        console.log("DEBUG: Input values:", { userId, restaurantId, addressId, voucherCode, items });
        const connection = await db.getConnection();
        
        try {
            // BẮT ĐẦU TRANSACTION
            await connection.beginTransaction();

            // 1. Lấy giỏ hàng của người dùng ra kiểm tra
            let cartItems: any[] = [];

            if (items && items.length > 0) {
            cartItems = items.map((item: any) => ({
                item_id: item.item_id || item.id,
                quantity: item.quantity,
                price: item.price,
            }));
            } else {
            const [rows]: any = await connection.execute(
                `SELECT c.item_id, c.quantity, m.price 
                FROM cart c 
                JOIN Menu_Items m ON c.item_id = m.item_id 
                WHERE c.user_id = ?`,
                [userId]
            );

            cartItems = rows;
            }
            if (cartItems.length === 0) {
                throw new Error("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
            }

            // 2. Tính tổng tiền hàng gốc
            let totalItemsPrice = cartItems.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);
            let discountAmount = 0;
            let voucherId: number | null = null;

            // 3. Nếu có truyền mã voucher kèm theo đơn hàng
            if (voucherCode) {
                // Khóa hàng bằng FOR UPDATE chống race condition khi cập nhật lượt dùng mã
                const [vouchers]: any = await connection.execute(
                    'SELECT * FROM Vouchers WHERE code = ? FOR UPDATE', [voucherCode]
                );

                if (vouchers.length === 0) {
                    throw new Error("Mã giảm giá không tồn tại!");
                }

                const v = vouchers[0];
                const now = new Date();

                // Xác thực lại các điều kiện một lần nữa tại DB trước khi trừ lượt dùng
                if (new Date(v.expiry_date) < now) throw new Error("Mã giảm giá đã hết hạn!");
                if (v.used_count >= v.max_uses) throw new Error("Mã giảm giá đã hết lượt dùng!");
                if (totalItemsPrice < Number(v.min_order_amount)) throw new Error("Đơn hàng chưa đủ giá trị tối thiểu để áp mã!");

                // Tính toán tiền giảm
                discountAmount = (totalItemsPrice * v.discount_percent) / 100;
                if (discountAmount > Number(v.max_discount_amount)) {
                    discountAmount = Number(v.max_discount_amount);
                }
                voucherId = v.voucher_id;

                // Tăng used_count của voucher lên 1
                await connection.execute('UPDATE Vouchers SET used_count = used_count + 1 WHERE voucher_id = ?', [voucherId]);
            }

            const finalTotalPrice = totalItemsPrice - discountAmount;

            // 4. Lưu dữ liệu tổng quan vào bảng Orders
            const [orderResult]: any = await connection.execute(
                `INSERT INTO Orders (user_id, restaurant_id, address_id, voucher_id, total_price, status) 
                 VALUES (?, ?, ?, ?, ?, 'PENDING')`,
                [userId, restaurantId, addressId, voucherId, finalTotalPrice]
            );

            const newOrderId = orderResult.insertId;

            // 5. Lưu danh sách món ăn vào bảng Order_Details
            for (const item of cartItems) {
                await connection.execute(
                    `INSERT INTO Order_Details (order_id, item_id, quantity) VALUES (?, ?, ?)`,
                    [newOrderId, item.item_id, item.quantity]
                );
            }

            // 6. Dọn dẹp giỏ hàng
            await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

            // 7. Ghi nhận log trạng thái đầu tiên
            await connection.execute(
                `INSERT INTO delivery_Logs (order_id, status) VALUES (?, 'PENDING')`,
                [newOrderId]
            );

            // NẾU KHÔNG CÓ LỖI XẢY RA -> COMMIT DATA XUỐNG DB
            await connection.commit();

            return {
                order_id: newOrderId,
                total_origin_price: totalItemsPrice,
                discount_amount: discountAmount,
                final_total_price: finalTotalPrice
            };

        } catch (error) {
            console.error("--- LỖI TRANSACTION ---", error);
            // CÓ LỖI LÀ ROLLBACK NGAY LẬP TỨC ĐỂ BẢO VỆ DỮ LIỆU
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getMyOrders: async (userId: number) => {
        console.log("SERVICE USER ID:", userId);

        const [rows]: any = await db.execute(
            `
            SELECT *
            FROM Orders
            WHERE user_id = ?
            `,
            [userId]
        );

        console.log("ROWS:", rows);

        return rows;
    },

    getOrderById: async (orderId: number, userId: number) => {
        const [order]: any = await db.execute(
            `
            SELECT 
            o.*,
            r.name AS restaurant_name,
            ua.address_text AS delivery_address
            FROM Orders o
            LEFT JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
            LEFT JOIN User_Addresses ua ON o.address_id = ua.address_id
            WHERE o.order_id = ? AND o.user_id = ?
            `,
            [orderId, userId]
        );

        if (order.length === 0) throw new Error('Không tìm thấy đơn hàng!');

        const [details]: any = await db.execute(
            `
            SELECT 
            od.*,
            m.name,
            m.price,
            m.image_url
            FROM Order_Details od
            JOIN Menu_Items m ON od.item_id = m.item_id
            WHERE od.order_id = ?
            `,
            [orderId]
        );

        return { ...order[0], items: details };
    },

    getAllOrders: async () => {
    const [rows]: any = await db.execute(
        `SELECT o.*, r.name AS restaurant_name, u.name AS user_name
        FROM Orders o
        JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        JOIN Users u ON o.user_id = u.user_id
        ORDER BY o.created_at DESC`
    );
    return rows;
    },

    cancelOrder: async (orderId: number, userId: number) => {
    const [order]: any = await db.execute(
        'SELECT * FROM Orders WHERE order_id = ? AND user_id = ?',
        [orderId, userId]
    );
    if (order.length === 0) throw new Error('Không tìm thấy đơn hàng!');
    if (order[0].status !== 'PENDING') throw new Error('Chỉ có thể hủy đơn khi đang ở trạng thái PENDING!');

    await db.execute(
        'UPDATE Orders SET status = "CANCELLED" WHERE order_id = ?', [orderId]
    );
    await db.execute(
        'INSERT INTO delivery_Logs (order_id, status) VALUES (?, "Đã hủy")', [orderId]
    );
    },
};

