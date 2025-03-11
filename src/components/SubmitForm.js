import { useState } from "react";
import { API } from "aws-amplify"; 

const SubmitForm = () => {
  const [formData, setFormData] = useState({ question1: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("OutsidersAPI", "/pdf", {
        body: {
          formName: "CDCR2311",
          userId: "user-123",
          formData,
        },
      });

      setStatus(`Success! Form saved at: ${response.s3Key}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("Error submitting form.");
    }
  };

  return (
    <div>
      <h2>Submit Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Question 1:
          <input type="text" name="question1" value={formData.question1} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SubmitForm;
