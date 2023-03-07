import { GridToolbarExportContainer } from '@mui/x-data-grid';
import * as React from 'react';
import { ButtonProps } from '@mui/material';
import { ExportMenuItem } from './export-menu-item';

export function ExportButton(
  props: JSX.IntrinsicAttributes &
    Omit<ButtonProps<'button', {}>, 'ref'> &
    React.RefAttributes<HTMLButtonElement>
) {
  return (
    <GridToolbarExportContainer {...props}>
      <ExportMenuItem />
    </GridToolbarExportContainer>
  );
}
