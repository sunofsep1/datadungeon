import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLIENT_ID = Deno.env.get("MICROSOFT_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("MICROSOFT_CLIENT_SECRET");
const REDIRECT_URI_BASE = Deno.env.get("SUPABASE_URL");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const { action, code, redirectUri, accessToken } = body;

    console.log("Microsoft Calendar: Action requested:", action);
    console.log("Microsoft Calendar: Redirect URI provided:", redirectUri);

    // Validate environment variables
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Microsoft Calendar: Missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET");
      return new Response(JSON.stringify({ 
        error: "Server configuration error: Microsoft credentials not configured" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate auth URL
    if (action === "getAuthUrl") {
      const redirect = redirectUri || "https://datadungeon.lovable.app/";
      const scope = "Calendars.Read User.Read offline_access";
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirect)}` +
        `&response_mode=query` +
        `&scope=${encodeURIComponent(scope)}` +
        `&prompt=consent`;

      console.log("Microsoft Calendar: Generated auth URL with redirect:", redirect);
      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Exchange code for tokens
    if (action === "exchangeCode") {
      if (!code) {
        console.error("Microsoft Calendar: No authorization code provided");
        return new Response(JSON.stringify({ error: "Authorization code is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!redirectUri) {
        console.error("Microsoft Calendar: No redirect URI provided for code exchange");
        return new Response(JSON.stringify({ error: "Redirect URI is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Microsoft Calendar: Exchanging code for tokens with redirect URI:", redirectUri);
      
      const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
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
        console.error("Microsoft Calendar: Token exchange error:", JSON.stringify(tokens));
        console.error("Microsoft Calendar: This usually means the redirect_uri doesn't match what's registered in Azure");
        console.error("Microsoft Calendar: Redirect URI used:", redirectUri);
        return new Response(JSON.stringify({ 
          error: tokens.error_description || tokens.error,
          hint: "Ensure the redirect URI matches exactly what's registered in Azure AD"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Microsoft Calendar: Token exchange successful");
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
      const { refreshToken } = await req.json();
      
      const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
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
        refreshToken: tokens.refresh_token,
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

      // Get events for the next 7 days
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const eventsUrl = `https://graph.microsoft.com/v1.0/me/calendarview?` +
        `startDateTime=${now.toISOString()}` +
        `&endDateTime=${nextWeek.toISOString()}` +
        `&$orderby=start/dateTime` +
        `&$top=50`;

      const eventsResponse = await fetch(eventsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!eventsResponse.ok) {
        const errorText = await eventsResponse.text();
        console.error("Graph API error:", eventsResponse.status, errorText);
        return new Response(JSON.stringify({ 
          error: "Failed to fetch calendar events",
          status: eventsResponse.status 
        }), {
          status: eventsResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const eventsData = await eventsResponse.json();
      
      return new Response(JSON.stringify({ events: eventsData.value }), {
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

      const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
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

      const profile = await profileResponse.json();
      
      return new Response(JSON.stringify({ profile }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Microsoft calendar error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
