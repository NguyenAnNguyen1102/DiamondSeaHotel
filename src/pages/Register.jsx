import React, { useState, useContext } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Kiểm tra mật khẩu xác nhận
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (formData.fullName && formData.email && formData.password) {
            setLoading(true);
            try {
                const result = await register(formData.fullName, formData.email, formData.password);

                if (result.success) {
                    navigate("/login");
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("Đã xảy ra lỗi khi đăng ký");
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setError("Vui lòng điền đầy đủ thông tin");
        }
    };

    return (
        <>
            <Container className="py-5" style={{ marginTop: "250px" }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow rounded-4">
                            <Card.Body className="p-4 p-md-5">
                                <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formFullName">
                                        <Form.Label>Họ và tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ và tên của bạn"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập lại mật khẩu"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button
                                            variant="danger"
                                            type="submit"
                                            className="py-2 rounded-3"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang xử lý..." : "Đăng ký"}
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center mt-4">
                                    <p>Đã có tài khoản? <Link to="/login" className="text-danger">Đăng nhập</Link></p>
                                    <p><Link to="/" className="text-secondary">Quay lại trang chủ</Link></p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Register; 