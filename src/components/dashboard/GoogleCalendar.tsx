import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, RefreshCw, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, isSameDay, isSameMonth, parseISO } from "date-fns";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  htmlLink?: string;
}

interface GoogleProfile {
  name: string;
  email: string;
  picture?: string;
}

type ViewMode = "day" | "week" | "month";

const STORAGE_KEY = "google_calendar_tokens";

// Google Cloud Console requires this exact redirect URI
const REDIRECT_URI = "https://datadungeon.lovable.app/";

export function GoogleCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<GoogleProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
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
      console.log("OAuth: Initiating Google connection with redirect URI:", REDIRECT_URI);
      
      const { data, error } = await supabase.functions.invoke("google-calendar", {
        body: { action: "getAuthUrl", redirectUri: REDIRECT_URI },
      });
      
      if (error) {
        console.error("OAuth: Edge function error:", error);
        throw error;
      }
      
      if (!data?.authUrl) {
        console.error("OAuth: No auth URL returned from edge function", data);
        throw new Error("No authentication URL received");
      }
      
      console.log("OAuth: Redirecting to Google login");
      window.location.href = data.authUrl;
    } catch (error: any) {
      console.error("OAuth: Connect error:", error);
      toast({ 
        title: "Connection Failed", 
        description: error.message || "Could not initiate Google login. Check console for details.", 
        variant: "destructive" 
      });
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    setIsLoading(true);
    console.log("OAuth: Processing Google authorization callback");
    
    try {
      console.log("OAuth: Exchanging code with redirect URI:", REDIRECT_URI);
      
      const { data, error } = await supabase.functions.invoke("google-calendar", {
        body: { action: "exchangeCode", code, redirectUri: REDIRECT_URI },
      });
      
      if (error) {
        console.error("OAuth: Edge function error during code exchange:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("OAuth: Token exchange failed:", data.error);
        throw new Error(data.error);
      }
      
      if (!data.accessToken) {
        console.error("OAuth: No access token in response:", data);
        throw new Error("No access token received from Google");
      }

      console.log("OAuth: Successfully obtained tokens, storing...");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      }));
      
      setAccessToken(data.accessToken);
      setIsConnected(true);
      toast({ title: "Connected!", description: "Your Google Calendar is now linked" });
    } catch (error: any) {
      console.error("OAuth: Auth callback error:", error);
      toast({ 
        title: "Authentication Failed", 
        description: error.message || "Could not complete Google login. Check console for details.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("google-calendar", {
        body: { action: "getProfile", accessToken },
      });
      if (error) throw error;
      if (data.profile) setProfile(data.profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("google-calendar", {
        body: { action: "getEvents", accessToken },
      });
      if (error) throw error;
      if (data.error) {
        if (data.status === 401) {
          handleDisconnect();
          toast({ title: "Session Expired", description: "Please reconnect your Google Calendar", variant: "destructive" });
          return;
        }
        throw new Error(data.error);
      }
      setEvents(data.events || []);
    } catch (error: any) {
      console.error("Fetch events error:", error);
      toast({ title: "Failed to Load Events", description: error.message || "Could not fetch calendar events", variant: "destructive" });
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
    toast({ title: "Disconnected", description: "Google Calendar has been unlinked" });
  };

  const navigatePrevious = () => {
    setCurrentDate(prev => {
      if (viewMode === "day") return subDays(prev, 1);
      if (viewMode === "week") return subWeeks(prev, 1);
      return subMonths(prev, 1);
    });
  };

  const navigateNext = () => {
    setCurrentDate(prev => {
      if (viewMode === "day") return addDays(prev, 1);
      if (viewMode === "week") return addWeeks(prev, 1);
      return addMonths(prev, 1);
    });
  };

  const goToToday = () => setCurrentDate(new Date());

  // Get visible dates based on view mode
  const visibleDates = useMemo(() => {
    if (viewMode === "day") {
      return [currentDate];
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const weekStart = startOfWeek(start, { weekStartsOn: 1 });
      const days: Date[] = [];
      let day = weekStart;
      while (day <= end || days.length % 7 !== 0) {
        days.push(day);
        day = addDays(day, 1);
        if (days.length > 42) break;
      }
      return days;
    }
  }, [currentDate, viewMode]);

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDateTime = event.start.dateTime || event.start.date;
      if (!eventDateTime) return false;
      const eventDate = parseISO(eventDateTime);
      return isSameDay(eventDate, date);
    });
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.start.date) return "All Day";
    if (event.start.dateTime) return format(parseISO(event.start.dateTime), "h:mm a");
    return "";
  };

  const getHeaderText = () => {
    if (viewMode === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  };

  if (!isConnected) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-info" />
          <h3 className="text-lg font-semibold text-foreground">Google Calendar</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-lg bg-info/20 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-info" />
          </div>
          <p className="text-muted-foreground mb-4 text-center">
            Connect your Google Calendar to see your appointments
          </p>
          <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
            Connect Google Calendar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-card border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-info" />
          <h3 className="text-lg font-semibold text-foreground">Google Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={fetchEvents} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDisconnect} className="text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {profile && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-secondary rounded-lg">
          {profile.picture && (
            <img src={profile.picture} alt={profile.name} className="w-6 h-6 rounded-full" />
          )}
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate">
            {profile.name} ({profile.email})
          </span>
        </div>
      )}

      {/* View Toggle & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="bg-muted">
            <TabsTrigger value="day" className="text-xs sm:text-sm">Day</TabsTrigger>
            <TabsTrigger value="week" className="text-xs sm:text-sm">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs sm:text-sm">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">{getHeaderText()}</span>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading && events.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Day View */}
          {viewMode === "day" && (
            <div className="max-h-[400px] overflow-y-auto">
              {getEventsForDay(currentDate).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events today</p>
              ) : (
                <div className="space-y-2">
                  {getEventsForDay(currentDate).map((event) => (
                    <EventCard key={event.id} event={event} formatTime={formatEventTime} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Week View */}
          {viewMode === "week" && (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[600px]">
                {visibleDates.map((date) => (
                  <div key={date.toISOString()} className="min-h-[200px]">
                    <div className={`text-center p-2 rounded-t-lg ${isSameDay(date, new Date()) ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-xs font-medium">{format(date, "EEE")}</p>
                      <p className="text-lg font-bold">{format(date, "d")}</p>
                    </div>
                    <div className="p-1 space-y-1 bg-secondary/30 rounded-b-lg min-h-[150px]">
                      {getEventsForDay(date).slice(0, 3).map((event) => (
                        <a
                          key={event.id}
                          href={event.htmlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-1.5 bg-primary/20 rounded text-xs hover:bg-primary/30 transition-colors"
                        >
                          <p className="font-medium text-foreground truncate">{event.summary}</p>
                          <p className="text-muted-foreground">{formatEventTime(event)}</p>
                        </a>
                      ))}
                      {getEventsForDay(date).length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{getEventsForDay(date).length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[500px]">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                {visibleDates.map((date) => {
                  const dayEvents = getEventsForDay(date);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isToday = isSameDay(date, new Date());
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={`min-h-[80px] p-1 rounded-lg border ${
                        isToday ? 'border-primary bg-primary/10' : 
                        isCurrentMonth ? 'border-border bg-secondary/20' : 
                        'border-transparent bg-muted/30'
                      }`}
                    >
                      <p className={`text-xs font-medium mb-1 ${
                        isToday ? 'text-primary' : 
                        isCurrentMonth ? 'text-foreground' : 
                        'text-muted-foreground'
                      }`}>
                        {format(date, "d")}
                      </p>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <a
                            key={event.id}
                            href={event.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-1 py-0.5 bg-primary/20 rounded text-[10px] truncate hover:bg-primary/30 transition-colors"
                          >
                            {event.summary}
                          </a>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function EventCard({ event, formatTime }: { event: CalendarEvent; formatTime: (event: CalendarEvent) => string }) {
  return (
    <a
      href={event.htmlLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
    >
      <p className="font-medium text-foreground text-sm mb-1">{event.summary}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatTime(event)}
        </span>
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.location}
          </span>
        )}
      </div>
    </a>
  );
}
