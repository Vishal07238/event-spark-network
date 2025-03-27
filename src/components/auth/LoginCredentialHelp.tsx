
import { useLogin } from "./LoginContext";

export default function LoginCredentialHelp() {
  const { activeTab } = useLogin();

  return (
    <div className="mt-6 text-center text-sm">
      {activeTab === "volunteer" && (
        <div className="text-center text-sm text-muted-foreground">
          <span>For demo, use:</span>
          <div className="flex flex-col sm:flex-row text-xs gap-2 justify-center mt-1">
            <span className="bg-muted px-2 py-1 rounded">volunteer@example.com</span>
          </div>
          <span className="block mt-1">Name: John Doe, Mobile: 1234567890</span>
        </div>
      )}
      
      {activeTab === "organizer" && (
        <div className="text-center text-sm text-muted-foreground">
          <span>For demo, use:</span>
          <div className="flex flex-col sm:flex-row text-xs gap-2 justify-center mt-1">
            <span className="bg-muted px-2 py-1 rounded">organizer@example.com</span>
          </div>
          <span className="block mt-1">Password: password123</span>
        </div>
      )}
      
      {activeTab === "admin" && (
        <div className="text-center text-sm text-muted-foreground">
          <span>For demo, use:</span>
          <div className="flex flex-col sm:flex-row text-xs gap-2 justify-center mt-1">
            <span className="bg-muted px-2 py-1 rounded">admin@example.com</span>
          </div>
          <span className="block mt-1">Password: admin123</span>
        </div>
      )}
    </div>
  );
}
