import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail } from "lucide-react";

interface EmailVerificationButtonProps {
  className?: string;
}

export function EmailVerificationButton({ className = "" }: EmailVerificationButtonProps) {
  const { user, requestVerificationMutation } = useAuth();

  if (!user) return null;

  // If user is already verified, don't show the button
  if (user.isVerified) return null;

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      onClick={() => requestVerificationMutation.mutate()}
      disabled={requestVerificationMutation.isPending}
    >
      {requestVerificationMutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري إرسال البريد...
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          تحقق من البريد الإلكتروني
        </>
      )}
    </Button>
  );
}