import React from "react";
import { motion } from "motion/react";
import { Certificate } from "../shared/types";
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  X,
  GraduationCap,
  CheckCircle,
} from "lucide-react";

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-[#0f0f17] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div
          id="certificate-frame"
          className="border-4 border-double border-cyan-500/40 p-6 md:p-8 rounded-xl bg-gradient-to-tr from-[#161424] via-[#1a172c] to-[#12111d] text-center space-y-6 shadow-inner relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-cyan-400">
              {certificate.badgeUrl ? (
                <img
                  src={certificate.badgeUrl}
                  alt="Course Badge"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-full border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                />
              ) : (
                <GraduationCap className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-extrabold text-cyan-200 tracking-wider uppercase">
              {certificate.institutionName}
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Official Certificate of Master Competency
            </p>
          </div>

          <div className="text-xs text-gray-300 italic">
            This is to certify that
          </div>

          {/* Student Name */}
          <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-200 via-white to-cyan-300 bg-clip-text text-transparent">
            {certificate.studentName}
          </div>

          <div className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
            has successfully completed all adaptive learning modules, practical
            exercises, and interactive AI assessments with a score of{" "}
            <strong className="text-cyan-300">{certificate.score}%</strong>{" "}
            for:
          </div>

          {/* Course Title */}
          <div className="text-lg md:text-xl font-bold text-white border-y border-cyan-500/20 py-3">
            {certificate.courseTitle}
          </div>

          {/* Footer Metadata & Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-left border-t border-white/10 text-xs">
            <div>
              <span className="text-gray-500 text-[10px] uppercase block">
                Issued Date
              </span>
              <span className="text-gray-200 font-semibold">
                {certificate.issuedDate}
              </span>
              <span className="text-gray-500 text-[10px] uppercase block mt-2">
                Verification ID
              </span>
              <span className="text-cyan-400 font-mono text-[11px]">
                {certificate.verificationId}
              </span>
            </div>

            <div className="text-right">
              <span className="text-gray-500 text-[10px] uppercase block">
                Authorized Instructor
              </span>
              <span className="text-gray-200 font-semibold">
                {certificate.instructorName}
              </span>
              <div className="flex items-center justify-end gap-1 text-cyan-400 text-[10px] font-bold mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Verified Seal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
