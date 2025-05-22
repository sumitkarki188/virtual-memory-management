import { PAGE_SIZE, FRAME_SIZE } from '../../constants/config';

export default function TranslationDiagram({ currentStep, currentAddress, physicalAddress, theme }) {
  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow`}>
      <h2 className="text-xl font-semibold mb-4">Virtual Address Translation Process</h2>
      <div className="relative h-64 border border-gray-200 rounded-lg p-4">
        <div className={`absolute top-4 left-4 w-1/3 ${theme === 'light' ? 'bg-blue-100 border-blue-300' : 'bg-blue-900 border-blue-600'} border rounded p-2`}>
          <div className="text-xs text-center font-medium">Virtual Address</div>
          <div className="flex mt-1 text-center text-xs">
            <div className={`w-1/2 ${theme === 'light' ? 'bg-blue-200' : 'bg-blue-700'} p-1 rounded-l`}>
              Page Number
            </div>
            <div className={`w-1/2 ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'} p-1 rounded-r`}>
              Offset
            </div>
          </div>
          <div className="text-center mt-2 text-sm">
            {currentAddress !== null ? (
              <>
                <span className="font-mono">
                  {currentAddress} = 
                </span>
                <span className={`font-mono ${theme === 'light' ? 'bg-blue-200' : 'bg-blue-700'} px-1 mx-1`}>
                  {Math.floor(currentAddress / PAGE_SIZE)}
                </span>
                <span className={`font-mono ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'} px-1`}>
                  {currentAddress % PAGE_SIZE}
                </span>
              </>
            ) : '- - -'}
          </div>
        </div>

        <div className={`absolute top-4 right-4 w-1/3 ${currentStep === 'tlb_hit' ? 'bg-green-100 border-green-300' : currentStep === 'tlb_miss' ? 'bg-orange-100 border-orange-300' : theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-700 border-gray-600'} border rounded p-2`}>
          <div className="text-xs text-center font-medium">TLB Lookup</div>
          <div className="text-center mt-2 text-sm">
            {currentStep === 'tlb_hit' ? (
              <span className="bg-green-200 px-2 py-1 rounded text-green-800">Hit!</span>
            ) : currentStep === 'tlb_miss' ? (
              <span className="bg-orange-200 px-2 py-1 rounded text-orange-800">Miss!</span>
            ) : '- - -'}
          </div>
        </div>

        <div className={`absolute bottom-4 left-4 w-1/3 ${currentStep === 'page_table_hit' ? 'bg-green-100 border-green-300' : currentStep === 'page_fault' ? 'bg-red-100 border-red-300' : theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-700 border-gray-600'} border rounded p-2`}>
          <div className="text-xs text-center font-medium">Page Table Lookup</div>
          <div className="text-center mt-2 text-sm">
            {currentStep === 'page_table_hit' ? (
              <span className="bg-green-200 px-2 py-1 rounded text-green-800">In Memory</span>
            ) : currentStep === 'page_fault' ? (
              <span className="bg-red-200 px-2 py-1 rounded text-red-800">Page Fault!</span>
            ) : '- - -'}
          </div>
        </div>

        <div className={`absolute bottom-4 right-4 w-1/3 ${theme === 'light' ? 'bg-purple-100 border-purple-300' : 'bg-purple-900 border-purple-600'} border rounded p-2`}>
          <div className="text-xs text-center font-medium">Physical Address</div>
          <div className="flex mt-1 text-center text-xs">
            <div className={`w-1/2 ${theme === 'light' ? 'bg-purple-200' : 'bg-purple-700'} p-1 rounded-l`}>
              Frame Number
            </div>
            <div className={`w-1/2 ${theme === 'light' ? 'bg-purple-300' : 'bg-purple-600'} p-1 rounded-r`}>
              Offset
            </div>
          </div>
          <div className="text-center mt-2 text-sm">
            {physicalAddress !== null ? (
              <>
                <span className="font-mono">
                  {physicalAddress} = 
                </span>
                <span className={`font-mono ${theme === 'light' ? 'bg-purple-200' : 'bg-purple-700'} px-1 mx-1`}>
                  {Math.floor(physicalAddress / FRAME_SIZE)}
                </span>
                <span className={`font-mono ${theme === 'light' ? 'bg-purple-300' : 'bg-purple-600'} px-1`}>
                  {physicalAddress % FRAME_SIZE}
                </span>
              </>
            ) : '- - -'}
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          {currentStep === 'tlb_hit' && (
            <line 
              x1="65%" 
              y1="30%" 
              x2="65%" 
              y2="70%" 
              stroke="#16a34a" 
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          <line 
            x1="35%" 
            y1="20%" 
            x2="65%" 
            y2="20%" 
            stroke="#6b7280" 
            strokeWidth="2"
          />

          {(currentStep === 'tlb_miss' || currentStep === 'page_table_hit' || currentStep === 'page_fault') && (
            <line 
              x1="20%" 
              y1="30%" 
              x2="20%" 
              y2="70%" 
              stroke="#f97316" 
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {(currentStep === 'page_table_hit') && (
            <line 
              x1="35%" 
              y1="80%" 
              x2="65%" 
              y2="80%" 
              stroke="#16a34a" 
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {currentStep === 'page_fault' && (
            <path 
              d="M 35 80 Q 50 95 65 80" 
              stroke="#ef4444" 
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="transparent"
            />
          )}
        </svg>
      </div>
    </div>
  );
}