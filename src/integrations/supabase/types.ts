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
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          commission_amount: number
          commission_rate: number | null
          created_at: string | null
          id: string
          order_id: string | null
          recipient_id: string
          recipient_type: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          commission_amount: number
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          recipient_id: string
          recipient_type: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_amount?: number
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          recipient_id?: string
          recipient_type?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string | null
          discount_applied: number
          id: string
          order_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          discount_applied: number
          id?: string
          order_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          discount_applied?: number
          id?: string
          order_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_amount: number
          discount_type: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          minimum_order_amount: number | null
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_amount: number
          discount_type: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_amount?: number
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      driver_locations: {
        Row: {
          driver_id: string | null
          heading: number | null
          id: string
          is_active: boolean | null
          location: unknown | null
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          driver_id?: string | null
          heading?: number | null
          id?: string
          is_active?: boolean | null
          location?: unknown | null
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          driver_id?: string | null
          heading?: number | null
          id?: string
          is_active?: boolean | null
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
      driver_ride_requests: {
        Row: {
          created_at: string | null
          distance_km: number | null
          driver_id: string | null
          estimated_pickup_minutes: number | null
          expires_at: string
          id: string
          responded_at: string | null
          ride_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string | null
          estimated_pickup_minutes?: number | null
          expires_at: string
          id?: string
          responded_at?: string | null
          ride_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string | null
          estimated_pickup_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_ride_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_saved_routes: {
        Row: {
          created_at: string | null
          driver_id: string | null
          from_address: string
          id: string
          name: string
          to_address: string
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          from_address: string
          id?: string
          name: string
          to_address: string
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          from_address?: string
          id?: string
          name?: string
          to_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_saved_routes_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          availability_status: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          license_number: string | null
          license_plate: string | null
          phone: string | null
          rating: number | null
          status: string | null
          total_rides: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          vehicle_year: number | null
        }
        Insert: {
          address?: string | null
          availability_status?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          license_plate?: string | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
        }
        Update: {
          address?: string | null
          availability_status?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          license_plate?: string | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
        }
        Relationships: []
      }
      employers: {
        Row: {
          approved: boolean | null
          company_name: string
          contact_name: string
          created_at: string | null
          description: string | null
          email: string
          id: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          approved?: boolean | null
          company_name: string
          contact_name: string
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          approved?: boolean | null
          company_name?: string
          contact_name?: string
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
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
      insurance_policies: {
        Row: {
          coverage_amount: number
          created_at: string | null
          end_date: string
          id: string
          policy_type: string
          premium_amount: number
          provider_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coverage_amount: number
          created_at?: string | null
          end_date: string
          id?: string
          policy_type: string
          premium_amount: number
          provider_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coverage_amount?: number
          created_at?: string | null
          end_date?: string
          id?: string
          policy_type?: string
          premium_amount?: number
          provider_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          coverage_types: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          pricing: Json | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          coverage_types?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pricing?: Json | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          coverage_types?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pricing?: Json | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_provider_applications: {
        Row: {
          address: string | null
          documents: Json | null
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
          documents?: Json | null
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
          documents?: Json | null
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
          is_active: boolean | null
          is_verified: boolean | null
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
          is_active?: boolean | null
          is_verified?: boolean | null
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
          is_active?: boolean | null
          is_verified?: boolean | null
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
      properties: {
        Row: {
          address: string | null
          agent_id: string | null
          amenities: Json | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          listing_type: string
          location: string | null
          owner_id: string | null
          price: number
          property_type: string | null
          status: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          address?: string | null
          agent_id?: string | null
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          listing_type: string
          location?: string | null
          owner_id?: string | null
          price: number
          property_type?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          address?: string | null
          agent_id?: string | null
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          listing_type?: string
          location?: string | null
          owner_id?: string | null
          price?: number
          property_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "real_estate_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          inquirer_name: string | null
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
          inquirer_name?: string | null
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
          inquirer_name?: string | null
          message?: string | null
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_inquiries_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
      real_estate_agents: {
        Row: {
          address: string | null
          agency_name: string
          created_at: string | null
          email: string | null
          experience_years: number | null
          id: string
          license_number: string | null
          phone: string | null
          rating: number | null
          specialization: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          agency_name: string
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          license_number?: string | null
          phone?: string | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          agency_name?: string
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          license_number?: string | null
          phone?: string | null
          rating?: number | null
          specialization?: string | null
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
          duration_minutes: number | null
          estimated_fare: number | null
          fare: number | null
          id: string
          pickup_address: string
          pickup_location: string | null
          rating: number | null
          review: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          actual_fare?: number | null
          completed_at?: string | null
          created_at?: string | null
          destination_address: string
          destination_location?: string | null
          driver_id?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          fare?: number | null
          id?: string
          pickup_address: string
          pickup_location?: string | null
          rating?: number | null
          review?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          actual_fare?: number | null
          completed_at?: string | null
          created_at?: string | null
          destination_address?: string
          destination_location?: string | null
          driver_id?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          fare?: number | null
          id?: string
          pickup_address?: string
          pickup_location?: string | null
          rating?: number | null
          review?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
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
      service_bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          location: string | null
          price: number | null
          provider_id: string | null
          service_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          price?: number | null
          provider_id?: string | null
          service_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          price?: number | null
          provider_id?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_provider_profiles: {
        Row: {
          address: string | null
          business_name: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          rating: number | null
          service_type: string
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          rating?: number | null
          service_type: string
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          rating?: number | null
          service_type?: string
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          business_description: string | null
          business_name: string
          contact_email: string | null
          contact_phone: string | null
          id: string
          logo_url: string | null
          service_type: string | null
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
          service_type?: string | null
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
          service_type?: string | null
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
          business_email: string | null
          business_name: string
          business_phone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_medical_provider_application: {
        Args: { p_application_id: string }
        Returns: undefined
      }
      approve_vendor_application: {
        Args: { p_application_id: string }
        Returns: undefined
      }
      calculate_coupon_discount: {
        Args: { p_coupon_code: string; p_order_amount: number }
        Returns: number
      }
      find_nearby_drivers: {
        Args: {
          p_pickup_lat: number
          p_pickup_lng: number
          p_radius_km?: number
        }
        Returns: {
          driver_id: string
          distance_km: number
        }[]
      }
      get_driver_analytics: {
        Args: { p_driver_id: string }
        Returns: Json
      }
      get_popular_routes: {
        Args: Record<PropertyKey, never>
        Returns: {
          pickup_address: string
          destination_address: string
          ride_count: number
        }[]
      }
      increment_property_views: {
        Args: { property_id: string }
        Returns: undefined
      }
      reject_medical_provider_application: {
        Args: { p_application_id: string; p_admin_notes?: string }
        Returns: undefined
      }
      reject_vendor_application: {
        Args: { p_application_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "customer"
        | "vendor"
        | "driver"
        | "property_owner"
        | "rider"
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
    Enums: {
      app_role: [
        "admin",
        "customer",
        "vendor",
        "driver",
        "property_owner",
        "rider",
      ],
    },
  },
} as const
