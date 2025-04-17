CREATE DATABASE db;
USE db;
CREATE TABLE Accounts (
    accountID INT PRIMARY KEY,
    password NVARCHAR(255) NOT NULL,
    sdt NVARCHAR(20),
    userName NVARCHAR(100),
    email NVARCHAR(100)
);

CREATE TABLE RoomTypes (
    roomTypeID INT PRIMARY KEY,
    name NVARCHAR(100),
    pathImg NVARCHAR(255)
);

CREATE TABLE Rooms (
    roomID INT PRIMARY KEY,
    name NVARCHAR(100),
    price DECIMAL(10,2),
    dienTich FLOAT,
    soNguoi INT,
    bedType NVARCHAR(50),
    bedCount INT,
    roomTypeID INT,
    danhGia FLOAT,
    moTa NVARCHAR(255),
    location NVARCHAR(255),
    FOREIGN KEY (roomTypeID) REFERENCES RoomTypes(roomTypeID)
);

CREATE TABLE RoomImages (
    roomID INT,
    imageID INT,
    pathImg NVARCHAR(255),
    PRIMARY KEY (roomID, imageID),
    FOREIGN KEY (roomID) REFERENCES Rooms(roomID)
);

CREATE TABLE Orders (
    orderID INT PRIMARY KEY,
    price DECIMAL(10,2),
    roomID INT,
    orderDate DATE,
    checkInDate DATE,
    checkOutDate DATE,
    accountID INT,
    attribute NVARCHAR(255),
    FOREIGN KEY (roomID) REFERENCES Rooms(roomID),
    FOREIGN KEY (accountID) REFERENCES Accounts(accountID)
);

CREATE TABLE Services (
    serviceID INT PRIMARY KEY,
    name NVARCHAR(100),
    pathImg NVARCHAR(255)
);

CREATE TABLE Room_Service (
    serviceID INT,
    roomID INT,
    PRIMARY KEY (serviceID, roomID),
    FOREIGN KEY (serviceID) REFERENCES Services(serviceID),
    FOREIGN KEY (roomID) REFERENCES Rooms(roomID)
);

CREATE TABLE Amenities (
    amenityID INT PRIMARY KEY,
    name NVARCHAR(100),
    pathImg NVARCHAR(255)
);

CREATE TABLE Room_Amenity (
    roomID INT,
    amenityID INT,
    PRIMARY KEY (roomID, amenityID),
    FOREIGN KEY (roomID) REFERENCES Rooms(roomID),
    FOREIGN KEY (amenityID) REFERENCES Amenities(amenityID)
);

-- Insert 2 Accounts
INSERT INTO Accounts (accountID, password, sdt, userName, email) VALUES
(1, 'password123', '0123456789', 'user1', 'user1@example.com'),
(2, 'password456', '0987654321', 'user2', 'user2@example.com');

-- Insert RoomTypes
INSERT INTO RoomTypes (roomTypeID, name, pathImg) VALUES
(1, 'Standard', '/roomtype/1.png'),
(2, 'Deluxe', '/roomtype/2.png'),
(3, 'Suite', '/roomtype/3.png'),
(4, 'Family', '/roomtype/4.png');

-- Insert 20 Rooms
INSERT INTO Rooms (roomID, name, price, dienTich, soNguoi, bedType, bedCount, roomTypeID, danhGia, moTa, location) VALUES
(1, 'Standard Room 101', 100.00, 25.5, 2, 'Double', 1, 1, 4.5, 'Cozy standard room', 'Floor 1'),
(2, 'Standard Room 102', 100.00, 25.5, 2, 'Double', 1, 1, 4.3, 'Comfortable standard room', 'Floor 1'),
(3, 'Deluxe Room 201', 200.00, 35.0, 3, 'Queen', 1, 2, 4.7, 'Spacious deluxe room', 'Floor 2'),
(4, 'Deluxe Room 202', 200.00, 35.0, 3, 'Queen', 1, 2, 4.6, 'Modern deluxe room', 'Floor 2'),
(5, 'Suite Room 301', 350.00, 50.0, 4, 'King', 1, 3, 4.9, 'Luxury suite', 'Floor 3'),
(6, 'Suite Room 302', 350.00, 50.0, 4, 'King', 1, 3, 4.8, 'Premium suite', 'Floor 3'),
(7, 'Family Room 401', 250.00, 45.0, 5, 'Double', 2, 4, 4.4, 'Spacious family room', 'Floor 4'),
(8, 'Family Room 402', 250.00, 45.0, 5, 'Double', 2, 4, 4.5, 'Comfortable family room', 'Floor 4'),
(9, 'Standard Room 103', 100.00, 25.5, 2, 'Double', 1, 1, 4.2, 'Budget standard room', 'Floor 1'),
(10, 'Standard Room 104', 100.00, 25.5, 2, 'Double', 1, 1, 4.3, 'Simple standard room', 'Floor 1'),
(11, 'Deluxe Room 203', 200.00, 35.0, 3, 'Queen', 1, 2, 4.6, 'Elegant deluxe room', 'Floor 2'),
(12, 'Deluxe Room 204', 200.00, 35.0, 3, 'Queen', 1, 2, 4.7, 'Stylish deluxe room', 'Floor 2'),
(13, 'Suite Room 303', 350.00, 50.0, 4, 'King', 1, 3, 4.9, 'Exclusive suite', 'Floor 3'),
(14, 'Suite Room 304', 350.00, 50.0, 4, 'King', 1, 3, 4.8, 'Grand suite', 'Floor 3'),
(15, 'Family Room 403', 250.00, 45.0, 5, 'Double', 2, 4, 4.5, 'Large family room', 'Floor 4'),
(16, 'Family Room 404', 250.00, 45.0, 5, 'Double', 2, 4, 4.4, 'Cozy family room', 'Floor 4'),
(17, 'Standard Room 105', 100.00, 25.0, 2, 'Double', 1, 1, 4.3, 'Basic standard room', 'Floor 1'),
(18, 'Standard Room 106', 100.00, 25.0, 2, 'Double', 1, 1, 4.2, 'Minimal standard room', 'Floor 1'),
(19, 'Deluxe Room 205', 200.00, 35.0, 3, 'Queen', 1, 2, 4.6, 'Chic deluxe room', 'Floor 2'),
(20, 'Deluxe Room 206', 200.00, 35.0, 3, 'Queen', 1, 2, 4.7, 'Modern deluxe room', 'Floor 2');

UPDATE Rooms
SET location = CASE
    -- Room IDs 1-4: United States
    WHEN roomID = 1 THEN '123 Main Street, New York, United States'
    WHEN roomID = 2 THEN '456 Oak Avenue, Los Angeles, United States'
    WHEN roomID = 3 THEN '789 Pine Road, Chicago, United States'
    WHEN roomID = 4 THEN '101 Maple Lane, Houston, United States'

    -- Room IDs 5-7: South Korea
    WHEN roomID = 5 THEN '12 Gangnam Street, Seoul, South Korea'
    WHEN roomID = 6 THEN '34 Itaewon Road, Busan, South Korea'
    WHEN roomID = 7 THEN '56 Myeongdong Avenue, Incheon, South Korea'

    -- Room IDs 8-10: Australia
    WHEN roomID = 8 THEN '78 Collins Street, Melbourne, Australia'
    WHEN roomID = 9 THEN '90 George Street, Sydney, Australia'
    WHEN roomID = 10 THEN '11 Queen Street, Brisbane, Australia'

    -- Room IDs 11-13: Thailand
    WHEN roomID = 11 THEN '22 Sukhumvit Road, Bangkok, Thailand'
    WHEN roomID = 12 THEN '33 Chiang Mai Street, Chiang Mai, Thailand'
    WHEN roomID = 13 THEN '44 Phuket Avenue, Phuket, Thailand'

    -- Room IDs 14-16: France
    WHEN roomID = 14 THEN '55 Champs-Élysées, Paris, France'
    WHEN roomID = 15 THEN '66 Rue de Rivoli, Lyon, France'
    WHEN roomID = 16 THEN '77 Avenue Montaigne, Nice, France'

    -- Room IDs 17-20: Italy
    WHEN roomID = 17 THEN '88 Via Roma, Rome, Italy'
    WHEN roomID = 18 THEN '99 Via Veneto, Venice, Italy'
    WHEN roomID = 19 THEN '111 Via Dante, Milan, Italy'
    WHEN roomID = 20 THEN '222 Via Toledo, Naples, Italy'
END;

-- Insert 5 images per room (100 images total)
INSERT INTO RoomImages (roomID, imageID, pathImg) VALUES
-- Room 1
(1, 1, '/room/1.png'), (1, 2, '/room/2.png'), (1, 3, '/room/3.png'), (1, 4, '/room/4.png'), (1, 5, '/room/5.png'),
-- Room 2
(2, 1, '/room/6.png'), (2, 2, '/room/7.png'), (2, 3, '/room/8.png'), (2, 4, '/room/9.png'), (2, 5, '/room/10.png'),
-- Room 3
(3, 1, '/room/11.png'), (3, 2, '/room/12.png'), (3, 3, '/room/13.png'), (3, 4, '/room/14.png'), (3, 5, '/room/15.png'),
-- Room 4
(4, 1, '/room/16.png'), (4, 2, '/room/17.png'), (4, 3, '/room/18.png'), (4, 4, '/room/19.png'), (4, 5, '/room/20.png'),
-- Room 5
(5, 1, '/room/21.png'), (5, 2, '/room/22.png'), (5, 3, '/room/23.png'), (5, 4, '/room/24.png'), (5, 5, '/room/25.png'),
-- Room 6
(6, 1, '/room/26.png'), (6, 2, '/room/27.png'), (6, 3, '/room/28.png'), (6, 4, '/room/29.png'), (6, 5, '/room/30.png'),
-- Room 7
(7, 1, '/room/31.png'), (7, 2, '/room/32.png'), (7, 3, '/room/33.png'), (7, 4, '/room/34.png'), (7, 5, '/room/35.png'),
-- Room 8
(8, 1, '/room/36.png'), (8, 2, '/room/37.png'), (8, 3, '/room/38.png'), (8, 4, '/room/39.png'), (8, 5, '/room/40.png'),
-- Room 9
(9, 1, '/room/41.png'), (9, 2, '/room/42.png'), (9, 3, '/room/43.png'), (9, 4, '/room/44.png'), (9, 5, '/room/45.png'),
-- Room 10
(10, 1, '/room/46.png'), (10, 2, '/room/47.png'), (10, 3, '/room/48.png'), (10, 4, '/room/49.png'), (10, 5, '/room/50.png'),
-- Room 11
(11, 1, '/room/51.png'), (11, 2, '/room/52.png'), (11, 3, '/room/53.png'), (11, 4, '/room/54.png'), (11, 5, '/room/55.png'),
-- Room 12
(12, 1, '/room/56.png'), (12, 2, '/room/57.png'), (12, 3, '/room/58.png'), (12, 4, '/room/59.png'), (12, 5, '/room/60.png'),
-- Room 13
(13, 1, '/room/61.png'), (13, 2, '/room/62.png'), (13, 3, '/room/63.png'), (13, 4, '/room/64.png'), (13, 5, '/room/65.png'),
-- Room 14
(14, 1, '/room/66.png'), (14, 2, '/room/67.png'), (14, 3, '/room/68.png'), (14, 4, '/room/69.png'), (14, 5, '/room/70.png'),
-- Room 15
(15, 1, '/room/71.png'), (15, 2, '/room/72.png'), (15, 3, '/room/73.png'), (15, 4, '/room/74.png'), (15, 5, '/room/75.png'),
-- Room 16
(16, 1, '/room/76.png'), (16, 2, '/room/77.png'), (16, 3, '/room/78.png'), (16, 4, '/room/79.png'), (16, 5, '/room/80.png'),
-- Room 17
(17, 1, '/room/81.png'), (17, 2, '/room/82.png'), (17, 3, '/room/83.png'), (17, 4, '/room/84.png'), (17, 5, '/room/85.png'),
-- Room 18
(18, 1, '/room/86.png'), (18, 2, '/room/87.png'), (18, 3, '/room/88.png'), (18, 4, '/room/89.png'), (18, 5, '/room/90.png'),
-- Room 19
(19, 1, '/room/91.png'), (19, 2, '/room/92.png'), (19, 3, '/room/93.png'), (19, 4, '/room/94.png'), (19, 5, '/room/95.png'),
-- Room 20
(20, 1, '/room/96.png'), (20, 2, '/room/97.png'), (20, 3, '/room/98.png'), (20, 4, '/room/99.png'), (20, 5, '/room/100.png');

-- Insert Services
INSERT INTO Services (serviceID, name, pathImg) VALUES
(1, 'Wi-Fi', '/service/1.png'),
(2, 'Breakfast', '/service/2.png'),
(3, 'Parking', '/service/3.png'),
(4, 'Gym', '/service/4.png'),
(5, 'Spa', '/service/5.png'),
(6, 'Pool', '/service/6.png');

-- Insert Room_Service (each room has 2-4 services)
INSERT INTO Room_Service (serviceID, roomID) VALUES
(1, 1), (2, 1), (3, 1),
(1, 2), (2, 2), (4, 2),
(1, 3), (2, 3), (5, 3), (6, 3),
(1, 4), (2, 4), (3, 4), (4, 4),
(1, 5), (2, 5), (5, 5),
(1, 6), (2, 6), (6, 6),
(1, 7), (2, 7), (3, 7), (4, 7),
(1, 8), (2, 8), (5, 8),
(1, 9), (2, 9), (3, 9),
(1, 10), (2, 10), (4, 10),
(1, 11), (2, 11), (5, 11), (6, 11),
(1, 12), (2, 12), (3, 12),
(1, 13), (2, 13), (4, 13), (5, 13),
(1, 14), (2, 14), (6, 14),
(1, 15), (2, 15), (3, 15), (4, 15),
(1, 16), (2, 16), (5, 16),
(1, 17), (2, 17), (3, 17),
(1, 18), (2, 18), (4, 18),
(1, 19), (2, 19), (5, 19), (6, 19),
(1, 20), (2, 20), (3, 20);

-- Insert Amenities
INSERT INTO Amenities (amenityID, name, pathImg) VALUES
(1, 'Air Conditioning', '/amenity/1.png'),
(2, 'TV', '/amenity/2.png'),
(3, 'Minibar', '/amenity/3.png'),
(4, 'Safe', '/amenity/4.png'),
(5, 'Hairdryer', '/amenity/5.png');

-- Insert Room_Amenity (each room has 3-5 amenities)
INSERT INTO Room_Amenity (roomID, amenityID) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 4),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
(4, 1), (4, 2), (4, 3), (4, 4),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5),
(6, 1), (6, 2), (6, 3), (6, 4),
(7, 1), (7, 2), (7, 3), (7, 4), (7, 5),
(8, 1), (8, 2), (8, 3), (8, 4),
(9, 1), (9, 2), (9, 3),
(10, 1), (10, 2), (10, 4),
(11, 1), (11, 2), (11, 3), (11, 4), (11, 5),
(12, 1), (12, 2), (12, 3), (12, 4),
(13, 1), (13, 2), (13, 3), (13, 4), (13, 5),
(14, 1), (14, 2), (14, 3), (14, 4),
(15, 1), (15, 2), (15, 3), (15, 4), (15, 5),
(16, 1), (16, 2), (16, 3), (16, 4),
(17, 1), (17, 2), (17, 3),
(18, 1), (18, 2), (18, 4),
(19, 1), (19, 2), (19, 3), (19, 4), (19, 5),
(20, 1), (20, 2), (20, 3), (20, 4);

-- Insert Orders (1 for account 1, 3 for account 2)
INSERT INTO Orders (orderID, price, roomID, orderDate, checkInDate, checkOutDate, accountID, attribute) VALUES
(1, 100.00, 1, '2025-04-10', '2025-04-15', '2025-04-17', 1, 'Standard booking'),
(2, 200.00, 3, '2025-04-11', '2025-04-20', '2025-04-22', 2, 'Deluxe booking'),
(3, 350.00, 5, '2025-04-12', '2025-04-25', '2025-04-28', 2, 'Suite booking'),
(4, 250.00, 7, '2025-04-13', '2025-05-01', '2025-05-03', 2, 'Family booking');


UPDATE Rooms
SET location = CASE
    -- Room IDs 1-4: United States
    WHEN roomID = 1 THEN '123 Main Street, New York, United States'
    WHEN roomID = 2 THEN '456 Oak Avenue, Los Angeles, United States'
    WHEN roomID = 3 THEN '789 Pine Road, Chicago, United States'
    WHEN roomID = 4 THEN '101 Maple Lane, Houston, United States'

    -- Room IDs 5-7: South Korea
    WHEN roomID = 5 THEN '12 Gangnam Street, Seoul, South Korea'
    WHEN roomID = 6 THEN '34 Itaewon Road, Busan, South Korea'
    WHEN roomID = 7 THEN '56 Myeongdong Avenue, Incheon, South Korea'

    -- Room IDs 8-10: Australia
    WHEN roomID = 8 THEN '78 Collins Street, Melbourne, Australia'
    WHEN roomID = 9 THEN '90 George Street, Sydney, Australia'
    WHEN roomID = 10 THEN '11 Queen Street, Brisbane, Australia'

    -- Room IDs 11-13: Thailand
    WHEN roomID = 11 THEN '22 Sukhumvit Road, Bangkok, Thailand'
    WHEN roomID = 12 THEN '33 Chiang Mai Street, Chiang Mai, Thailand'
    WHEN roomID = 13 THEN '44 Phuket Avenue, Phuket, Thailand'

    -- Room IDs 14-16: France
    WHEN roomID = 14 THEN '55 Champs-Élysées, Paris, France'
    WHEN roomID = 15 THEN '66 Rue de Rivoli, Lyon, France'
    WHEN roomID = 16 THEN '77 Avenue Montaigne, Nice, France'

    WHEN roomID = 17 THEN '88 Via Roma, Rome, France'
    WHEN roomID = 18 THEN '99 Via Veneto, Venice, United States'
    WHEN roomID = 19 THEN '111 Via Dante, Milan, Thailand'
    WHEN roomID = 20 THEN '222 Via Toledo, Naples, Australia'
END;



