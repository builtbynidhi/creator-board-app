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

const ScriptGeneratorModal = ({ isOpen, onClose, productName = '' }) => {
  const [formData, setFormData] = useState({
    product_name: productName,
    target_audience: '',
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

  const generateScript = async () => {
    if (!formData.product_name || !formData.target_audience) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        product_name: '',
        target_audience: '',
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
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              <Sparkles className="w-6 h-6" />
              AI Script Generator
            </DialogTitle>
            <DialogDescription className="text-purple-100">
              Generate compelling marketing scripts for your products using AI
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <form className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name *
                </label>
                <Input
                  type="text"
                  name="product_name"
                  placeholder="e.g., TravelAI, FoodHub, etc."
                  value={formData.product_name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-10 rounded-lg border-slate-200"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Audience *
                </label>
                <Textarea
                  name="target_audience"
                  placeholder="e.g., Budget travelers aged 18-30, Tech-savvy millennials, etc."
                  value={formData.target_audience}
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
                    <SelectItem value="humorous">Humorous</SelectItem>
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
                  onClick={generateScript}
                  disabled={loading}
                  className="flex-1 h-11 rounded-lg bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Script
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            // Results View
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700 font-medium">Script generated successfully!</p>
              </div>

              {/* Script */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-800">Marketing Script</h4>
                  <button
                    onClick={() => copyToClipboard(result.script)}
                    className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{result.script}</p>
                </div>
              </div>

              {/* Visual Hook */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Visual Hook</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-slate-700">{result.visual_hook}</p>
                </div>
              </div>

              {/* Hook */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Opening Hook</h4>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-slate-700 font-medium">{result.hook}</p>
                </div>
              </div>

              {/* Body */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Body</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-sm text-slate-700">{result.body}</p>
                </div>
              </div>

              {/* CTA */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Call to Action</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-slate-700">{result.cta}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Estimated Duration:</span>{' '}
                  <span className="font-bold text-purple-600">{result.estimated_duration} seconds</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      product_name: formData.product_name,
                      target_audience: '',
                      tone: 'professional',
                    });
                  }}
                  className="flex-1 h-11 rounded-lg border-slate-200"
                >
                  Generate Another
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-11 rounded-lg bg-purple-600 hover:bg-purple-700"
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

export default ScriptGeneratorModal;
