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
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          id: string
          order_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          order_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          order_id?: string | null
          used_at?: string
          user_id?: string
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
          applicable_categories: string[] | null
          applicable_products: string[] | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          is_active: boolean | null
          maximum_discount_amount: number | null
          minimum_order_amount: number | null
          name: string
          start_date: string
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
          user_usage_limit: number | null
        }
        Insert: {
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean | null
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          name: string
          start_date: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          user_usage_limit?: number | null
        }
        Update: {
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean | null
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          name?: string
          start_date?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          user_usage_limit?: number | null
        }
        Relationships: []
      }
      delivery_schedules: {
        Row: {
          created_at: string
          delivery_address: string
          id: string
          order_id: string
          phone_number: string
          scheduled_date: string
          special_instructions: string | null
          status: string | null
          time_slot: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          id?: string
          order_id: string
          phone_number: string
          scheduled_date: string
          special_instructions?: string | null
          status?: string | null
          time_slot: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          id?: string
          order_id?: string
          phone_number?: string
          scheduled_date?: string
          special_instructions?: string | null
          status?: string | null
          time_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_schedules_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          driver_id: string
          heading: number | null
          id: string
          is_active: boolean | null
          location: unknown
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          accuracy?: number | null
          driver_id: string
          heading?: number | null
          id?: string
          is_active?: boolean | null
          location: unknown
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          accuracy?: number | null
          driver_id?: string
          heading?: number | null
          id?: string
          is_active?: boolean | null
          location?: unknown
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
          driver_id: string
          estimated_pickup_minutes: number | null
          expires_at: string
          id: string
          responded_at: string | null
          ride_id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          driver_id: string
          estimated_pickup_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string
          estimated_pickup_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id?: string
          sent_at?: string | null
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
          driver_id: string
          from_address: string
          id: string
          name: string
          to_address: string
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          from_address: string
          id?: string
          name: string
          to_address: string
        }
        Update: {
          created_at?: string | null
          driver_id?: string
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
          availability_status: string | null
          created_at: string | null
          current_location: unknown | null
          documents: Json | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_location_update: string | null
          license_number: string
          license_plate: string
          phone_number: string
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          total_rides: number | null
          updated_at: string | null
          user_id: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year: number | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          current_location?: unknown | null
          documents?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          license_number: string
          license_plate: string
          phone_number: string
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_rides?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          current_location?: unknown | null
          documents?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          license_number?: string
          license_plate?: string
          phone_number?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          audience_segments: Json | null
          clicked_count: number | null
          content: string
          created_at: string
          created_by: string
          id: string
          name: string
          opened_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          target_audience: string | null
          template_type: string | null
          total_recipients: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audience_segments?: Json | null
          clicked_count?: number | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          target_audience?: string | null
          template_type?: string | null
          total_recipients?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audience_segments?: Json | null
          clicked_count?: number | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          target_audience?: string | null
          template_type?: string | null
          total_recipients?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          is_subscribed: boolean | null
          subscribed_at: string
          subscription_source: string | null
          tags: string[] | null
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          is_subscribed?: boolean | null
          subscribed_at?: string
          subscription_source?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_subscribed?: boolean | null
          subscribed_at?: string
          subscription_source?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fare_calculations: {
        Row: {
          base_fare: number
          created_at: string | null
          id: string
          is_active: boolean | null
          minimum_fare: number
          per_km_rate: number
          per_minute_rate: number
          surge_multiplier: number | null
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          base_fare: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_fare: number
          per_km_rate: number
          per_minute_rate: number
          surge_multiplier?: number | null
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          base_fare?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_fare?: number
          per_km_rate?: number
          per_minute_rate?: number
          surge_multiplier?: number | null
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: []
      }
      medical_facilities: {
        Row: {
          address: string
          created_at: string
          email: string | null
          facility_type: Database["public"]["Enums"]["medical_facility_type"]
          id: string
          is_verified: boolean | null
          location_coordinates: unknown | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          facility_type: Database["public"]["Enums"]["medical_facility_type"]
          id?: string
          is_verified?: boolean | null
          location_coordinates?: unknown | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          facility_type?: Database["public"]["Enums"]["medical_facility_type"]
          id?: string
          is_verified?: boolean | null
          location_coordinates?: unknown | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medical_provider_applications: {
        Row: {
          admin_notes: string | null
          documents: Json | null
          email: string
          full_name: string
          id: string
          license_number: string
          phone: string
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          reviewed_at: string | null
          reviewed_by: string | null
          specialization_id: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          documents?: Json | null
          email: string
          full_name: string
          id?: string
          license_number: string
          phone: string
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization_id?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          documents?: Json | null
          email?: string
          full_name?: string
          id?: string
          license_number?: string
          phone?: string
          provider_type?: Database["public"]["Enums"]["medical_provider_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization_id?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
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
          created_at: string
          facility_id: string | null
          full_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          rating: number | null
          specialization_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          facility_id?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          provider_type: Database["public"]["Enums"]["medical_provider_type"]
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          facility_id?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          provider_type?: Database["public"]["Enums"]["medical_provider_type"]
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_providers_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "medical_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_providers_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "medical_specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_specializations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          pharmacy_id: string
          price: number
          requires_prescription: boolean | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          pharmacy_id: string
          price: number
          requires_prescription?: boolean | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          pharmacy_id?: string
          price?: number
          requires_prescription?: boolean | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "medical_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
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
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_status: Database["public"]["Enums"]["order_status_type"]
          notes: string | null
          old_status: Database["public"]["Enums"]["order_status_type"] | null
          order_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["order_status_type"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status_type"] | null
          order_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["order_status_type"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status_type"] | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string | null
          discount_amount: number | null
          id: string
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
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
          category: string
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
          rating: number | null
          reviews_count: number | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
          vendor: string | null
          vendor_id: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          category: string
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
          rating?: number | null
          reviews_count?: number | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          vendor?: string | null
          vendor_id?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          category?: string
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
          rating?: number | null
          reviews_count?: number | null
          stock_quantity?: number | null
          tags?: string[] | null
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
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          agent_id: string | null
          amenities: string[] | null
          area_sqm: number | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          county: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location_address: string
          location_coordinates: unknown | null
          owner_id: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          status: Database["public"]["Enums"]["property_status"] | null
          title: string
          updated_at: string | null
          views_count: number | null
          virtual_tour_url: string | null
        }
        Insert: {
          agent_id?: string | null
          amenities?: string[] | null
          area_sqm?: number | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location_address: string
          location_coordinates?: unknown | null
          owner_id: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          status?: Database["public"]["Enums"]["property_status"] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
        }
        Update: {
          agent_id?: string | null
          amenities?: string[] | null
          area_sqm?: number | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location_address?: string
          location_coordinates?: unknown | null
          owner_id?: string
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          status?: Database["public"]["Enums"]["property_status"] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
          virtual_tour_url?: string | null
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          id: string
          inquirer_email: string
          inquirer_id: string | null
          inquirer_name: string
          inquirer_phone: string | null
          inquiry_type: string | null
          message: string
          preferred_contact_method: string | null
          property_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquirer_email: string
          inquirer_id?: string | null
          inquirer_name: string
          inquirer_phone?: string | null
          inquiry_type?: string | null
          message: string
          preferred_contact_method?: string | null
          property_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inquirer_email?: string
          inquirer_id?: string | null
          inquirer_name?: string
          inquirer_phone?: string | null
          inquiry_type?: string | null
          message?: string
          preferred_contact_method?: string | null
          property_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
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
          property_id: string
          status: string | null
          viewer_email: string
          viewer_id: string | null
          viewer_name: string
          viewer_phone: string | null
          viewing_date: string
          viewing_time: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id: string
          status?: string | null
          viewer_email: string
          viewer_id?: string | null
          viewer_name: string
          viewer_phone?: string | null
          viewing_date: string
          viewing_time: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string
          status?: string | null
          viewer_email?: string
          viewer_id?: string | null
          viewer_name?: string
          viewer_phone?: string | null
          viewing_date?: string
          viewing_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      real_estate_agents: {
        Row: {
          agency_name: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          license_number: string | null
          phone: string
          profile_image_url: string | null
          rating: number | null
          social_media: Json | null
          specializations: string[] | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          agency_name?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          phone: string
          profile_image_url?: string | null
          rating?: number | null
          social_media?: Json | null
          specializations?: string[] | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          agency_name?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          phone?: string
          profile_image_url?: string | null
          rating?: number | null
          social_media?: Json | null
          specializations?: string[] | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          product_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
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
      ride_matching_requests: {
        Row: {
          created_at: string | null
          distance_km: number | null
          driver_id: string
          estimated_time_minutes: number | null
          expires_at: string
          id: string
          responded_at: string | null
          ride_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          driver_id: string
          estimated_time_minutes?: number | null
          expires_at: string
          id?: string
          responded_at?: string | null
          ride_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string
          estimated_time_minutes?: number | null
          expires_at?: string
          id?: string
          responded_at?: string | null
          ride_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_matching_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_matching_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          created_at: string | null
          driver_id: string
          expires_at: string
          id: string
          ride_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          expires_at: string
          id?: string
          ride_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          expires_at?: string
          id?: string
          ride_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          accepted_at: string | null
          actual_fare: number | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          destination_address: string
          destination_location: unknown
          distance_km: number | null
          driver_id: string | null
          duration_minutes: number | null
          estimated_fare: number | null
          id: string
          pickup_address: string
          pickup_location: unknown
          rating: number | null
          requested_at: string | null
          review: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["ride_status"] | null
          updated_at: string | null
          user_id: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          accepted_at?: string | null
          actual_fare?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          destination_address: string
          destination_location: unknown
          distance_km?: number | null
          driver_id?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          id?: string
          pickup_address: string
          pickup_location: unknown
          rating?: number | null
          requested_at?: string | null
          review?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
          updated_at?: string | null
          user_id: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          accepted_at?: string | null
          actual_fare?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          destination_address?: string
          destination_location?: unknown
          distance_km?: number | null
          driver_id?: string | null
          duration_minutes?: number | null
          estimated_fare?: number | null
          id?: string
          pickup_address?: string
          pickup_location?: unknown
          rating?: number | null
          requested_at?: string | null
          review?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
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
          booking_address: string | null
          booking_date: string
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          provider_id: string | null
          service_category_id: string | null
          status: Database["public"]["Enums"]["service_booking_status"] | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          booking_address?: string | null
          booking_date: string
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          provider_id?: string | null
          service_category_id?: string | null
          status?: Database["public"]["Enums"]["service_booking_status"] | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_address?: string | null
          booking_date?: string
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          provider_id?: string | null
          service_category_id?: string | null
          status?: Database["public"]["Enums"]["service_booking_status"] | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
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
      service_provider_profiles: {
        Row: {
          business_description: string | null
          business_name: string | null
          created_at: string | null
          documents: Json | null
          email: string | null
          id: string
          is_active: boolean | null
          location_address: string | null
          location_coordinates: unknown | null
          phone_number: string | null
          provider_type: string
          updated_at: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          business_description?: string | null
          business_name?: string | null
          created_at?: string | null
          documents?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location_address?: string | null
          location_coordinates?: unknown | null
          phone_number?: string | null
          provider_type: string
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          business_description?: string | null
          business_name?: string | null
          created_at?: string | null
          documents?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location_address?: string | null
          location_coordinates?: unknown | null
          phone_number?: string | null
          provider_type?: string
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      surge_pricing: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          end_time: string | null
          id: string
          is_active: boolean | null
          location_bounds: Json
          location_name: string
          start_time: string | null
          surge_multiplier: number
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          location_bounds: Json
          location_name: string
          start_time?: string | null
          surge_multiplier?: number
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          location_bounds?: Json
          location_name?: string
          start_time?: string | null
          surge_multiplier?: number
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          payment_data: Json | null
          payment_method: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          payment_data?: Json | null
          payment_method: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          payment_data?: Json | null
          payment_method?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
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
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_to_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_applications: {
        Row: {
          admin_notes: string | null
          bank_details: Json | null
          business_address: string
          business_description: string
          business_email: string
          business_license: string | null
          business_name: string
          business_phone: string
          documents: Json | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          service_type: string | null
          status: string | null
          submitted_at: string
          tax_id: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          bank_details?: Json | null
          business_address: string
          business_description: string
          business_email: string
          business_license?: string | null
          business_name: string
          business_phone: string
          documents?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_type?: string | null
          status?: string | null
          submitted_at?: string
          tax_id?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          bank_details?: Json | null
          business_address?: string
          business_description?: string
          business_email?: string
          business_license?: string | null
          business_name?: string
          business_phone?: string
          documents?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_type?: string | null
          status?: string | null
          submitted_at?: string
          tax_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_coupon_requests: {
        Row: {
          admin_notes: string | null
          coupon_type: string
          created_at: string
          discount_value: number
          generated_coupon_id: string | null
          id: string
          minimum_order_amount: number | null
          requested_by: string
          requested_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          usage_limit: number | null
          vendor_id: string
        }
        Insert: {
          admin_notes?: string | null
          coupon_type?: string
          created_at?: string
          discount_value: number
          generated_coupon_id?: string | null
          id?: string
          minimum_order_amount?: number | null
          requested_by: string
          requested_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          usage_limit?: number | null
          vendor_id: string
        }
        Update: {
          admin_notes?: string | null
          coupon_type?: string
          created_at?: string
          discount_value?: number
          generated_coupon_id?: string | null
          id?: string
          minimum_order_amount?: number | null
          requested_by?: string
          requested_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          usage_limit?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_coupon_requests_generated_coupon_id_fkey"
            columns: ["generated_coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_coupon_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          banner_url: string | null
          business_address: string | null
          business_description: string | null
          business_email: string | null
          business_license: string | null
          business_name: string
          business_phone: string | null
          commission_rate: number | null
          created_at: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          social_media: Json | null
          updated_at: string
          user_id: string
          verification_status: string | null
          website_url: string | null
        }
        Insert: {
          banner_url?: string | null
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_license?: string | null
          business_name: string
          business_phone?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          website_url?: string | null
        }
        Update: {
          banner_url?: string | null
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_license?: string | null
          business_name?: string
          business_phone?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_medical_provider_application: {
        Args: { p_application_id: string }
        Returns: string
      }
      approve_vendor_application: {
        Args: { application_id: string }
        Returns: string
      }
      calculate_coupon_discount: {
        Args: {
          p_coupon_code: string
          p_order_amount: number
          p_user_id: string
          p_product_categories?: string[]
        }
        Returns: Json
      }
      expire_old_ride_requests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      find_nearby_drivers: {
        Args: {
          pickup_lat: number
          pickup_lng: number
          vehicle_type_param: Database["public"]["Enums"]["vehicle_type"]
          radius_km?: number
        }
        Returns: {
          driver_id: string
          distance_km: number
          estimated_pickup_minutes: number
        }[]
      }
      get_driver_analytics: {
        Args: { p_driver_id: string }
        Returns: Json
      }
      get_popular_routes: {
        Args: { limit_count: number }
        Returns: {
          from_address: string
          to_address: string
          ride_count: number
          avg_fare: number
          avg_duration_minutes: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      reject_medical_provider_application: {
        Args: { p_application_id: string; p_admin_notes: string }
        Returns: undefined
      }
      reject_vendor_application: {
        Args: { application_id: string; rejection_notes?: string }
        Returns: boolean
      }
      update_product_rating: {
        Args: { product_id: number; rating: number }
        Returns: undefined
      }
      upsert_recently_viewed: {
        Args: { p_user_id: string; p_product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      driver_status: "offline" | "available" | "busy"
      listing_type: "sale" | "rent"
      medical_facility_type:
        | "hospital"
        | "clinic"
        | "pharmacy"
        | "laboratory"
        | "Hospital"
        | "Clinic"
        | "Pharmacy"
        | "Laboratory"
      medical_provider_type:
        | "doctor"
        | "nurse"
        | "pharmacist"
        | "lab_technician"
        | "ambulance_driver"
      order_status_type:
        | "pending"
        | "confirmed"
        | "processing"
        | "packed"
        | "shipped"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "refunded"
      property_status: "available" | "sold" | "rented" | "pending"
      property_type: "house" | "apartment" | "land" | "commercial" | "office"
      ride_status:
        | "requested"
        | "accepted"
        | "in_progress"
        | "completed"
        | "cancelled"
      service_booking_status:
        | "pending"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rejected"
      user_role:
        | "admin"
        | "customer"
        | "vendor"
        | "driver"
        | "property_owner"
        | "rider"
      vehicle_type: "taxi" | "motorbike"
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
      driver_status: ["offline", "available", "busy"],
      listing_type: ["sale", "rent"],
      medical_facility_type: [
        "hospital",
        "clinic",
        "pharmacy",
        "laboratory",
        "Hospital",
        "Clinic",
        "Pharmacy",
        "Laboratory",
      ],
      medical_provider_type: [
        "doctor",
        "nurse",
        "pharmacist",
        "lab_technician",
        "ambulance_driver",
      ],
      order_status_type: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      property_status: ["available", "sold", "rented", "pending"],
      property_type: ["house", "apartment", "land", "commercial", "office"],
      ride_status: [
        "requested",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      service_booking_status: [
        "pending",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      user_role: [
        "admin",
        "customer",
        "vendor",
        "driver",
        "property_owner",
        "rider",
      ],
      vehicle_type: ["taxi", "motorbike"],
    },
  },
} as const
