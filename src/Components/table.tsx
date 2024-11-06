
import { DataGrid } from '@mui/x-data-grid'

const Table = ({ rowdata, coldata }: any) => {

    const paginationModel = { page: 0, pageSize: 5 };
    return (

        <DataGrid
            rows={rowdata}
            columns={coldata}
            initialState={{ pagination: { paginationModel } }}
            sx={{ border: 0, maxWidth: '1100px' }}
        />


    )
}
export default Table