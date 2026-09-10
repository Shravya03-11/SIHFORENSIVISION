import {
  Case,
  Evidence,
  TimelineEvent,
  ChainOfCustodyEntry,
  AnalysisResult,
  RecoveryCandidate,
  VendorProfile,
  User,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Authentication rejected by security vault.');
    }
    const data = await res.json();
    sessionStorage.setItem('fv_auth_token', data.token);
    sessionStorage.setItem('fv_user', JSON.stringify(data.user));
    return data;
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Cases
  async getCases(): Promise<Case[]> {
    const res = await fetch(`${API_BASE}/cases`);
    if (!res.ok) throw new Error('Failed to retrieve case registry from database.');
    return await res.json();
  },

  async getCase(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/cases/${id}`);
    if (!res.ok) throw new Error(`Case ${id} not found.`);
    return await res.json();
  },

  async createCase(caseData: Partial<Case>): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register case in database.');
    }
    return await res.json();
  },

  async updateCaseStatus(id: string, status: string): Promise<Case> {
    const res = await fetch(`${API_BASE}/cases/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update case status.');
    return await res.json();
  },

  // Evidence
  async getEvidence(caseId?: string): Promise<Evidence[]> {
    const url = caseId ? `${API_BASE}/evidence?case_id=${encodeURIComponent(caseId)}` : `${API_BASE}/evidence`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load evidence records.');
    return await res.json();
  },

  async uploadEvidence(
    caseId: string,
    file: File
  ): Promise<{ evidence: Evidence; vendor: VendorProfile; hashes: { md5: string; sha256: string }; isPlayable: boolean }> {
    const formData = new FormData();
    formData.append('case_id', caseId);
    formData.append('evidenceFile', file);

    const res = await fetch(`${API_BASE}/evidence/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Server error processing evidence ingestion.');
    }
    return await res.json();
  },

  async verifyEvidence(id: string): Promise<{ verified: boolean; md5: string; sha256: string }> {
    const res = await fetch(`${API_BASE}/evidence/${id}/verify`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Integrity recalculation failed.');
    return await res.json();
  },

  // Timeline
  async getTimeline(caseId?: string): Promise<TimelineEvent[]> {
    const url = caseId ? `${API_BASE}/timeline?case_id=${encodeURIComponent(caseId)}` : `${API_BASE}/timeline`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load timeline events.');
    return await res.json();
  },

  async getTimelineEvents(caseId?: string): Promise<TimelineEvent[]> {
    return this.getTimeline(caseId);
  },

  async addTimelineEvent(event: Partial<TimelineEvent>): Promise<TimelineEvent> {
    const res = await fetch(`${API_BASE}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error('Failed to record timeline event.');
    return await res.json();
  },

  // AI Analysis Results
  async getAnalysis(caseId?: string): Promise<AnalysisResult[]> {
    const url = caseId ? `${API_BASE}/analysis?case_id=${encodeURIComponent(caseId)}` : `${API_BASE}/analysis`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load analysis results.');
    return await res.json();
  },

  async getAnalysisResults(caseId?: string): Promise<AnalysisResult[]> {
    return this.getAnalysis(caseId);
  },

  // Recovery items
  async getRecovery(caseId?: string): Promise<RecoveryCandidate[]> {
    const url = caseId ? `${API_BASE}/recovery?case_id=${encodeURIComponent(caseId)}` : `${API_BASE}/recovery`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load recovery candidates.');
    return await res.json();
  },

  // Chain of Custody
  async getCustody(caseId?: string): Promise<ChainOfCustodyEntry[]> {
    const url = caseId ? `${API_BASE}/custody?case_id=${encodeURIComponent(caseId)}` : `${API_BASE}/custody`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load chain of custody provenance logs.');
    return await res.json();
  },

  async addCustodyEntry(entry: { case_id: string; evidence_id?: string; action: string; performed_by?: string; details?: string }): Promise<ChainOfCustodyEntry> {
    const res = await fetch(`${API_BASE}/custody`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error('Failed to record custody provenance log.');
    return await res.json();
  },

  // Reports
  async getReports(caseId?: string): Promise<any[]> {
    const url = caseId ? `${API_BASE}/reports?case_id=${encodeURIComponent(caseId)}` : `${API_BASE}/reports`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load reports.');
    return await res.json();
  },

  async createReport(report: { case_id: string; report_number: string; generated_by: string; file_path?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) throw new Error('Failed to save report record.');
    return await res.json();
  },

  // Videos & Frames (Requirement 11)
  async getVideos(caseId?: string, evidenceId?: string): Promise<any[]> {
    let url = `${API_BASE}/videos`;
    const params: string[] = [];
    if (caseId) params.push(`case_id=${encodeURIComponent(caseId)}`);
    if (evidenceId) params.push(`evidence_id=${encodeURIComponent(evidenceId)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load videos.');
    return await res.json();
  },

  async getVideo(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/videos/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to load video record.');
    return await res.json();
  },

  async getVideoFrames(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/videos/${encodeURIComponent(id)}/frames`);
    if (!res.ok) throw new Error('Failed to load video frames.');
    return await res.json();
  },

  async captureVideoFrame(
    id: string,
    payload: {
      timestamp: string;
      frame_number: number;
      time_seconds: number;
      case_id?: string;
      evidence_id?: string;
    }
  ): Promise<{ success: boolean; frame: any }> {
    const res = await fetch(`${API_BASE}/videos/${encodeURIComponent(id)}/capture-frame`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Frame extraction failed.');
    }
    return await res.json();
  },

  async createVideoClip(
    id: string,
    payload: {
      start_time: number;
      end_time: number;
      case_id?: string;
      evidence_id?: string;
    }
  ): Promise<{ success: boolean; clip: any }> {
    const res = await fetch(`${API_BASE}/videos/${encodeURIComponent(id)}/create-clip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'CLIP GENERATION UNAVAILABLE IN PROTOTYPE');
    }
    return await res.json();
  },

  async analyzeVideo(id: string): Promise<{ status: string; video_id: string; processing_status: string; detections: any[] }> {
    const res = await fetch(`${API_BASE}/videos/${encodeURIComponent(id)}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Video AI analysis failed.');
    return await res.json();
  },

  // Carving & Recovery Scan (Requirement 6 & Requirement 11)
  async getRecoveryResults(caseId?: string, evidenceId?: string): Promise<any[]> {
    let url = `${API_BASE}/recovery/results`;
    const params: string[] = [];
    if (caseId) params.push(`case_id=${encodeURIComponent(caseId)}`);
    if (evidenceId) params.push(`evidence_id=${encodeURIComponent(evidenceId)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load recovery results.');
    return await res.json();
  },

  async scanRecovery(caseId?: string, evidenceId?: string): Promise<{ status: string; scanSummary: any; results: any[] }> {
    const res = await fetch(`${API_BASE}/recovery/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, evidence_id: evidenceId }),
    });
    if (!res.ok) throw new Error('Recovery scan execution failed.');
    return await res.json();
  },

  async addRecoveryToTimeline(recoveryId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/recovery/${encodeURIComponent(recoveryId)}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to add recovery segment to timeline.');
    return await res.json();
  },

  // Vendors
  async getVendors(): Promise<VendorProfile[]> {
    const res = await fetch(`${API_BASE}/vendors`);
    if (!res.ok) throw new Error('Failed to load vendor profiles.');
    return await res.json();
  },
};
