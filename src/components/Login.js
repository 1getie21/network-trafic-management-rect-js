import React, {useState} from 'react';
import {Button, Card, Form, Input, Tag} from 'antd';
import AuthService from "../auth/AuthService ";


const Login = () => {
    const [errors, setError] = useState(null);

    const onFinish = (values) => {
        AuthService.login(values)
            .then(() => {
                window.location.reload();
            }, error => {
                setError(error?.response?.data?.apierror?.message)
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: "url('data:image/jpeg;base64,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')", // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white'
            }}
        >
            <Card
                extra={<a style={{textAlign: 'center', fontSize: 28, color: 'white'}}>Traffic Management System</a>}
                style={{
                    maxWidth: 900,
                    width: 600,
                    height: 400,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
                }}
                bordered={false}
            >
                <Form
                    name="basic"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input
                            style={{
                                height: 50,
                                fontSize: 30,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                            placeholder="User Name"
                        />
                    </Form.Item>
                    <br/>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password
                            style={{
                                height: 50,
                                fontSize: 30,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                            placeholder="Password ***"
                        />
                    </Form.Item>
                    {errors && (
                        <Tag color="red">{errors}. Please try again</Tag>
                    )}
                    <Form.Item wrapperCol={{offset: 16, span: 32}}>
                        <Button
                            style={{
                                height: 50,
                                width: 150,
                                fontSize: 30,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                            type="primary"
                            htmlType="submit"
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;