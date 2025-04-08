import { Switch, Route, RouteComponentProps } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import GamesPage from "@/pages/games/index";
import LettersGame from "@/pages/games/letters";
import WordsGame from "@/pages/games/words";
import StoriesGame from "@/pages/games/stories";
import SubscriptionPage from "@/pages/subscription";
import ProfilePage from "@/pages/profile";
import AuthPage from "@/pages/auth-page";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import VerificationSuccessPage from "@/pages/verification-success";
import { ToastContextProvider } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { FC } from "react";

function Router() {
  // Type assertions to ensure components are compatible with wouter's RouteComponentProps
  const HomeComponent = Home as FC<RouteComponentProps>;
  const GamesPageComponent = GamesPage as FC<RouteComponentProps>;
  const SubscriptionPageComponent = SubscriptionPage as FC<RouteComponentProps>;
  const ProfilePageComponent = ProfilePage as FC<RouteComponentProps>;
  const LettersGameComponent = LettersGame as FC<RouteComponentProps>;
  const WordsGameComponent = WordsGame as FC<RouteComponentProps>;
  const StoriesGameComponent = StoriesGame as FC<RouteComponentProps>;
  const AuthPageComponent = AuthPage as FC<RouteComponentProps>;
  const ForgotPasswordPageComponent = ForgotPasswordPage as FC<RouteComponentProps>;
  const ResetPasswordPageComponent = ResetPasswordPage as FC<RouteComponentProps>;
  const VerificationSuccessPageComponent = VerificationSuccessPage as FC<RouteComponentProps>;
  const NotFoundComponent = NotFound as FC<RouteComponentProps>;
  
  return (
    <Switch>
      {/* Auth Pages - These should be placed before protected routes */}
      <Route path="/auth" component={AuthPageComponent} />
      <Route path="/forgot-password" component={ForgotPasswordPageComponent} />
      <Route path="/reset-password" component={ResetPasswordPageComponent} />
      <Route path="/verification-success" component={VerificationSuccessPageComponent} />
      
      {/* Main Pages */}
      <ProtectedRoute path="/" component={HomeComponent} />
      <ProtectedRoute path="/games" component={GamesPageComponent} />
      <ProtectedRoute path="/subscription" component={SubscriptionPageComponent} />
      <ProtectedRoute path="/profile" component={ProfilePageComponent} />
      
      {/* Game Pages */}
      <ProtectedRoute path="/games/letters" component={LettersGameComponent} />
      <ProtectedRoute path="/games/words" component={WordsGameComponent} />
      <ProtectedRoute path="/games/stories" component={StoriesGameComponent} />
      
      {/* Fallback to 404 */}
      <Route component={NotFoundComponent} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ToastContextProvider>
    </QueryClientProvider>
  );
}

export default App;
