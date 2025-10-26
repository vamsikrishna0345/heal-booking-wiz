import { Button } from "@/components/ui/button";
import { Stethoscope, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">HealthCare</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/appointments')}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              My Appointments
            </Button>
          )}
          <Button
            onClick={handleAuthClick}
            variant={user ? "ghost" : "default"}
            size="sm"
            className="gap-2"
          >
            {user ? (
              <>
                <LogOut className="w-4 h-4" />
                Sign Out
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                Sign In
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
