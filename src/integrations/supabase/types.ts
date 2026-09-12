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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addon_downloads: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          user_id: string | null
          visitor_key: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_key: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "addon_downloads_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      addon_ratings: {
        Row: {
          addon_id: string
          comment: string | null
          created_at: string
          id: string
          stars: number
          updated_at: string
          user_id: string
        }
        Insert: {
          addon_id: string
          comment?: string | null
          created_at?: string
          id?: string
          stars: number
          updated_at?: string
          user_id: string
        }
        Update: {
          addon_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          stars?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addon_ratings_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      addon_requests: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          minecraft_version: string
          official_response: string | null
          reference_url: string | null
          slug: string
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          votes: number
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          minecraft_version: string
          official_response?: string | null
          reference_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
          votes?: number
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          minecraft_version?: string
          official_response?: string | null
          reference_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
          votes?: number
        }
        Relationships: []
      }
      addon_screenshots: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "addon_screenshots_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      addon_views: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          user_id: string | null
          visitor_key: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_key: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "addon_views_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      addons: {
        Row: {
          addon_type: string
          addon_version: string
          admin_hosted: boolean
          author_name: string
          category: string
          cover_url: string | null
          created_at: string
          description: string
          downloads: number
          featured: boolean
          file_size: string | null
          file_url: string | null
          id: string
          installation: string[]
          published_at: string | null
          rating_avg: number
          rating_count: number
          requirements: string[]
          review_note: string | null
          slug: string
          status: Database["public"]["Enums"]["addon_status"]
          submitter_id: string | null
          tagline: string | null
          title: string
          updated_at: string
          versions: string[]
          viewers: number
        }
        Insert: {
          addon_type: string
          addon_version?: string
          admin_hosted?: boolean
          author_name: string
          category: string
          cover_url?: string | null
          created_at?: string
          description: string
          downloads?: number
          featured?: boolean
          file_size?: string | null
          file_url?: string | null
          id?: string
          installation?: string[]
          published_at?: string | null
          rating_avg?: number
          rating_count?: number
          requirements?: string[]
          review_note?: string | null
          slug: string
          status?: Database["public"]["Enums"]["addon_status"]
          submitter_id?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
          versions?: string[]
          viewers?: number
        }
        Update: {
          addon_type?: string
          addon_version?: string
          admin_hosted?: boolean
          author_name?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          downloads?: number
          featured?: boolean
          file_size?: string | null
          file_url?: string | null
          id?: string
          installation?: string[]
          published_at?: string | null
          rating_avg?: number
          rating_count?: number
          requirements?: string[]
          review_note?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["addon_status"]
          submitter_id?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string
          versions?: string[]
          viewers?: number
        }
        Relationships: []
      }
      favourites: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourites_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          addon_id: string | null
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_by: string | null
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          addon_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          addon_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      request_votes: {
        Row: {
          created_at: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_votes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "addon_requests"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      publish_addon: {
        Args: { p_addon_id: string; p_admin_hosted: boolean }
        Returns: undefined
      }
      record_addon_download: {
        Args: { p_addon_id: string; p_visitor_key: string }
        Returns: undefined
      }
      record_addon_view: {
        Args: { p_addon_id: string; p_visitor_key: string }
        Returns: undefined
      }
    }
    Enums: {
      addon_status: "pending" | "changes_requested" | "published" | "rejected"
      app_role: "owner" | "admin" | "moderator" | "user"
      report_status: "open" | "reviewing" | "resolved"
      request_status:
        | "requested"
        | "under_consideration"
        | "in_development"
        | "completed"
        | "rejected"
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
      addon_status: ["pending", "changes_requested", "published", "rejected"],
      app_role: ["owner", "admin", "moderator", "user"],
      report_status: ["open", "reviewing", "resolved"],
      request_status: [
        "requested",
        "under_consideration",
        "in_development",
        "completed",
        "rejected",
      ],
    },
  },
} as const
