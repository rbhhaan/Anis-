export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export enum WidgetType {
  NONE = 'NONE',
  BREATHING = 'BREATHING',
  AUDIO_RAIN = 'AUDIO_RAIN',
  CHECKLIST_Depression = 'CHECKLIST_DEPRESSION'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isError?: boolean;
  widget?: WidgetType;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
}

export interface EmergencyResource {
  name: string;
  number: string;
  description: string;
  country: string;
}

export interface ToolkitItem {
  id: string;
  title: string;
  type: 'audio' | 'exercise' | 'reading';
  icon: string;
}