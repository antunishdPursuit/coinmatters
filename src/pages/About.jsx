import "./About.css";

const teamMembers = [
  {
    name: "Irwin Jorge",
    title: "Tech Enthusiast and Resolution Keeper",
    initials: "IJ",
    linkedin: "https://www.linkedin.com/in/irwin-jorge",
    github: "https://github.com/Irwinj7",
  },
  {
    name: "Noni Porter",
    title: "The Cat-Loving Coding Advocate",
    initials: "NP",
    linkedin: "https://www.linkedin.com/in/noni-porter-46a4a272",
    github: "https://github.com/Honeyx03",
  },
  {
    name: "Dennys Antunish",
    title: "Database Expert Turned Programmer",
    initials: "DA",
    linkedin: "https://www.linkedin.com/in/dennys-antunish",
    github: "https://github.com/antunishdPursuit",
  },
];

const specialThanks = [
  {
    name: "Lakisha Johnson",
    note: "Provided amazing knowledge and expertise during the initial layout of the project.",
  },
  {
    name: "Will Dickerson",
    note: "Tech mentor who helped us with the ERD and database layout, and gave advice on any question we had.",
  },
  {
    name: "Dillon Eversman",
    note: "Design mentor who helped us with the price display layout and gave great tips. The website would not look half as good without his input.",
  },
];

function About() {
  return (
    <div className="about-page">
      <section className="about-intro">
        <div className="about-card">
          <h1>Who we are</h1>
          <p>We are a team brought together by a shared passion for technology and a commitment to making a positive impact. Our backgrounds and experiences came together to create CoinMatters, a simpler way through the complex world of grocery shopping.</p>
        </div>
        <div className="about-card">
          <h2>What we did</h2>
          <p>We built an app to take the stress out of shopping. Comparing prices between stores by hand is a hassle, so CoinMatters shows you the cheapest products from nearby stores all at once, saving you money and time.</p>
        </div>
      </section>

      <section className="about-team" aria-labelledby="team-title">
        <div className="rail" aria-hidden="true"></div>
        <div className="sign">
          <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
          <h2 id="team-title">Meet the team</h2>
        </div>
        <ul className="about-grid">
          {teamMembers.map((member) => (
            <li className="about-card" key={member.name}>
              <div className="about-initials" aria-hidden="true">{member.initials}</div>
              <h3>{member.name}</h3>
              <p>{member.title}</p>
              <p className="about-links">
                <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`}>LinkedIn</a>
                <a href={member.github} aria-label={`${member.name} on GitHub`}>GitHub</a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-thanks" aria-labelledby="thanks-title">
        <h2 id="thanks-title">Special thanks</h2>
        <ul className="about-grid">
          {specialThanks.map((person) => (
            <li className="about-card" key={person.name}>
              <h3>{person.name}</h3>
              <p>{person.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default About;
