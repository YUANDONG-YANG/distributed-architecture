import { useCallback, useState } from 'react';
import { TAB_META } from '../data/tabs.js';

const meta = TAB_META.engineering;

const RIPPLE_DURATION_MS = 700;

export function EngineeringPracticePage() {
  const [ripples, setRipples] = useState([]);

  const onAfterwordLedePointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setRipples((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, RIPPLE_DURATION_MS);
  }, []);

  return (
    <div className="rationale-page engineering-practice-page">
      <header className="rationale-page__header">
        <h1 className="rationale-page__title">{meta.pageTitle}</h1>
        <p className="rationale-page__subtitle">{meta.pageSubtitle}</p>
      </header>

      <div className="rationale-page__body">
        <div className="rationale-page__lede-wrap">
          <p className="rationale-page__lede">
            <strong>Design Rationale</strong> is the wide shot. This page is the opposite: tables and queues I touch,
            where retries show up before they hit rows, and how I actually explain a bad deploy or a partial outage to
            someone who was not in the war room.
          </p>
        </div>

        <section className="rationale-section rationale-section--pillar rationale-section--pillar-business">
          <p className="rationale-section__eyebrow">I · Mechanisms</p>
          <h2 className="rationale-section__title">Same demos as the app—more wiring detail</h2>
          <p>
            Blocks follow the three simulators plus contracts and SLOs. First blurb is the point; the paragraph under it
            is the kind of detail I bring up when someone asks what shipped, not what the slide said.
          </p>
        </section>

        <div className="rationale-page__pillar-stack" aria-label="Mechanisms by simulator theme">
          <section className="rationale-section rationale-section--pillar rationale-section--pillar-business">
            <p className="rationale-section__eyebrow">Transaction simulator</p>
            <h2 className="rationale-section__title">Transaction control</h2>
            <p>
              Idempotency and compensation are table stakes. The part that matters in review is which row moves, which
              log line wins on replay, and where a duplicate message dies.
            </p>
            <p className="engineering-landing">
              Small <strong>state machine</strong> for illegal transitions. Versions via <strong>CAS / optimistic
              locks</strong>. Append-only <strong>process log</strong> as replay source. <strong>Outbox</strong> tied to
              the publisher so commit order and publish order line up. Consumers keyed for <strong>idempotency</strong>{' '}
              on a business id. Path is <strong>retry → DLQ → controlled replay</strong>; manual steps stay in the
              loop when replay would falsify money.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-contract">
            <p className="rationale-section__eyebrow">Observability</p>
            <h2 className="rationale-section__title">When half the trace is missing</h2>
            <p>
              Dashboards help after you know which slice is on fire. The boring work is one <code>requestId</code> (or
              equivalent) end to end, plus a business key on log lines and spans so you can stitch when a vendor drops
              context.
            </p>
            <p className="engineering-landing">
              Enforce <strong>requestId</strong> at the edge where it is realistic. Put the <strong>business key</strong>{' '}
              on logs and span attrs; metric labels should line up. Partner lost your trace? You can still go alert → log
              line → rough latency from metrics and not guess.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-security">
            <p className="rationale-section__eyebrow">Traffic protection</p>
            <h2 className="rationale-section__title">Name the hop</h2>
            <p>
              “Protect the core” is fluff until you list gateway, queue, app pool, then DB. If the database is eating
              your retries, the design already failed—usually earlier than people admit.
            </p>
            <p className="engineering-landing">
              Cheap <strong>rate limit + validation</strong> at the edge. Stateless tier scales out.{' '}
              <strong>Bulkheads and breakers</strong> so one dependency does not take the pool. Keep a{' '}
              <strong>degraded path</strong> (cached read, async ticket, static fallback) so synchronous writes to the
              store do not spike with every upstream wobble.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-slo">
            <p className="rationale-section__eyebrow">Contract governance</p>
            <h2 className="rationale-section__title">Many consumers, one producer</h2>
            <p>
              “Backward compatible” is paper until you know who runs which schema revision and what breaks when you
              tighten a field.
            </p>
            <p className="engineering-landing">
              <strong>Explicit API versions</strong>. Additive rules for events written down. A small{' '}
              <strong>matrix</strong>: consumer × minimum version × known breakage. Then you can schedule a break
              instead of reading about it in prod.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-capacity">
            <p className="rationale-section__eyebrow">SLO / capacity / chaos</p>
            <h2 className="rationale-section__title">When the budget bites</h2>
            <p>
              SLIs only matter if they change what ships: freeze scope, shed load, or move people onto the path that is
              eating the budget.
            </p>
            <p className="engineering-landing">
              Track <strong>latency, success, freshness</strong> on what you sell. Size <strong>headroom</strong> for
              peak plus replay. Budget gone: <strong>throttle or stop</strong> non-critical work; hot-path fixes before
              new features. No mystery there.
            </p>
          </section>
        </div>

        <section className="rationale-section rationale-section--pillar rationale-section--pillar-performance">
          <p className="rationale-section__eyebrow">II · Concurrency &amp; performance</p>
          <h2 className="rationale-section__title">Load, retries, database</h2>
          <p>
            Slide decks skip pool sizing and hot rows. In incidents those decide whether a spike becomes an outage.
          </p>
          <ul className="rationale-list">
            <li>
              <strong>Database</strong>: pool matches what CPU and locks can take; split or serialize hot rows; cap
              statement time; read replicas only where stale is acceptable.
            </li>
            <li>
              <strong>Bursts</strong>: queues absorb what would otherwise open thousands of transactions at once;
              admission at the edge should match what the slowest hop drains.
            </li>
            <li>
              <strong>App tier</strong>: horizontal scale; shard-aware routing if data is partitioned; warm capacity
              before known spikes; stick sessions only if the store forces it.
            </li>
            <li>
              <strong>Retries</strong>: jitter, caps, breakers so you do not thunder the herd; idempotency keys so retry
              is not a second payment; DLQ when replay is unsafe.
            </li>
            <li>
              <strong>Off the sync path</strong>: cache with a real invalidation story; MQ and batch writers; async APIs
              when the client can wait on a callback instead of a long held HTTP transaction.
            </li>
          </ul>
        </section>

        <section className="rationale-section rationale-section--pillar rationale-section--pillar-ownership rationale-section--last">
          <p className="rationale-section__eyebrow">III · Ownership</p>
          <h2 className="rationale-section__title">What I actually say in a room</h2>
          <p>
            Buzzwords copy-paste. Convincing is naming phases, keys, and who owns the ugly path—without the slide deck
            voice.
          </p>
          <ul className="rationale-list">
            <li>
              Cross-system work gets split into <strong>commit → outbox dispatch → idempotent apply → fix-up</strong>{' '}
              (replay or compensate). Each step has a store that is source of truth; I say which one.
            </li>
            <li>
              <strong>requestId + business key</strong> on systems I run are not optional in logs and traces. Vendors get
              pushed on the same fields when traces break mid-flight.
            </li>
            <li>
              Clear split between <strong>must work now</strong> (sync, hard checks) and <strong>can lag</strong> (async,
              stale read, canned response when a dep is down).
            </li>
            <li>
              Traffic order: <strong>cheap checks</strong>, bounded pools and queues, then the transactional core. DB
              saturation should not be the first symptom.
            </li>
            <li>
              Replay tooling, compensation hooks, and runbooks for the nasty cases ship with the feature. No promise of
              auto-recovery on flows I would not re-drive by hand.
            </li>
          </ul>
          <p className="rationale-page__closing">
            Use <strong>Design Rationale</strong> for breadth. Use this tab when the discussion needs mechanism names,
            load paths that match production, and a straight account of what happened on a real integration.
          </p>
        </section>

        <aside className="engineering-afterword" aria-label="Closing note">
          <div
            className="engineering-afterword__lede-wrap"
            onPointerDown={onAfterwordLedePointerDown}
          >
            <p className="engineering-afterword__lede">
              <span className="engineering-afterword__lede-shimmer">
                When you run into an architecture problem and try to solve it with business-side levers alone, you have
                not fixed the underlying gap—you will keep stepping into pitfalls. If you have more thoughts, please
                reach out.
              </span>
            </p>
            {ripples.map((r) => (
              <span
                key={r.id}
                className="engineering-afterword__ripple"
                style={{ left: r.x, top: r.y }}
                aria-hidden
              />
            ))}
          </div>
          <div className="engineering-afterword__contact">
            <span className="engineering-afterword__hint">If you have more thoughts</span>
            <a
              className="engineering-afterword__link"
              href="https://www.linkedin.com/in/yuandong-yang-robin/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn — https://www.linkedin.com/in/yuandong-yang-robin/"
            >
              Robin Yang
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
