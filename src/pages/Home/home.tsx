import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css";

interface Option {
  label: string;
  value: string;
}

export const Home: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // change your local server here....
        const response = await fetch('http://192.168.1.58:5000/api/locations');
        const data: any = await response.json();
        setOptions(data.locations)
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);


  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setError(false);
  };

  const handleDoctorsClick = (type: string) => {
    if (!selectedOption) {
      setError(true);
      return;
    }
    setError(false);
    if (type === 'doctors') {
      navigate(`/doctors`, { state: { location: selectedOption } });
    } else if (type === 'ambulance') {
      navigate(`/ambulance`, { state: { location: selectedOption } });
    }
  };

  return (
    <div className="banner-container">
      <div className="banner-content">
        <h1>EMERGENCY HELPLINE 🚑...</h1>
        <p>
          Accident cases are increasing more nowadays. So this app needs to display the list of all nearby ambulance services and doctors based on location with one click.
        </p>
        <ul>
          <li>Fast response time</li>
          <li>24/7 availability</li>
          <li>Emergency support</li>
        </ul>
        <div className="banner-selectlocation">
          <Autocomplete
            disablePortal
            options={options}
            sx={{ width: 300 }}
            onChange={(e: any) => handleSelect(e.target.innerText)}
            renderInput={(params) => <TextField {...params} label="Location" />}
          />
          <div className="error-text">{error && <div >Please select a location before proceeding.</div>}</div>
        </div>
        <div className="banner-buttonContainer">
          <button onClick={() => handleDoctorsClick('doctors')}>GET DOCTORS</button>
          <button onClick={() => handleDoctorsClick('ambulance')}>GET AMBULANCE</button>
        </div>
      </div>
      <div className="banner-bgimage"></div>
    </div>
  );
};
