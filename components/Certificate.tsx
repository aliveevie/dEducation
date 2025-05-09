"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";

interface CertificateProps {
  id: string;
  courseTitle: string;
  recipient: string;
  issueDate: Date;
  onClose?: () => void;
}

export const Certificate = ({ id, courseTitle, recipient, issueDate, onClose }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Generate a unique hash for the certificate (in a real app, this would be blockchain-based)
  const generateVerificationHash = () => {
    const data = `${id}-${courseTitle}-${recipient}-${issueDate.toISOString()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  };

  // Download certificate as image
  const downloadCertificate = () => {
    if (!certificateRef.current) return;
    
    // In a real implementation, we would use html2canvas or a similar library
    // to convert the certificate div to an image for download
    alert("In a production environment, this would download the certificate as a PDF or image file.");
    
    // Example of how this would be implemented with html2canvas:
    /*
    import html2canvas from 'html2canvas';
    
    html2canvas(certificateRef.current).then(canvas => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${courseTitle.replace(/\s+/g, '-')}-Certificate.png`;
      link.click();
    });
    */
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-500" />
            Certificate of Completion
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="p-6">
          <div 
            ref={certificateRef} 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-4 border-blue-200 dark:border-blue-900 rounded-lg p-8 relative overflow-hidden"
          >
            {/* Certificate Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full border-[20px] border-blue-500 rounded-lg"></div>
              <div className="absolute top-10 left-10 right-10 bottom-10 border-2 border-blue-500 rounded-lg"></div>
              <Award className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-blue-500" />
            </div>
            
            {/* Certificate Content */}
            <div className="text-center relative z-10 space-y-6">
              <div className="mb-6">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-lg uppercase tracking-widest">Certificate of Completion</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Decentralized Education Platform</div>
              </div>
              
              <div className="my-8">
                <p className="text-gray-600 dark:text-gray-300 mb-2">This certifies that</p>
                <h3 className="text-2xl font-bold font-serif">{recipient}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">has successfully completed the course</p>
                <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 my-4 font-serif">{courseTitle}</h2>
                <p className="text-gray-600 dark:text-gray-300">on {formatDate(issueDate)}</p>
              </div>
              
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Certificate ID</p>
                  <p className="font-mono text-sm">{id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verification Hash</p>
                  <p className="font-mono text-sm">{generateVerificationHash()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={downloadCertificate} className="gap-2">
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
