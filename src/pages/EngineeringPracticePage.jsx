import { TAB_META } from '../data/tabs.js';

const meta = TAB_META.engineering;

export function EngineeringPracticePage() {
  return (
    <div className="rationale-page engineering-practice-page">
      <header className="rationale-page__header">
        <h1 className="rationale-page__title">{meta.pageTitle}</h1>
        <p className="rationale-page__subtitle">{meta.pageSubtitle}</p>
      </header>

      <div className="rationale-page__body">
        <div className="rationale-page__lede-wrap">
          <p className="rationale-page__lede">
            <strong>Design Rationale</strong> sketches the full picture. This tab is narrower:{' '}
            <strong>which artifacts you actually maintain</strong> (code paths, tables, queues),{' '}
            <strong>where traffic and retries land before the database</strong>, and{' '}
            <strong>how you’d explain a real outage or rollout</strong> without stopping at buzzwords.
          </p>
        </div>

        <section className="rationale-section rationale-section--surface">
          <p className="rationale-section__eyebrow">I · Mechanisms</p>
          <h2 className="rationale-section__title">Same themes as the demos, with file-level detail</h2>
          <p>
            Each block below matches a tab in the app. The second paragraph is the sort of answer you give
            when someone asks “what did you use?”—not a recap of the slide title.
          </p>
        </section>

        <div className="rationale-page__pillar-stack" aria-label="Mechanisms by simulator theme">
          <section className="rationale-section rationale-section--pillar rationale-section--pillar-business">
            <p className="rationale-section__eyebrow">Transaction simulator</p>
            <h2 className="rationale-section__title">Transaction control</h2>
            <p>
              Everyone says idempotency and compensation. The useful part is the wiring: which row moves,
              which log line is authoritative, and where a duplicate delivery stops.
            </p>
            <p className="engineering-landing">
              Guard illegal transitions with a <strong>small state machine</strong>; keep versions with{' '}
              <strong>CAS or optimistic locks</strong>; treat an append-only <strong>process log</strong> as
              the replay source; pair <strong>outbox rows</strong> with your publisher so publish order matches
              commit order; make consumers <strong>idempotent on a business key</strong>; wire{' '}
              <strong>retry, then DLQ, then controlled replay</strong> (plus manual steps when replay would
              lie about money).
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-contract">
            <p className="rationale-section__eyebrow">Observability</p>
            <h2 className="rationale-section__title">Tracing that still works when a vendor goes dark</h2>
            <p>
              Dashboards help after you know the slice. The hard bit is carrying the same identifiers through
              metrics, logs, and traces so half a path is still debuggable.
            </p>
            <p className="engineering-landing">
              Pick a <strong>requestId</strong> at the edge and refuse requests without it where you can;
              add a <strong>business key</strong> (order id, transfer ref) on log lines and span attributes;
              line up metric labels with those fields. When the partner drops your trace context, you can
              still stitch from alert → log → rough latency from metrics.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-security">
            <p className="rationale-section__eyebrow">Traffic protection</p>
            <h2 className="rationale-section__title">Stopping junk before it becomes row locks</h2>
            <p>
              “Protect the core” means nothing until you name the hop: gateway, queue, app pool, then
              database. If the DB is absorbing retries and spikes, the design already lost.
            </p>
            <p className="engineering-landing">
              <strong>Rate limit and validate cheaply</strong> at the edge; scale out the stateless tier;
              use <strong>bulkheads and breakers</strong> so one bad dependency does not flatten the pool;
              keep a <strong>degraded response path</strong> (cached read, async ticket, static fallback)
              that caps how many synchronous writes hit the store during a storm.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-slo">
            <p className="rationale-section__eyebrow">Contract governance</p>
            <h2 className="rationale-section__title">Many consumers, one producer</h2>
            <p>
              Backward compatible is a wish until you track who is on which schema and what happens when you
              tighten a field.
            </p>
            <p className="engineering-landing">
              Ship <strong>explicit API versions</strong>; document additive-only rules for events and
              payloads; keep a small <strong>matrix</strong> (consumer × min version × known breakage). That
              is how you schedule a breaking change instead of discovering it in prod logs.
            </p>
          </section>

          <section className="rationale-section rationale-section--pillar rationale-section--pillar-implementation">
            <p className="rationale-section__eyebrow">SLO / capacity / chaos</p>
            <h2 className="rationale-section__title">Budgets that change the queue order</h2>
            <p>
              SLIs matter when they change behavior: freeze features, turn down traffic, or move headcount to
              the path that is actually burning error budget.
            </p>
            <p className="engineering-landing">
              Measure <strong>latency, success, freshness</strong> on the paths you sell; size{' '}
              <strong>headroom</strong> against peak plus replay load; when the budget is gone,{' '}
              <strong>throttle or stop shipping</strong> non-critical work and put fixes for the hot path
              ahead of new scope.
            </p>
          </section>
        </div>

        <section className="rationale-section rationale-section--surface">
          <p className="rationale-section__eyebrow">II · Concurrency &amp; performance</p>
          <h2 className="rationale-section__title">Load, retries, and the database</h2>
          <p>
            Governance slides rarely mention thread pools and partition hot spots. In practice those are what
            decide whether a spike becomes an outage.
          </p>
          <ul className="rationale-list">
            <li>
              <strong>Database first</strong>: pool size matched to what the CPU and locks can take; split hot
              rows or serialize contentious updates; cap statement time so one query cannot starve the pool;
              use replicas for read-heavy paths where stale reads are acceptable.
            </li>
            <li>
              <strong>Bursts</strong>: let queues or buffers soak traffic that would otherwise open thousands
              of transactions at once; match admission at the edge to what the slowest hop can drain.
            </li>
            <li>
              <strong>App tier</strong>: horizontal pods, shard-aware routing if data is partitioned; warm
              capacity before known events; session stickiness only when the session store demands it.
            </li>
            <li>
              <strong>Retries</strong>: jitter and hard caps; breakers so you do not coordinate a thundering
              herd; idempotency keys so a retry is not a second payment; DLQ when you are not sure it is safe
              to try again.
            </li>
            <li>
              <strong>Off the synchronous path</strong>: cache with a real invalidation story; hand work to
              MQ and batch writers; expose async APIs when the user can wait on a callback instead of holding
              a long HTTP transaction open.
            </li>
          </ul>
        </section>

        <section className="rationale-section rationale-section--surface rationale-section--last">
          <p className="rationale-section__eyebrow">III · Ownership</p>
          <h2 className="rationale-section__title">How I talk about my own work</h2>
          <p>
            Abstract principles are easy to copy. What convinces people is a clear split of phases, keys, and
            failure handling—stated plainly.
          </p>
          <ul className="rationale-list">
            <li>
              I break cross-system work into <strong>commit → outbox dispatch → idempotent apply → fix-up</strong>
              (replay or compensate) and I name which store holds the truth at each step.
            </li>
            <li>
              <strong>requestId + business key</strong> are non-optional in logs and traces on systems I own;
              I push vendors toward the same fields even when tracing breaks mid-flight.
            </li>
            <li>
              I draw a line between <strong>must succeed now</strong> (sync, strong checks) and{' '}
              <strong>can lag or degrade</strong> (async fan-out, stale reads, canned responses when deps are
              down).
            </li>
            <li>
              Traffic hits <strong>cheap checks first</strong>, then bounded pools and queues, and only then
              the transactional core—so the database is rarely the first thing that saturates.
            </li>
            <li>
              Replay tooling, compensation hooks, and runbooks for the ugly cases ship together; I do not
              promise automated recovery for flows we would not safely re-drive.
            </li>
          </ul>
          <p className="rationale-page__closing">
            Keep <strong>Design Rationale</strong> for breadth. Use this tab when the conversation needs{' '}
            <strong>names of mechanisms</strong>, <strong>honest load paths</strong>, and{' '}
            <strong>how you behaved on a real integration</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
