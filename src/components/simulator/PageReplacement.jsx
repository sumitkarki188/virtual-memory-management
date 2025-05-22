import { ALGORITHMS } from '../../constants/algorithms';

export default function PageReplacement({ algorithm, theme }) {
  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow`}>
      <h2 className="text-xl font-semibold mb-4">Page Replacement Algorithm: {ALGORITHMS[algorithm]}</h2>
      <div className="p-4 border border-gray-200 rounded-lg">
        {algorithm === 'FIFO' && (
          <div>
            <div className="flex justify-center items-center mb-4">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-indigo-100 border-indigo-300' : 'bg-indigo-900 border-indigo-600'} border rounded-lg flex justify-center items-center`}>
                <div className="text-2xl font-bold">1</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-indigo-200 border-indigo-300' : 'bg-indigo-800 border-indigo-600'} border rounded-lg flex justify-center items-center`}>
                <div className="text-2xl font-bold">2</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-indigo-300 border-indigo-300' : 'bg-indigo-700 border-indigo-600'} border rounded-lg flex justify-center items-center`}>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-indigo-400 border-indigo-300' : 'bg-indigo-600 border-indigo-600'} border rounded-lg flex justify-center items-center`}>
                <div className="text-2xl font-bold">4</div>
              </div>
            </div>
            <p className={`text-sm text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              First-In-First-Out: The oldest page in memory is replaced first, regardless of how frequently it's used.
            </p>
          </div>
        )}

        {algorithm === 'LRU' && (
          <div>
            <div className="flex justify-center items-center mb-4">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-yellow-100 border-yellow-300' : 'bg-yellow-900 border-yellow-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Last used</div>
                <div className="text-2xl font-bold">956</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-yellow-200 border-yellow-300' : 'bg-yellow-800 border-yellow-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Used</div>
                <div className="text-2xl font-bold">854</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-yellow-300 border-yellow-300' : 'bg-yellow-700 border-yellow-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Used</div>
                <div className="text-2xl font-bold">621</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-yellow-400 border-yellow-300' : 'bg-yellow-600 border-yellow-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Least used</div>
                <div className="text-2xl font-bold">245</div>
              </div>
            </div>
            <p className={`text-sm text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Least Recently Used: Replaces the page that hasn't been accessed for the longest time.
            </p>
          </div>
        )}

        {algorithm === 'OPTIMAL' && (
          <div>
            <div className="flex justify-center items-center mb-4">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-green-100 border-green-300' : 'bg-green-900 border-green-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Next in</div>
                <div className="text-2xl font-bold">1 pg</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`${theme === 'light' ? 'bg-green-200 border-green-300' : 'bg-green-800 border-green-600'} w-16 h-16 border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Next in</div>
                <div className="text-2xl font-bold">5 pg</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-green-300 border-green-300' : 'bg-green-700 border-green-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Next in</div>
                <div className="text-2xl font-bold">12 pg</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-green-400 border-green-300' : 'bg-green-600 border-green-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Never used</div>
                <div className="text-2xl font-bold">∞</div>
              </div>
            </div>
            <p className={`text-sm text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Optimal: Replaces the page that won't be used for the longest time in the future. (Theoretically optimal but requires future knowledge)
            </p>
          </div>
        )}

        {algorithm === 'MRU' && (
          <div>
            <div className="flex justify-center items-center mb-4">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-purple-400 border-purple-300' : 'bg-purple-600 border-purple-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Most used</div>
                <div className="text-2xl font-bold">958</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-purple-300 border-purple-300' : 'bg-purple-700 border-purple-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Used</div>
                <div className="text-2xl font-bold">854</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-purple-200 border-purple-300' : 'bg-purple-800 border-purple-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Used</div>
                <div className="text-2xl font-bold">621</div>
              </div>
              <div className="w-8 text-center">→</div>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-purple-100 border-purple-300' : 'bg-purple-900 border-purple-600'} border rounded-lg flex flex-col justify-center items-center`}>
                <div className="text-xs">Least used</div>
                <div className="text-2xl font-bold">245</div>
              </div>
            </div>
            <p className={`text-sm text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Most Recently Used: Replaces the page that has been most recently accessed, assuming it won't be needed soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}