import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface AmbulanceServiceFormData {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
}

interface ServiceFormProps {
  fetchItems?: () => Promise<void>;
}
interface Option {
  label: string;
  value: string;
}
const AmbulanceServiceForm: React.FC<any> = ({ fetchItems, keys }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState<AmbulanceServiceFormData>({
    id: 0,
    name: '',
    description: '',
    location: '',
    image: '',
  });
  const [errors, setErrors] = useState({
    id: false,
    name: false,
    description: false,
    location: false,
    image: false,
  });

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // change your local server here....
        const response = await fetch('http://localhost:5000/api/locations');
        const data: any = await response.json();
        setOptions(data.locations)
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (field: keyof AmbulanceServiceFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setError(false);
  };


  const postDoctorData = async () => {

    try {
      const response = await fetch(`http://localhost:5000/api/${keys === 'doctors' ? 'doctors' : 'ambulances'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


      if (response.ok) {
        setSubmitStatus('Form submitted successfully!');
        setFormData({
          id: 0,
          name: '',
          description: '',
          location: '',
          image: '',
        });
        fetchItems();

      } else {
        setSubmitStatus('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('Error submitting form. Please try again.');
    }
  }

  const handleSubmit = async () => {
    setSubmitStatus('');
    const newErrors = {
      id: formData.id === 0,
      name: formData.name === '',
      description: formData.description === '',
      location: formData.location === '',
      image: formData.image === '',
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) return;
    if (!selectedOption) {
      setError(true);
      return;
    }
    if (!hasError) {
      postDoctorData();
    }

  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Ambulance Service Form
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="ID"
          type="number"
          variant="outlined"
          value={formData.id || ''}
          onChange={(e) => handleChange('id', Number(e.target.value))}
          error={errors.id}
          helperText={errors.id ? 'ID is required' : ''}
        />
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          helperText={errors.name ? 'Name is required' : ''}
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          helperText={errors.description ? 'Description is required' : ''}
        />

        <Autocomplete
          fullWidth
          disablePortal
          options={options}
          onChange={(e: any) => {
            handleChange('location', e.target.innerText),
              handleSelect(e.target.innerText)
          }}
          renderInput={(params) => <TextField {...params} label="Location" />}
        />
        <div className="error-text">{error && <div >Please select a location .</div>}</div>
        <TextField
          fullWidth
          label="Image URL"
          variant="outlined"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          error={errors.image}
          helperText={errors.image ? 'Image URL is required' : ''}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
        {submitStatus && (
          <Typography
            variant="body2"
            color={submitStatus.includes('successfully') ? 'green' : 'red'}
            sx={{ mt: 2 }}
          >
            {submitStatus}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default AmbulanceServiceForm;
