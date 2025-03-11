import { useState } from "react";
import { API } from "aws-amplify";

const GetForm = () => {
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchFormData = async () => {
    try {
      const response = await API.get("OutsidersAPI", "/pdf", {
        queryStringParameters: {
          userId: "user-123",
          formName: "CDCR2311",
        },
      });

      if (response.url) {
        const formResponse = await fetch(response.url);
        const formJson = await formResponse.json();
        setFormData(formJson);
        setStatus("Form data retrieved successfully.");
      } else {
        setStatus("Form not found.");
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      setStatus("Error fetching form.");
    }
  };

  return (
    <div>
      <h2>Retrieve Form</h2>
      <button onClick={fetchFormData}>Get Form</button>
      {status && <p>{status}</p>}
      {formData && (
        <div>
          <h3>Form Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GetForm;
