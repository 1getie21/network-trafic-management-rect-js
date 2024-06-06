import React from "react";

function Footer() {
    return (
        <div
            style={{
                textAlign: "center",
                color: "white",
                backgroundColor: "rgba(8, 5, 46, 0.98)",
                fontWeight: "bold",
                padding: "20px",
            }}
        >
            <div>system teamop</div>
            <div>All rights are reserved</div>
            <style>{`
        @media (max-width: 768px) {
          div {
            font-size: 14px;
          }
        }
        @media (max-width: 576px) {
          div {
            font-size: 12px;
          }
        }
      `}</style>
        </div>
    );
}

export default Footer;
