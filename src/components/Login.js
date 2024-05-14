import React, {useState} from 'react';
import {Button, Card, Form, Input} from 'antd';
import AuthService from "../auth/AuthService ";

const Login = () => {
    const [errors, setError] = useState(null);

    const onFinish = (values) => {
        AuthService.login(values)
            .then(() => {
                    window.location.reload();
                },
                error => {
                    setError(error.response.data.message)
                }
            )
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
                backgroundColor: "black"
            }}
        >
            <Card  extra={<a style={{textAlign: 'center', fontSize: 28}}>Traffic Management System</a >}
                   wrapperCol={{span: 32}}
                   style={{maxWidth: 900, width: 600, height: 400}}
                   bordered={false}>
                <Form name="basic"
                      initialValues={{remember: true}}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off">
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input
                            style={{height: 50,fontSize:30}}
                            placeholder={'User Name'}/>
                    </Form.Item>
                    <br/>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password
                            style={{height: 50,fontSize:30}}
                            placeholder={'Password ***'}/>
                    </Form.Item>
                    {errors && (
                        <div style={{width: 300, alignItems: "center", marginBottom: 15}}>
                            <label style={{color: 'red'}}>{errors}. Please try again</label>
                        </div>
                    )}
                    <Form.Item wrapperCol={{offset: 16, span: 32}}>
                        <Button
                            style={{height:50,width:150,fontSize:30}}
                            type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>

            </Card>
        </div>
    );
};

export default Login;
