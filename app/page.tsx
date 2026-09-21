export default function Home() {
  return (
    <main className="home">
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <section className="hero">
        <div className="badge">
          <span className="dot" />
          AKHIL NEURAL CORE X
        </div>

        <h1>
          Your AI.
          <br />
          <span>Your Core.</span>
        </h1>

        <p>
          A personal AI workspace built for thinking, creating,
          coding and getting things done.
        </p>

        <div className="actions">
          <a href="/chat" className="primary">
  Start Chatting
</a>
          <button className="secondary">Explore Core</button>
        </div>

        <div className="status">
          <span className="statusDot" />
          Neural Core Online
        </div>
      </section>
    </main>
  );
}
