export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diary_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          insight_data: Json
          insight_type: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          insight_data: Json
          insight_type: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          insight_data?: Json
          insight_type?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          mood: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          mood?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      match_game_reflections: {
        Row: {
          created_at: string
          emotion: string
          id: string
          reflection: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion: string
          id?: string
          reflection?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emotion?: string
          id?: string
          reflection?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meditation_sessions: {
        Row: {
          completed: boolean | null
          created_at: string
          duration: number
          id: string
          notes: string | null
          session_type: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          duration: number
          id?: string
          notes?: string | null
          session_type: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          duration?: number
          id?: string
          notes?: string | null
          session_type?: string
          user_id?: string
        }
        Relationships: []
      }
      minigame_progress: {
        Row: {
          created_at: string
          current_level: number
          game_type: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          game_type: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          game_type?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_personality: string | null
          created_at: string | null
          id: string
          include_exercises: boolean | null
          response_length: string | null
          session_reminders: boolean | null
          updated_at: string | null
          use_formal_language: boolean | null
          user_id: string
        }
        Insert: {
          ai_personality?: string | null
          created_at?: string | null
          id?: string
          include_exercises?: boolean | null
          response_length?: string | null
          session_reminders?: boolean | null
          updated_at?: string | null
          use_formal_language?: boolean | null
          user_id: string
        }
        Update: {
          ai_personality?: string | null
          created_at?: string | null
          id?: string
          include_exercises?: boolean | null
          response_length?: string | null
          session_reminders?: boolean | null
          updated_at?: string | null
          use_formal_language?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string | null
          date_recorded: string | null
          id: string
          metric_type: string
          metric_value: number
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          metric_type: string
          metric_value: number
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          communication_style: string | null
          created_at: string
          crisis_contact: string | null
          mood: string | null
          notification_preferences: Json | null
          personality_traits: Json | null
          preferred_topics: string[] | null
          reminder_time: string | null
          theme: string | null
          therapy_goals: string[] | null
          trigger_words: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          created_at?: string
          crisis_contact?: string | null
          mood?: string | null
          notification_preferences?: Json | null
          personality_traits?: Json | null
          preferred_topics?: string[] | null
          reminder_time?: string | null
          theme?: string | null
          therapy_goals?: string[] | null
          trigger_words?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          created_at?: string
          crisis_contact?: string | null
          mood?: string | null
          notification_preferences?: Json | null
          personality_traits?: Json | null
          preferred_topics?: string[] | null
          reminder_time?: string | null
          theme?: string | null
          therapy_goals?: string[] | null
          trigger_words?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
