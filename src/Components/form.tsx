import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

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
const AmbulanceServiceForm: React.FC<any> = ({fetchItems}) => {
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

  const handleChange = (field: keyof AmbulanceServiceFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

 const postDoctorData = async() => {
    console.log("function calling")
    try {
        const response = await fetch('http://localhost:5000/api/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        console.log("response",response);
  
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
    if(!hasError) {
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
        <TextField
          fullWidth
          label="Location"
          variant="outlined"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          error={errors.location}
          helperText={errors.location ? 'Location is required' : ''}
        />
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
