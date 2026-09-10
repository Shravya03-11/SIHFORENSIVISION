export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clearance: string;
  badgeNumber: string;
  created_at: string;
}

export type CaseStatus = 'Active' | 'Analysis' | 'Acquisition' | 'Closed' | 'Under Review';

export interface Case {
  id: string;
  case_number: string;
  case_name: string;
  description: string;
  investigator: string;
  location: string;
  incident_date: string;
  status: CaseStatus;
  evidence_source: string;
  created_at: string;
  tags?: string[];
}

export interface Evidence {
  id: string;
  case_id: string;
  filename: string;
  file_size: string;
  file_size_bytes: number;
  file_type: string;
  device_vendor: string;
  device_model: string;
  md5: string;
  sha256: string;
  acquisition_status: 'Pending' | 'Acquiring' | 'Acquired' | 'Verified' | 'Working Copy Created';
  analysis_status?: 'Pending' | 'In Progress' | 'Completed' | 'Verified';
  uploaded_at?: string;
  created_at: string;
  storage_size?: string;
  camera_channels?: number;
  video_codec?: string;
  recording_format?: string;
  filesystem_type?: string;
  is_working_copy?: boolean;
}

export interface TimelineEvent {
  id: string;
  case_id: string;
  evidence_id?: string;
  video_id?: string;
  camera_id: string;
  camera_name: string;
  timestamp: string;
  event_type: 'Person' | 'Vehicle' | 'Motion' | 'Object' | 'Exit' | 'Anomaly';
  object_type: string;
  confidence: number;
  description: string;
  frame_number?: number;
  location_sector?: string;
}

export interface ChainOfCustodyEntry {
  id: string;
  case_id: string;
  evidence_id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  hash_verified?: boolean;
  notes?: string;
}

export interface AnalysisResult {
  id: string;
  case_id: string;
  evidence_id: string;
  detection_type: 'Person' | 'Vehicle' | 'Object' | 'Motion';
  result: string;
  confidence: number;
  timestamp: string;
  bbox?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  details?: Record<string, string | number>;
}

export interface RecoveryCandidate {
  id: string;
  case_id: string;
  evidence_id: string;
  camera_id: string;
  camera_name: string;
  timestamp: string;
  status: 'Recoverable' | 'Partial' | 'Corrupted';
  sector_offset: string;
  size_kb: number;
  signature: string;
  recovery_percentage: number;
  notes: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  deviceType?: string;
  marketShare: string;
  defaultFilesystem: string;
  signatureMagic: string;
  defaultCodecs: string[];
  containerFormats: string[];
  metadataCharacteristics?: string;
  compatibilityStatus?: 'SUPPORTED' | 'PARTIAL' | 'PROTOTYPE';
  maxChannels: number;
  description: string;
}

export interface VideoRecord {
  id: string;
  case_id: string;
  evidence_id?: string;
  filename: string;
  file_size: string | number;
  duration: number;
  resolution: string;
  fps: number;
  codec: string;
  storage_path: string;
  processing_status: 'UPLOADED' | 'PROCESSING' | 'ANALYZED' | 'READY' | 'COMPLETED';
  created_at: string;
}

export interface VideoFrame {
  id: string;
  video_id: string;
  timestamp: string | number;
  frame_number: number;
  frame_path: string;
  thumbnail_path?: string;
  camera_id?: string;
  created_at: string;
}

export interface RecoveryResult {
  id: string;
  case_id: string;
  evidence_id?: string;
  recovery_id: string;
  camera_id: string;
  timestamp: string;
  segment_name: string;
  status: 'RECOVERABLE' | 'PARTIAL' | 'CORRUPTED';
  confidence: number;
  preview_path?: string;
  created_at: string;
}

export type ScreenId =
  | 'login'
  | 'dashboard'
  | 'create-case'
  | 'evidence-upload'
  | 'device-identification'
  | 'forensic-acquisition'
  | 'integrity-verification'
  | 'video-analysis'
  | 'ai-detection'
  | 'timeline'
  | 'multi-camera'
  | 'recovery-analysis'
  | 'investigation-summary'
  | 'forensic-report';
