import {Route, Routes} from "react-router-dom";
import Users from "./Users";
import React from "react";
import Traffic from "./Traffic";
import AuthService from "../auth/AuthService ";
import FailedTraffic from "./FailedTraffic";
import Site from "./Site";
import CheckList from "./Check-list";
import Request from "./Request";
import SixMCList from "./6MCList";
import Ftraffics from "./Ftrafics";

const listOfRoles = AuthService?.getRoles();

// Content component
function Content() {
    return (
        <div
            style={{
                width: '100%',
                marginTop: '10px',
                marginLeft: '10px',
                marginRight: '2px',
                backgroundColor: "rgba(255,255,255,0.62)",
            }}
        >
            <Routes>
                {listOfRoles && (listOfRoles.includes("ROLE_ADMIN") || listOfRoles.includes("ROLE_MEMBER")) && (
                    <>
                        <Route path="/f-traffics" element={<Ftraffics/>}></Route>
                        <Route path="/failed-traffics" element={<FailedTraffic/>}></Route>
                        <Route path="/CheckList" element={<CheckList/>}></Route>
                        <Route path="/sixmclist" element={<SixMCList/>}></Route>
                        <Route path="/sites" element={<Site/>}></Route>
                    </>
                )}
                {listOfRoles && listOfRoles.includes("ROLE_ADMIN") && (
                    <Route path="/users" element={<Users/>}/>
                )}
                <Route path="/request" element={<Request/>}></Route>
            </Routes>
        </div>
    );
}

export default Content;