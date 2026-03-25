import { createClient } from "@supabase/supabase-js";


export async function getUserFromRequest(request: Request): Promise<string | null> {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return null;


    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    return user.id;

}