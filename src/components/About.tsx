import "./styles/About.css";
import { config } from "../config";

const facts = [
  { label: "Studying", value: config.education.degree },
  { label: "At", value: config.education.institute },
  { label: "Graduating", value: "June 2027" },
  { label: "Score", value: config.education.score },
  { label: "Currently", value: "Software Engineer Intern, Data & AI" },
  { label: "Based in", value: config.social.location },
];

const About = () => {
  return (
    <div className="about-section" id="about">
      <aside className="about-facts" aria-label="Quick facts">
        <p className="about-facts-script">a little about me</p>
        <dl>
          {facts.map((f) => (
            <div className="about-fact" key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="about-greeting">{config.about.greeting}</p>
        <p className="about-tagline">{config.about.tagline}</p>
        <div className="about-body">
          {config.about.paragraphs.map((text, i) => (
            <p key={i} className={i === config.about.paragraphs.length - 1 ? "about-close" : undefined}>
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
