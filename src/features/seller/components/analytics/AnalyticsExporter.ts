export const exportToCSV = (headers: string[], rows: any[][], filename: string) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      const cellStr = cell === null || cell === undefined ? '' : String(cell);
      // Escape quotes
      return `"${cellStr.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (headers: string[], rows: any[][], filename: string) => {
  // Simple XML format or Tab-separated values that open cleanly in Excel
  const tabContent = [
    headers.join('\t'),
    ...rows.map(row => row.map(cell => cell === null || cell === undefined ? '' : String(cell)).join('\t'))
  ].join('\n');

  const blob = new Blob([tabContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = () => {
  window.print();
};
