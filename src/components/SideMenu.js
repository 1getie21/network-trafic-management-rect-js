import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {FallOutlined, FundOutlined, MenuUnfoldOutlined, UserOutlined} from "@ant-design/icons";
import AuthService from "../auth/AuthService ";
import SixMCList from "./6MCList";

const listOfRoles = AuthService?.getRoles();

const ListOfItems = [
    getItem('Collapse', 'Collapse', <MenuUnfoldOutlined />)
];

if (listOfRoles && listOfRoles.includes('ROLE_ADMIN')) {
    ListOfItems.push(getItem('Users', 'Users', <UserOutlined />));
}

ListOfItems.push(
    // getItem('Users', 'Users', <UserOutlined />),
    getItem('Daily-Traffic', 'Traffics', <FundOutlined/>),
    getItem('failed-traffics', 'failed-traffics', <FallOutlined/>),
    getItem('Add site', 'sites', <UserOutlined/>),
    getItem('Request-Form', 'request', <UserOutlined/>),
    getItem('Check-List', 'CheckList', <UserOutlined/>),
        getItem('6Month-Check-List', 'sixmclist', <UserOutlined/>),
);

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,

        label,
        type,
    };
}

function SideMenu() {
    const [collapsed, setCollapsed] = useState(false);
    const [width, setWidth] = useState(200); // Initialize width with 200

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        setWidth(collapsed ? 200 : 56); // Adjust width based on collapse state
    };

    const navigate = useNavigate();

    return (
        <div
            style={{
                width: width,
                display: "flex",
                flexDirection: "column",
            }}
        >
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
