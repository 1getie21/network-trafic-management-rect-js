import {Route, Routes} from "react-router-dom";
import Users from "./Users";
import React from "react";
import Traffic from "./Traffic";
import AuthService from "../auth/AuthService ";
import FailedTraffic from "./FailedTraffic";
import Course from "./Site";
import Site from "./Site";
import CheckList from "./Check-list";
import Request from "./Request";
import SixMCList from "./6MCList";
import Ftraffics from "./Ftrafics";

const listOfRoles = AuthService?.getRoles();
function Content() {
    return (<div
        style={{
            width: '100%',
            margin: '10px'
        }}
    >
        <Routes>
            {listOfRoles && listOfRoles.includes("ROLE_ADMIN") && (
                <Route path="/users" element={<Users />} />
            )}
            <Route path="/traffics" element={<Traffic/>}></Route>



            <Route path="/failed-traffics" element={<FailedTraffic/>}></Route>
            <Route path="/" element={<Traffic/>}></Route>>
            <Route path="/CheckList" element={<CheckList/>}></Route>
            <Route path="/request" element={<Request/>}></Route>
            <Route path="/sixmclist" element={<SixMCList/>}></Route>
            <Route path="/sites" element={<Site/>}></Route>
            <Route path="/f-traffics" element={<Ftraffics/>}></Route>

        </Routes>
    </div>)
}

export default Content;
