import { RefreshCcw, Shield, X } from 'lucide-react';

export default function ChatHeader({ title, logo, onRefresh, onClose }) {
  return (
    <div 
      className="flex items-center justify-between p-4 text-white shadow-md transition-colors"
      style={{ background: 'var(--primary-color)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm overflow-hidden">
          {logo ? (
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          ) : (
            <Shield className="h-6 w-6 text-white" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-bold leading-tight">{title || "AI Assistant"}</h2>
          <p className="text-xs text-blue-100/80">Online & Ready</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={onRefresh}
          className="rounded-full p-2 hover:bg-white/20 transition-colors"
          title="Reset Chat"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
        <button 
          onClick={onClose}
          className="rounded-full p-2 hover:bg-white/20 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
