import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirectUri, accessToken } = body;

    console.log("Google Calendar: Action requested:", action);
    console.log("Google Calendar: Redirect URI provided:", redirectUri);

    // Validate environment variables
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Google Calendar: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
      return new Response(JSON.stringify({ 
        error: "Server configuration error: Google credentials not configured" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate auth URL
    if (action === "getAuthUrl") {
      const redirect = redirectUri || "https://datadungeon.lovable.app/";
      const scope = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirect)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&prompt=consent`;

      console.log("Google Calendar: Generated auth URL with redirect:", redirect);
      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Exchange code for tokens
    if (action === "exchangeCode") {
      if (!code) {
        console.error("Google Calendar: No authorization code provided");
        return new Response(JSON.stringify({ error: "Authorization code is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!redirectUri) {
        console.error("Google Calendar: No redirect URI provided for code exchange");
        return new Response(JSON.stringify({ error: "Redirect URI is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Google Calendar: Exchanging code for tokens with redirect URI:", redirectUri);
      
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID!,
          client_secret: CLIENT_SECRET!,
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();
      
      if (tokens.error) {
        console.error("Google Calendar: Token exchange error:", JSON.stringify(tokens));
        console.error("Google Calendar: This usually means the redirect_uri doesn't match what's registered in Google Cloud Console");
        console.error("Google Calendar: Redirect URI used:", redirectUri);
        return new Response(JSON.stringify({ 
          error: tokens.error_description || tokens.error,
          hint: "Ensure the redirect URI matches exactly what's registered in Google Cloud Console"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Google Calendar: Token exchange successful");
      return new Response(JSON.stringify({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expires_in,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refresh access token
    if (action === "refreshToken") {
      const { refreshToken } = body;
      
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID!,
          client_secret: CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const tokens = await tokenResponse.json();
      
      if (tokens.error) {
        return new Response(JSON.stringify({ error: tokens.error_description || tokens.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        accessToken: tokens.access_token,
        expiresIn: tokens.expires_in,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch calendar events
    if (action === "getEvents") {
      if (!accessToken) {
        return new Response(JSON.stringify({ error: "Access token required" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get events for the next 30 days
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${now.toISOString()}` +
        `&timeMax=${nextMonth.toISOString()}` +
        `&orderBy=startTime` +
        `&singleEvents=true` +
        `&maxResults=100`;

      const eventsResponse = await fetch(eventsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!eventsResponse.ok) {
        const errorText = await eventsResponse.text();
        console.error("Google Calendar API error:", eventsResponse.status, errorText);
        return new Response(JSON.stringify({ 
          error: "Failed to fetch calendar events",
          status: eventsResponse.status 
        }), {
          status: eventsResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const eventsData = await eventsResponse.json();
      
      return new Response(JSON.stringify({ events: eventsData.items || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile
    if (action === "getProfile") {
      if (!accessToken) {
        return new Response(JSON.stringify({ error: "Access token required" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
          status: profileResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const profileData = await profileResponse.json();
      
      return new Response(JSON.stringify({ 
        profile: {
          name: profileData.name,
          email: profileData.email,
          picture: profileData.picture,
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Google Calendar error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
