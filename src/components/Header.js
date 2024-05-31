import React, { useState } from 'react';
import { CaretDownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Dropdown, Form, Input, Menu, notification } from "antd";
import axiosInstance from "../auth/authHeader";
import AuthService from "../auth/AuthService ";

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isLoggedIn = AuthService.getCurrentUser();
    const API_URL ="http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";

    const handleLogout = () => {
        AuthService.logout();
    };

    const onSubmitClick = async (values) => {
        try {
            await updateRecordById(values, isLoggedIn.id);
            openNotificationWithIcon('success', 'Success', 'Your password is updated successfully.');
            setOpenDrawer(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const updateRecordById = async (data, id) => {
        const response = await axiosInstance.put(`${API_URL}/users/${id}`, data);
        return response.data;
    };

    const handleApiError = (error) => {
        const errorMessage = error?.response?.data?.apierror;
        if (errorMessage) {
            const { message, subErrors, status } = errorMessage;
            const errorText = subErrors?.length > 0
                ? `${message} ${subErrors[0]?.field} ${subErrors[0]?.message}`
                : message;
            openNotificationWithIcon('error', `Error ~${status || ''}`, errorText);
        } else {
            openNotificationWithIcon('error', 'Error', error.message || 'Unknown error occurred.');
        }
    };

    const openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message,
            description,
        });
    };

    const password = () => (
        <Drawer
            title="Change Password"
            placement="right"
            onClose={() => setOpenDrawer(false)}
            visible={openDrawer}
        >
            <Form
                layout="vertical"
                onFinish={onSubmitClick}
                onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}
            >
                <Form.Item
                    label="New Password"
                    name="password"
                    placeholder="Enter new password ***"
                    rules={[{ required: true, message: 'Please input password!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );

    const menu = (
        <Menu>
            <Menu.Item onClick={handleLogout}>
                <LogoutOutlined /> Logout
            </Menu.Item>
            <Menu.Item onClick={() => setOpenDrawer(true)}>
                Change Password
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60,
            backgroundColor: "blue"
        }}>
            <div></div>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button type="text" style={{ color: 'white', fontWeight: "bold", fontSize: 20 }}>
                    <UserOutlined /> {isLoggedIn ? `${isLoggedIn.firstName} ${isLoggedIn.lastName}` : 'Guest'}
                    <CaretDownOutlined />
                </Button>
            </Dropdown>
            {password()}
        </div>
    );
};

export default Header;
