import {
  BackendChatRequest,
  BackendChatResponse,
  CodeGenerationRequest,
  CodeGenerationResponse,
} from '@/types/types';

export class BackendChatService {
  private sessionId: string | null = null;
  private backendUrl: string;

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId();
    // Get backend URL from localStorage or use default
    this.backendUrl = this.getBackendUrl();
  }

  private getBackendUrl(): string {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('backend_url') ||
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        'http://localhost:8000'
      );
    }
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  }

  private getOrCreateSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('chat_session_id');
      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem('chat_session_id', sessionId);
      }
      return sessionId;
    }
    return this.generateSessionId();
  }

  private generateSessionId(): string {
    return (
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  async sendMessage(message: string): Promise<BackendChatResponse> {
    const request: BackendChatRequest = {
      message,
      session_id: this.sessionId || undefined,
    };

    const response = await fetch('/api/backend/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Backend-URL': this.getBackendUrl(), // Pass backend URL to API route
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send message to backend');
    }

    const data = await response.json();

    // Update session ID if received from backend
    if (data.session_id && data.session_id !== this.sessionId) {
      this.sessionId = data.session_id;
      if (typeof window !== 'undefined') {
        localStorage.setItem('chat_session_id', data.session_id);
      }
    }

    return data;
  }

  async generateExecutable(
    description: string,
  ): Promise<CodeGenerationResponse> {
    const request: CodeGenerationRequest = {
      description,
      session_id: this.sessionId || undefined,
    };

    const response = await fetch('/api/backend/generate-executable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Backend-URL': this.getBackendUrl(), // Pass backend URL to API route
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate executable');
    }

    const data = await response.json();
    return data;
  }

  async downloadExecutable(fileId: string): Promise<void> {
    const downloadUrl = `${this.getBackendUrl()}/download/${fileId}`;

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `zerbot_program_${fileId}.exe`;
    link.target = '_blank'; // Open in new tab to handle CORS
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clearSession(): void {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_session_id', this.sessionId);
    }
  }
}
