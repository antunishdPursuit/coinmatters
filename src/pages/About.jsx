import "../CSS/About.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const teamMembers = [
  {
    name: "Irwin Jorge - Tech Enthusiast and Resolution Keeper",
    bio: `Started the journey of self-learning about computers as a New Year’s resolution. Discovered Pursuit, where a newfound passion for programming took root. Continuously growing in the tech field to explore new opportunities.`,
    image: "https://ca.slack-edge.com/TCVA3PF24-U04DJT6DW3B-504952daa222-512",
    linkedin: "https://www.linkedin.com/in/irwin-jorge",
    github: "https://github.com/Irwinj7",
  },
  {
    name: "Noni Porter - The Cat-Loving Coding Advocate",
    bio: `Dedicated to making a difference in education, particularly for differently-abled students. Witnessing the positive impact of technology on middle schoolers inspired a journey into coding. Committed to bridging educational gaps for students with disabilities and those from low-income communities.`,
    image: "https://avatars.slack-edge.com/2024-01-17/6487301772053_7c3d14dead5055e10cf5_original.jpg",
    linkedin: "https://www.linkedin.com/in/noni-porter-46a4a272",
    github: "https://github.com/Honeyx03",
  },
  {
    name: "Dennys Antunish - Database Expert Turned Programmer",
    bio: `Initially worked with databases and SQL, realizing the potential of programming for a deeper understanding of technology. Found fulfillment in the everyday challenges and knowledge that programming provides.`,
    image: "https://avatars.slack-edge.com/2024-01-18/6493962618899_0053fe1fe2cf3e90897d_original.jpg",
    linkedin: "https://www.linkedin.com/in/dennys-antunish",
    github: "https://github.com/antunishdPursuit",
  },
];

const speicalThanks = [
  {
    name: "Lakisha Johnson",
    bio: `"LA FIN, Provided amazing knowlegde and exterpise during the intial layout of the project."`,
    image: "https://ca.slack-edge.com/TCVA3PF24-U023QNLU8AF-f97d7c72a3e9-512",
    linkedin: "https://www.linkedin.com/in/lakisha-johnson-0b0587219/",
    github: "https://github.com/lakishaJohnson",
  
  },
  {
    name: "Will Dickerson",
    bio: `"Knoweldge Tech Mentor who helped us with the ERD and database layout. As well as giving advice with any question we had"`,
    image: "https://avatars.slack-edge.com/2023-11-12/6180562484373_cb54a9db5d205bd763d5_original.jpg",
    linkedin: "https://www.linkedin.com",
    github: "https://github.com/wdickerson",
  
  },
  {
    name: "Dillon Eversman",
    bio: `"Amazing Design mentor who helped us with the pay display layout and gave great helpful tips. The website would not look half as good without his input. "`,
    image: "https://avatars.slack-edge.com/2023-05-11/5250700032690_bb2b098c92056a9a813a_original.jpg",
    linkedin: "https://www.linkedin.com",
    github: "https://github.com/lakishaJohnson",
  
  },
]
function About() {

  return (
    <div>
      <header className="about-banner">
        <div className="about-background-box">
          <h1>Who we are</h1>
          <p>We are a dynamic team brought together by a shared passion for technology and a commitment to making a positive impact. Our diverse backgrounds and experiences converge to create CoinsMatter, an innovative solution to simplify the complex world of grocery shopping.</p>
        </div>
        <div className="about-background-box">
          <h1>What we did</h1>
          <p>LWe created an app that will hopefully take the stress off shopping for all walks of life! We know how much of a hassle manually comparing prices between stores is, so our solution is to show you the cheapest products from stores, all at once! Our aim is for the user to not only save money, but time as well.</p>
        </div>
      </header>
      <section className="team">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <img src={member.image} alt={member.name} />
            <h2>{member.name}</h2>
            <p>{member.bio}</p>
            <div className="social-links">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
      <footer className="special-thanks-banner">
        <div className="special-thanks-banner-box">
          <h1>Special Thanks</h1>
        </div>
      </footer>
      <section className="team">
        {speicalThanks.map((member, index) => (
          <div className="team-member" key={index}>
            <img src={member.image} alt={member.name} />
            <h2>{member.name}</h2>
            <p>{member.bio}</p>
            <div className="social-links">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default About;
