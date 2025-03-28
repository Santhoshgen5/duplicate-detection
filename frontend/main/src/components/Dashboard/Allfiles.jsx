import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import api from "../../api"; // Import axios instance


export default function Allfiles() {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        api
            .get("google-api/google-drive/files/")
            .then((response) => {
                console.log(response.data.files);
                setFiles(response.data.files); // Google Drive API returns `files` array
            })
            .catch((error) => {
                console.error("Error fetching files:", error);
            });
    }, []);

    return (
        <>

            <div>
                <h2 >Google Drive All Files</h2>
                <Grid container spacing={2}>
                    {files.length > 0 ? (
                        files.map((file, index) => (
                            <Grid size={{
                                sm: 12,
                                md: 6,
                                lg: 4,
                            }} key={index}>
                                <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {file.name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            href={file.webViewLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Open File
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>No files found.</Typography>
                    )}
                </Grid>
            </div>
        </>
    );
}

