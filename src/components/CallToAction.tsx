import { Link } from "react-router-dom";
import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <Link to="/myworks" className="cta-btn cta-btn-play" data-cursor="disable">
          See All Projects →
        </Link>
        
        <a 
          href={`mailto:${config.contact.email}`}
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Let's Work Together →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
