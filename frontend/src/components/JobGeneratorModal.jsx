import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Sparkles, Loader2, Copy, CheckCircle2 } from 'lucide-react';

const JobGeneratorModal = ({ isOpen, onClose, onJobGenerated }) => {
  const [formData, setFormData] = useState({
    job_title: '',
    company: '',
    target_profile: '',
    tone: 'professional',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      tone: value,
    }));
  };

  const generateJob = async () => {
    if (!formData.job_title || !formData.company || !formData.target_profile) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate job posting');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Job generation error:', err);
      setError(err.message || 'Failed to generate job posting');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    if (result && onJobGenerated) {
      onJobGenerated(result);
    }
    handleClose();
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        job_title: '',
        company: '',
        target_profile: '',
        tone: 'professional',
      });
      setResult(null);
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              <Sparkles className="w-6 h-6" />
              AI Job Generator
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Generate comprehensive job postings using AI
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <form className="space-y-5">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  name="job_title"
                  placeholder="e.g., Senior Product Manager, Full Stack Developer, etc."
                  value={formData.job_title}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-10 rounded-lg border-slate-200"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  name="company"
                  placeholder="e.g., TravelAI Inc, Google, Startup XYZ, etc."
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-10 rounded-lg border-slate-200"
                />
              </div>

              {/* Target Profile */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Candidate Profile *
                </label>
                <Textarea
                  name="target_profile"
                  placeholder="e.g., Experienced PM with B2C background, Full-stack engineer with 5+ years, etc."
                  value={formData.target_profile}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-24 rounded-lg border-slate-200"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tone
                </label>
                <Select value={formData.tone} onValueChange={handleToneChange} disabled={loading}>
                  <SelectTrigger className="h-10 rounded-lg border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="exciting">Exciting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 h-11 rounded-lg border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={generateJob}
                  disabled={loading}
                  className="flex-1 h-11 rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            // Results View
            <div className="space-y-5">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700 font-medium">Job posting generated successfully!</p>
              </div>

              {/* Job Title */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Job Title</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-lg font-bold text-slate-800">{result.job_title}</p>
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Company</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-slate-700">{result.company}</p>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Job Description</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{result.job_description}</p>
                </div>
              </div>

              {/* Key Responsibilities */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Key Responsibilities</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <ul className="space-y-2">
                    {result.key_responsibilities && result.key_responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Required Skills</h4>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <ul className="space-y-2">
                    {result.required_skills && result.required_skills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-purple-600 font-bold mt-0.5">•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nice to Have */}
              {result.nice_to_have && result.nice_to_have.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Nice to Have</h4>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <ul className="space-y-2">
                      {result.nice_to_have.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-amber-600 font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Why Join Us */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Why Join Us</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-slate-700">{result.why_join_us}</p>
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Salary Range</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-slate-700 font-medium">{result.salary_range}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Location</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-slate-700 font-medium">{result.location}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      job_title: '',
                      company: '',
                      target_profile: '',
                      tone: 'professional',
                    });
                  }}
                  className="flex-1 h-11 rounded-lg border-slate-200"
                >
                  Generate Another
                </Button>
                <Button
                  type="button"
                  onClick={handleDone}
                  className="flex-1 h-11 rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobGeneratorModal;
