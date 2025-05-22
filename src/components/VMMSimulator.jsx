import { useSimulation } from '../hooks/useSimulation';
import Controls from './simulator/Controls';
import MemoryStatus from './simulator/MemoryStatus';
import PerformanceMetrics from './simulator/PerformanceMetrics';
import TranslationDiagram from './simulator/TranslationDiagram';
import PageReplacement from './simulator/PageReplacement';
import { Icons } from './common/Icons';

export default function VMMSimulator() {
  const {
    pageTable,
    tlb,
    memory,
    addressQueue,
    currentAddress,
    algorithm,
    setAlgorithm,
    metrics,
    simulationSpeed,
    setSimulationSpeed,
    isRunning,
    currentStep,
    stepLog,
    fileContent,
    setFileContent,
    memoryValue,
    physicalAddress,
    activeFrame,
    activePage,
    activeTlbIndex,
    theme,
    setTheme,
    timelineSteps,
    currentTimelineIndex,
    memoryChartRef,
    performanceChartRef,
    toggleSimulation,
    stepSimulation,
    resetSimulation,
    generateTestAddresses,
    handleFileUpload,
    navigateTimeline,
  } = useSimulation();

  return (
    <div className={`flex flex-col min-h-screen p-6 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900 text-white'}`}>
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Icons.Memory className="mr-2" /> Virtual Memory Manager Simulator
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mt-2`}>
            Simulate how operating systems translate virtual addresses to physical addresses using paging, TLB, and page replacement algorithms
          </p>
        </div>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {theme === 'light' ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Controls
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          isRunning={isRunning}
          currentStep={currentStep}
          currentAddress={currentAddress}
          physicalAddress={physicalAddress}
          activePage={activePage}
          activeFrame={activeFrame}
          memoryValue={memoryValue}
          addressQueue={addressQueue}
          metrics={metrics}
          toggleSimulation={toggleSimulation}
          stepSimulation={stepSimulation}
          resetSimulation={resetSimulation}
          generateTestAddresses={generateTestAddresses}
          handleFileUpload={handleFileUpload}
          theme={theme}
          timelineSteps={timelineSteps}
          currentTimelineIndex={currentTimelineIndex}
          navigateTimeline={navigateTimeline}
        />
        <MemoryStatus
          memory={memory}
          tlb={tlb}
          activeFrame={activeFrame}
          activeTlbIndex={activeTlbIndex}
          theme={theme}
          memoryChartRef={memoryChartRef}
        />
        <PerformanceMetrics
          metrics={metrics}
          memory={memory}
          stepLog={stepLog}
          theme={theme}
          performanceChartRef={performanceChartRef}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TranslationDiagram
          currentStep={currentStep}
          currentAddress={currentAddress}
          physicalAddress={physicalAddress}
          theme={theme}
        />
        <PageReplacement
          algorithm={algorithm}
          theme={theme}
        />
      </div>
    </div>
  );
}