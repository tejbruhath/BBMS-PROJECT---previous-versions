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
      blood_inventory: {
        Row: {
          blood_group: string
          donation_date: string
          donor_id: string | null
          expiry_date: string
          id: string
          location: string
          rh_factor: string
          status: string | null
        }
        Insert: {
          blood_group: string
          donation_date: string
          donor_id?: string | null
          expiry_date: string
          id?: string
          location: string
          rh_factor: string
          status?: string | null
        }
        Update: {
          blood_group?: string
          donation_date?: string
          donor_id?: string | null
          expiry_date?: string
          id?: string
          location?: string
          rh_factor?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_inventory_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          age: number
          alcohol_consent: boolean | null
          blood_group: string
          donation_date: string | null
          id: string
          is_alcohol_consumer: boolean | null
          is_smoker: boolean | null
          location: string
          name: string
          rh_factor: string
          smoking_consent: boolean | null
        }
        Insert: {
          age: number
          alcohol_consent?: boolean | null
          blood_group: string
          donation_date?: string | null
          id?: string
          is_alcohol_consumer?: boolean | null
          is_smoker?: boolean | null
          location: string
          name: string
          rh_factor: string
          smoking_consent?: boolean | null
        }
        Update: {
          age?: number
          alcohol_consent?: boolean | null
          blood_group?: string
          donation_date?: string | null
          id?: string
          is_alcohol_consumer?: boolean | null
          is_smoker?: boolean | null
          location?: string
          name?: string
          rh_factor?: string
          smoking_consent?: boolean | null
        }
        Relationships: []
      }
      recipients: {
        Row: {
          age: number
          blood_group: string
          id: string
          location: string
          name: string
          request_date: string | null
          rh_factor: string
          urgency: string
        }
        Insert: {
          age: number
          blood_group: string
          id?: string
          location: string
          name: string
          request_date?: string | null
          rh_factor: string
          urgency: string
        }
        Update: {
          age?: number
          blood_group?: string
          id?: string
          location?: string
          name?: string
          request_date?: string | null
          rh_factor?: string
          urgency?: string
        }
        Relationships: []
      }
      test_table: {
        Row: {
          created_at: string
          id: number
          test_column: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          test_column?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          test_column?: number | null
        }
        Relationships: []
      }
      transfusions: {
        Row: {
          blood_group: string
          donor_id: string | null
          id: string
          location: string
          notes: string | null
          recipient_id: string | null
          status: string | null
          transfusion_date: string | null
        }
        Insert: {
          blood_group: string
          donor_id?: string | null
          id?: string
          location: string
          notes?: string | null
          recipient_id?: string | null
          status?: string | null
          transfusion_date?: string | null
        }
        Update: {
          blood_group?: string
          donor_id?: string | null
          id?: string
          location?: string
          notes?: string | null
          recipient_id?: string | null
          status?: string | null
          transfusion_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfusions_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfusions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
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
