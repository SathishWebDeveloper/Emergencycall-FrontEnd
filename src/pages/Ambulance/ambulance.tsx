import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Table from "../../Components/table";
import ambulanceImage from "../../assets/ambulance121.png";

interface Item {
  id: number;
  name: string;
}

const ambulanceColData = [
  { field: 'id', headerName: 'ID', width: 200 },
  {
    field: 'image', headerName: 'Image', width: 200, renderCell: (params: any) => (

      <img
        src={params?.row?.image ? params.row.image : ambulanceImage}
        alt={params?.row?.name ? params.row.name : "test"}
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    ),
  },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'location', headerName: 'Location', width: 200 }
]

export const Ambulance: React.FC = () => {
  const { state } = useLocation();
  const { location } = state;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // change your local server here....
        const response = await fetch(`http://192.168.1.58:5000/api/ambulances?location=${location}`)
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

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>This is the Page for the Ambulance List... </h1>
      <div className="tableContainer">
        <Table rowdata={items} coldata={ambulanceColData} />
      </div>
    </div>
  );
};

