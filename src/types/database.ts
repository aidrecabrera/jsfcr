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
      cases: {
        Row: {
          case_date_time: string
          case_description: string
          case_evidence: string
          case_id: number
          case_location: string
          case_status: string
          case_suspect: number | null
          case_title: string | null
          case_uploader_id: number | null
        }
        Insert: {
          case_date_time?: string
          case_description: string
          case_evidence: string
          case_id?: number
          case_location: string
          case_status?: string
          case_suspect?: number | null
          case_title?: string | null
          case_uploader_id?: number | null
        }
        Update: {
          case_date_time?: string
          case_description?: string
          case_evidence?: string
          case_id?: number
          case_location?: string
          case_status?: string
          case_suspect?: number | null
          case_title?: string | null
          case_uploader_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_case_suspect_fkey"
            columns: ["case_suspect"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["student_uid"]
          },
          {
            foreignKeyName: "cases_case_uploader_id_fkey"
            columns: ["case_uploader_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["user_uid"]
          },
        ]
      }
      student: {
        Row: {
          date_registered: string | null
          student_address: string
          student_barangay: string | null
          student_course: string
          student_family_name: string
          student_id: string
          student_middle_name: string | null
          student_municipal: string | null
          student_name: string
          student_province: string | null
          student_region: string | null
          student_suffix: string | null
          student_uid: number
          student_year: string
          student_zip_code: string
        }
        Insert: {
          date_registered?: string | null
          student_address: string
          student_barangay?: string | null
          student_course: string
          student_family_name: string
          student_id: string
          student_middle_name?: string | null
          student_municipal?: string | null
          student_name: string
          student_province?: string | null
          student_region?: string | null
          student_suffix?: string | null
          student_uid?: number
          student_year: string
          student_zip_code: string
        }
        Update: {
          date_registered?: string | null
          student_address?: string
          student_barangay?: string | null
          student_course?: string
          student_family_name?: string
          student_id?: string
          student_middle_name?: string | null
          student_municipal?: string | null
          student_name?: string
          student_province?: string | null
          student_region?: string | null
          student_suffix?: string | null
          student_uid?: number
          student_year?: string
          student_zip_code?: string
        }
        Relationships: []
      }
      student_fingerprint_images: {
        Row: {
          img_left_index_finger_url: string | null
          img_left_middle_finger_url: string | null
          img_left_pinky_url: string | null
          img_left_ring_finger_url: string | null
          img_left_thumb_url: string | null
          img_right_index_finger_url: string | null
          img_right_middle_finger_url: string | null
          img_right_pinky_url: string | null
          img_right_ring_finger_url: string | null
          img_right_thumb_url: string | null
          student_uid: number
        }
        Insert: {
          img_left_index_finger_url?: string | null
          img_left_middle_finger_url?: string | null
          img_left_pinky_url?: string | null
          img_left_ring_finger_url?: string | null
          img_left_thumb_url?: string | null
          img_right_index_finger_url?: string | null
          img_right_middle_finger_url?: string | null
          img_right_pinky_url?: string | null
          img_right_ring_finger_url?: string | null
          img_right_thumb_url?: string | null
          student_uid: number
        }
        Update: {
          img_left_index_finger_url?: string | null
          img_left_middle_finger_url?: string | null
          img_left_pinky_url?: string | null
          img_left_ring_finger_url?: string | null
          img_left_thumb_url?: string | null
          img_right_index_finger_url?: string | null
          img_right_middle_finger_url?: string | null
          img_right_pinky_url?: string | null
          img_right_ring_finger_url?: string | null
          img_right_thumb_url?: string | null
          student_uid?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_fingerprint_images_student_uid_fkey"
            columns: ["student_uid"]
            isOneToOne: true
            referencedRelation: "student"
            referencedColumns: ["student_uid"]
          },
        ]
      }
      user_account: {
        Row: {
          position: string
          status: number
          user_biometric: string
          user_id: string
          user_name: string
          user_password: string
          user_uid: number
          user_username: string
        }
        Insert: {
          position: string
          status: number
          user_biometric: string
          user_id: string
          user_name: string
          user_password: string
          user_uid?: number
          user_username: string
        }
        Update: {
          position?: string
          status?: number
          user_biometric?: string
          user_id?: string
          user_name?: string
          user_password?: string
          user_uid?: number
          user_username?: string
        }
        Relationships: []
      }
      user_hist: {
        Row: {
          hist_date: string
          hist_id: number
          user_action: string
          user_uid: number
        }
        Insert: {
          hist_date?: string
          hist_id?: number
          user_action: string
          user_uid: number
        }
        Update: {
          hist_date?: string
          hist_id?: number
          user_action?: string
          user_uid?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_hist_user_uid_fkey"
            columns: ["user_uid"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["user_uid"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
