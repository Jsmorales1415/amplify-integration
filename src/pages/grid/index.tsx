import React, { memo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridRow,
  GridColumnHeaders,
  GridColDef,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { Button } from '@mui/material';

const MemoizedRow = memo(GridRow);

const MemoizedColumnHeaders = memo(GridColumnHeaders);

interface IUser {
  id: string;
  name: string;
  address: string;
  email: string;
  resource: string;
}

const useFetch = () => {
  const [currentData, setCurrentData] = useState<any[]>([]);

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
    { field: 'resource', headerName: 'Resource', width: 250 },
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

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();

    doc.text('Users Data', 30, 20);

    let imageUrl64: string = (await getBase64FromUrl(
      'https://vilmanunez.com/wp-content/uploads/2016/05/listado-banco-de-imagenes-vectores-gratis.png'
    )) as string;

    console.log('imageUrl', imageUrl64);

    doc.addImage(imageUrl64, 'JPEG', 10, 10, 20, 20, 'image', 'NONE', 0);

    autoTable(doc, {
      headStyles: { cellWidth: 'wrap' },
      columns: [
        { header: 'ID', dataKey: 'id' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Address', dataKey: 'address' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Resource', dataKey: 'resource' },
      ],
      body: currentData,
      startY: 20,
    });

    doc.save('table.pdf');
  };

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <Button onClick={exportToPDF}>PDF</Button>
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
