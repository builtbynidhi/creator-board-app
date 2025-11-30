import React from 'react';
import { Calendar, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const JobCard = ({ job, onViewDetails, onApply, isApplied }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Beverage': 'bg-orange-100 text-orange-700 border-orange-200',
      'Beauty & Skincare': 'bg-pink-100 text-pink-700 border-pink-200',
      'Tech & Apps': 'bg-blue-100 text-blue-700 border-blue-200',
      'Fashion & Lifestyle': 'bg-amber-100 text-amber-700 border-amber-200',
      'Home & Decor': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Badge 
          variant="outline" 
          className={`${getCategoryColor(job.category)} text-xs font-medium px-2.5 py-1 rounded-lg`}
        >
          {job.category}
        </Badge>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>Due {formatDate(job.deadline)}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
        {job.title}
      </h3>

      {/* Brand */}
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-600 font-medium">{job.brandName}</span>
      </div>

      {/* Description Preview */}
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
        {job.description}
      </p>

      {/* Price */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100">
        <div className="text-xs text-teal-600 font-medium mb-1">Budget</div>
        <div className="text-2xl font-bold text-teal-700">
          {formatPrice(job.price)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="outline"
          onClick={() => onViewDetails(job)}
          className="flex-1 h-10 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
        </Button>
        
        <Button
          onClick={() => !isApplied && onApply(job)}
          disabled={isApplied}
          className={`flex-1 h-10 rounded-xl transition-all ${
            isApplied
              ? 'bg-emerald-600 hover:bg-emerald-600 cursor-default'
              : 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Applied
            </>
          ) : (
            'Apply Now'
          )}
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
