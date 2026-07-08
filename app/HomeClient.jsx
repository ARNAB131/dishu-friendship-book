"use client";

import { useRef, useState } from "react";
import BookClient from "./components/BookClient";

export default function HomeClient({ initialUnlocked }) {
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [musicState, setMusicState] = useState("stopped");

  const audioRef = useRef(null);

  async function startMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      audio.volume = 0.42;
      await audio.play();
      setMusicState("playing");
    } catch {
      setMusicState("blocked");
    }
  }

  function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
      setMusicState("stopped");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answer })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "Wrong answer.");
        setLoading(false);
        return;
      }

      setUnlocked(true);
      setLoading(false);

      setTimeout(() => {
        startMusic();
      }, 180);
    } catch {
      setError("Unable to unlock the book right now.");
      setLoading(false);
    }
  }

  return (
    <main className="site-shell">
      <audio
        ref={audioRef}
        src="/music/tum-hi-ho-bandhu.mp3"
        loop
        preload="auto"
      />

      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />
      <div className="noise-layer" />

      {!unlocked ? (
        <section className="lock-screen">
          <div className="lock-card">
            <p className="eyebrow">A random day. A real thank you.</p>

            <h1>
              For my
              <span>Dearest Dishu</span>
            </h1>

            <p className="lock-note">
              This is not a birthday gift. This is a small book for the friend
              who stayed, supported, lifted, and reminded me that I am not alone.
            </p>

            <form onSubmit={handleSubmit} className="unlock-form">
              <label htmlFor="answer">
                What does your buddy call you as?
              </label>

              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Enter the answer"
                autoComplete="off"
              />

              {error ? <p className="error-text">{error}</p> : null}

              <button type="submit" disabled={loading}>
                {loading ? "Opening..." : "Open The Book"}
              </button>
            </form>

            <p className="tiny-hint">
              Only the right buddy name can open this.
            </p>
          </div>
        </section>
      ) : (
        <>
          <button className="music-pill" onClick={toggleMusic}>
            {musicState === "playing" ? "Pause music" : "Play music"}
          </button>

          {musicState === "blocked" ? (
            <p className="music-warning">
              Tap “Play music” once. Some phones block automatic playback.
            </p>
          ) : null}

          <BookClient />
        </>
      )}
    </main>
  );
}
