import { useState, useEffect, useRef } from 'react';
import { PAGE_SIZE, NUM_PAGES, NUM_FRAMES, FRAME_SIZE, TLB_SIZE } from '../constants/config';
import { exportMetricsToCSV, exportChart } from '../utils/exportUtils';

export const useSimulation = () => {
  const [pageTable, setPageTable] = useState(Array(NUM_PAGES).fill(-1));
  const [tlb, setTlb] = useState([]);
  const [memory, setMemory] = useState(
    Array(NUM_FRAMES).fill().map(() => ({ used: false, pageNumber: -1, lastUsed: 0 }))
  );
  const [addressQueue, setAddressQueue] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [metrics, setMetrics] = useState({
    totalAddresses: 0,
    pageFaults: 0,
    tlbHits: 0,
    tlbMisses: 0,
  });
  const [simulationSpeed, setSimulationSpeed] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('idle');
  const [stepLog, setStepLog] = useState([]);
  const [fileContent, setFileContent] = useState('');
  const [memoryValue, setMemoryValue] = useState('?');
  const [physicalAddress, setPhysicalAddress] = useState(null);
  const [activeFrame, setActiveFrame] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [activeTlbIndex, setActiveTlbIndex] = useState(null);
  const [theme, setTheme] = useState('light');
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(-1);

  const timeCounter = useRef(0);
  const memoryChartRef = useRef(null);
  const performanceChartRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRunning && addressQueue.length > 0) {
      timer = setTimeout(() => {
        processNextAddress();
      }, simulationSpeed);
    } else if (addressQueue.length === 0 && isRunning) {
      setIsRunning(false);
      setCurrentStep('finished');
      addToLog('Simulation completed!');
    }
    return () => clearTimeout(timer);
  }, [isRunning, addressQueue, simulationSpeed]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const processNextAddress = () => {
    const address = addressQueue[0];
    const newQueue = addressQueue.slice(1);
    setAddressQueue(newQueue);
    if (address !== undefined) {
      simulateAddressTranslation(address);
    }
  };

  const simulateAddressTranslation = (virtualAddress) => {
    setCurrentAddress(virtualAddress);
    timeCounter.current++;

    const pageNumber = Math.floor(virtualAddress / PAGE_SIZE);
    const offset = virtualAddress % PAGE_SIZE;

    setActivePage(pageNumber);
    setActiveFrame(null);
    setActiveTlbIndex(null);

    addToLog(`Processing virtual address ${virtualAddress} (Page: ${pageNumber}, Offset: ${offset})`);

    setTimelineSteps([]);
    setCurrentTimelineIndex(-1);

    addTimelineStep('tlb_lookup');
    const tlbEntry = tlb.find(entry => entry.pageNumber === pageNumber);

    if (tlbEntry) {
      addTimelineStep('tlb_hit');
      setActiveTlbIndex(tlb.indexOf(tlbEntry));
      const frameNumber = tlbEntry.frameNumber;
      setActiveFrame(frameNumber);
      setCurrentStep('tlb_hit');

      setMetrics(prev => ({
        ...prev,
        totalAddresses: prev.totalAddresses + 1,
        tlbHits: prev.tlbHits + 1,
      }));

      addToLog(`TLB Hit! Page ${pageNumber} found in frame ${frameNumber}`);

      updateMemoryUsage(frameNumber);
      addTimelineStep('memory_update');

      const physAddr = frameNumber * FRAME_SIZE + offset;
      setPhysicalAddress(physAddr);
      setMemoryValue(Math.floor(Math.random() * 256));

      addToLog(`Physical address: ${physAddr}, Value: ${memoryValue}`);
    } else {
      addTimelineStep('tlb_miss');
      setCurrentStep('tlb_miss');
      setMetrics(prev => ({
        ...prev,
        totalAddresses: prev.totalAddresses + 1,
        tlbMisses: prev.tlbMisses + 1,
      }));

      addToLog(`TLB Miss! Page ${pageNumber} not in TLB`);

      const frameNumber = pageTable[pageNumber];

      if (frameNumber !== -1) {
        addTimelineStep('page_table_hit');
        setActiveFrame(frameNumber);
        setCurrentStep('page_table_hit');
        addToLog(`Page table hit! Page ${pageNumber} found in frame ${frameNumber}`);

        updateTLB(pageNumber, frameNumber);
        addTimelineStep('memory_update');

        updateMemoryUsage(frameNumber);

        const physAddr = frameNumber * FRAME_SIZE + offset;
        setPhysicalAddress(physAddr);
        setMemoryValue(Math.floor(Math.random() * 256));

        addToLog(`Physical address: ${physAddr}, Value: ${memoryValue}`);
      } else {
        addTimelineStep('page_fault');
        setCurrentStep('page_fault');
        setMetrics(prev => ({
          ...prev,
          pageFaults: prev.pageFaults + 1,
        }));

        addToLog(`Page fault! Page ${pageNumber} not in memory`);

        const frameNumber = handlePageFault(pageNumber);
        setActiveFrame(frameNumber);

        updateTLB(pageNumber, frameNumber);
        addTimelineStep('memory_update');

        const physAddr = frameNumber * FRAME_SIZE + offset;
        setPhysicalAddress(physAddr);
        setMemoryValue(Math.floor(Math.random() * 256));

        addToLog(`Loaded page ${pageNumber} into frame ${frameNumber}`);
        addToLog(`Physical address: ${physAddr}, Value: ${memoryValue}`);
      }
    }

    startTimelineAnimation();
  };

  const handlePageFault = (pageNumber) => {
    const freeFrameIndex = memory.findIndex(frame => !frame.used);

    if (freeFrameIndex !== -1) {
      const newMemory = [...memory];
      newMemory[freeFrameIndex] = {
        used: true,
        pageNumber: pageNumber,
        lastUsed: timeCounter.current
      };
      setMemory(newMemory);

      const newPageTable = [...pageTable];
      newPageTable[pageNumber] = freeFrameIndex;
      setPageTable(newPageTable);

      return freeFrameIndex;
    } else {
      let victimFrameIndex;

      switch (algorithm) {
        case 'FIFO':
          victimFrameIndex = memory.reduce(
            (oldest, frame, index, arr) => 
              frame.lastUsed < arr[oldest].lastUsed ? index : oldest,
            0
          );
          break;
        case 'LRU':
          victimFrameIndex = memory.reduce(
            (leastRecent, frame, index, arr) => 
              frame.lastUsed < arr[leastRecent].lastUsed ? index : leastRecent,
            0
          );
          break;
        case 'MRU':
          victimFrameIndex = memory.reduce(
            (mostRecent, frame, index, arr) => 
              frame.lastUsed > arr[mostRecent].lastUsed ? index : mostRecent,
            0
          );
          break;
        case 'OPTIMAL':
          const remainingAddresses = [...addressQueue];
          const pageAccessTimes = {};

          memory.forEach((frame, index) => {
            const pageNum = frame.pageNumber;
            if (pageNum !== -1) {
              const nextAccessIndex = remainingAddresses.findIndex(
                addr => Math.floor(addr / PAGE_SIZE) === pageNum
              );
              pageAccessTimes[index] = nextAccessIndex === -1 ? 
                Number.MAX_SAFE_INTEGER : 
                nextAccessIndex;
            }
          });

          victimFrameIndex = Object.keys(pageAccessTimes).reduce(
            (farthest, frame) => 
              pageAccessTimes[frame] > pageAccessTimes[farthest] ? frame : farthest,
            Object.keys(pageAccessTimes)[0]
          );
          break;
        default:
          victimFrameIndex = 0;
      }

      const victimPage = memory[victimFrameIndex].pageNumber;
      const newPageTable = [...pageTable];
      if (victimPage !== -1) {
        newPageTable[victimPage] = -1;
      }

      newPageTable[pageNumber] = victimFrameIndex;
      setPageTable(newPageTable);

      const newMemory = [...memory];
      newMemory[victimFrameIndex] = {
        used: true,
        pageNumber: pageNumber,
        lastUsed: timeCounter.current
      };
      setMemory(newMemory);

      addToLog(`Replaced page ${victimPage} with page ${pageNumber} in frame ${victimFrameIndex}`);

      return victimFrameIndex;
    }
  };

  const updateTLB = (pageNumber, frameNumber) => {
    let newTlb = [...tlb];
    newTlb = newTlb.filter(entry => entry.pageNumber !== pageNumber);
    const newEntry = {
      pageNumber: pageNumber,
      frameNumber: frameNumber,
      lastUsed: timeCounter.current
    };
    if (newTlb.length >= TLB_SIZE) {
      newTlb.shift();
    }
    newTlb.push(newEntry);
    setTlb(newTlb);
  };

  const updateMemoryUsage = (frameNumber) => {
    const newMemory = [...memory];
    newMemory[frameNumber] = {
      ...newMemory[frameNumber],
      lastUsed: timeCounter.current
    };
    setMemory(newMemory);
  };

  const addToLog = (message) => {
    setStepLog(prev => [...prev, { time: Date.now(), message }]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);

      const addresses = content
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => parseInt(line.trim(), 10))
        .filter(addr => !isNaN(addr) && addr >= 0 && addr < PAGE_SIZE * NUM_PAGES);

      if (addresses.length > 0) {
        setAddressQueue(addresses);
        addToLog(`Loaded ${addresses.length} addresses from file`);
        resetSimulation(addresses);
      } else {
        addToLog('No valid addresses found in file');
      }
    };
    reader.readAsText(file);
  };

  const resetSimulation = (addresses = []) => {
    timeCounter.current = 0;
    setPageTable(Array(NUM_PAGES).fill(-1));
    setTlb([]);
    setMemory(Array(NUM_FRAMES).fill().map(() => ({ used: false, pageNumber: -1, lastUsed: 0 })));
    setCurrentAddress(null);
    setMetrics({
      totalAddresses: 0,
      pageFaults: 0,
      tlbHits: 0,
      tlbMisses: 0,
    });
    setCurrentStep('idle');
    setStepLog([]);
    setMemoryValue('?');
    setPhysicalAddress(null);
    setActiveFrame(null);
    setActivePage(null);
    setActiveTlbIndex(null);
    setTimelineSteps([]);
    setCurrentTimelineIndex(-1);

    if (addresses.length > 0) {
      setAddressQueue(addresses);
      addToLog('Simulation reset with loaded addresses');
    } else {
      setAddressQueue([]);
      addToLog('Simulation reset');
    }
  };

  const generateTestAddresses = () => {
    const count = 100;
    const addresses = Array(count)
      .fill()
      .map(() => Math.floor(Math.random() * PAGE_SIZE * NUM_PAGES));

    setAddressQueue(addresses);
    setFileContent(addresses.join('\n'));
    addToLog(`Generated ${count} random test addresses`);
    resetSimulation(addresses);
  };

  const toggleSimulation = () => {
    if (addressQueue.length === 0) {
      addToLog('No addresses to process. Please load or generate addresses first.');
      return;
    }

    setIsRunning(!isRunning);
    addToLog(isRunning ? 'Simulation paused' : 'Simulation started');
  };

  const stepSimulation = () => {
    if (addressQueue.length === 0) {
      addToLog('No addresses to process. Please load or generate addresses first.');
      return;
    }

    if (isRunning) {
      setIsRunning(false);
    }

    processNextAddress();
  };

  const addTimelineStep = (stepId) => {
    setTimelineSteps(prev => [...prev, stepId]);
    setCurrentTimelineIndex(prev => prev + 1);
  };

  const startTimelineAnimation = () => {
    if (timelineSteps.length > 0) {
      setCurrentTimelineIndex(0);
      if (isRunning) {
        const interval = setInterval(() => {
          setCurrentTimelineIndex(prev => {
            if (prev + 1 < timelineSteps.length) {
              setCurrentStep(timelineSteps[prev + 1]);
              return prev + 1;
            } else {
              clearInterval(interval);
              return prev;
            }
          });
        }, simulationSpeed / timelineSteps.length);
      }
    }
  };

  const navigateTimeline = (direction) => {
    setIsRunning(false);
    setCurrentTimelineIndex(prev => {
      const newIndex = direction === 'next' ? prev + 1 : prev - 1;
      if (newIndex >= 0 && newIndex < timelineSteps.length) {
        setCurrentStep(timelineSteps[newIndex]);
        return newIndex;
      }
      return prev;
    });
  };

  return {
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
    exportMetricsToCSV: () => exportMetricsToCSV(metrics, addToLog),
    exportPerformanceChart: () => exportChart(performanceChartRef, 'performance_chart.png', addToLog),
    exportMemoryChart: () => exportChart(memoryChartRef, 'memory_chart.png', addToLog),
    navigateTimeline,
  };
};