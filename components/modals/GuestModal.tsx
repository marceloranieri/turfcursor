import React from 'react';
import Link from 'next/link';

interface GuestModalProps {
  onClose: () => void;
}

const GuestModal = ({ onClose }: GuestModalProps) => {
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="modal bg-background-secondary rounded-lg p-4 max-w-md w-full">
        <div className="modal-header text-xl font-bold text-text-primary mb-4 pb-2 border-b border-background-tertiary">
          Sign In Required
        </div>
        <div className="modal-content text-text-secondary mb-6">
          You need to sign in to participate in the debate. Would you like to create an account or sign in now?
        </div>
        <div className="modal-buttons flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button 
            className="btn-secondary bg-background-tertiary text-text-primary hover:bg-background-primary px-4 py-2 rounded-md transition-colors"
            onClick={onClose}
          >
            Continue as Guest
          </button>
          <Link href="/auth/signin">
            <button className="btn-primary bg-accent-primary text-background-primary hover:bg-gold font-semibold px-4 py-2 rounded-md transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestModal; 