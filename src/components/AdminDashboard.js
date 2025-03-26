import React, { useState, useEffect } from 'react';
import { getSubmittedForms, filterSubmittedForms } from '../services/formsApi';
import { Button, Alert } from "react-native";
import RNFS from "react-native-fs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import '../AdminDashboard.css';
import SiteHeader from './SiteHeader';

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');
    const [pdfName, setPdfName] = useState('');
    
    useEffect(() => {
        async function fetchForms() {
            const allForms = await getSubmittedForms();
            setForms(allForms);
            setFilteredForms(allForms);
        }
        fetchForms();
    }, []);

    const handleFilterChange = async () => {
        const filtered = await filterSubmittedForms(prisonFilter, playerFilter);
        setFilteredForms(filtered);
    };

    const handleSort = () => {
        setFilteredForms(prevForms => [...prevForms].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    };

    const findPlayerPdf = () => {
        
        setPdfName()
    }

    const downloadPDF = async (fileName) => {
        try {
          // Step 1: Fetch S3 URL from DynamoDB
          const dynamoDBClient = new DynamoDBClient({ region: "us-west-1" });
          const params = {
            TableName: "PDFVersionsTable", // Replace with partition key name
            Key: {
              FileName: { S: fileName },
              Version: { S: "latest" }, // Replace with sort key name or logic to fetch the latest version
            },
          };
      
          const { Item } = await dynamoDBClient.send(new GetItemCommand(params));
          const s3Key = Item.S3Key.S; // Retrieve the S3 key from the response
      
          //  Fetch the file from S3
          const s3Client = new S3Client({ region: "us-west-1" });
          const bucketName = "outsidersfc-app-bucket";
          const fileUrl = `https://${outsidersfc-app-bucket}.s3.amazonaws.com/${s3Key}`;
          const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`; //The downloaded file is saved locally using the RNFS.DocumentDirectoryPath. The file name is based on the fileName parameter.
      
          const download = RNFS.downloadFile({
            fromUrl: fileUrl,
            toFile: filePath,
          });
      
          const result = await download.promise;
      
          if (result.statusCode === 200) {
            Alert.alert("Success", `PDF downloaded to ${filePath}`);
          } else {
            throw new Error("Failed to download PDF");
          }
        } catch (error) {
          console.error("Error downloading PDF:", error);
          Alert.alert("Error", "Failed to download the PDF");
        }
      };

    //<Button title="Download PDF" onPress={() => downloadPDF("example.pdf")} />
    //the file name is dynamic, ensure it's passed correctly based on the context
    return (
        <div>
            <SiteHeader />
            <div className="admin-dashboard">
                <h1>Admin Dashboard - View Submitted Forms</h1>
                <div className="filters">
                    <select onChange={(e) => setPrisonFilter(e.target.value)}>
                        <option value="">All Prisons</option>
                        <option value="Folsom">Folsom</option>
                        <option value="San Quentin">San Quentin</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="Search by Player" 
                        onChange={(e) => setPlayerFilter(e.target.value)} 
                    />
                    <button onClick={handleFilterChange}>Filter</button>
                    <button onClick={handleSort}>Sort by Most Recent</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Form ID</th>
                            <th>Prison</th>
                            <th>Player</th>
                            <th>Submission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredForms.map(form => (
                            <tr key={form.formID}>
                                <td>{form.formID}</td>
                                <td>{form.prison}</td>
                                <td>{form.player}</td>
                                <td>{new Date(form.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
