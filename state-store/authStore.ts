import { getSupabaseClient } from "@/lib/supabase/client";
import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { VendorRow } from "@/types/vendor";
import { toast } from "sonner";

type SignupDetails = {
  email: string;
  password: string;
};

type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

type AuthStore = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  vendorData: VendorRow | null;
  supabaseError: string | null;
  login: (formData: SignupDetails) => Promise<AuthResult>;
  signUp: (formData: SignupDetails) => Promise<AuthResult>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  initializeAuth: () => Promise<void>;
};

const errorMap = {
  PGRST302: "Invalid credentials. Please check your email or password.",
  PGRST301: "Check email or password and try again.",
  PGRST303: "Your session has expired. Please log in again.",
  PGRST304: "Permission denied. You do not have access to this resource.",
  PGRST305: "Please wait and try again later.",
  PGRST307: "Invalid email format.",
  PGRST308: "Password is too weak. Please use a stronger password.",
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  vendorData: null,
  supabaseError: null,

  initializeAuth: async () => {
    const supabase = getSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      set({ user: null, vendorData: null });
      return;
    }

    const { data: vendorData } = await supabase
      .from("vendors")
      .select("*")
      .eq("vendor_id", session.user.id)
      .single();

    set({ user: session.user, session, vendorData: vendorData ?? null });
  },

  signUp: async (formData: SignupDetails) => {
    set({ loading: true });

    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        const friendlyMessage =
          error.message || "Something went wrong. Please try again.";
        set({ supabaseError: friendlyMessage });
        return { success: false, error: friendlyMessage };
      }

      if (!data.user) {
        const message = "Signup failed. Please try again.";
        set({ supabaseError: message });
        return { success: false, error: message };
      }

      set({ user: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error occurred. Please try again.";
      set({ supabaseError: message });
      return { success: false, error: message };
    } finally {
      set({ loading: false });
    }
  },

  login: async (formData: SignupDetails) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { success: false, error: "Supabase configuration missing" };
    }
    try {
      set({ loading: true });
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        const friendlyMessage =
          errorMap?.[error.code as keyof typeof errorMap] ||
          error.message ||
          "Invalid email or password.";

        set({ supabaseError: friendlyMessage });
        return { success: false, error: friendlyMessage };
      }

      if (!data.user) {
        const message = "Login failed. Please try again.";
        set({ supabaseError: message });
        return { success: false, error: message };
      }

      set({ user: data.user, session: data.session });

      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("vendor_id", data.user.id)
        .single();

      if (vendorError && vendorError.code !== "PGRST116") {
        toast.error(`Error fetching vendor data: ${vendorError.message}`);
      }

      set({ vendorData: vendorData ?? null });
      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error occurred. Please try again.";
      set({ supabaseError: message });
      return { success: false, error: message };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      // clear all auth state from store
      set({
        user: null,
        session: null,
        vendorData: null,
        supabaseError: null,
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      return { success: false, error: message };
    }
  },
}));

export default useAuthStore;
