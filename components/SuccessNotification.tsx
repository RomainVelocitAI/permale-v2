'use client';

import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessNotificationProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function SuccessNotification({ show, onClose, title, message }: SuccessNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        
        .notification-enter {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .notification-exit {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
      
      <div 
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 notification-enter"
        style={{ maxWidth: '90vw' }}
      >
        <div className="bg-[#efefef] rounded-lg shadow-2xl border border-[#363d43]/10 overflow-hidden">
          <div className="p-6 flex items-start gap-4 min-w-[320px] max-w-[480px]">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#acae9f] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#363d43]" />
              </div>
            </div>
            
            <div className="flex-1">
              {title && (
                <h3 
                  className="text-[#363d43] font-light tracking-[0.2em] text-sm uppercase mb-2"
                  style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                >
                  {title}
                </h3>
              )}
              <p 
                className="text-[#363d43] text-base font-light leading-relaxed"
                style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial' }}
              >
                {message}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-[#363d43]/5 rounded-full transition-colors duration-200"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-[#363d43]/60" />
            </button>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-[#acae9f] via-[#acae9f]/70 to-[#acae9f]/40" />
        </div>
      </div>
    </>
  );
}