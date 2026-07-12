import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Laptop, Smartphone, Monitor, ShieldAlert } from "lucide-react";

type SessionInfo = {
  id: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
  ip: string;
  device_desc?: string;
  os?: string;
  browser?: string;
};

export function SessionManager() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      // NOTE: supabase.auth.getSessions() lists all sessions for the user if the user is authenticated
      // For a proper implementation, this requires the Supabase API to support fetching active sessions, 
      // or we must track sessions in a custom `user_sessions` table if not natively supported by the JS client.
      // Currently, supabase-js does not expose a list of all active sessions natively in v2 client-side, 
      // only the current session, but we can simulate this or implement it if a custom table exists.
      
      // Assuming we have a custom RPC or endpoint for this in EcoSphere:
      // const { data, error } = await supabase.rpc('get_active_sessions');
      
      // Mocking for the UI demonstration:
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessions([
          {
            id: session.access_token.substring(0, 10),
            is_current: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ip: "192.168.1.1",
            device_desc: "MacBook Pro",
            os: "macOS",
            browser: "Chrome",
          },
          {
            id: "mock-session-2",
            is_current: false,
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            ip: "10.0.0.5",
            device_desc: "iPhone 13",
            os: "iOS",
            browser: "Safari",
          }
        ]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(error); // Just to use the state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string, isCurrent: boolean) => {
    if (isCurrent) {
      await supabase.auth.signOut();
      return;
    }
    
    // In a real Supabase setup, revoking a specific session requires Admin API or custom RPC
    // Example: await supabase.rpc('revoke_session', { session_id: sessionId });
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const handleRevokeAllOther = async () => {
    // Revoke all other sessions. Usually implemented via a custom RPC on the backend
    setSessions(sessions.filter(s => s.is_current));
  };

  const getDeviceIcon = (os?: string) => {
    if (!os) return <Monitor className="h-5 w-5 text-slate-500" />;
    const lowercaseOS = os.toLowerCase();
    if (lowercaseOS.includes('ios') || lowercaseOS.includes('android')) {
      return <Smartphone className="h-5 w-5 text-slate-500" />;
    }
    return <Laptop className="h-5 w-5 text-slate-500" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Active Sessions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and revoke your active sessions across devices.</p>
        </div>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleRevokeAllOther}>
          <ShieldAlert className="mr-2 h-4 w-4" /> Sign out all other sessions
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-md animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-md">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  {getDeviceIcon(session.os)}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {session.device_desc || session.os || "Unknown Device"}
                      {session.browser ? ` · ${session.browser}` : ''}
                    </p>
                    {session.is_current && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    IP: {session.ip} · Last active: {new Date(session.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-slate-500 hover:text-red-600"
                onClick={() => handleRevokeSession(session.id, session.is_current)}
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
