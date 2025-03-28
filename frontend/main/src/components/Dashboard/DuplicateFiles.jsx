import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import api from "../../api"; // Import axios instance

export default function DuplicateFiles() {
  const [duplicates, setDuplicates] = useState({ name_duplicates: {}, content_duplicates: {} });
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    api
      .get("google-api/google-drive/duplicates/") // Fetch duplicate files
      .then((response) => {
        console.log(response.data);
        setDuplicates(response.data.duplicates);
        setAlertMessage(response.data.alert);
      })
      .catch((error) => {
        console.error("Error fetching duplicate files:", error);
      });
  }, []);

  const renderDuplicateGroup = (title, duplicateData) => (
    <>

      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Grid container spacing={2}>
        {Object.keys(duplicateData).length > 0 ? (
          Object.entries(duplicateData).map(([key, files]) => (
            <Grid size={12} key={key}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {title === "Filename-Based Duplicates" ? key : "Duplicate Group"}
                  </Typography>
                  <Grid container spacing={2}>
                    {files.map((file) => (
                      <Grid xs={12} sm={6} md={4} key={file.id}>
                        <Card sx={{ boxShadow: 2, borderRadius: 2, height: "100%" }}>
                          <CardContent>
                            <Typography variant="body1" gutterBottom>
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
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No {title.toLowerCase()} found.</Typography>
        )}
      </Grid>
    </>
  );

  return (

    <Box sx={{ p: 3 }}>

      <Typography variant="h4" sx={{ mt: 3 }}>Duplicate Files</Typography>

      {alertMessage && <Alert severity="warning" sx={{ my: 2 }}>{alertMessage}</Alert>}
      <br />
      <br />
      {renderDuplicateGroup("Filename-Based Duplicates", duplicates.name_duplicates)}
      <br />
      <br />
      {renderDuplicateGroup("Content-Based Duplicates", duplicates.content_duplicates)}
    </Box>
  );
}
