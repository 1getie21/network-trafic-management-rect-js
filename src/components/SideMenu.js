import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Button } from "antd";
import {
    CheckSquareOutlined, DisconnectOutlined, FileAddOutlined, FormOutlined,
    MenuUnfoldOutlined, MenuFoldOutlined, SecurityScanOutlined, UserAddOutlined,
} from "@ant-design/icons";
import AuthService from "../auth/AuthService ";

// Get roles from AuthService
const listOfRoles = AuthService?.getRoles();

// Function to create menu item
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

// Initialize list of menu items
const ListOfItems = [];

if (listOfRoles) {
    if (listOfRoles.includes('ROLE_ADMIN')) {
        ListOfItems.push(getItem('Users', 'Users', <UserAddOutlined />));
    }
    if (listOfRoles.includes('ROLE_ADMIN') || listOfRoles.includes('ROLE_MEMBER')) {
        ListOfItems.push(
            getItem('Daily Traffic Monitoring', 'f-traffics', <UserAddOutlined />),
            getItem('Failed Traffics', 'failed-traffics', <DisconnectOutlined />),
            getItem('Sites', 'sites', <FileAddOutlined />),
            getItem('Traffic Request', 'request', <FormOutlined />),
            getItem('Traffic Processing Checklist', 'CheckList', <CheckSquareOutlined />),
            getItem('6Month SSM Checklist', 'sixmclist', <SecurityScanOutlined />)
        );
    }
    if (listOfRoles.includes('ROLE_MANAGER')) {
        ListOfItems.push(getItem('Traffic Request', 'request', <FormOutlined />));
    }
}

// SideMenu component
function SideMenu() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const navigate = useNavigate();

    return (
        <div style={{
            flexDirection: "column",
            boxShadow: "0 5px 8px rgba(0, 0, 0, 0.1)",
            padding: "0 10px",
            marginLeft: -10,
            display: "flex",
            height: "100vh",
            fontFamily: 'Roboto, sans-serif', // Apply Roboto font to the component
            // overflowY: 'auto', // Make the menu scrollable
        }}>
            <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{
                    borderRadius: 0
                }}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
                style={{ height: '100%' }}
                onClick={({ key }) => {
                    if (key === "Collapse") {
                        toggleCollapsed(key);
                    } else {
                        navigate(key);
                    }
                }}
                defaultSelectedKeys={['1']}
                theme="dark"
                inlineCollapsed={collapsed}
                items={ListOfItems}
            />
        </div>
    );
}

export default SideMenu;
