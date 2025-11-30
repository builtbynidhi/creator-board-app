import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Sparkles,
} from 'lucide-react';

const JobModal = ({ job, isOpen, onClose, onApply, isApplied }) => {
  if (!job) return null;

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
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Beverage': 'bg-orange-100 text-orange-700',
      'Beauty & Skincare': 'bg-pink-100 text-pink-700',
      'Tech & Apps': 'bg-blue-100 text-blue-700',
      'Fashion & Lifestyle': 'bg-amber-100 text-amber-700',
      'Home & Decor': 'bg-emerald-100 text-emerald-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white rounded-t-2xl">
          <Badge 
            className={`${getCategoryColor(job.category)} mb-3 text-xs font-medium`}
          >
            {job.category}
          </Badge>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              {job.title}
            </DialogTitle>
            <DialogDescription className="text-teal-100 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {job.brandName}
            </DialogDescription>
          </DialogHeader>
          
          {/* Price Banner */}
          <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <div className="text-sm text-teal-100 mb-1">Campaign Budget</div>
            <div className="text-3xl font-bold">{formatPrice(job.price)}</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Timeline */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-sm">
                <span className="text-slate-500">Posted:</span>{' '}
                <span className="font-medium text-slate-700">{formatDate(job.postedDate)}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm">
                <span className="text-slate-500">Deadline:</span>{' '}
                <span className="font-medium text-slate-700">{formatDate(job.deadline)}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Job Description
            </h4>
            <p className="text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Required Deliverables
            </h4>
            <ul className="space-y-2">
              {job.deliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-teal-700">{index + 1}</span>
                  </div>
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Terms */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-1">
              <CreditCard className="w-4 h-4" />
              Payment Terms
            </h4>
            <p className="text-amber-700">{job.paymentTerms}</p>
          </div>

          {/* Apply Button */}
          <Button
            onClick={() => !isApplied && onApply(job)}
            disabled={isApplied}
            className={`w-full h-12 rounded-xl text-base font-semibold transition-all ${
              isApplied
                ? 'bg-emerald-600 hover:bg-emerald-600 cursor-default'
                : 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Application Submitted
              </>
            ) : (
              'Apply for this Campaign'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;
