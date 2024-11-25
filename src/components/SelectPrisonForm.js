import React, { useState, useEffect } from 'react';
import '../SelectPrisonForm.css';

const SelectPrisonForm = ({ onPrisonSelected }) => {
    const [prisons, setPrisons] = useState([]);
    const [selectedPrisons, setSelectedPrisons] = useState([]);

    useEffect(() => {
      fetch('/api/prisons.json') // Adjust the path if using a different folder
          .then((res) => res.json())
          .then((data) => setPrisons(data))
          .catch((err) => console.error(err));
  }, []);
  

    const handleSelectionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
        setSelectedPrisons(selectedOptions);
    };

    const handleSubmit = () => {
        if (selectedPrisons.length === 0) {
            alert('Please select at least one prison.');
            return;
        }
        onPrisonSelected(selectedPrisons);
    };

    return (
        <div className="form-container">
            <h1>Select Prisons</h1>
            <p>Choose one or more prisons to proceed with registration.</p>
            <select multiple className="form-control" onChange={handleSelectionChange}>
                {prisons.map((prison) => (
                    <option key={prison.id} value={prison.id}>
                        {prison.name}
                    </option>
                ))}
            </select>
            <button className="submit-btn" onClick={handleSubmit}>
                Continue
            </button>
        </div>
    );
};

export default SelectPrisonForm;
