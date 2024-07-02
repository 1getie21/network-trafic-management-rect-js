import React, { useState } from 'react';
import { CaretDownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Dropdown, Form, Input, Menu, notification } from "antd";
import axiosInstance from "../auth/authHeader";
import AuthService from "../auth/AuthService ";

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isLoggedIn = AuthService.getCurrentUser();
const API_URL = process.env.REACT_APP_API_URL;


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
                    label="Enter old password"
                    name="oldPassword"
                    placeholder="Enter old password ***"
                    rules={[{ required: true, message: 'Please input your old password!' }]}
                >
                    <Input type="password" />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="password"
                    placeholder="Enter new password ***"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input type="password" />
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
            position: "fixed", // Make the header fixed
            top: 0, // Position it at the top of the viewport
            width: "100%", // Occupy full width
            zIndex: 1000, // Set a high z-index to ensure it's on top of other elements
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgb(255,255,255)", // Semi-transparent white background
            height: 60,
            // backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx6yBZlLnqn-b9ZCU-bug-r6Ytcmdv1_dDPw&s')", // Replace 'path_to_your_image.jpg' with the actual path to your image
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        }}>
            <div style={{fontWeight: "bold", fontSize: 20}}>Traffic Management System</div>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button type="text" style={{color: 'black', fontWeight: "bold", fontSize: 20}}>
                    <UserOutlined/> {isLoggedIn ? `${isLoggedIn.firstName} ${isLoggedIn.lastName}` : 'Guest'}
                    <CaretDownOutlined/>
                </Button>
            </Dropdown>
            {password()}
        </div>
    );
};

export default Header;
