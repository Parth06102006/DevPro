"use client";

import { useState } from "react";
import { HiArrowNarrowRight, HiArrowNarrowLeft, HiCalendar } from "react-icons/hi";

interface StepItem {
  id?: string;
  stepNumber: number;
  title: string;
  details: string;
  projectId?: string;
}

interface TimelineProps {
  data?: StepItem[];
}

export function TimelineHorizontal({ data = [] }: TimelineProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  
  const sortedData = [...data].sort((a, b) => a.stepNumber - b.stepNumber);
  const hasMore = visibleCount < sortedData.length;
  const canCollapse = visibleCount > 3;

  const handleExpand = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleCollapse = () => {
    setVisibleCount(3);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.slice(0, visibleCount).map((step, index) => {
          const isLast = index === sortedData.slice(0, visibleCount).length - 1;
          
          return (
            <div key={step.id || step.stepNumber} className="relative">
              <div className="flex items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-900 z-10 relative">
                  <HiCalendar className="h-3 w-3 text-primary-600 dark:text-primary-300" />
                </div>
                {!isLast && (
                  <div className="hidden lg:block absolute left-6 top-3 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  {step.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {hasMore && (
          <button 
            onClick={handleExpand}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Expand
            <HiArrowNarrowRight className="ml-2 h-3 w-3" />
          </button>
        )}
        
        {canCollapse && (
          <button 
            onClick={handleCollapse}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Collapse
            <HiArrowNarrowLeft className="ml-2 h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
