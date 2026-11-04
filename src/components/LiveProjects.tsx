import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { config } from "../config";
import "./styles/LiveProjects.css";

type Project = (typeof config.projects)[number] & { repo?: string };

const LiveProjects = () => {
  const live = (config.projects as Project[]).filter(
    (p) => !p.category.startsWith("Work") && p.link
  );
  return (
    <section className="live-section section-container" id="live-projects">
      <h2>
        Live <span>Projects</span>
      </h2>
      <p className="live-sub">Deployed and open to try. Click through to the demo or read the code.</p>
      <div className="live-grid">
        {live.map((p) => (
          <article className="live-card" key={p.id}>
            <a className="live-thumb" href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="disable">
              <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
              <span className="live-badge"><i /> Live</span>
            </a>
            <div className="live-body">
              <p className="live-cat">{p.category}</p>
              <h3>{p.title}</h3>
              <p className="live-desc">{p.description}</p>
              <p className="live-tech">{p.technologies}</p>
              <div className="live-actions">
                <a className="live-btn live-btn-solid" href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                  Live demo <MdArrowOutward />
                </a>
                {p.repo && (
                  <a className="live-btn live-btn-ghost" href={p.repo} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                    <FaGithub /> Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LiveProjects;
