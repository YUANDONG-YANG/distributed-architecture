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
        <div className="rationale-page__lede-wrap">
          <p className="rationale-page__lede">
            The three tabs (<strong>transaction control</strong>, <strong>observability</strong>,{' '}
            <strong>traffic protection</strong>) each stress-tests one slice of integration work:{' '}
            <strong>correct execution</strong>, <strong>finding what broke</strong>, and{' '}
            <strong>staying up when load spikes</strong>. They do not cover everything. You still need a
            clear line on <strong>who may call what</strong> (identity and policy),{' '}
            <strong>how APIs and events change without breaking consumers</strong>,{' '}
            <strong>what latency or error rate you actually promise</strong>, and{' '}
            <strong>how that ties to money or risk</strong>. The sections below spell that out. Security is
            called out separately: it is not the same problem as rate limits or log volume.
          </p>
        </div>

        <div className="rationale-page__pillar-stack" aria-label="Four additional topics">
        <section className="rationale-section rationale-section--pillar rationale-section--pillar-security">
          <p className="rationale-section__eyebrow">Security</p>
          <h2 className="rationale-section__title">Security &amp; trust boundary</h2>
          <p>
            Throttling and bulkheads handle <strong>how much</strong> hits the system. They do not replace
            answers to <strong>who</strong> is calling, <strong>whether the credential is still valid</strong>, or{' '}
            <strong>what a partner is allowed to do</strong>. Put identity and policy on the same footing as
            throughput: otherwise you can “protect” a path that is still wide open to the wrong caller.
          </p>
          <ul className="rationale-list">
            <li>
              <strong>Authentication &amp; authorization</strong> at the edge and between services:
              human users, service accounts, batch jobs—each with scopes that match the integration.
            </li>
            <li>
              <strong>Token lifecycle</strong>: issuance, rotation, refresh, revocation, and least-privilege
              scopes tied to integration flows (callbacks, webhooks, partner APIs).
            </li>
            <li>
              <strong>Per-hop trust</strong>: assume the network is not special; attach policy to identity
              and request context, not just VLAN or IP.
            </li>
            <li>
              <strong>mTLS</strong> (or equivalent) for east–west where it buys you real assurance; wire it
              to service identity and policy, not a one-off cert install.
            </li>
            <li>
              <strong>Secret rotation</strong>: credentials for vendors, signing keys, connection strings—
              automated and observable, not quarterly heroics.
            </li>
            <li>
              <strong>Third-party access governance</strong>: scoped credentials, egress controls, allowlists,
              and audit of what external systems can reach or invoke.
            </li>
          </ul>
        </section>

        <section className="rationale-section rationale-section--pillar rationale-section--pillar-contract">
          <p className="rationale-section__eyebrow">Contracts</p>
          <h2 className="rationale-section__title">Contract governance</h2>
          <p>
            The demos focus on <strong>behavior when messages fly</strong>. In production, integrations
            also rot: schemas shift, new consumers appear, old ones lag. If you never pin down compatibility
            rules, you fix one outage and ship the next breakage with the next deploy.
          </p>
          <ul className="rationale-list">
            <li>
              <strong>API contracts</strong> written down: what may change without a major version, who owns
              the doc, how consumers get warned.
            </li>
            <li>
              <strong>Schema evolution</strong> for payloads and events: additive changes, safe rollouts,
              and clear deprecation windows.
            </li>
            <li>
              <strong>Event versioning</strong> and consumer-driven expectations so replay and new consumers
              do not silently fork reality.
            </li>
            <li>
              <strong>Consumer compatibility</strong>: who must upgrade, who can lag, and how you test
              matrix combinations.
            </li>
            <li>
              <strong>Data ownership</strong>: which system is source of truth for which fact; where
              reconciliation is a product of design, not an accident of history.
            </li>
          </ul>
        </section>

        <section className="rationale-section rationale-section--pillar rationale-section--pillar-slo">
          <p className="rationale-section__eyebrow">SLOs &amp; rehearsal</p>
          <h2 className="rationale-section__title">SLOs, capacity, and chaos engineering</h2>
          <p>
            Retry policies and circuit breakers show you thought about failure modes. That is different from
            saying <strong>how good the path must be</strong> (SLIs/SLOs), <strong>how much spare capacity
            you keep</strong>, and <strong>whether you have ever broken dependencies on purpose</strong> to
            see what actually happens.
          </p>
          <ul className="rationale-list">
            <li>
              <strong>SLIs &amp; SLOs</strong> on the integration paths that matter (latency, success,
              freshness), with a named owner and a review cadence—not a chart nobody acts on.
            </li>
            <li>
              <strong>Error budgets</strong>: when to freeze features, throttle, or invest in
              remediation—linking reliability to product trade-offs.
            </li>
            <li>
              <strong>Capacity planning &amp; headroom</strong>: peak events, partner bursts, replay
              storms—validated with load tests, not hope.
            </li>
            <li>
              <strong>Chaos engineering / game days / fault injection</strong>: inject latency, drops, or
              partial outages in staging (or controlled prod) so you see whether isolation and backoff do
              what you assumed.
            </li>
          </ul>
        </section>

        <section className="rationale-section rationale-section--pillar rationale-section--pillar-business">
          <p className="rationale-section__eyebrow">Impact</p>
          <h2 className="rationale-section__title">Business-domain framing</h2>
          <p>
            Idempotency and tracing are easier to fund when you name the downside:{' '}
            <strong>double charges</strong>, <strong>long finance close</strong>, or{' '}
            <strong>checkout down during a promo</strong>. Same mechanisms; clearer priority when you tie them
            to dollars or SLAs partners see.
          </p>
          <ul className="rationale-list">
            <li>
              <strong>Prevent duplicate charges / duplicate side effects</strong>—the monetary and
              reputational face of idempotency and exactly-once <em>effects</em>.
            </li>
            <li>
              <strong>Shorten reconciliation cycles</strong>—clear ownership of state, auditable process
              logs, and observable handoffs between finance and operations.
            </li>
            <li>
              <strong>Lower MTTR</strong> on integration incidents via correlation (requestId / business
              keys) and playbooks tied to replay and compensation.
            </li>
            <li>
              <strong>Limit blast radius</strong>—rate limits, bulkheads, and degradation paths that protect
              core catalog, payment, or fulfillment.
            </li>
            <li>
              <strong>Protect revenue paths</strong>—promotions, checkout, and partner SLAs treated as
              first-class SLOs, not afterthoughts behind internal metrics.
            </li>
          </ul>
        </section>
        </div>

        <section className="rationale-section rationale-section--surface">
          <h2 className="rationale-section__title">How this maps to the simulators</h2>
          <p>
            The three tabs are where you click through behavior. The four topics above are what you bring
            when the discussion moves to <strong>trust boundaries</strong>, <strong>long-term API
            change</strong>, <strong>committed reliability</strong>, or <strong>why the work matters to the
            business</strong>.
          </p>
          <div className="rationale-table-wrap">
            <table className="rationale-table">
              <thead>
                <tr>
                  <th scope="col">Topic</th>
                  <th scope="col">Beside the three demos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Transaction simulator</td>
                  <td>
                    Idempotency, process logs, replay, and compensation so cross-service work stays
                    consistent and fixable after partial failure.
                  </td>
                </tr>
                <tr>
                  <td>Observability</td>
                  <td>
                    Tie metrics, traces, and logs to business keys; follow a request when ownership splits or
                    a vendor black-boxes part of the path.
                  </td>
                </tr>
                <tr>
                  <td>Traffic protection</td>
                  <td>
                    Shed or shape load before it reaches databases and core services; isolate failures so
                    retries do not amplify into outages.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Security &amp; trust</strong>
                  </td>
                  <td>
                    Who may call what, with which credential, how keys rotate, and how third-party access
                    is scoped and audited.
                  </td>
                </tr>
                <tr>
                  <td>Contract governance</td>
                  <td>
                    Schema and event rules, deprecation windows, and which team owns which fact so drift is
                    visible early.
                  </td>
                </tr>
                <tr>
                  <td>SLO / capacity / chaos</td>
                  <td>
                    Numbers you stand behind, headroom for peaks, and exercises that break dependencies on
                    purpose.
                  </td>
                </tr>
                <tr>
                  <td>Business framing</td>
                  <td>
                    Duplicate charges, reconciliation time, incident duration, and how far a partner outage
                    can spread.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rationale-section rationale-section--surface rationale-section--last">
          <h2 className="rationale-section__title">Summary</h2>
          <ul className="rationale-list">
            <li>
              The three tabs cover execution, troubleshooting, and load—<strong>the usual integration
              triad</strong>.
            </li>
            <li>
              <strong>Security</strong> is its own topic: identity, policy, secrets—not a footnote under
              traffic or logging.
            </li>
            <li>
              <strong>Contracts</strong> decide whether you can change systems for years without surprise
              breaks.
            </li>
            <li>
              <strong>SLOs, capacity, chaos</strong> turn “we handle failure” into numbers and drills you
              can defend.
            </li>
            <li>
              <strong>Business framing</strong> states the cost of getting it wrong in terms finance and
              partners already use.
            </li>
          </ul>
          <p className="rationale-page__closing">
            Use the demos for hands-on behavior; use these four when the question is trust, change over
            time, measurable reliability, or impact outside engineering.
          </p>
        </section>
      </div>
    </div>
  );
}
