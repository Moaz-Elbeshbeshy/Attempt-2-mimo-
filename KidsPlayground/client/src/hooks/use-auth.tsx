import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, insertUserSchema } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Extended schema with confirmPassword field for registration
export const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور وتأكيدها يجب أن تتطابقا",
  path: ["confirmPassword"],
});

export type RegistrationData = z.infer<typeof userRegistrationSchema>;
export type LoginData = Pick<RegistrationData, "username" | "password">;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegistrationData>;
  requestVerificationMutation: UseMutationResult<void, Error, void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Query to fetch current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل تسجيل الدخول");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً، ${user.fullName || user.username}!`,
      });
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegistrationData) => {
      // Remove confirmPassword field before sending to the API
      const { confirmPassword, ...userDataToSend } = userData;
      
      const res = await apiRequest("POST", "/api/register", userDataToSend);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل التسجيل");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      toast({
        title: "تم التسجيل بنجاح",
        description: `مرحباً، ${user.fullName || user.username}!`,
      });
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "فشل التسجيل",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل تسجيل الخروج");
      }
    },
    onSuccess: () => {
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
      queryClient.setQueryData(["/api/user"], null);
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Request email verification mutation
  const requestVerificationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/request-verification");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل طلب التحقق من البريد الإلكتروني");
      }
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال بريد التحقق",
        description: "تم إرسال بريد التحقق إلى عنوان بريدك الإلكتروني. يرجى التحقق من بريدك الوارد.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل إرسال بريد التحقق",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        requestVerificationMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}