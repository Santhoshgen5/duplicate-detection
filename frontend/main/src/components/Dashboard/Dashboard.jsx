import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api"; // Import axios instance

export default function Dashboard() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    api
      .get("google-api/google-drive/files/")
      .then((response) => {
        setFiles(response.data.files); // Google Drive API returns `files` array
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  return (
    <>
      <div>Dashboard</div>
      <Link to={"/logout"}>Log Out</Link>

      <h2>Google Drive Files</h2>
      <ul>
        {files.length > 0 ? (
          files.map((file) => (
            <li key={file.id}>
              {file.name} - 
              <a
                href={`http://127.0.0.1:8000/google-drive/file/${file.id}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </li>
          ))
        ) : (
          <p>No files found.</p>
        )}
      </ul>
    </>
  );
}

