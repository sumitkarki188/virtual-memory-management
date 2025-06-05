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
    console.log('Export chart called with:', { chartRef, filename });

    if (!chartRef || !chartRef.current) {
      console.error('Chart reference check failed:', { chartRef, current: chartRef?.current });
      throw new Error('Chart reference is missing or invalid');
    }

    console.log('Chart element found:', chartRef.current);

    // Add a small delay to ensure the chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      width: chartRef.current.offsetWidth,
      height: chartRef.current.offsetHeight
    });

    console.log('Canvas created:', canvas);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          reject(new Error('Failed to create blob for chart'));
          return;
        }
        console.log('Blob created, saving file:', filename);
        saveAs(blob, filename);
        if (addToLog) addToLog(`Exported ${filename}`);
        resolve();
      }, 'image/png');
    });

  } catch (error) {
    console.error(`Error exporting ${filename}:`, error);
    if (addToLog) addToLog(`Failed to export ${filename}: ${error.message}`);
    throw error;
  }
};

// Method to export memory status section specifically
export const exportMemoryStatus = async (filename, addToLog) => {
  try {
    // Look for memory status section specifically
    const selectors = [
      '.memory-status',
      '.memory-usage',
      '[data-section="memory"]',
      '.memory-container',
      '.memory-info'
    ];

    let element = null;
    for (const selector of selectors) {
      element = document.querySelector(selector);
      if (element) {
        console.log(`Found memory status with selector: ${selector}`);
        break;
      }
    }

    // If still not found, try to find by heading text using a different approach
    if (!element) {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      for (const heading of headings) {
        const text = heading.textContent.toLowerCase();
        if (text.includes('memory') || text.includes('tlb')) {
          element = heading.closest('div, section, article') || heading.parentElement;
          console.log('Found memory section by heading:', heading.textContent);
          break;
        }
      }
    }

    // Alternative approach: look for elements containing specific text
    if (!element) {
      const allElements = document.querySelectorAll('div, section, article');
      for (const el of allElements) {
        const text = el.textContent.toLowerCase();
        if ((text.includes('memory') && text.includes('usage')) ||
          (text.includes('tlb') && text.includes('status')) ||
          text.includes('memory & tlb status')) {
          element = el;
          console.log('Found memory section by text content');
          break;
        }
      }
    }

    // Final fallback: look for progress bars or usage indicators
    if (!element) {
      const progressBars = document.querySelectorAll('.progress-bar, .usage-indicator, [role="progressbar"]');
      if (progressBars.length > 0) {
        element = progressBars[0].closest('div, section, article') || progressBars[0].parentElement;
        console.log('Found memory section by progress bar');
      }
    }

    if (!element) {
      throw new Error('Could not find memory status section');
    }

    console.log('Found memory status element:', element);

    // Add delay to ensure rendering
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: true,
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
      height: element.scrollHeight,
      windowHeight: element.scrollHeight,
      removeContainer: true
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob for memory status'));
          return;
        }
        saveAs(blob, filename);
        if (addToLog) addToLog(`Exported ${filename}`);
        resolve();
      }, 'image/png');
    });

  } catch (error) {
    console.error(`Error exporting memory status:`, error);
    if (addToLog) addToLog(`Failed to export memory status: ${error.message}`);
    throw error;
  }
};

// Alternative method using different approach
export const exportChartAlternative = async (chartRef, filename, addToLog) => {
  try {
    if (!chartRef || !chartRef.current) {
      throw new Error('Chart reference is missing or invalid');
    }

    // Method 1: Try with different html2canvas options
    let canvas;
    try {
      canvas = await html2canvas(chartRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        removeContainer: true,
        async: true,
        foreignObjectRendering: true,
        logging: false
      });
    } catch (error) {
      console.warn('First method failed, trying alternative approach:', error);

      // Method 2: Try with minimal options
      canvas = await html2canvas(chartRef.current, {
        scale: 1,
        backgroundColor: '#ffffff'
      });
    }

    // Convert to blob and download
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }
        saveAs(blob, filename);
        if (addToLog) addToLog(`Exported ${filename}`);
        resolve();
      }, 'image/png', 0.9);
    });

  } catch (error) {
    console.error(`Error exporting ${filename}:`, error);
    if (addToLog) addToLog(`Failed to export ${filename}: ${error.message}`);
    throw error;
  }
};

// Method to export by finding chart by selector with specific fallbacks
export const exportChartBySelector = async (selector, filename, addToLog, chartType = 'general') => {
  try {
    let element = document.querySelector(selector);
    if (!element) {
      // Different fallback selectors based on chart type
      let fallbackSelectors = [];

      if (chartType === 'memory') {
        fallbackSelectors = [
          '[data-chart="memory"]',
          '.memory-chart',
          '.memory-usage',
          '.memory-status',
          '.progress-bar',
          '.usage-indicator',
          '.memory-container'
        ];
      } else if (chartType === 'performance') {
        fallbackSelectors = [
          '[data-chart="performance"]',
          '.performance-chart',
          '.recharts-wrapper',
          '.recharts-responsive-container',
          '.line-chart',
          '.performance-container'
        ];
      } else {
        fallbackSelectors = [
          '.recharts-wrapper',
          '.recharts-responsive-container',
          '[data-testid="chart"]',
          '.chart-container',
          'svg',
          'canvas'
        ];
      }

      for (const fallbackSelector of fallbackSelectors) {
        element = document.querySelector(fallbackSelector);
        if (element) {
          console.log(`Found element with fallback selector: ${fallbackSelector} for ${chartType} chart`);
          break;
        }
      }

      if (!element) {
        throw new Error(`No ${chartType} chart element found with selector: ${selector} or fallback selectors`);
      }
    }

    console.log(`Found ${chartType} element by selector:`, element);

    // Add delay to ensure rendering
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: true,
      useCORS: true,
      allowTaint: true
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob for chart'));
          return;
        }
        saveAs(blob, filename);
        if (addToLog) addToLog(`Exported ${filename}`);
        resolve();
      }, 'image/png');
    });

  } catch (error) {
    console.error(`Error exporting ${filename}:`, error);
    if (addToLog) addToLog(`Failed to export ${filename}: ${error.message}`);
    throw error;
  }
};

// Smart export function that tries multiple methods
export const smartExportChart = async (chartRef, selector, filename, addToLog) => {
  const methods = [
    // Method 1: Use provided ref
    async () => {
      if (chartRef && chartRef.current) {
        return await exportChart(chartRef, filename, addToLog);
      }
      throw new Error('Chart ref not available');
    },
    // Method 2: Use selector
    async () => {
      return await exportChartBySelector(selector, filename, addToLog);
    },
    // Method 3: Use alternative method with ref
    async () => {
      if (chartRef && chartRef.current) {
        return await exportChartAlternative(chartRef, filename, addToLog);
      }
      throw new Error('Chart ref not available for alternative method');
    }
  ];

  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`Trying export method ${i + 1} for ${filename}`);
      await methods[i]();
      console.log(`Successfully exported ${filename} using method ${i + 1}`);
      return;
    } catch (error) {
      console.warn(`Export method ${i + 1} failed for ${filename}:`, error.message);
      if (i === methods.length - 1) {
        // Last method failed, throw the error
        throw new Error(`All export methods failed for ${filename}`);
      }
    }
  }
};