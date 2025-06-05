import { ALGORITHMS } from '@/constants/algorithms';
import { TIMELINE_STEPS } from '@/constants/timeline';
import { COLORS } from '@/constants/colors';
import { Icons } from '@/components/common/Icons';
import { exportMetricsToCSV, exportChart, exportChartBySelector, exportMemoryStatus } from '@/utils/exportUtils';

export default function Controls({
  algorithm,
  setAlgorithm,
  simulationSpeed,
  setSimulationSpeed,
  isRunning,
  currentStep,
  currentAddress,
  physicalAddress,
  activePage,
  activeFrame,
  memoryValue,
  addressQueue,
  metrics,
  toggleSimulation,
  stepSimulation,
  resetSimulation,
  generateTestAddresses,
  handleFileUpload,
  theme,
  timelineSteps,
  currentTimelineIndex,
  navigateTimeline,
  performanceChartRef,
  memoryChartRef,
  addToLog,
}) {
  const getStepColor = (step) => {
    switch (step) {
      case 'tlb_hit': return COLORS.tlbHit;
      case 'page_fault': return COLORS.pageFault;
      case 'tlb_miss': return COLORS.tlbMiss;
      default: return COLORS.highlight;
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'tlb_hit': return <Icons.AlertCircle className="ml-2" size={16} />;
      case 'page_fault': return <Icons.AlertCircle className="ml-2" size={16} />;
      case 'tlb_miss': return <Icons.AlertCircle className="ml-2" size={16} />;
      case 'idle': return <Icons.Play className="ml-2" size={16} />;
      case 'finished': return <Icons.RefreshCw className="ml-2" size={16} />;
      default: return <Icons.Cpu className="ml-2" size={16} />;
    }
  };

  const handleExportMetrics = () => {
    try {
      console.log('Export metrics clicked', metrics);
      exportMetricsToCSV(metrics, addToLog);
    } catch (error) {
      console.error('Error exporting metrics:', error);
      if (addToLog) addToLog(`Failed to export metrics: ${error.message}`);
    }
  };

  const handleExportPerformanceChart = async () => {
    try {
      console.log('Export performance chart clicked', performanceChartRef);
      
      // Check if ref exists and has current property
      if (!performanceChartRef || !performanceChartRef.current) {
        console.warn('Performance chart ref not available, trying alternative method');
        // Try to find the performance chart specifically
        await exportChartBySelector('[data-chart="performance"]', 'performance_chart.png', addToLog, 'performance');
        return;
      }
      
      await exportChart(performanceChartRef, 'performance_chart.png', addToLog);
    } catch (error) {
      console.error('Error exporting performance chart:', error);
      if (addToLog) addToLog(`Failed to export performance chart: ${error.message}`);
      
      // Try fallback method with performance-specific selectors
      try {
        console.log('Trying fallback export method for performance chart');
        await exportChartBySelector('.recharts-wrapper', 'performance_chart.png', addToLog, 'performance');
      } catch (fallbackError) {
        console.error('Fallback export also failed:', fallbackError);
        if (addToLog) addToLog(`All export methods failed for performance chart`);
      }
    }
  };

  const handleExportMemoryChart = async () => {
    try {
      console.log('Export memory chart clicked', memoryChartRef);
      
      // Check if ref exists and has current property
      if (!memoryChartRef || !memoryChartRef.current) {
        console.warn('Memory chart ref not available, trying alternative method');
        // Try to find the memory section specifically
        await exportMemoryStatus('memory_status.png', addToLog);
        return;
      }
      
      await exportChart(memoryChartRef, 'memory_chart.png', addToLog);
    } catch (error) {
      console.error('Error exporting memory chart:', error);
      if (addToLog) addToLog(`Failed to export memory chart: ${error.message}`);
      
      // Try fallback method with memory-specific approach
      try {
        console.log('Trying fallback export method for memory status');
        await exportMemoryStatus('memory_status.png', addToLog);
      } catch (fallbackError) {
        console.error('Fallback export also failed:', fallbackError);
        if (addToLog) addToLog(`All export methods failed for memory chart`);
      }
    }
  };

  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Icons.Settings className="mr-2" size={20} /> Simulation Controls
      </h2>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1`}>
            Page Replacement Algorithm
          </label>
          <select
            className={`w-full border ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'} rounded-md px-3 py-2`}
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            {Object.entries(ALGORITHMS).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1`}>
            Simulation Speed (ms)
          </label>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
            className="w-full"
          />
          <div className={`text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{simulationSpeed}ms</div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1`}>
            Address Input
          </label>
          <div className="flex space-x-2">
            <button
              className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white rounded-md`}
              onClick={generateTestAddresses}
              disabled={isRunning}
            >
              <Icons.RefreshCw className="mr-2" size={16} /> Generate Test Data
            </button>
            <label className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600'} text-white rounded-md cursor-pointer`}>
              <Icons.Upload className="mr-2" size={16} /> Upload File
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isRunning}
              />
            </label>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md ${
              isRunning 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            onClick={toggleSimulation}
          >
            <Icons.Play className="mr-2" size={16} /> {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
            onClick={stepSimulation}
            disabled={isRunning}
          >
            Step
          </button>
          <button
            className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white rounded-md`}
            onClick={() => resetSimulation(addressQueue)}
            disabled={isRunning}
          >
            Reset
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-md`}
            onClick={handleExportMetrics}
          >
            <Icons.Download className="mr-2" size={16} /> Export Metrics
          </button>
          <button
            className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-md`}
            onClick={handleExportPerformanceChart}
          >
            <Icons.Download className="mr-2" size={16} /> Export Performance Chart
          </button>
          <button
            className={`flex-1 flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-md`}
            onClick={handleExportMemoryChart}
          >
            <Icons.Download className="mr-2" size={16} /> Export Memory Status
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Current Status</h3>
        <div 
          className="p-3 rounded-md flex items-center" 
          style={{ backgroundColor: `${getStepColor(currentStep)}20` }}
        >
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getStepColor(currentStep) }}
          ></div>
          <span className="font-medium capitalize">
            {currentStep.replace('_', ' ')}
            {getStepIcon()}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Current Address</div>
            <div className="font-mono font-medium">
              {currentAddress !== null ? currentAddress : '-'}
            </div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Physical Address</div>
            <div className="font-mono font-medium">
              {physicalAddress !== null ? physicalAddress : '-'}
            </div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Page Number</div>
            <div className="font-mono font-medium">
              {activePage !== null ? activePage : '-'}
            </div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Frame Number</div>
            <div className="font-mono font-medium">
              {activeFrame !== null ? activeFrame : '-'}
            </div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded col-span-2`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Memory Value</div>
            <div className="font-mono font-medium">
              {memoryValue !== '?' ? memoryValue : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Addresses Remaining</h3>
        <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded text-center`}>
          <span className="text-xl font-bold">{addressQueue.length}</span>
          <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>of {metrics.totalAddresses + addressQueue.length}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Timeline</h3>
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} ${currentTimelineIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigateTimeline('prev')}
            disabled={currentTimelineIndex <= 0}
          >
            <Icons.ChevronLeft size={16} />
          </button>
          <div className="flex-1 flex overflow-x-auto">
            {timelineSteps.map((step, index) => (
              <div
                key={index}
                className={`px-2 py-1 text-xs rounded mx-1 cursor-pointer ${index === currentTimelineIndex ? 'font-bold' : ''}`}
                style={{ backgroundColor: `${TIMELINE_STEPS.find(s => s.id === step)?.color || '#gray'}30` }}
                onClick={() => navigateTimeline(index)}
              >
                {TIMELINE_STEPS.find(s => s.id === step)?.label || step}
              </div>
            ))}
          </div>
          <button
            className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} ${currentTimelineIndex >= timelineSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigateTimeline('next')}
            disabled={currentTimelineIndex >= timelineSteps.length - 1}
          >
            <Icons.ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}