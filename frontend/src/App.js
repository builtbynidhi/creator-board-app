import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import JobGrid from './components/JobGrid';
import JobModal from './components/JobModal';
import Toast from './components/Toast';
import ScriptGeneratorModal from './components/ScriptGeneratorModal';
import JobGeneratorModal from './components/JobGeneratorModal';
import { mockJobs } from './data/mock';
import { Sparkles, Zap } from 'lucide-react';

const Home = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isScriptGeneratorOpen, setIsScriptGeneratorOpen] = useState(false);
  const [isJobGeneratorOpen, setIsJobGeneratorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.brandName.toLowerCase().includes(query)
      );
    }

    if (categoryFilter && categoryFilter !== 'All Categories') {
      result = result.filter((job) => job.category === categoryFilter);
    }

    switch (sortBy) {
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
        break;
      default:
        break;
    }

    return result;
  }, [jobs, searchQuery, sortBy, categoryFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    sortBy !== 'newest' ||
    categoryFilter !== 'All Categories';
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedJob(null), 200);
  };

  const handleApply = (job) => {
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs((prev) => [...prev, job.id]);
      
      console.log('Application submitted:', {
        jobId: job.id,
        jobTitle: job.title,
        brandName: job.brandName,
        timestamp: new Date().toISOString(),
      });

      setToast({
        visible: true,
        message: `Applied to "${job.title}" successfully!`,
      });
    }
  };

  const handleJobGenerated = (newJob) => {
    const formattedJob = {
      id: Date.now(),
      title: newJob.job_title,
      brandName: newJob.company,
      category: 'Tech & Apps',
      description: newJob.job_description,
      price: 50000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      postedDate: new Date().toISOString(),
      deliverables: newJob.key_responsibilities || [],
      paymentTerms: `Salary: ${newJob.salary_range} | Location: ${newJob.location} | Type: ${newJob.job_type}`,
      generatedJob: newJob,
    };

    setJobs((prev) => [formattedJob, ...prev]);

    setToast({
      visible: true,
      message: `Job "${newJob.job_title}" has been added to the board!`,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setCategoryFilter('All Categories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar appliedCount={appliedJobs.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap gap-3 items-center justify-center">
          <button
            onClick={() => setIsScriptGeneratorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            Mini Ad-Script Generator
          </button>
          <button
            onClick={() => setIsJobGeneratorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4" />
            AI Job Generator
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Fresh Opportunities Daily
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Find Your Perfect Brand Collaboration
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Browse through exciting creator campaigns from top brands. Apply to projects that match your style and start earning.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-teal-600">{jobs.length}</span>
            <span className="text-slate-600">Active Bounties</span>
          </div>
          <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              ₹{jobs.reduce((sum, job) => sum + job.price, 0).toLocaleString('en-IN')}
            </span>
            <span className="text-slate-600">Total Value</span>
          </div>
          <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-600">
              {new Set(jobs.map((j) => j.brandName)).size}
            </span>
            <span className="text-slate-600">Partner Brands</span>
          </div>
        </div>

        <div className="mb-8">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {!isLoading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600">
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {filteredJobs.length}
              </span>{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'}
              {hasActiveFilters && ' matching your filters'}
            </p>
          </div>
        )}

        <JobGrid
          jobs={filteredJobs}
          onViewDetails={handleViewDetails}
          onApply={handleApply}
          appliedJobs={appliedJobs}
          isLoading={isLoading}
        />
      </main>

      <footer className="border-t border-slate-200 mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Creator Board. Connecting creators with amazing brands.
          </p>
        </div>
      </footer>

      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApply}
        isApplied={selectedJob ? appliedJobs.includes(selectedJob.id) : false}
      />

      <ScriptGeneratorModal
        isOpen={isScriptGeneratorOpen}
        onClose={() => setIsScriptGeneratorOpen(false)}
      />

      <JobGeneratorModal
        isOpen={isJobGeneratorOpen}
        onClose={() => setIsJobGeneratorOpen(false)}
        onJobGenerated={handleJobGenerated}
      />

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
