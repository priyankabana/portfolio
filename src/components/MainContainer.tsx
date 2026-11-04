import { useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import CursorHero from "./CursorHero";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import LiveProjects from "./LiveProjects";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";

const MainContainer = () => {
  useEffect(() => {
    const resizeHandler = () => setSplitText();
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="container-main">
      <Navbar />
      <SocialIcons />
      <div className="container-main">
        <CursorHero />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <LiveProjects />
        <TechStackNew />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
