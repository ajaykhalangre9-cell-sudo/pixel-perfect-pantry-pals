export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      delivery_assignments: {
        Row: {
          confirmation_code: string
          created_at: string
          created_by: string | null
          delivered_at: string | null
          destination_note: string | null
          id: string
          listing_id: string | null
          need_report_id: string | null
          reference: string
          status: string
          updated_at: string
          volunteer_id: string | null
        }
        Insert: {
          confirmation_code?: string
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          destination_note?: string | null
          id?: string
          listing_id?: string | null
          need_report_id?: string | null
          reference?: string
          status?: string
          updated_at?: string
          volunteer_id?: string | null
        }
        Update: {
          confirmation_code?: string
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          destination_note?: string | null
          id?: string
          listing_id?: string | null
          need_report_id?: string | null
          reference?: string
          status?: string
          updated_at?: string
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "food_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_need_report_id_fkey"
            columns: ["need_report_id"]
            isOneToOne: false
            referencedRelation: "need_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_events: {
        Row: {
          actor_id: string | null
          assignment_id: string
          created_at: string
          id: string
          note: string | null
          status: string
        }
        Insert: {
          actor_id?: string | null
          assignment_id: string
          created_at?: string
          id?: string
          note?: string | null
          status: string
        }
        Update: {
          actor_id?: string | null
          assignment_id?: string
          created_at?: string
          id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "delivery_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount_inr: number
          campaign: string | null
          contact_preference: string | null
          created_at: string
          donor_name: string
          id: string
          meals: number | null
          mode: string
          receipt_number: string | null
          reference: string
          status: string
          user_id: string
        }
        Insert: {
          amount_inr: number
          campaign?: string | null
          contact_preference?: string | null
          created_at?: string
          donor_name: string
          id?: string
          meals?: number | null
          mode?: string
          receipt_number?: string | null
          reference?: string
          status?: string
          user_id?: string
        }
        Update: {
          amount_inr?: number
          campaign?: string | null
          contact_preference?: string | null
          created_at?: string
          donor_name?: string
          id?: string
          meals?: number | null
          mode?: string
          receipt_number?: string | null
          reference?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      food_listings: {
        Row: {
          allergens: string | null
          category: string
          contact_phone: string | null
          created_at: string
          description: string | null
          diet: string
          food_name: string
          handling_instructions: string | null
          id: string
          image_path: string | null
          latitude: number | null
          longitude: number | null
          pickup_address: string
          pickup_deadline: string
          preparation_details: string | null
          prepared_at: string | null
          provider_id: string
          quantity: number
          reference: string
          rejection_reason: string | null
          status: string
          storage_details: string | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allergens?: string | null
          category: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          diet: string
          food_name: string
          handling_instructions?: string | null
          id?: string
          image_path?: string | null
          latitude?: number | null
          longitude?: number | null
          pickup_address: string
          pickup_deadline: string
          preparation_details?: string | null
          prepared_at?: string | null
          provider_id: string
          quantity: number
          reference?: string
          rejection_reason?: string | null
          status?: string
          storage_details?: string | null
          unit: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          allergens?: string | null
          category?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          diet?: string
          food_name?: string
          handling_instructions?: string | null
          id?: string
          image_path?: string | null
          latitude?: number | null
          longitude?: number | null
          pickup_address?: string
          pickup_deadline?: string
          preparation_details?: string | null
          prepared_at?: string | null
          provider_id?: string
          quantity?: number
          reference?: string
          rejection_reason?: string | null
          status?: string
          storage_details?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "food_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      food_providers: {
        Row: {
          address: string
          city: string | null
          created_at: string
          fssai_license: string | null
          id: string
          name: string
          phone: string | null
          provider_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          city?: string | null
          created_at?: string
          fssai_license?: string | null
          id?: string
          name: string
          phone?: string | null
          provider_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string
          fssai_license?: string | null
          id?: string
          name?: string
          phone?: string | null
          provider_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_safety_reviews: {
        Row: {
          allergens_declared: boolean | null
          created_at: string
          decision: string
          id: string
          listing_id: string
          notes: string | null
          packaging_ok: boolean | null
          reviewer_id: string
          temperature_ok: boolean | null
          within_safe_window: boolean | null
        }
        Insert: {
          allergens_declared?: boolean | null
          created_at?: string
          decision: string
          id?: string
          listing_id: string
          notes?: string | null
          packaging_ok?: boolean | null
          reviewer_id?: string
          temperature_ok?: boolean | null
          within_safe_window?: boolean | null
        }
        Update: {
          allergens_declared?: boolean | null
          created_at?: string
          decision?: string
          id?: string
          listing_id?: string
          notes?: string | null
          packaging_ok?: boolean | null
          reviewer_id?: string
          temperature_ok?: boolean | null
          within_safe_window?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "food_safety_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "food_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      need_report_evidence: {
        Row: {
          created_at: string
          file_path: string
          id: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          report_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "need_report_evidence_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "need_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      need_reports: {
        Row: {
          address: string | null
          consent: boolean
          contact_phone: string | null
          created_at: string
          description: string | null
          dietary: string | null
          general_location: string
          id: string
          latitude: number | null
          longitude: number | null
          need_type: string
          people_count: number
          reference: string
          rejection_reason: string | null
          requested_time: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          consent?: boolean
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          dietary?: string | null
          general_location: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          need_type: string
          people_count: number
          reference?: string
          rejection_reason?: string | null
          requested_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          address?: string | null
          consent?: boolean
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          dietary?: string | null
          general_location?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          need_type?: string
          people_count?: number
          reference?: string
          rejection_reason?: string | null
          requested_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          email: boolean
          in_app: boolean
          sms: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          email?: boolean
          in_app?: boolean
          sms?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          email?: boolean
          in_app?: boolean
          sms?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          onboarded: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          onboarded?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          onboarded?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      review_notes: {
        Row: {
          created_at: string
          decision: string | null
          entity: string
          entity_id: string
          id: string
          notes: string | null
          reviewer_id: string
        }
        Insert: {
          created_at?: string
          decision?: string | null
          entity: string
          entity_id: string
          id?: string
          notes?: string | null
          reviewer_id?: string
        }
        Update: {
          created_at?: string
          decision?: string | null
          entity?: string
          entity_id?: string
          id?: string
          notes?: string | null
          reviewer_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_profiles: {
        Row: {
          available: boolean
          created_at: string
          phone: string | null
          service_area: string | null
          updated_at: string
          user_id: string
          vehicle: string | null
        }
        Insert: {
          available?: boolean
          created_at?: string
          phone?: string | null
          service_area?: string | null
          updated_at?: string
          user_id?: string
          vehicle?: string | null
        }
        Update: {
          available?: boolean
          created_at?: string
          phone?: string | null
          service_area?: string | null
          updated_at?: string
          user_id?: string
          vehicle?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
      get_impact_stats: {
        Args: never
        Returns: {
          active_volunteers: number
          deliveries_completed: number
          people_supported: number
          reports_fulfilled: number
        }[]
      }
      get_my_assignments: {
        Args: never
        Returns: {
          created_at: string
          delivered_at: string
          destination_address: string
          destination_location: string
          destination_note: string
          destination_people: number
          food_name: string
          handling_instructions: string
          id: string
          pickup_address: string
          pickup_deadline: string
          provider_contact: string
          quantity: number
          reference: string
          status: string
          unit: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      notify: {
        Args: { _body: string; _link: string; _title: string; _user: string }
        Returns: undefined
      }
      update_delivery_status: {
        Args: {
          _assignment: string
          _code?: string
          _note?: string
          _status: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "requester"
        | "donor"
        | "provider"
        | "volunteer"
        | "ngo"
        | "reviewer"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "requester",
        "donor",
        "provider",
        "volunteer",
        "ngo",
        "reviewer",
        "admin",
      ],
    },
  },
} as const
