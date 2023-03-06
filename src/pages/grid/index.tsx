import React, { memo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridRow,
  GridColumnHeaders,
  GridColDef,
  DataGridProProps,
} from '@mui/x-data-grid-pro';

const MemoizedRow = memo(GridRow);

const MemoizedColumnHeaders = memo(GridColumnHeaders);

interface IUser {
  id: string;
  name: string;
}

const useFetch = () => {
  const [currentData, setCurrentData] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/usersData');
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
          }}
          onRowsScrollEnd={handleOnRowsScrollEnd}
        />
      )}
    </Box>
  );
}
