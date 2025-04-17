import express from "express";
import mariadb from 'mariadb';
import cors from "cors";
const app = express();

// Middleware để xử lý JSON từ request body
app.use(express.json());

// Cấu hình kết nối MariaDB
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapassword',
    database: 'db',
    connectionLimit: 5
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// API trả về danh sách tiện nghi
app.get("/amenities", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const query = `
            SELECT * FROM amenities
        `;

        const rows = await connection.query(query);

        res.json(rows);
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        if (connection) connection.release();
    }
});

// API trả về danh sách tiện nghi
app.get("/services", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const query = `
            SELECT * FROM services
        `;

        const rows = await connection.query(query);

        res.json(rows);
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        if (connection) connection.release();
    }
});

// API trả về danh sách loại phòng
app.get("/roomtypes", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const query = `
            SELECT roomTypeID, NAME, pathImg FROM roomtypes
        `;

        const rows = await connection.query(query);

        res.json(rows);
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        if (connection) connection.release();
    }
});

// API trả về danh sách phòng kèm loại phòng và hình ảnh và services name và amenities name
app.get("/rooms", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const query = `
            SELECT r.*,
	               rt.name AS roomTypeName,
		           ri.imageID, ri.pathImg, 
		           s.serviceID AS serviceID, s.name AS serviceName,
		           a.amenityID AS amenityID, a.name AS amenityName  
            FROM rooms r   JOIN roomtypes rt ON r.roomTypeID=rt.roomTypeID 
                           JOIN roomimages ri ON r.roomID=ri.roomID
                           JOIN room_service rs ON r.roomID=rs.roomID JOIN services s ON rs.serviceID=s.serviceID
                           JOIN room_amenity ra ON r.roomID=ra.roomID JOIN amenities a ON ra.amenityID=a.amenityID
        `;

        const rows = await connection.query(query);
        const roomsMap = new Map();

        rows.forEach(row => {
            if (!roomsMap.has(row.roomID)) {
                roomsMap.set(row.roomID, {
                    name: row.name,
                    roomID: row.roomID,
                    price: row.price,
                    soNguoi: row.soNguoi,
                    dienTich: row.dienTich,
                    bedType: row.bedType,
                    bedCount: row.bedCount,
                    location: row.location,
                    roomTypeName: row.roomTypeName,
                    danhGia: row.danhGia,
                    images: [],
                    services: [],
                    amenities: []
                });
            }

            const room = roomsMap.get(row.roomID);

            // Thêm hình ảnh nếu chưa có
            if (row.pathImg && !room.images.some(img => img.imageID === row.imageID)) {
                room.images.push({ imageID: row.imageID, pathImg: row.pathImg });
            }

            // Thêm service name nếu chưa có
            if (row.serviceName && !room.services.includes(row.serviceName)) {
                room.services.push(row.serviceName);
            }

            // Thêm amenity name nếu chưa có
            if (row.amenityName && !room.amenities.includes(row.amenityName)) {
                room.amenities.push(row.amenityName);
            }
        });

        const roomsList = Array.from(roomsMap.values());

        res.json(roomsList);
    } catch (error) {
        res.status(500).json(error.message);
    } finally {
        if (connection) connection.release();
    }
});

// API đăng nhập
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await pool.getConnection();

        // Kiểm tra thông tin đăng nhập
        const query = `
            SELECT accountID, password, userName, email 
            FROM Accounts 
            WHERE email = ? AND password = ?
        `;

        const rows = await connection.query(query, [email, password]);

        if (rows.length > 0) {
            const user = {
                accountID: rows[0].accountID,
                userName: rows[0].userName,
                email: rows[0].email,
                sdt: rows[0].sdt||null
            };

            res.json({
                success: true,
                user: user,
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không chính xác"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        if (connection) connection.release();
    }
});

// API đăng ký
app.post("/register", async (req, res) => {
    const { userName, email, password } = req.body;
    let connection;

    try {
        connection = await pool.getConnection();

        // Kiểm tra email đã tồn tại chưa
        const checkQuery = `SELECT COUNT(*) as count FROM Accounts WHERE email = ?`;
        const checkResult = await connection.query(checkQuery, [email]);

        if (checkResult[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "Email đã được sử dụng"
            });
        }

        // Lấy ID lớn nhất để tạo ID mới
        const maxIdQuery = `SELECT MAX(accountID) as maxId FROM Accounts`;
        const maxIdResult = await connection.query(maxIdQuery);
        const newId = (maxIdResult[0].maxId || 0) + 1;

        // Thêm người dùng mới
        const insertQuery = `
            INSERT INTO Accounts (accountID, userName, email, password)
            VALUES (?, ?, ?, ?)
        `;

        await connection.query(insertQuery, [newId, userName, email, password]);

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        if (connection) connection.release();
    }
});

// API lấy thông tin người dùng
app.get("/api/auth/profile", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Không có token xác thực"
        });
    }

    // Lấy accountID từ token
    const accountIDMatch = token.match(/token-(\d+)/);
    if (!accountIDMatch) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ"
        });
    }

    const accountID = parseInt(accountIDMatch[1]);
    let connection;

    try {
        connection = await pool.getConnection();

        const query = `
            SELECT accountID, userName, email, sdt
            FROM Accounts 
            WHERE accountID = ?
        `;

        const rows = await connection.query(query, [accountID]);

        if (rows.length > 0) {
            const user = {
                accountID: rows[0].accountID,
                userName: rows[0].userName,
                email: rows[0].email,
                sdt: rows[0].sdt
            };

            res.json({
                success: true,
                user: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

