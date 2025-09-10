"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, HelpCircle, Bug, MessageSquare, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface FormData {
  fullName: string;
  email: string;
  issueType: string;
  message: string;
}

interface FormStatus {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

export function CustomerSupport() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    issueType: 'general',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  });

  const issueTypes = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle },
    { value: 'technical', label: 'Technical Support', icon: Bug },
    { value: 'billing', label: 'Billing & Credits', icon: MessageSquare },
    { value: 'verification', label: 'Project Verification', icon: CheckCircle }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please fill in all required fields.'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please enter a valid email address.'
      });
      return;
    }
    
    // Reset status
    setFormStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      message: ''
    });

    try {
      const response = await fetch('https://formspree.io/f/xwpnaeqn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          issueType: formData.issueType,
          message: formData.message,
          subject: `CLORIT Support - ${issueTypes.find(type => type.value === formData.issueType)?.label || 'General'}`,
          _replyto: formData.email
        }),
      });

      if (response.ok) {
        setFormStatus({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
          message: 'Thanks! Our support team will reach out within 24 hours.'
        });
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          issueType: 'general',
          message: ''
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, isSuccess: false, message: '' }));
        }, 5000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Sorry, there was an error submitting your message. Please try again.'
      });
    }
  };

  return (
    <section id="support" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-50">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [180, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-24 h-24 bg-purple-100 rounded-full blur-lg"
        />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <MessageSquare className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Need Help? Contact{" "}
            <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              CLORIT Support
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our expert team is here to assist you with any questions about blue carbon projects, 
            verification processes, or platform features.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="form-label flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  {/* Issue Type */}
                  <div>
                    <label htmlFor="issueType" className="form-label text-gray-700 font-medium mb-2 block">
                      Issue Type
                    </label>
                    <select
                      id="issueType"
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm bg-white transition-all duration-200 hover:border-gray-300"
                    >
                      {issueTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="form-label text-gray-700 font-medium mb-2 block">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your issue or question in detail..."
                      required
                      rows={5}
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={formStatus.isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {formStatus.isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Status Messages */}
                  {(formStatus.isSuccess || formStatus.isError) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl flex items-start gap-3 ${
                        formStatus.isSuccess 
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                    >
                      {formStatus.isSuccess ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm font-medium">{formStatus.message}</p>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6 order-1 lg:order-2"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Response Times</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">General inquiries: Within 4 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Technical support: Within 2 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Critical issues: Within 1 hour</span>
                </div>
              </div>
            </Card>

            <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Categories</h3>
              <div className="grid grid-cols-2 gap-4">
                {issueTypes.map((type, index) => (
                  <motion.div
                    key={type.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <type.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📧 Direct Email</h3>
              <p className="text-gray-600 mb-2">
                For urgent matters, you can also reach us directly at:
              </p>
              <a 
                href="mailto:support@clorit.com"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                support@clorit.com
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
