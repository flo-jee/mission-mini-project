import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../context/UserContext"; // 전역 상태 업데이트
import { supabaseClient as supabase } from "../supabase/context"; // supabase 클라이언트 가져오기

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ 리디렉트 후 유저 정보 가져오기
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (user) {
          console.log("✅ 소셜 로그인 후 유저 정보 가져오기 성공!", user);
          setUser(user); // ✅ 전역 상태 업데이트
          navigate("/"); // ✅ 메인으로 이동
        } else {
          console.error("❌ 유저 정보 없음", error);
          navigate("/login"); // ❌ 로그인 실패 시 로그인 페이지로
        }
      } catch (err) {
        console.error("❌ 유저 정보 조회 중 에러", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-lg">로그인 처리 중입니다...</p>
    </div>
  );
};

export default AuthCallback;
