import { useState, useEffect, useRef } from "react";

const useCountAnimation = (targetValue, duration = 1500, delay = 0, startTrigger = true) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!startTrigger) {
      setDisplayValue(0);
      return;
    }

    // Reset to 0 when target changes (profile switch)
    setDisplayValue(0);
    startTimeRef.current = null;

    if (targetValue === undefined || targetValue === null) return;

    // Respect delay before starting
    const delayTimer = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function — ease out cubic
        // Starts fast, slows down at the end (feels satisfying)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * targetValue);

        setDisplayValue(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, delay, startTrigger]);

  return displayValue;
};

export default useCountAnimation;
