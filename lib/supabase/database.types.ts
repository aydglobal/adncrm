export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          city: string | null;
          phone: string | null;
          email: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          city?: string | null;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          city?: string | null;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agency_memberships: {
        Row: {
          id: string;
          agency_id: string | null;
          profile_id: string;
          role: Database["public"]["Enums"]["app_role"];
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          agency_id?: string | null;
          profile_id: string;
          role: Database["public"]["Enums"]["app_role"];
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string | null;
          profile_id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          is_default?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agency_memberships_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          agency_id: string;
          customer_type: string;
          full_name: string;
          company_name: string | null;
          national_id: string | null;
          tax_number: string | null;
          phone: string | null;
          email: string | null;
          city: string | null;
          notes: string | null;
          assigned_membership_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          customer_type?: string;
          full_name: string;
          company_name?: string | null;
          national_id?: string | null;
          tax_number?: string | null;
          phone?: string | null;
          email?: string | null;
          city?: string | null;
          notes?: string | null;
          assigned_membership_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          customer_type?: string;
          full_name?: string;
          company_name?: string | null;
          national_id?: string | null;
          tax_number?: string | null;
          phone?: string | null;
          email?: string | null;
          city?: string | null;
          notes?: string | null;
          assigned_membership_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          agency_id: string;
          customer_id: string | null;
          policy_id: string | null;
          uploaded_by: string | null;
          title: string;
          document_type: Database["public"]["Enums"]["document_type"];
          file_url: string;
          file_size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          customer_id?: string | null;
          policy_id?: string | null;
          uploaded_by?: string | null;
          title: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          file_url: string;
          file_size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          customer_id?: string | null;
          policy_id?: string | null;
          uploaded_by?: string | null;
          title?: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          file_url?: string;
          file_size_bytes?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          agency_id: string;
          customer_id: string | null;
          full_name: string;
          phone: string | null;
          email: string | null;
          source: string;
          campaign_name: string | null;
          product_interest: string | null;
          quality_score: number;
          status: Database["public"]["Enums"]["lead_status"];
          assigned_membership_id: string | null;
          last_action_note: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          customer_id?: string | null;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          source: string;
          campaign_name?: string | null;
          product_interest?: string | null;
          quality_score?: number;
          status?: Database["public"]["Enums"]["lead_status"];
          assigned_membership_id?: string | null;
          last_action_note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          customer_id?: string | null;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          source?: string;
          campaign_name?: string | null;
          product_interest?: string | null;
          quality_score?: number;
          status?: Database["public"]["Enums"]["lead_status"];
          assigned_membership_id?: string | null;
          last_action_note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          agency_id: string;
          customer_id: string | null;
          policy_id: string | null;
          author_profile_id: string | null;
          topic: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          customer_id?: string | null;
          policy_id?: string | null;
          author_profile_id?: string | null;
          topic: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          customer_id?: string | null;
          policy_id?: string | null;
          author_profile_id?: string | null;
          topic?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      policies: {
        Row: {
          id: string;
          agency_id: string;
          customer_id: string;
          branch: string;
          insurer_name: string;
          policy_number: string | null;
          status: Database["public"]["Enums"]["policy_status"];
          start_date: string | null;
          end_date: string | null;
          premium_amount: number;
          renewal_reminder_at: string | null;
          pdf_url: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          customer_id: string;
          branch: string;
          insurer_name: string;
          policy_number?: string | null;
          status?: Database["public"]["Enums"]["policy_status"];
          start_date?: string | null;
          end_date?: string | null;
          premium_amount?: number;
          renewal_reminder_at?: string | null;
          pdf_url?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          customer_id?: string;
          branch?: string;
          insurer_name?: string;
          policy_number?: string | null;
          status?: Database["public"]["Enums"]["policy_status"];
          start_date?: string | null;
          end_date?: string | null;
          premium_amount?: number;
          renewal_reminder_at?: string | null;
          pdf_url?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          agency_id: string;
          customer_id: string | null;
          policy_id: string | null;
          title: string;
          description: string | null;
          status: Database["public"]["Enums"]["task_status"];
          due_at: string | null;
          assigned_membership_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          customer_id?: string | null;
          policy_id?: string | null;
          title: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          due_at?: string | null;
          assigned_membership_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          customer_id?: string | null;
          policy_id?: string | null;
          title?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          due_at?: string | null;
          assigned_membership_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "super_admin" | "agency_admin" | "sales" | "operations" | "marketing";
      document_type: "quote_pdf" | "policy_pdf" | "claim_document" | "payment_receipt" | "other";
      lead_status: "new" | "contacted" | "quoted" | "won" | "lost";
      policy_status: "draft" | "quoted" | "active" | "renewal_due" | "expired" | "cancelled";
      task_status: "todo" | "in_progress" | "waiting" | "done" | "cancelled";
    };
    CompositeTypes: Record<string, never>;
  };
};
