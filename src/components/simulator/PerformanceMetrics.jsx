import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS } from '@/constants/colors';
import { Icons } from '@/components/common/Icons';

export default function PerformanceMetrics({ metrics, memory, stepLog, theme, performanceChartRef, memoryChartRef }) {
  const getPerformanceData = () => {
    const totalAddresses = metrics.totalAddresses || 1;
    return [
      { 
        name: 'Page Fault Rate', 
        value: (metrics.pageFaults / totalAddresses) * 100,
        fill: COLORS.pageFault 
      },
      { 
        name: 'TLB Hit Rate', 
        value: (metrics.tlbHits / totalAddresses) * 100,
        fill: COLORS.tlbHit 
      },
    ];
  };

  const getMemoryUsageData = () => [
    { name: 'Used', value: memory.filter(frame => frame.used).length },
    { name: 'Free', value: memory.filter(frame => !frame.used).length },
  ];

  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Icons.Cpu className="mr-2" size={20} /> Performance Metrics
      </h2>

      <div className="mb-4" ref={performanceChartRef}>
        <h3 className="text-md font-medium mb-2">Performance Rates</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getPerformanceData()}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-4" ref={memoryChartRef}>
        <h3 className="text-md font-medium mb-2">Memory Usage</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getMemoryUsageData()}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell key="used" fill={COLORS.used} />
                <Cell key="free" fill={COLORS.unused} />
              </Pie>
              <Tooltip formatter={(value) => `${value} frames`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Addresses</div>
            <div className="font-medium">{metrics.totalAddresses || 0}</div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Page Faults</div>
            <div className="font-medium">{metrics.pageFaults || 0}</div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>TLB Hits</div>
            <div className="font-medium">{metrics.tlbHits || 0}</div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>TLB Misses</div>
            <div className="font-medium">{metrics.tlbMisses || 0}</div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Page Fault Rate</div>
            <div className="font-medium">
              {metrics.totalAddresses ? 
                `${((metrics.pageFaults / metrics.totalAddresses) * 100).toFixed(2)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded`}>
            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>TLB Hit Rate</div>
            <div className="font-medium">
              {metrics.totalAddresses ? 
                `${((metrics.tlbHits / metrics.totalAddresses) * 100).toFixed(2)}%` : 
                '0%'}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Operation Log</h3>
        <div className={`h-40 overflow-y-auto ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} p-2 rounded font-mono text-xs`}>
          {stepLog.length > 0 ? (
            stepLog.map((log, index) => (
              <div key={index} className="mb-1">
                <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>[{new Date(log.time).toLocaleTimeString()}]</span> {log.message}
              </div>
            ))
          ) : (
            <div className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-4`}>
              No operations logged yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}