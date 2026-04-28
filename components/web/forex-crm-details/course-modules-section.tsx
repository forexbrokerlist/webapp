import React from 'react';
const RoundIcon = '/assets/images/round.svg';

interface CourseModule {
  id?: number;
  title: string;
  difficulty: string;
  duration: string;
  topics: string[];
  order?: number;
}

interface CourseModulesSectionProps {
  courseModules: CourseModule[];
  sectionTitle?: string;
}

export default function CourseModulesSection({
  courseModules,
  sectionTitle = " COURSE MODULES "
}: CourseModulesSectionProps) {
  if (!courseModules || courseModules.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <div className="border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-6 mt-6">
      <div className='flex items-center gap-2 pb-3'>
        <img src={RoundIcon} alt="RoundIcon" className='block' />
        <span className='block text-base font-medium text-black'>
          Course Modules
        </span>
      </div>

      <div className="w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)] mb-6"></div>

      <div className="space-y-6">
        {courseModules
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((module, index) => (
            <div key={module.id || index} className="border border-border-light200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-black capitalize">
                      {module.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>

                      {module.difficulty}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {module.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">What you'll learn:</h5>
                {module.topics && module.topics.length > 0 ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {module.topics.map((topic, index) =>
                      topic.charAt(0).toUpperCase() + topic.slice(1)
                    ).join(', ')}.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No topics specified</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
