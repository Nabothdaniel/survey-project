import { useEffect, useRef } from "react";
import { FiCalendar } from "react-icons/fi";
import { gsap } from "gsap";
import useProfile from "../../hooks/useProfile";

const Welcome = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const { profile, loading } = useProfile();

  // Format current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = today
    .toLocaleDateString("en-US", options)
    .toUpperCase();

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
    );

    if (starsRef.current) {
      const stars = starsRef.current.querySelectorAll(".star");
      stars.forEach((star, i) => {
        gsap.fromTo(
          star,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            repeat: 3,
            yoyo: true,
            delay: i * 0.3,
            ease: "power2.inOut",
          }
        );
      });

      gsap.to(starsRef.current, {
        opacity: 0,
        duration: 1,
        delay: 5,
        onComplete: () => {
          if (starsRef.current) starsRef.current.innerHTML = "";
        },
      });
    }
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  const fullName = profile?.name?.trim() || "Guest";
  const firstName = fullName.includes(" ")
    ? fullName.split(" ")[0]
    : fullName; 

  return (
    <div className="mb-8 relative">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <FiCalendar className="mr-2" /> {formattedDate}
      </div>

      <h1
        ref={textRef}
        className="text-2xl sm:text-3xl font-bold text-gray-900 relative"
      >
        Hi,{" "}
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent font-extrabold text-5xl px-1">
            {firstName}
          </span>
          <div ref={starsRef} className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="star absolute w-2 h-2 bg-yellow-300 rounded-full shadow-md"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: "blur(1px)",
                }}
              ></span>
            ))}
          </div>
        </span>
        . Welcome back...
      </h1>
    </div>
  );
};

export default Welcome;
