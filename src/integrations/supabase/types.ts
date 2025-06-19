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
      driver_locations: {
        Row: {
          driver_id: string | null
          heading: number | null
          id: string
          location: unknown | null
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          driver_id?: string | null
          heading?: number | null
          id?: string
          location?: unknown | null
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          driver_id?: string | null
          heading?: number | null
          id?: string
          location?: unknown | null
          speed?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          availability_status: string | null
          created_at: string | null
          id: string
          license_number: string | null
          license_plate: string | null
          rating: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: string | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          id?: string
          license_number?: string | null
          license_plate?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          id?: string
          license_number?: string | null
          license_plate?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      fare_calculations: {
        Row: {
          base_fare: number
          created_at: string | null
          id: string
          minimum_fare: number
          per_km_rate: number
          updated_at: string | null
          vehicle_type: string
        }
        Insert: {
          base_fare: number
          created_at?: string | null
          id?: string
          minimum_fare: number
          per_km_rate: number
          updated_at?: string | null
          vehicle_type: string
        }
        Update: {
          base_fare?: number
          created_at?: string | null
          id?: string
          minimum_fare?: number
          per_km_rate?: number
          updated_at?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
      medical_provider_applications: {
        Row: {
          address: string | null
          email: string | null
          full_name: string
          id: string
          license_number: string | null
          phone: string | null
          provider_type: string
          reviewed_at: string | null
          reviewer_notes: string | null
          specialization_id: string | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          full_name: string
          id?: string
          license_number?: string | null
          phone?: string | null
          provider_type: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          specialization_id?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          email?: string | null
          full_name?: string
          id?: string
          license_number?: string | null
          phone?: string | null
          provider_type?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          specialization_id?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_provider_applications_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "medical_specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_providers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          license_number: string | null
          phone: string | null
          provider_type: string
          rating: number | null
          specialization_id: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          license_number?: string | null
          phone?: string | null
          provider_type: string
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          license_number?: string | null
          phone?: string | null
          provider_type?: string
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_medical_providers_specialization"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "medical_specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_specializations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          location: string | null
          make: string | null
          model: string | null
          name: string
          original_price: number | null
          price: number
          stock_quantity: number | null
          updated_at: string | null
          vendor: string | null
          vendor_id: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          location?: string | null
          make?: string | null
          model?: string | null
          name: string
          original_price?: number | null
          price: number
          stock_quantity?: number | null
          updated_at?: string | null
          vendor?: string | null
          vendor_id?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          location?: string | null
          make?: string | null
          model?: string | null
          name?: string
          original_price?: number | null
          price?: number
          stock_quantity?: number | null
          updated_at?: string | null
          vendor?: string | null
          vendor_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          property_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      property_viewings: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          property_id: string | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string | null
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          actual_fare: number | null
          completed_at: string | null
          created_at: string | null
          destination_address: string
          destination_location: string | null
          driver_id: string | null
          estimated_fare: number | null
          fare: number | null
          id: string
          pickup_address: string
          pickup_location: string | null
          rating: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actual_fare?: number | null
          completed_at?: string | null
          created_at?: string | null
          destination_address: string
          destination_location?: string | null
          driver_id?: string | null
          estimated_fare?: number | null
          fare?: number | null
          id?: string
          pickup_address: string
          pickup_location?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actual_fare?: number | null
          completed_at?: string | null
          created_at?: string | null
          destination_address?: string
          destination_location?: string | null
          driver_id?: string | null
          estimated_fare?: number | null
          fare?: number | null
          id?: string
          pickup_address?: string
          pickup_location?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string | null
          payment_data: Json | null
          payment_method: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_data?: Json | null
          payment_method: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_data?: Json | null
          payment_method?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_applications: {
        Row: {
          business_description: string | null
          business_name: string
          contact_email: string | null
          contact_phone: string | null
          id: string
          logo_url: string | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          business_description?: string | null
          business_name: string
          contact_email?: string | null
          contact_phone?: string | null
          id?: string
          logo_url?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          business_description?: string | null
          business_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          id?: string
          logo_url?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          business_address: string | null
          business_description: string | null
          business_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_address?: string | null
          business_description?: string | null
          business_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_address?: string | null
          business_description?: string | null
          business_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
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
