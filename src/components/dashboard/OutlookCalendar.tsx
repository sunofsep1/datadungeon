import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, RefreshCw, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: { displayName: string };
  isAllDay?: boolean;
  webLink?: string;
}

interface MicrosoftProfile {
  displayName: string;
  mail: string;
}

const STORAGE_KEY = "outlook_tokens";

export function OutlookCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<MicrosoftProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for stored tokens on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const tokens = JSON.parse(stored);
        if (tokens.accessToken) {
          setAccessToken(tokens.accessToken);
          setIsConnected(true);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    if (code && !isConnected) {
      handleAuthCallback(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isConnected]);

  // Fetch events when connected
  useEffect(() => {
    if (accessToken && isConnected) {
      fetchEvents();
      fetchProfile();
    }
  }, [accessToken, isConnected]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const redirectUri = window.location.origin + "/";
      
      const { data, error } = await supabase.functions.invoke("microsoft-calendar", {
        body: { action: "getAuthUrl", redirectUri },
      });

      if (error) throw error;
      
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Connect error:", error);
      toast({
        title: "Connection Failed",
        description: "Could not initiate Microsoft login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const redirectUri = window.location.origin + "/";
      
      const { data, error } = await supabase.functions.invoke("microsoft-calendar", {
        body: { action: "exchangeCode", code, redirectUri },
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Store tokens
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      }));

      setAccessToken(data.accessToken);
      setIsConnected(true);
      
      toast({
        title: "Connected!",
        description: "Your Outlook calendar is now linked",
      });
    } catch (error: any) {
      console.error("Auth callback error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not complete Microsoft login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("microsoft-calendar", {
        body: { action: "getProfile", accessToken },
      });

      if (error) throw error;
      
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("microsoft-calendar", {
        body: { action: "getEvents", accessToken },
      });

      if (error) throw error;
      
      if (data.error) {
        // Token might be expired
        if (data.status === 401) {
          handleDisconnect();
          toast({
            title: "Session Expired",
            description: "Please reconnect your Outlook calendar",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error);
      }

      setEvents(data.events || []);
    } catch (error: any) {
      console.error("Fetch events error:", error);
      toast({
        title: "Failed to Load Events",
        description: error.message || "Could not fetch calendar events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setIsConnected(false);
    setEvents([]);
    setProfile(null);
    toast({
      title: "Disconnected",
      description: "Outlook calendar has been unlinked",
    });
  };

  const formatEventTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-AU", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const formatEventDate = (dateTime: string) => {
    const date = new Date(dateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-AU", { 
      weekday: "short",
      month: "short", 
      day: "numeric" 
    });
  };

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = formatEventDate(event.start.dateTime);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  if (!isConnected) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-info" />
          <h3 className="text-lg font-semibold text-foreground">Outlook Calendar</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-lg bg-info/20 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-info" />
          </div>
          <p className="text-muted-foreground mb-4 text-center">
            Connect your Microsoft Outlook calendar to see your appointments
          </p>
          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            Connect Outlook
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-info" />
          <h3 className="text-lg font-semibold text-foreground">Outlook Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchEvents}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDisconnect}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {profile && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-secondary rounded-lg">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {profile.displayName} ({profile.mail})
          </span>
        </div>
      )}

      {isLoading && events.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No upcoming events in the next 7 days
        </p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {date}
              </p>
              <div className="space-y-2">
                {dateEvents.map((event) => (
                  <a
                    key={event.id}
                    href={event.webLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-foreground text-sm mb-1">
                      {event.subject}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.isAllDay 
                          ? "All Day" 
                          : `${formatEventTime(event.start.dateTime)} - ${formatEventTime(event.end.dateTime)}`
                        }
                      </span>
                      {event.location?.displayName && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location.displayName}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
