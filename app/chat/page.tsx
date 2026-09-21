export default function ChatPage() {
  return (
    <main className="chatPage">
      <header className="chatHeader">
        <div>
          <strong>AKHIL NEURAL CORE X</strong>
          <span>Online</span>
        </div>
      </header>

      <section className="chatArea">
        <div className="welcome">
          <div className="coreIcon">✦</div>
          <h1>How can I help, Akhil?</h1>
          <p>
            Ask anything. Build, code, create, learn or explore.
          </p>
        </div>
      </section>

      <div className="composer">
        <input
          type="text"
          placeholder="Message AKHIL AI..."
        />
        <button>↑</button>
      </div>
    </main>
  );
}
