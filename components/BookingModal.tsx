
import React, { useState } from 'react';
import { X, Calendar, CheckCircle, ChevronRight, ChevronLeft, Bug, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import * as Icons from 'lucide-react';

const IconMap = Icons as unknown as Record<string, React.ElementType>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'service' | 'datetime' | 'details' | 'confirmation';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { content, addBooking } = useContent(); // Use context
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  // Get visible services from content
  const services = content.services.filter(s => s.visible);

  if (!isOpen) return null;

  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const handleNext = () => {
    if (step === 'service' && selectedService) setStep('datetime');
    else if (step === 'datetime' && selectedDate && selectedTime) setStep('details');
    else if (step === 'details' && formData.name && formData.phone) {
        // Create booking object
        const newBooking = {
            id: Date.now().toString(),
            serviceId: selectedService || '',
            serviceName: services.find(s => s.id === selectedService)?.title || 'Unknown Service',
            date: selectedDate || '',
            time: selectedTime || '',
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            clientAddress: formData.address,
            submittedAt: new Date().toISOString(),
            status: 'New' as const
        };
        
        // Save to context
        addBooking(newBooking);
        
        setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'datetime') setStep('service');
    else if (step === 'details') setStep('datetime');
    else if (step === 'confirmation') setStep('details');
  };

  const resetAndClose = () => {
      setStep('service');
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
      onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-pestBrown/60 backdrop-blur-sm" onClick={resetAndClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-pestStone w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Close Button - Fixed Positioning & Z-Index */}
        <button 
            onClick={resetAndClose} 
            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-pestBrown hover:bg-gray-200 rounded-full p-1 transition-colors"
        >
            <X size={24} />
        </button>

        {/* Left Panel: Summary & Info */}
        <div className="w-full md:w-1/3 bg-pestBrown text-white p-8 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 text-pestGreen mb-6">
              <Calendar className="w-6 h-6" />
              <span className="font-bold tracking-wide uppercase text-sm">Booking System</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{content.bookingModal.headerTitle}</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {content.bookingModal.headerSubtitle}
            </p>
            
            <div className="space-y-6 border-t border-white/10 pt-6">
              <div className={`transition-opacity ${selectedService ? 'opacity-100' : 'opacity-30'}`}>
                <label className="text-xs text-gray-500 uppercase font-bold">Service</label>
                <div className="font-medium text-lg">{services.find(s => s.id === selectedService)?.title || '...'}</div>
              </div>
              <div className={`transition-opacity ${selectedDate ? 'opacity-100' : 'opacity-30'}`}>
                <label className="text-xs text-gray-500 uppercase font-bold">Date & Time</label>
                <div className="font-medium text-lg">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '...'}
                  {selectedTime ? ` at ${selectedTime}` : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
             <div className="flex gap-1">
               {['service', 'datetime', 'details', 'confirmation'].map((s, i) => (
                 <div key={s} className={`h-1 flex-1 rounded-full ${
                   ['service', 'datetime', 'details', 'confirmation'].indexOf(step) >= i ? 'bg-pestGreen' : 'bg-white/20'
                 }`} />
               ))}
             </div>
             <div className="text-xs text-gray-500 mt-2 text-right">Step {['service', 'datetime', 'details', 'confirmation'].indexOf(step) + 1} of 4</div>
          </div>
        </div>

        {/* Right Panel: Interactive Steps */}
        <div className="w-full md:w-2/3 bg-pestLight p-8 flex flex-col relative">
          <div className="flex-1 overflow-y-auto py-4 pt-8">
            <AnimatePresence mode="wait">
              {step === 'service' && (
                <motion.div 
                  key="service"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-pestBrown">{content.bookingModal.stepServiceTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((s) => {
                        const IconComponent = (IconMap as any)[s.iconName] || IconMap['Circle'];
                        return (
                            <button
                                key={s.id}
                                onClick={() => setSelectedService(s.id)}
                                className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-3 ${
                                selectedService === s.id 
                                ? 'border-pestGreen bg-pestLight shadow-md ring-1 ring-pestGreen' 
                                : 'border-transparent bg-pestLight hover:border-gray-200 shadow-sm'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedService === s.id ? 'bg-pestGreen text-white' : 'bg-pestStone text-pestBrown'}`}>
                                    <IconComponent size={20} />
                                </div>
                                <div>
                                <div className="font-bold text-pestBrown">{s.title}</div>
                                <div className="text-xs text-gray-500 mt-1">{s.price || "Quote"}</div>
                                </div>
                            </button>
                        );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 'datetime' && (
                <motion.div 
                   key="datetime"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                >
                  <div>
                    <h3 className="text-xl font-bold text-pestBrown mb-4">{content.bookingModal.stepDateTitle}</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {generateDates().map((date, i) => {
                        const isSelected = selectedDate === date.toISOString();
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(date.toISOString())}
                            className={`min-w-[80px] p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                              isSelected ? 'bg-pestGreen text-white border-pestGreen shadow-md' : 'bg-pestLight border-gray-200 text-gray-600 hover:border-pestGreen/50'
                            }`}
                          >
                            <span className="text-xs font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-xl font-bold">{date.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-pestBrown mb-4">Select Time</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-md text-sm font-medium border transition-all ${
                            selectedTime === time 
                            ? 'bg-pestBrown text-white border-pestBrown' 
                            : 'bg-pestLight text-gray-600 border-gray-200 hover:border-pestGreen'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div 
                   key="details"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-pestBrown">{content.bookingModal.stepDetailsTitle}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-pestGreen focus:ring-1 focus:ring-pestGreen outline-none bg-pestLight text-pestBrown placeholder-gray-500" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-pestGreen focus:ring-1 focus:ring-pestGreen outline-none bg-pestLight text-pestBrown placeholder-gray-500" 
                        placeholder="082 123 4567"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-pestGreen focus:ring-1 focus:ring-pestGreen outline-none bg-pestLight text-pestBrown placeholder-gray-500" 
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                      <textarea 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-pestGreen focus:ring-1 focus:ring-pestGreen outline-none bg-pestLight text-pestBrown placeholder-gray-500" 
                        placeholder="123 Street Name, Suburb"
                        rows={2}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div 
                   key="confirmation"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center text-center h-full py-8"
                >
                  <div className="w-20 h-20 bg-pestGreen/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-pestGreen" />
                  </div>
                  <h3 className="text-2xl font-bold text-pestBrown mb-2">{content.bookingModal.successTitle}</h3>
                  <p className="text-gray-500 max-w-xs mb-8">
                    Thank you, {formData.name}. We have received your request for <strong>{services.find(s => s.id === selectedService)?.title}</strong> on <strong>{new Date(selectedDate!).toLocaleDateString()}</strong>.
                  </p>
                  <p className="text-sm text-pestBrown bg-pestGreen/20 px-4 py-2 rounded-lg">
                    {content.bookingModal.successMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terms Text display in Details or Confirmation */}
          {content.bookingModal.termsText && step === 'details' && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-[10px] text-gray-400">
                  {content.bookingModal.termsText}
              </div>
          )}

          {/* Footer Buttons */}
          {step !== 'confirmation' && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
              {step !== 'service' ? (
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-pestBrown px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium">
                  <ChevronLeft size={18} /> Back
                </button>
              ) : <div></div>}
              
              <button 
                onClick={handleNext}
                disabled={
                  (step === 'service' && !selectedService) ||
                  (step === 'datetime' && (!selectedDate || !selectedTime)) ||
                  (step === 'details' && (!formData.name || !formData.phone))
                }
                className="bg-pestGreen text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-pestDarkGreen disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {step === 'details' ? 'Confirm Booking' : 'Next Step'}
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          {step === 'confirmation' && (
             <div className="flex justify-center pt-4">
                <button onClick={resetAndClose} className="bg-pestBrown text-white px-8 py-3 rounded-lg font-bold hover:bg-pestDarkGreen transition-colors shadow-lg">
                    Close
                </button>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
