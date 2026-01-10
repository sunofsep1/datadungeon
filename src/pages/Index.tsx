import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Preserve OAuth callback params (e.g. ?code=...) when redirecting to the dashboard
    navigate(`/dashboard${window.location.search}`);
  }, [navigate]);

  return null;
};

export default Index;
