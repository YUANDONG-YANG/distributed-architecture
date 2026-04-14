import { TAB_META } from '../data/tabs.js';

const meta = TAB_META.rationale;

export function RationalePage() {
  return (
    <div className="rationale-page">
      <header className="rationale-page__header">
        <h1 className="rationale-page__title">{meta.pageTitle}</h1>
        <p className="rationale-page__subtitle">{meta.pageSubtitle}</p>
      </header>

      <div className="rationale-page__body">
        <p className="rationale-page__lede">
          This page explains why the three interactive architecture simulators exist:{' '}
          <strong>distributed transaction control</strong>,{' '}
          <strong>production observability and a closed troubleshooting loop</strong>, and{' '}
          <strong>traffic governance and system protection (survivability / resilience)</strong>. They
          are not three isolated diagrams—they abstract three classes of problems integration
          engineers face repeatedly, expressed at the architecture level.
        </p>

        <section className="rationale-section">
          <h2 className="rationale-section__title">1. What integration engineers actually do</h2>
          <p>
            Integration engineers connect reliable data and process flows across{' '}
            <strong>heterogeneous systems, asynchronous boundaries, third parties, and legacy APIs</strong>
            . Typical situations include:
          </p>
          <ul className="rationale-list">
            <li>Coordinating order, payment, inventory, and fulfillment across many services;</li>
            <li>Message delivery, retries, idempotency, and reconciliation;</li>
            <li>Unstable or rate-limited vendor APIs;</li>
            <li>
              Incidents where you must locate which hop failed and which business line is affected—
              within minutes.
            </li>
          </ul>
          <p>
            This work shares three traits: <strong>many boundaries, many failure modes, and failures
            that are visible across teams</strong>. CRUD inside a single service is not enough—you need
            to understand <strong>how consistency is defined and delivered in a distributed world</strong>
            , <strong>how failures are made visible and contained</strong>, and{' '}
            <strong>how load is kept away from core assets</strong>. The three simulators map to these
            three capabilities.
          </p>
        </section>

        <section className="rationale-section">
          <h2 className="rationale-section__title">2. Page 1: Distributed transaction control</h2>
          <p className="rationale-section__tagline">Connect, align, and roll forward or back safely</p>
          <h3 className="rationale-section__h3">Why it matters</h3>
          <p>
            In integration scenarios there is <strong>no single database transaction</strong> wrapping
            the whole chain. One “business success” is usually split into local commit, publish,
            downstream consumption, and writes in multiple places. Without clear{' '}
            <strong>
              local atomic boundaries, outbox, idempotent consumption, process logs, and
              compensation/replay
            </strong>
            , you get:
          </p>
          <ul className="rationale-list">
            <li>Duplicate delivery leading to duplicate charges or shipments;</li>
            <li>Misaligned upstream/downstream state and reconciliation that never closes;</li>
            <li>No durable story of how far execution got—replay has nowhere to start.</li>
          </ul>
          <p>
            For integration engineers, this page answers:{' '}
            <strong>
              under asynchrony and multiple systems, how to turn one business operation into an
              auditable, retryable, convergent engineering fact
            </strong>
            —not hope that “it should be fine.”
          </p>
          <h3 className="rationale-section__h3">Tie-in to integration work</h3>
          <ul className="rationale-list">
            <li>
              You own <strong>end-to-end consistency across systems</strong>: beyond API contracts you
              define <strong>failure semantics</strong> and <strong>recovery paths</strong>.
            </li>
            <li>
              <strong>Idempotency, process logs, DLQs, and manual intervention</strong> are part of
              integration design—not only operations.
            </li>
          </ul>
        </section>

        <section className="rationale-section">
          <h2 className="rationale-section__title">3. Page 2: Monitoring and observability</h2>
          <p className="rationale-section__tagline">See it, correlate it, close the loop</p>
          <h3 className="rationale-section__h3">Why it matters</h3>
          <p>
            Integration paths are long and failure points are scattered. Without a{' '}
            <strong>metrics–traces–logs</strong> loop, troubleshooting devolves into “every team says
            they are green.” Integration engineers are often asked to:
          </p>
          <ul className="rationale-list">
            <li>
              Use <strong>requestId / traceId / business keys</strong> to stitch gateway, services,
              message queues, and third parties into one narrative;
            </li>
            <li>
              Cut through alert noise to tell <strong>dependency flakiness</strong> from{' '}
              <strong>your own release</strong>;
            </li>
            <li>
              After root cause, drive <strong>retries, replay, and compensation</strong> to finish the
              business story.
            </li>
          </ul>
          <p>
            The point is not a wall of dashboards—it is a <strong>production-grade incident loop</strong>
            : from detection to correlation, then linking to <strong>process logs / replay</strong> from
            Page 1.
          </p>
          <h3 className="rationale-section__h3">Tie-in to integration work</h3>
          <ul className="rationale-list">
            <li>
              Third parties and legacy stacks vary in observability—you must design{' '}
              <strong>correlation keys and fallback correlation</strong>.
            </li>
            <li>
              <strong>Integration amplifies incidents</strong>: weak observability turns the
              integration layer into a black box and blurs ownership.
            </li>
          </ul>
        </section>

        <section className="rationale-section">
          <h2 className="rationale-section__title">4. Page 3: Traffic governance and protection</h2>
          <p className="rationale-section__tagline">
            Survivability / resilience—absorb load, isolate failures, protect the core
          </p>
          <h3 className="rationale-section__h3">Why survivability matters</h3>
          <p>
            “Survivability” here means the system can still reserve capacity for critical work and
            degrade predictably under abnormal load or dependency failure—not merely that a process is
            still running. Integration ingress is often where bursts appear (promotions, batch
            callbacks, reconciliation jobs, retry storms). Without layered defenses at{' '}
            <strong>ingress, validation, elasticity, and downstream isolation</strong>,{' '}
            <strong>databases and core dependencies become the bottleneck first</strong> and can trigger
            site-wide incidents.
          </p>
          <h3 className="rationale-section__h3">Tie-in to integration work</h3>
          <ul className="rationale-list">
            <li>
              <strong>Retries, callbacks, and batch jobs</strong> can create{' '}
              <strong>retry storms</strong> at the integration tier—they must be designed together with
              rate limiting, circuit breaking, and fail-fast behavior.
            </li>
            <li>
              <strong>Caches and queues shift pressure but do not replace layered governance</strong>.
              The third page’s message: <strong>move protection of the DB / core toward the middle tier
              and edge</strong>—often underestimated in integration architecture.
            </li>
          </ul>
        </section>

        <section className="rationale-section">
          <h2 className="rationale-section__title">
            5. Together: a minimal complete narrative for integration engineers
          </h2>
          <div className="rationale-table-wrap">
            <table className="rationale-table">
              <thead>
                <tr>
                  <th scope="col">Dimension</th>
                  <th scope="col">Question it answers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Transaction control</td>
                  <td>
                    How data and state <strong>advance and converge correctly across systems</strong>
                  </td>
                </tr>
                <tr>
                  <td>Observability</td>
                  <td>
                    After an issue, <strong>how to localize and prove cause quickly</strong>
                  </td>
                </tr>
                <tr>
                  <td>Survivability</td>
                  <td>
                    Under stress and failure, <strong>how to protect the core and bound blast radius</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The three threads depend on each other:{' '}
            <strong>
              without observability, transactions and replay are hard to validate; without transaction
              semantics, monitoring stays superficial; without traffic and resilience governance, one
              bad dependency can take down the whole integration path
            </strong>
            . Owning all three lets you operate at the level of <strong>system design</strong>—not only
            “wiring an API.”
          </p>
        </section>

        <section className="rationale-section rationale-section--last">
          <h2 className="rationale-section__title">6. Summary</h2>
          <ul className="rationale-list">
            <li>
              <strong>Page 1</strong> makes <strong>correctness and recoverability</strong> of
              distributed integration explicit.
            </li>
            <li>
              <strong>Page 2</strong> makes <strong>diagnosability and closed-loop handling</strong> of
              cross-system incidents explicit.
            </li>
            <li>
              <strong>Page 3</strong> shows how <strong>load and dependency risk</strong> from
              integration is <strong>absorbed in layers while the core stays protected</strong>.
            </li>
          </ul>
          <p className="rationale-page__closing">
            Together they form a demonstrable, explainable backbone for{' '}
            <strong>integration and distributed architecture</strong>—useful in design reviews,
            interviews, and team alignment on what “reliable integration” actually means.
          </p>
        </section>
      </div>
    </div>
  );
}
