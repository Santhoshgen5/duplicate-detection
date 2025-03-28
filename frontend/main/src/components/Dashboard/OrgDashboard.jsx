import React, { useState, useEffect } from "react";
import humanlogo from "../../assets/humanlogo/humanlogo.jpg"
import Allfiles from "./Allfiles";
import DuplicateFiles from "./DuplicateFiles";
import { Link } from "react-router-dom";
import api from "../../api";

export default function OrgDashboard() {
    const [page, setPage] = useState("allfiles");

    const [profile, setProfile] = useState(null)
    const [username, setUsername] = useState("")

    useEffect(() => {
        api
            .get("user-api/userdetails/") // Fetch duplicate files
            .then((response) => {
                console.log(response.data);
                setUsername(response.data.name)
                setProfile(response.data.profile)
                // setDuplicates(response.data.duplicates);
                // setAlertMessage(response.data.alert);
            })
            .catch((error) => {
                console.error("Error fetching duplicate files:", error);
            });
    }, [])

    function mngpage(page) {
        setPage(page)
    }

    console.log(profile)

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={{
                ...styles.sidebar,
                height: "100%",
            }}>
                <div style={{ minHeight: "660px" }}>
                    <div style={{ textAlign: "center" }}>
                        {profile ? (
                            <img src={profile} alt="Profile" height="100px" style={{ borderRadius: "50%" }} />
                        ) : (
                            <img src={humanlogo} alt="Default Profile" height="100px" style={{ borderRadius: "50%" }} />
                        )}
                    </div>

                    <p style={{ textAlign: "center" }}>{username}</p>
                    <br />

                    <h4 className="navbartexts" onClick={() => { mngpage("allfiles") }}><i class="fa fa-file-o" aria-hidden="true" style={{ fontSize: "20px", paddingRight: "5px" }} />All Files</h4>

                    <h4 className="navbartexts" onClick={() => { mngpage("duplicate") }}><i class="fa fa-files-o" aria-hidden="true" style={{ fontSize: "20px", paddingRight: "5px" }} />Duplicate Files</h4>

                </div>


                <div style={{ textAlign: "center" }}>
                    <Link
                        to={"/logout"}
                        style={{

                            textDecoration: "none",
                            color: "black",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            border: "1px solid black"
                        }}
                    >
                        Log Out
                    </Link>
                </div>



            </div>

            {/* Main Chat Section */}
            <div style={styles.mainContent}>
                {page == "allfiles" ? <Allfiles /> : <DuplicateFiles />}

            </div>
        </div >
    )
}


const styles = {
    container: {
        display: "flex", // Enables side-by-side layout
        width: "100%",

        height: "100vh", // Adjust height as needed

    },
    sidebar: {
        minWidth: "150px", // Adjust as needed
        backgroundColor: "#ECECEC",
        borderRight: "1px solid black",
        padding: "20px",
        height: "100%",
        position: "fixed",
        marginRight: "150px"
    },
    mainContent: {
        flex: 1, // Takes remaining space
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: "0 10px 10px 0",
        padding: "0px 30px",
        marginLeft: "191px"
    },


    placeholderText: {
        color: "#aaa",
        fontStyle: "italic",
        textAlign: "center",
        paddingTop: "5%",
    },
};

