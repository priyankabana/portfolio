import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import { config } from "../config";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Paused until the intro finishes (initialFX starts it)
    lenis.stop();

    let rafId = 0;
    function raf(time: number) {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const links = document.querySelectorAll(".header .nav-pill a");
    const onClick = (e: Event) => {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        const section = (e.currentTarget as HTMLAnchorElement).getAttribute("data-href");
        const target = section ? (document.querySelector(section) as HTMLElement | null) : null;
        if (target && lenis) lenis.scrollTo(target, { offset: 0, duration: 1.5 });
      }
    };
    links.forEach((el) => el.addEventListener("click", onClick));

    const onResize = () => lenis?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      links.forEach((el) => el.removeEventListener("click", onClick));
      window.removeEventListener("resize", onResize);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title">
          {config.developer.initials}
        </a>
        <ul className="nav-pill">
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#live-projects" href="#live-projects">
              <HoverLinks text="PROJECTS" />
            </a>
          </li>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
        <a href={`mailto:${config.contact.email}`} className="navbar-connect">
          {config.contact.email}
        </a>
      </div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
