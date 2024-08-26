import { useRef } from "react";

export default function Loading() {
  const loadingRef = useRef<HTMLDivElement>(null);

  window.addEventListener("load", () => {
    loadingRef.current && (loadingRef.current.style.opacity = "0");

    document
      .querySelector(".loading")
      ?.addEventListener("transitionend", () => {
        loadingRef.current && (loadingRef.current.style.display = "none");
      });
  });
  return (
    <div
      ref={loadingRef}
      className="loading fixed top-0 right-0 bottom-0 left-0 z-[100] bg-white
    duration-500 flex items-center justify-center"
    >
      <svg className="loading-circle w-[54px] h-[54px]">
        <circle
          className="stroke-black stroke-[4] fill-transparent"
          cx="50%"
          cy="50%"
          r="25"
        ></circle>
      </svg>
    </div>
  );
}
