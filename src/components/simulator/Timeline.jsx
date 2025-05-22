import { TIMELINE_STEPS } from '../../constants/timeline';
import { Icons } from '../common/Icons';

export default function Timeline({
  timelineSteps,
  currentTimelineIndex,
  navigateTimeline,
  theme,
}) {
  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Icons.Cpu className="mr-2" size={20} /> Timeline
      </h2>
      <div className="flex items-center space-x-2">
        <button
          className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} ${currentTimelineIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => navigateTimeline('prev')}
          disabled={currentTimelineIndex <= 0}
        >
          <Icons.ChevronLeft size={16} />
        </button>
        <div className="flex-1 flex overflow-x-auto">
          {timelineSteps.map((step, index) => {
            const stepConfig = TIMELINE_STEPS.find(s => s.id === step);
            return (
              <div
                key={index}
                className={`px-2 py-1 text-xs rounded mx-1 cursor-pointer ${index === currentTimelineIndex ? 'font-bold' : ''}`}
                style={{ backgroundColor: `${stepConfig.color}30` }}
                onClick={() => navigateTimeline(index)}
              >
                {stepConfig.label}
              </div>
            );
          })}
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
  );
}