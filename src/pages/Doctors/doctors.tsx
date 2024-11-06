import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Table from "../../Components/table";
import doctorimage from "../../assets/sampledoctor.webp";
import { Button } from "@mui/material";
import ServiceForm from "../../Components/form";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

interface Item {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
}

export const Doctors: React.FC = () => {
  const { state } = useLocation();
  const { location } = state;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);

  const fetchItems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctors?location=${location}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data.results);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = async (id: number) => {
  };

  const handleDelete = async (id: number) => {
         if(id){
          try {
            const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
              method: 'DELETE',
            });
            
            if (response.ok) {
              fetchItems();
            } else {
              console.error('Failed to delete doctor.');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
  };

  const doctorColData = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params: any) => (
        <img
          src={params?.row?.image ? params.row.image : doctorimage}
          alt={params?.row?.name ? params.row.name : "Doctor"}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "location", headerName: "Location", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => handleEdit(params.row.id)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>This is the Page for the Doctors List...</h1>
      <div className="tableContainer">
        <Table rowdata={items} coldata={doctorColData} />
      </div>
      <div className="contentCenter">
        <Button variant="contained" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Add Doctors Form" : "Close Doctors Form"}
        </Button>
      </div>
      <div>
        {!showForm && <ServiceForm fetchItems={fetchItems} keys={"doctors"}/>}
      </div>
    </div>
  );
};
