import 'antd/dist/reset.css';
import React from 'react';
import AuthService from "./auth/AuthService ";
import Footer from "./components/Footer";
import Content from "./components/Content";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";
import Login from "./components/Login";


const App = () => {
    let isLoggedIn = AuthService.getCurrentUser();
    return (
        <div style={{display: "flex", flexDirection: "column", flex: 1, height: '100vh'}}>
            {isLoggedIn ? (
                <>
                    <Header/>
                    <div style={{display: "flex", flexDirection: "row", flex: 1}}>
                        <SideMenu/>
                        <Content/>
                    </div>
                    <Footer/>
                </>
            ) : (
                <Login/> // Render Login component if not logged in
            )}
        </div>
    );
};

export default App;