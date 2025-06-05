export type OpenAIModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}

// Backend API types
export interface BackendChatRequest {
  message: string;
  session_id?: string;
}

export interface BackendChatResponse {
  response: string;
  session_id: string;
  is_code_generation: boolean;
  download_url?: string;
  file_id?: string;
}

export interface CodeGenerationRequest {
  description: string;
  session_id?: string;
}

export interface CodeGenerationResponse {
  response: string;
  session_id: string;
  download_url?: string;
  file_id?: string;
}
