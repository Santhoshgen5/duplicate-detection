import React from 'react'

export default function AuthButton({ onClick, icon, text }) {
    return (
        <button
            style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 26px",
                border: "1px solid black",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "background-color 0.2s",
                minHeight: "32px",
                minWidth: "220px",
                textAlign: "center",
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = "black";
                e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "black";
            }}
        >
            <img src={icon} alt="Logo" style={{ height: "19px" }} />
            {text}
        </button>
    );
}




