import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Career.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const getDisplayYear = (period: string) => {
  if (period.includes("Present")) return "NOW";
  const start = period.split(" - ")[0];
  const year = start.match(/\d{4}/);
  return year ? year[0] : start;
};

const formatPeriod = (period: string) => {
  if (period.includes("Present")) return `Since ${period.split(" - ")[0].replace("Jul", "July").replace("Jun", "June")}`;
  return period.replace(" - ", " – ");
};

const Career = () => {
  useEffect(() => {
    // Grow the timeline line and fade in each entry as the section scrolls into view
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".career-section",
        start: "top 50%",
        end: "bottom 30%",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(".career-timeline", { maxHeight: "0%" }, { maxHeight: "100%", duration: 1, ease: "none" }, 0)
      .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
      .fromTo(
        ".career-dot",
        { animationIterationCount: "infinite" },
        { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
        0
      );
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {config.experiences.map((exp, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                  <p className="career-period">{formatPeriod(exp.period)}</p>
                </div>
                <h3>{getDisplayYear(exp.period)}</h3>
              </div>
              <div className="career-detail">
              <p>{exp.description}</p>
              {exp.responsibilities.length > 0 && (
                <ul className="career-highlights">
                  {exp.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
