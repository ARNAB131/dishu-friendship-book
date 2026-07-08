"use client";

import { useState } from "react";
import { pages } from "../data/bookPages";

export default function BookClient() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState("");

  const page = pages[index];

  const canGoBack = index > 0;
  const canGoNext = index < pages.length - 1;

  function changePage(direction) {
    if (turn) return;

    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= pages.length) return;

    setTurn(direction > 0 ? "next" : "prev");

    setTimeout(() => {
      setIndex(nextIndex);
      setTurn("");
    }, 650);
  }

  return (
    <section className="book-stage">
      <div className="book-title-strip">
        <p>For my Dearest Dishu</p>
        <span>
          Page {index + 1} / {pages.length}
        </span>
      </div>

      <div className="book-wrap">
        <div className="book-back" />
        <div className="book-spine" />

        <article className={`book-sheet ${turn ? `turn-${turn}` : ""}`}>
          <PageContent page={page} />

          <div className="corner corner-top" />
          <div className="corner corner-bottom" />
        </article>
      </div>

      <div className="book-controls">
        <button onClick={() => changePage(-1)} disabled={!canGoBack || !!turn}>
          Previous
        </button>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((index + 1) / pages.length) * 100}%`
            }}
          />
        </div>

        <button onClick={() => changePage(1)} disabled={!canGoNext || !!turn}>
          Next
        </button>
      </div>
    </section>
  );
}

function PageContent({ page }) {
  if (page.type === "cover") {
    return (
      <div className="page-content cover-page">
        <p className="eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p className="cover-subtitle">{page.subtitle}</p>
        <div className="divider">◆ ✦ ◆</div>
        <blockquote>{page.quote}</blockquote>
      </div>
    );
  }

  if (page.type === "photo") {
    return (
      <div className="page-content photo-page">
        <div className="polaroid">
          <img src={page.image} alt={page.alt} />
          <p>{page.caption}</p>
        </div>

        <div className="photo-copy">
          {page.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }

  if (page.type === "promise") {
    return (
      <div className="page-content promise-page">
        <p className="eyebrow">Final page</p>
        <h2>{page.title}</h2>

        <div className="promise-list">
          {page.body.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        <p className="signature">{page.signature}</p>
      </div>
    );
  }

  return (
    <div className="page-content story-page">
      <p className="eyebrow">Friendship chapter</p>
      <h2>{page.title}</h2>

      <div className="story-body">
        {page.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
