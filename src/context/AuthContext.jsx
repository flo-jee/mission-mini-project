import { createContext, useContext, useState, useEffect } from "react";
import { useSupabase } from "../supabase/context";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const supabase = useSupabase();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("✅ Auth 상태 리스너 등록!");

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth 이벤트: ${event}`, session);

        if (event === "SIGNED_IN" && session?.user) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error) {
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
          }
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("userInfo");
        }
      },
    );

    return () => {
      console.log("🧹 기존 리스너 정리 완료");
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
