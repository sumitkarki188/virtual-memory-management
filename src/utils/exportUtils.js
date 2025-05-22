import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export const exportMetricsToCSV = (metrics, addToLog) => {
  try {
    if (!metrics || !metrics.totalAddresses) {
      throw new Error('Invalid or missing metrics data');
    }
    const headers = ['Total Addresses', 'Page Faults', 'TLB Hits', 'TLB Misses', 'Page Fault Rate (%)', 'TLB Hit Rate (%)'];
    const data = [
      [
        metrics.totalAddresses || 0,
        metrics.pageFaults || 0,
        metrics.tlbHits || 0,
        metrics.tlbMisses || 0,
        metrics.totalAddresses ? ((metrics.pageFaults / metrics.totalAddresses) * 100).toFixed(2) : '0',
        metrics.totalAddresses ? ((metrics.tlbHits / metrics.totalAddresses) * 100).toFixed(2) : '0',
      ],
    ];
    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'vmm_metrics.csv');
    if (addToLog) addToLog('Exported metrics to CSV');
  } catch (error) {
    console.error('Error exporting metrics:', error.message);
    if (addToLog) addToLog(`Failed to export metrics: ${error.message}`);
  }
};

export const exportChart = async (chartRef, filename, addToLog) => {
  try {
    if (!chartRef || !chartRef.current) {
      throw new Error('Chart reference is missing or invalid');
    }
    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob for chart');
      }
      saveAs(blob, filename);
      if (addToLog) addToLog(`Exported ${filename}`);
    });
  } catch (error) {
    console.error(`Error exporting ${filename}:`, error.message);
    if (addToLog) addToLog(`Failed to export ${filename}: ${error.message}`);
  }
};