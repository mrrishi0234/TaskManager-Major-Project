import React from 'react';

const Home = ({ onLogin, onRegister }) => (
  <div className="home-page">
    <section className="home-hero">
      <div className="home-hero-copy fade-in">
        <span className="eyebrow">A simpler way to stay on track</span>
        <h1>Make room for the work that <em>matters.</em></h1>
        <p className="home-lead">
          Good task management is not about filling your day with checkboxes. It is about knowing what needs your attention, what can wait, and what is already done.
        </p>
        <div className="home-actions">
          <button className="btn btn-primary" onClick={onRegister}>Get started</button>
          <button className="btn btn-ghost" onClick={onLogin}>I already have an account</button>
        </div>
        <p className="home-note">Plan less. Remember less. Finish more.</p>
      </div>
      <div className="home-paper" aria-hidden="true">
        <div className="paper-heading">Today</div>
        <div className="paper-line"><span className="paper-check done"></span><span className="strike">Submit project outline</span></div>
        <div className="paper-line"><span className="paper-check"></span><span>Review lecture notes</span></div>
        <div className="paper-line"><span className="paper-check"></span><span>Call home</span></div>
        <div className="paper-rule"></div>
        <div className="paper-small">3 things worth your attention</div>
      </div>
    </section>

    <section className="home-section">
      <div className="section-intro">
        <span className="eyebrow">Why it helps</span>
        <h2>A task list should make your day feel lighter, not busier.</h2>
      </div>
      <div className="reason-grid">
        <article className="reason-card"><span className="reason-number">01</span><h3>Clear your head</h3><p>Writing something down means you do not have to keep rehearsing it in your mind. Your list becomes the place to remember.</p></article>
        <article className="reason-card"><span className="reason-number">02</span><h3>Know what comes next</h3><p>When everything feels urgent, priorities disappear. A simple list gives you a visible next step instead of vague pressure.</p></article>
        <article className="reason-card"><span className="reason-number">03</span><h3>See your progress</h3><p>Finished work is useful information too. Looking back at what you completed makes progress easier to notice.</p></article>
      </div>
    </section>

    <section className="home-quote">
      <p>“The goal is not to do everything. It is to make sure the right things do not get forgotten.”</p>
      <span>— the idea behind Taskflow</span>
    </section>
  </div>
);

export default Home;
