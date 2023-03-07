import React, { memo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridRow,
  GridColumnHeaders,
  GridColDef,
  DataGridProProps,
  GridToolbarContainer,
} from '@mui/x-data-grid-pro';
import { Link } from '@mui/material';
import { ExportButton } from '../../components/excel-export/export-button';

const CustomToolbar = (props: any) => {
  return (
    <GridToolbarContainer {...props}>
      <ExportButton />
    </GridToolbarContainer>
  );
};

const MemoizedRow = memo(GridRow);

const MemoizedColumnHeaders = memo(GridColumnHeaders);

interface IUser {
  id: string;
  name: string;
}

const useFetch = () => {
  const [currentData, setCurrentData] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3001/usersData');
    const { users } = await response.json();
    setCurrentData((prev) => [...prev, ...users]);
  };

  return { currentData, fetchUsers };
};

export default function DataGridProDemo() {
  const { currentData, fetchUsers } = useFetch();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'resource',
      headerName: 'Resource',
      width: 250,
      renderCell(params) {
        return (
          <Link href={params.value} target='_blank'>
            View location
          </Link>
        );
      },
    },
  ];
  console.log({ currentData });

  const handleOnRowsScrollEnd: DataGridProProps['onRowsScrollEnd'] = (
    params
  ) => {
    console.log('SCROLL END');
    if (currentData.length >= 10) {
      fetchUsers();
    }
  };

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      {currentData.length > 0 && (
        <DataGridPro
          getRowId={(row) => `${row.name}-${row.id}`}
          rows={currentData}
          columns={columns}
          // loading={data.rows.length === 0}
          rowHeight={38}
          checkboxSelection
          disableRowSelectionOnClick
          components={{
            Row: MemoizedRow,
            ColumnHeaders: MemoizedColumnHeaders,
            Toolbar: CustomToolbar,
          }}
          onRowsScrollEnd={handleOnRowsScrollEnd}
        />
      )}
    </Box>
  );
}
