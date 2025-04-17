import React, { useState, useContext } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

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

        if (formData.email && formData.password) {
            setLoading(true);
            try {
                const result = await login(formData.email, formData.password);

                if (result.success) {
                    navigate("/");
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("Đã xảy ra lỗi khi đăng nhập");
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setError("Vui lòng điền đầy đủ thông tin đăng nhập");
        }
    };

    return (
        <>
            <Container className="py-5" style={{ marginTop: "250px" }}>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow rounded-4">
                            <Card.Body className="p-4 p-md-5">
                                <h2 className="text-center mb-4">Đăng nhập</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
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

                                    <Form.Group className="mb-4" controlId="formPassword">
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

                                    <div className="d-grid">
                                        <Button
                                            variant="danger"
                                            type="submit"
                                            className="py-2 rounded-3"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center mt-4">
                                    <p>Chưa có tài khoản? <Link to="/register" className="text-danger">Đăng ký ngay</Link></p>
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

export default Login; 