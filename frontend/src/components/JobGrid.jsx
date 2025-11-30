import React from 'react';
import JobCard from './JobCard';
import { Inbox } from 'lucide-react';

// Skeleton loader component - defined outside of JobGrid
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="h-6 w-24 bg-slate-200 rounded-lg"></div>
      <div className="h-4 w-16 bg-slate-200 rounded"></div>
    </div>
    <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
    <div className="h-4 w-1/2 bg-slate-200 rounded mb-3"></div>
    <div className="h-16 bg-slate-200 rounded mb-4"></div>
    <div className="h-20 bg-slate-100 rounded-xl mb-4"></div>
    <div className="flex gap-2">
      <div className="h-10 flex-1 bg-slate-200 rounded-xl"></div>
      <div className="h-10 flex-1 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

const JobGrid = ({ jobs, onViewDetails, onApply, appliedJobs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Inbox className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          No jobs found
        </h3>
        <p className="text-slate-500 text-center max-w-md">
          We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onViewDetails={onViewDetails}
          onApply={onApply}
          isApplied={appliedJobs.includes(job.id)}
        />
      ))}
    </div>
  );
};

export default JobGrid;
