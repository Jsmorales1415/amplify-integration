import { MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import { config } from './config';
import {
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from '@mui/x-data-grid';

const getExcelData = (apiRef: any) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row: any = {};
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  return data;
};

const handleExport = (apiRef: any) => {
  const data = getExcelData(apiRef);

  const rows = data.map((row) => {
    const mRow: any = {};
    for (const key of config.keys) {
      mRow[key] = row[key];
    }
    return mRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.sheet_add_aoa(worksheet, [[...config.columnNames]], {
    origin: 'A1',
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, config.sheetName);
  XLSX.writeFile(workbook, config.fileName, { compression: true });
};

export const ExportMenuItem = (props: any) => {
  const apiRef = useGridApiContext();
  const { hideMenu } = props;

  return (
    <MenuItem
      onClick={() => {
        handleExport(apiRef);
        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      Download Excel
    </MenuItem>
  );
};
