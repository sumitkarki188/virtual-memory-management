import { NUM_FRAMES } from '../../constants/config';
import { COLORS } from '../../constants/colors';
import { Icons } from '../common/Icons';

export default function MemoryStatus({ memory, tlb, activeFrame, activeTlbIndex, theme, memoryChartRef }) {
  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Icons.Memory className="mr-2" size={20} /> Memory & TLB Status
      </h2>

      <div className="mb-4" ref={memoryChartRef}>
        <h3 className="text-md font-medium mb-2">Memory Usage</h3>
        <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-3 rounded-md`}>
          <div className={`${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'} h-8 rounded-full overflow-hidden`}>
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ 
                width: `${(memory.filter(frame => frame.used).length / NUM_FRAMES) * 100}%` 
              }}
            ></div>
          </div>
          <div className={`mt-2 text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            <span className="font-medium">
              {memory.filter(frame => frame.used).length} / {NUM_FRAMES}
            </span> frames used ({Math.round((memory.filter(frame => frame.used).length / NUM_FRAMES) * 100)}%)
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Memory Frames Preview</h3>
        <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
          {memory.slice(0, 64).map((frame, index) => (
            <div 
              key={index}
              className={`h-8 w-full rounded flex items-center justify-center text-xs ${
                activeFrame === index 
                  ? 'bg-yellow-400 text-black' 
                  : frame.used 
                    ? 'bg-indigo-600 text-white' 
                    : theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'
              }`}
              title={frame.used ? `Frame ${index}: Page ${frame.pageNumber}` : `Frame ${index}: Empty`}
            >
              {frame.used ? frame.pageNumber : ''}
            </div>
          ))}
        </div>
        <div className={`text-center text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
          Showing 64/{NUM_FRAMES} frames
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">TLB Entries ({tlb.length}/{16})</h3>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-600'}`}>
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
              <tr>
                <th className={`px-2 py-1 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Index</th>
                <th className={`px-2 py-1 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Page</th>
                <th className={`px-2 py-1 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Frame</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-600'}`}>
              {tlb.length > 0 ? (
                tlb.map((entry, index) => (
                  <tr 
                    key={index} 
                    className={activeTlbIndex === index ? 'bg-yellow-100' : ''}
                  >
                    <td className="px-2 py-1 whitespace-nowrap text-xs">{index}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-xs">{entry.pageNumber}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-xs">{entry.frameNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={`px-2 py-4 text-center text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    TLB is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}