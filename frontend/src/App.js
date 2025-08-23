import React, { useState, useEffect } from 'react';
import './App.css';
import ReputationGraph from './ReputationGraph';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'tracker', 'contact'];
      const scrollPos = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>🚀 Musk vs Trump</h2>
          </div>
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <button 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home')}
            >
              Home
            </button>
            <button 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className={`nav-link ${activeSection === 'tracker' ? 'active' : ''}`}
              onClick={() => scrollToSection('tracker')}
            >
              Tracker
            </button>
            <button 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </div>
          <div className="nav-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Landing Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Reputation Tracker
            </h1>
            <p className="hero-subtitle">
              Real-time sentiment analysis and reputation monitoring for public figures
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <h3>🤖 AI Analysis</h3>
                <p>Advanced sentiment tracking</p>
              </div>
              <div className="stat-card">
                <h3>📊 Real-time Data</h3>
                <p>Live reputation metrics</p>
              </div>
              <div className="stat-card">
                <h3>📱 Mobile Ready</h3>
                <p>Responsive design</p>
              </div>
            </div>
            <div className="hero-actions">
              <button 
                className="btn-primary"
                onClick={() => scrollToSection('tracker')}
              >
                View Tracker
              </button>
              <button 
                className="btn-secondary"
                onClick={() => scrollToSection('about')}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <h4>Live Sentiment Score</h4>
              <div className="score-display">
                <div className="score musk-score">
                  <span className="score-label">Elon Musk</span>
                  <span className="score-value">7.8</span>
                </div>
                <div className="vs-divider">VS</div>
                <div className="score trump-score">
                  <span className="score-label">Donald Trump</span>
                  <span className="score-value">6.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Data Collection</h3>
              <p>We continuously monitor social media, news articles, and public statements to gather comprehensive data about public figures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI Analysis</h3>
              <p>Our advanced AI algorithms analyze sentiment, context, and public perception to generate accurate reputation scores.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Real-time Updates</h3>
              <p>Get instant updates on reputation changes with our real-time tracking system and interactive visualizations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reputation Tracker Section */}
      <section id="tracker" className="tracker">
        <div className="container">
          <h2 className="section-title">Reputation Tracker</h2>
          <ReputationGraph />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Questions or Feedback?</h3>
              <p>We'd love to hear from you! Reach out to learn more about our AI reputation tracking system.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>info@muskvstrump.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🐦</span>
                  <span>@MuskVsTrumpAI</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <span>GitHub: hannesmitterer/musk_vs_trump</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message" rows="5"></textarea>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Musk vs Trump AI Reputation Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;