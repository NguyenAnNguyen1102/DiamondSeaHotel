import React, { useState, useContext, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Alert, Nav, Tab } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthProvider";

const Profile = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("thongtin");
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form state cho thông tin cá nhân
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
    });

    // Form state cho đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Kiểm tra nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            // Lấy thông tin hiện tại của người dùng
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            setProfileData({
                fullName: userData.fullName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || "",
            });
        }
    }, [isAuthenticated, navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();

        try {
            // Lấy danh sách người dùng từ localStorage
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const userIndex = users.findIndex(u => u.email === user.email);

            if (userIndex !== -1) {
                // Cập nhật thông tin người dùng trong danh sách
                users[userIndex] = {
                    ...users[userIndex],
                    fullName: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                };

                // Lưu lại danh sách người dùng
                localStorage.setItem("users", JSON.stringify(users));

                // Cập nhật thông tin người dùng hiện tại
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                const updatedUser = {
                    ...currentUser,
                    fullName: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
            } else {
                setMessage({ type: "danger", text: "Không tìm thấy thông tin người dùng!" });
            }
        } catch (error) {
            setMessage({ type: "danger", text: "Đã xảy ra lỗi khi cập nhật thông tin!" });
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra xác nhận mật khẩu
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "danger", text: "Mật khẩu xác nhận không khớp!" });
            return;
        }

        try {
            // Lấy danh sách người dùng từ localStorage
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const userIndex = users.findIndex(u => u.email === user.email);

            if (userIndex !== -1) {
                // Kiểm tra mật khẩu hiện tại
                if (users[userIndex].password !== passwordData.currentPassword) {
                    setMessage({ type: "danger", text: "Mật khẩu hiện tại không chính xác!" });
                    return;
                }

                // Cập nhật mật khẩu
                users[userIndex].password = passwordData.newPassword;

                // Lưu lại danh sách người dùng
                localStorage.setItem("users", JSON.stringify(users));

                // Reset form mật khẩu
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
            } else {
                setMessage({ type: "danger", text: "Không tìm thấy thông tin người dùng!" });
            }
        } catch (error) {
            setMessage({ type: "danger", text: "Đã xảy ra lỗi khi đổi mật khẩu!" });
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!isAuthenticated) {
        return null; // sẽ được chuyển hướng bởi useEffect
    }

    return (
        <>
            <Container className="py-5" style={{ marginTop: "250px" }}>
                <Row>
                    <Col lg={3} md={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <div className="text-center mb-3">
                                    <div className="rounded-circle bg-secondary d-inline-flex justify-content-center align-items-center mb-3" style={{ width: "100px", height: "100px" }}>
                                        <span className="text-white display-4">{profileData.fullName.charAt(0)}</span>
                                    </div>
                                    <h5 className="card-title">{profileData.fullName}</h5>
                                    <p className="text-muted">{profileData.email}</p>
                                </div>

                                <Nav className="flex-column" variant="pills">
                                    <Nav.Link
                                        active={activeTab === "thongtin"}
                                        onClick={() => setActiveTab("thongtin")}
                                        className="mb-2"
                                    >
                                        Thông tin cá nhân
                                    </Nav.Link>
                                    <Nav.Link
                                        active={activeTab === "doimatkhau"}
                                        onClick={() => setActiveTab("doimatkhau")}
                                        className="mb-2"
                                    >
                                        Đổi mật khẩu
                                    </Nav.Link>
                                    <Button
                                        variant="outline-danger"
                                        className="w-100 mt-3"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </Button>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={9} md={8}>
                        {message.text && (
                            <Alert variant={message.type} onClose={() => setMessage({ type: "", text: "" })} dismissible>
                                {message.text}
                            </Alert>
                        )}

                        <Card>
                            <Card.Body>
                                <Tab.Container activeKey={activeTab}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="thongtin">
                                            <h4 className="mb-4">Thông tin cá nhân</h4>
                                            <Form onSubmit={handleProfileSubmit}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Họ và tên</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="fullName"
                                                        value={profileData.fullName}
                                                        onChange={handleProfileChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={profileData.email}
                                                        disabled
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Email không thể thay đổi
                                                    </Form.Text>
                                                </Form.Group>

                                                <Button variant="primary" type="submit">
                                                    Lưu thay đổi
                                                </Button>
                                            </Form>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="doimatkhau">
                                            <h4 className="mb-4">Đổi mật khẩu</h4>
                                            <Form onSubmit={handlePasswordSubmit}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Mật khẩu mới</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Button variant="primary" type="submit">
                                                    Đổi mật khẩu
                                                </Button>
                                            </Form>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile; 