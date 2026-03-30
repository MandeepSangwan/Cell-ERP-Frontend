import { MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { COLLEGE } from '../../utils/constants';

export const LocationBadge = ({ locationStatus, distance }) => {
  if (locationStatus === 'valid') {
    return (
      <div className="location-badge valid">
        <CheckCircle2 size={16} />
        <div>
          <span className="location-badge-label">Location Verified</span>
          <span className="location-badge-detail">{distance}m from {COLLEGE.name}</span>
        </div>
      </div>
    );
  }

  if (locationStatus === 'invalid') {
    return (
      <div className="location-badge invalid">
        <XCircle size={16} />
        <div>
          <span className="location-badge-label">Location Invalid</span>
          <span className="location-badge-detail">{distance}m away — outside {COLLEGE.radiusMeters}m radius</span>
        </div>
      </div>
    );
  }

  return (
    <div className="location-badge pending">
      <MapPin size={16} />
      <div>
        <span className="location-badge-label">Location Pending</span>
        <span className="location-badge-detail">GPS verification required</span>
      </div>
    </div>
  );
};
