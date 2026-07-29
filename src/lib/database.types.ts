export type AppointmentStatus =
  | "na_cekanju"
  | "potvrdjeno"
  | "zavrseno"
  | "otkazano";

export type GalleryPairLabel = "prije" | "poslije";

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          price: number;
          duration_minutes: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          duration_minutes: number;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          duration_minutes?: number;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      staff: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          bio: string | null;
          photo_url: string | null;
          instagram_url: string | null;
          working_hours: Record<string, { start: string; end: string } | null>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          instagram_url?: string | null;
          working_hours?: Record<string, { start: string; end: string } | null>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          instagram_url?: string | null;
          working_hours?: Record<string, { start: string; end: string } | null>;
          created_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          customer_id: string;
          service_id: string;
          staff_id: string | null;
          appointment_date: string;
          appointment_time: string;
          status: AppointmentStatus;
          seen: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          service_id: string;
          staff_id?: string | null;
          appointment_date: string;
          appointment_time: string;
          status?: AppointmentStatus;
          seen?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          service_id?: string;
          staff_id?: string | null;
          appointment_date?: string;
          appointment_time?: string;
          status?: AppointmentStatus;
          seen?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          author_name: string;
          rating: number;
          body: string;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          rating: number;
          body: string;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          rating?: number;
          body?: string;
          approved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          contact: string;
          body: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          body: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          body?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          url: string;
          category: string;
          pair_key: string | null;
          pair_label: GalleryPairLabel | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          category?: string;
          pair_key?: string | null;
          pair_label?: GalleryPairLabel | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          category?: string;
          pair_key?: string | null;
          pair_label?: GalleryPairLabel | null;
          created_at?: string;
        };
        Relationships: [];
      };
      hairstyle_looks: {
        Row: {
          id: string;
          title: string;
          front_url: string | null;
          back_url: string | null;
          side_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          front_url?: string | null;
          back_url?: string | null;
          side_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          front_url?: string | null;
          back_url?: string | null;
          side_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
