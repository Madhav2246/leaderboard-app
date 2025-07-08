import React, { useEffect, useRef } from 'react';
import '../assets/style.css';
import logo from '../assets/images/acm-logo.jpg';

export default function HomePage() {
  const typingRef = useRef(null);
  const linesRef = useRef([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const typingTarget = typingRef.current;
    if (!typingTarget || linesRef.current.length < 5) return;

    const text = "The 30-Day Challenge";
    let i = 0;
    typingTarget.textContent = "";

    function typeHeadline() {
      if (i < text.length) {
        typingTarget.textContent += text.charAt(i++);
        setTimeout(typeHeadline, 70);
      }
    }

    const consoleLines = [
      "> Initializing recruitment protocol...",
      "> Connecting to ACM secure channel...",
      "> Verifying student agent ID...",
      "> Clearance level: Sufficient",
      "> Welcome, candidate. The path unfolds."
    ];
    let lineChar = 0;
    const totalChars = consoleLines.join("").length;

    function typeConsole() {
      let count = 0;
      for (let j = 0; j < consoleLines.length; j++) {
        count += consoleLines[j].length;
        if (lineChar < count) {
          const current = linesRef.current[j];
          const relIndex = lineChar - (count - consoleLines[j].length);
          current.textContent = consoleLines[j].substring(0, relIndex + 1);
          break;
        }
      }

      if (lineChar < totalChars) {
        lineChar++;
        setTimeout(typeConsole, 30);
      }
    }

    typeHeadline();
    setTimeout(typeConsole, 500);
  }, []);

  return (
    <div className="homepage-wrapper">
      {/* === Navbar === */}
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={logo} alt="ACM" className="nav-logo" />
          <span>ACM Recruitment</span>
        </div>
        <div className="navbar-links">
          <a href="/dashboard">Dashboard</a>
          <a href="#about">About Recruitment</a>
          <a href="#about-us">About Us</a>
          <a href="/">Logout</a>
        </div>
      </nav>

      {/* === Hero Section === */}
      <section className="hero-section">
        <div className="hero-content">
          <h4>ACM Student Chapter, Amritapuri Presents</h4>
          <h1 className="typing-text" aria-label="The 30-Day Challenge">
            <span ref={typingRef} aria-hidden="true" />
          </h1>
          <p className="hero-sub">This July, we do things differently.</p>
          <div className="console-box" id="intro-console">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`line ${i === 4 ? "final" : ""}`}
                ref={(el) => (linesRef.current[i] = el)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* === About Recruitment Section === */}
      <section id="about" className="info-section fade-in">
        <h2>The Invitation</h2>
        <p>
          It’s ACM recruitment time again — but this time, things aren’t quite the same.
          This is the ACM 30-Day Challenge.
          <br /><br />
          This isn’t your typical event. It’s a continuous, structured, and collaborative experience
          that builds real skills over a month, led by mentors and driven by participation.
          <br /><br />
          Sometimes the best way in isn’t through a form — it’s through showing up, building up,
          and standing out without saying a word.
        </p>
      </section>

      {/* === SIG Section === */}
      <section className="info-section fade-in">
        <h2>Special Interest Groups (SIG)</h2>
        <div className="sig-grid">
          {[
            {
              title: "Artificial Intelligence",
              desc: "Explore the future with ML, Neural Networks & more. Mentored sessions & projects.",
              icon: "🧠"
            },
            {
              title: "Cyber Security",
              desc: "Dive into ethical hacking, CTFs, and system defense strategies.",
              icon: "🛡️"
            },
            {
              title: "App & Web Dev",
              desc: "Build real apps with React, Flutter, and more. Ship real projects.",
              icon: "🌐"
            },
            {
              title: "Game Dev - Glitch",
              desc: "Use Unity & pixel magic to build indie games & interactive worlds.",
              icon: "🎮"
            }
          ].map((sig, idx) => (
            <div key={idx} className="sig-card tilt-card">
              <div className="sig-icon">{sig.icon}</div>
              <h3>{sig.title}</h3>
              <p>{sig.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Timeline Section === */}
      <section className="info-section fade-in">
        <h2>The Timeline</h2>
        <p>
          The challenge begins on <strong>July 15</strong>. Participants will be assigned mentors and will face a new challenge every 5 days.
          The final project phase begins on August 5.
        </p>
        <div className="timeline">
          {[
            { date: "July 15", label: "Start" },
            { date: "July 20", label: "Checkpoint 1" },
            { date: "July 25", label: "Checkpoint 2" },
            { date: "July 30", label: "Checkpoint 3" },
            { date: "August 4", label: "Checkpoint 4" },
            { date: "August 15", label: "Final Phase" }
          ].map((e, i) => (
            <div className="timeline-event" key={i}>
              <span>{e.date}</span>
              <div className="event-circle" />
              <p>{e.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Final Phase Section === */}
      <section className="info-section fade-in dark-section">
        <h2>The Final Phase</h2>
        <p>
          After the fourth challenge, you'll have 10 days for a final project that reflects everything you’ve learned.
          <br /><br />
          No formalities. Just footprints.
        </p>
      </section>

      {/* === About Us === */}
      <section id="about-us" className="info-section fade-in">
        <h2>About Us</h2>
        <p>
          ACM Student Chapter, Amritapuri is a community of passionate developers, designers,
          and thinkers who build great ideas together. We believe in mentorship, collaboration,
          and empowering students with knowledge that matters.
        </p>
      </section>

      {/* === CTA === */}
      <div className="cta-center">
        <a href="/dashboard">
          <button className="go-btn">Go to Dashboard</button>
        </a>
      </div>

      {/* === Footer === */}
      <footer className="footer">
        © ACM Amritapuri | 2025 | May the Code be with you!!
      </footer>
    </div>
  );
}