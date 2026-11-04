import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#140a10",
    duration: 0.5,
    delay: 1,
  });

  const greeting = new TextSplitter(".hero-greeting", { type: "chars,lines", linesClass: "split-line" });
  gsap.fromTo(
    greeting.chars,
    { opacity: 0, y: 40, filter: "blur(5px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out", stagger: 0.03, delay: 0.2 }
  );

  gsap.fromTo(
    ".hero-name",
    { opacity: 0, y: 60, filter: "blur(8px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out", delay: 0.45 }
  );

  gsap.fromTo(
    [".hero-bio", ".hero-actions", ".hero-role"],
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", stagger: 0.12, delay: 0.9 }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 }
  );
}
