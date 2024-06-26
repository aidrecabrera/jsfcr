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
      case_suspects: {
        Row: {
          case_id: number | null
          case_suspects_id: number
          created_at: string
          student_id: number | null
        }
        Insert: {
          case_id?: number | null
          case_suspects_id?: number
          created_at?: string
          student_id?: number | null
        }
        Update: {
          case_id?: number | null
          case_suspects_id?: number
          created_at?: string
          student_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "case_suspect_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["case_id"]
          },
        ]
      }
      cases: {
        Row: {
          case_date_time: string
          case_description: string
          case_evidence: string
          case_id: number
          case_location: string
          case_status: Database["public"]["Enums"]["CASE_STATUS"] | null
          case_title: string | null
          case_uploader_id: number | null
        }
        Insert: {
          case_date_time?: string
          case_description: string
          case_evidence: string
          case_id?: number
          case_location: string
          case_status?: Database["public"]["Enums"]["CASE_STATUS"] | null
          case_title?: string | null
          case_uploader_id?: number | null
        }
        Update: {
          case_date_time?: string
          case_description?: string
          case_evidence?: string
          case_id?: number
          case_location?: string
          case_status?: Database["public"]["Enums"]["CASE_STATUS"] | null
          case_title?: string | null
          case_uploader_id?: number | null
        }
        Relationships: [
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
          student_uid?: never
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
          student_uid?: never
          student_year?: string
          student_zip_code?: string
        }
        Relationships: []
      }
      student_fingerprint: {
        Row: {
          finger: Database["public"]["Enums"]["FINGERPRINT"] | null
          fingerprint_metadata_id: number
          hash: string
          img_url: string | null
          object_id: string
          student_id: number
        }
        Insert: {
          finger?: Database["public"]["Enums"]["FINGERPRINT"] | null
          fingerprint_metadata_id?: never
          hash: string
          img_url?: string | null
          object_id: string
          student_id: number
        }
        Update: {
          finger?: Database["public"]["Enums"]["FINGERPRINT"] | null
          fingerprint_metadata_id?: never
          hash?: string
          img_url?: string | null
          object_id?: string
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_fingerprint_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      CASE_STATUS: "NEW" | "PENDING" | "CLOSED"
      FINGERPRINT:
        | "R_THUMB"
        | "R_INDEX"
        | "R_MIDDLE"
        | "R_RING"
        | "R_PINKY"
        | "L_THUMB"
        | "L_INDEX"
        | "L_MIDDLE"
        | "L_RING"
        | "L_PINKY"
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
