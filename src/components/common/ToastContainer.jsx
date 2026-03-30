import { useAppContext } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useAppContext();

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {toasts.map(toast => (
        <div key={toast.id} className="toast" style={{ background: toast.type === 'error' ? 'var(--danger)' : 'var(--text-primary)' }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
};
