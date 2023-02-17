import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams, GridSortModel } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Activity } from '../../interfaces/activity';


const columns: GridColDef[] = [
  { field: 'activityId', headerName: 'ID' },
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'type', headerName: 'Type' },
  { field: 'description', headerName: 'Description', width: 250 },
  { field: 'accountId', headerName: 'Account Id', sortable: false },
  { field: 'isDelete', headerName: 'Is Delete', sortable: false },
  { field: 'status', headerName: 'Status', sortable: false },
  { field: 'formhtmlview_id', headerName: 'Formhtmlview Id', width: 60, sortable: false },
  { field: 'is_notified', headerName: 'Is Notified', sortable: false },
  { field: 'latitude', headerName: 'Lat', sortable: false },
  { field: 'longitude', headerName: 'Long', sortable: false },
  { field: 'is_geotask', headerName: 'Is Geotask', sortable: false },
  { field: 'sequence', headerName: 'Sequence', sortable: false },
  { field: 'sitemap', headerName: 'Sitemap', sortable: false },
];

const Activities = () => {

  const [activities, setActtivities] = useState<Activity[]>([]);

  const [sortOptions, setSortOptions] = useState({});

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = useState(10);


  const getAct = async () => {
    try {
      const { data } = await axios.get<Activity[]>('http://localhost:3001/items');
      setActtivities(data)
    } catch (error) {
      console.error(error);
    }
  }


  const onChangeSortModel = (sortModel: GridSortModel) => {
    setSortOptions({ sortModel: [...sortModel] });
    //BE with sort options
    console.log(sortOptions);
  }

  const queryOptions = useMemo(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize],
  );

  useEffect(() => {
    getAct();
  }, [])

  return (
    <Box>
      <Typography variant='h6'>Activities</Typography>
      <Grid container>
        <Grid item xs={12} sx={{ height: 600, width: '100%' }}>
          <DataGrid
            getRowId={(row) => row.activityId}
            rows={activities}
            columns={columns}


            sortingMode='server'
            onSortModelChange={onChangeSortModel}

            checkboxSelection

            // paginationMode="server"
            rowsPerPageOptions={[10, 25, 50, 100]}
            pagination
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => {
              setPage(newPage)
              console.log(queryOptions);
              console.log(`new page: ${newPage}`);
              
            }}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize)
              console.log(`new page size: ${newPageSize}`);
            }}

            // initialState={{
            //   pagination: {
            //     pageSize: 10
            //   }
            // }}


            onSelectionModelChange={(newSelectionModel) => {
              //toma el id
              console.log(newSelectionModel)
            }}
          />
        </Grid>
      </Grid>

    </Box>
  )
}

export default Activities