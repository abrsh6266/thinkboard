import { supabase } from "@/lib/supabase/client";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default api;
