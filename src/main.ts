import "@corvaui/tokens/css";
import "@corvaui/web-components/components/corva-accordion.js";
import "@corvaui/web-components/components/corva-alert.js";
import "@corvaui/web-components/components/corva-app-bar.js";
import "@corvaui/web-components/components/corva-autocomplete.js";
import "@corvaui/web-components/components/corva-badge.js";
import "@corvaui/web-components/components/corva-breadcrumbs.js";
import "@corvaui/web-components/components/corva-button.js";
import "@corvaui/web-components/components/corva-button-group.js";
import "@corvaui/web-components/components/corva-calendar.js";
import "@corvaui/web-components/components/corva-card.js";
import "@corvaui/web-components/components/corva-chart.js";
import "@corvaui/web-components/components/corva-checkbox.js";
import "@corvaui/web-components/components/corva-chip.js";
import "@corvaui/web-components/components/corva-data-grid.js";
import "@corvaui/web-components/components/corva-data-table.js";
import "@corvaui/web-components/components/corva-date-picker.js";
import "@corvaui/web-components/components/corva-divider.js";
import "@corvaui/web-components/components/corva-file-upload.js";
import "@corvaui/web-components/components/corva-list.js";
import "@corvaui/web-components/components/corva-number-field.js";
import "@corvaui/web-components/components/corva-paper.js";
import "@corvaui/web-components/components/corva-progress.js";
import "@corvaui/web-components/components/corva-radio-group.js";
import "@corvaui/web-components/components/corva-search-form.js";
import "@corvaui/web-components/components/corva-select.js";
import "@corvaui/web-components/components/corva-sidebar.js";
import "@corvaui/web-components/components/corva-slider.js";
import "@corvaui/web-components/components/corva-snackbar.js";
import "@corvaui/web-components/components/corva-stack.js";
import "@corvaui/web-components/components/corva-stepper.js";
import "@corvaui/web-components/components/corva-switch.js";
import "@corvaui/web-components/components/corva-tabs.js";
import "@corvaui/web-components/components/corva-text-field.js";
import "@corvaui/web-components/components/corva-textarea.js";
import "@corvaui/web-components/components/corva-time-picker.js";
import "@corvaui/web-components/components/corva-timeline.js";
import "@corvaui/web-components/components/corva-toggle-group.js";
import "@corvaui/web-components/components/corva-toolbar.js";
import "@corvaui/web-components/components/corva-tree-view.js";
import "@corvaui/web-components/components/corva-typography.js";
import "@corvaui/web-components/components/corva-workflow-board.js";
import "./styles.css";

type ThemeMode = "light" | "dark";
type RouteId = "home" | "dashboard" | "work-orders" | "customers" | "settings" | "about";
type DataElement<T> = HTMLElement & T;
type Tone = "info" | "success" | "warning" | "danger";

type RouteDefinition = {
  badge: string;
  id: RouteId;
  label: string;
  title: string;
};

const routes: RouteDefinition[] = [
  { badge: "Site", id: "home", label: "Home", title: "Marketing home" },
  { badge: "Ops", id: "dashboard", label: "Metrics", title: "Metrics dashboard" },
  { badge: "Form", id: "work-orders", label: "Work orders", title: "Work order form" },
  { badge: "CRM", id: "customers", label: "Customers", title: "Customer records" },
  { badge: "Admin", id: "settings", label: "Settings", title: "Settings and account" },
  { badge: "Proof", id: "about", label: "About", title: "Package proof" },
];

const appShell = document.querySelector("#app-shell") as HTMLElement;
const routeView = document.querySelector("#route-view") as HTMLElement;
const themeBadge = document.querySelector("#theme-badge") as HTMLElement;
const lightButton = document.querySelector("#theme-light") as HTMLElement;
const darkButton = document.querySelector("#theme-dark") as HTMLElement;
const sidebar = document.querySelector("#nav") as DataElement<{
  activeId?: string;
  items?: Array<{ badge?: string; href?: string; id: string; label: string }>;
}>;
const snackbar = document.querySelector("#snackbar") as DataElement<{ open?: boolean; tone?: Tone }>;
const mobileNav = document.querySelector("#mobile-nav") as HTMLElement;

snackbar.open = false;
sidebar.items = routes.map((route) => ({
  badge: route.badge,
  href: routeHref(route.id),
  id: route.id,
  label: route.label,
}));
mobileNav.innerHTML = routes.map((route) => `<a href="${routeHref(route.id)}">${route.label}</a>`).join("");

function routeHref(route: RouteId) {
  return route === "home" ? "#/" : `#/${route}`;
}

function readRoute(): RouteId {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const route = raw || "home";
  return routes.some((item) => item.id === route) ? (route as RouteId) : "home";
}

function setTheme(mode: ThemeMode) {
  const theme = `indigo-${mode}`;
  appShell.dataset.corvaTheme = theme;
  themeBadge.textContent = theme;
  lightButton.setAttribute("variant", mode === "light" ? "primary" : "secondary");
  darkButton.setAttribute("variant", mode === "dark" ? "primary" : "secondary");
  window.localStorage.setItem("northstar-theme", mode);

  const settingsTheme = routeView.querySelector("#settings-theme") as DataElement<{ value?: string }> | null;
  if (settingsTheme) {
    settingsTheme.value = mode;
  }
}

function notify(message: string, tone: Tone = "success") {
  snackbar.textContent = message;
  snackbar.tone = tone;
  snackbar.open = false;
  window.setTimeout(() => {
    snackbar.open = true;
  }, 0);
}

function setOptions(
  selector: string,
  options: Array<{ description?: string; label: string; value: string }> | string[],
) {
  const element = routeView.querySelector(selector) as DataElement<{ options?: typeof options }> | null;
  if (element) {
    element.options = options;
  }
}

function setRows(
  selector: string,
  columns: Array<{ key: string; header: string }>,
  rows: Array<Record<string, string | number | boolean | null | undefined>>,
) {
  const element = routeView.querySelector(selector) as DataElement<{
    columns?: typeof columns;
    rows?: typeof rows;
  }> | null;
  if (element) {
    element.columns = columns;
    element.rows = rows;
  }
}

function setChart(selector: string, data: Array<{ label: string; value: number }>) {
  const element = routeView.querySelector(selector) as DataElement<{ data?: typeof data }> | null;
  if (element) {
    element.data = data;
  }
}

function setWorkflow(
  selector: string,
  columns: Array<{ id: string; items: Array<{ id: string; meta?: string; title: string }>; title: string }>,
) {
  const element = routeView.querySelector(selector) as DataElement<{ columns?: typeof columns }> | null;
  if (element) {
    element.columns = columns;
  }
}

function setTimeline(selector: string, events: Array<{ description?: string; id: string; label: string; meta?: string }>) {
  const element = routeView.querySelector(selector) as DataElement<{ events?: typeof events }> | null;
  if (element) {
    element.events = events;
  }
}

function setBreadcrumbs(current: RouteDefinition) {
  const crumbs = routeView.querySelector("#breadcrumbs") as DataElement<{
    items?: Array<{ current?: boolean; href?: string; label: string }>;
  }> | null;
  if (crumbs) {
    crumbs.items = [
      { href: "#/", label: "CorvaUI" },
      { current: true, label: current.title },
    ];
  }
}

function render() {
  const route = readRoute();
  const definition = routes.find((item) => item.id === route) ?? routes[0];
  sidebar.activeId = route;
  mobileNav.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === routeHref(route)) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  routeView.innerHTML = templates[route]();
  setBreadcrumbs(definition);
  configureRoute(route);
  routeView.scrollTo({ top: 0 });
}

function pageShell(route: RouteId, eyebrow: string, title: string, body: string, content: string) {
  return `
    <div class="page">
      <corva-breadcrumbs id="breadcrumbs" label="Page trail"></corva-breadcrumbs>
      <div class="page-heading">
        <corva-stack gap="sm">
          <corva-badge tone="info">${eyebrow}</corva-badge>
          <corva-typography as="h1" variant="display">${title}</corva-typography>
          <corva-typography variant="body">${body}</corva-typography>
        </corva-stack>
        <div class="page-heading-actions">
          <a class="button-link" href="${routeHref(route === "home" ? "dashboard" : "work-orders")}">
            <corva-button>${route === "home" ? "Open dashboard" : "New work order"}</corva-button>
          </a>
          <a class="button-link" href="${routeHref("about")}">
            <corva-button variant="secondary">Package proof</corva-button>
          </a>
        </div>
      </div>
      ${content}
    </div>
  `;
}

const templates: Record<RouteId, () => string> = {
  home: () =>
    pageShell(
      "home",
      "Regional service operations",
      "Northstar gives distributed field teams one clear operating picture.",
      "A framework-free CorvaUI application for mobile technicians, dispatch leads, asset owners, and control-room teams who need speed without sacrificing rigor.",
      `
        <section class="immersive-hero" aria-labelledby="northstar-story-title">
          <img src="/images/northstar-workshop.jpg" alt="A mobile field workshop prepared with tools and service equipment" />
          <div class="immersive-hero-copy">
            <corva-badge tone="success">Field network online</corva-badge>
            <corva-typography id="northstar-story-title" as="h2" variant="title">One operating desk from first call to verified closeout.</corva-typography>
            <corva-typography variant="body">Dispatchers see capacity, technicians receive complete work packets, and leaders see risk without adding a framework runtime.</corva-typography>
            <div class="hero-actions">
              <a class="button-link" href="${routeHref("work-orders")}"><corva-button size="lg">Create sample order</corva-button></a>
              <a class="button-link" href="${routeHref("dashboard")}"><corva-button size="lg" variant="secondary">Open control room</corva-button></a>
            </div>
          </div>
          <div class="hero-proof" aria-label="Network proof">
            <span><strong>41%</strong> faster same-day scheduling</span>
            <span><strong>96%</strong> work packets complete</span>
            <corva-badge tone="info">Indigo tokens</corva-badge>
          </div>
        </section>

        <div class="metric-strip">
          <corva-card eyebrow="Booked capacity" heading="86%">
            <corva-progress label="Weekly crew allocation" value="86"></corva-progress>
          </corva-card>
          <corva-card eyebrow="Open work" heading="124 orders">
            <corva-progress label="Orders with owner" value="91"></corva-progress>
          </corva-card>
          <corva-card eyebrow="Customer health" heading="22 at risk">
            <corva-progress label="Renewal rescue plan" value="64"></corva-progress>
          </corva-card>
        </div>

        <div class="split-grid">
          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Offer</corva-typography>
              <corva-list>
                <li class="corva-list-item"><span>Dispatch planning with capacity and SLA context</span><corva-badge tone="info">Plan</corva-badge></li>
                <li class="corva-list-item"><span>Work order packets with parts, access, and safety notes</span><corva-badge tone="success">Do</corva-badge></li>
                <li class="corva-list-item"><span>Customer pipeline records tied to revenue and renewals</span><corva-badge tone="neutral">Grow</corva-badge></li>
              </corva-list>
            </corva-stack>
          </corva-paper>
          <corva-chart id="home-chart" label="CorvaUI rollout results"></corva-chart>
        </div>

        <figure class="story-photo">
          <img src="/images/northstar-control-room.jpg" alt="Operational control room with monitoring panels and equipment" />
          <figcaption><span>Connected operations</span><strong>Field evidence becomes control-room context without translation.</strong></figcaption>
        </figure>

        <corva-alert tone="success" heading="Proof path">This demo uses a vanilla hash router, CorvaUI web components, and indigo light/dark token themes.</corva-alert>
      `,
    ),

  dashboard: () =>
    pageShell(
      "dashboard",
      "Operations command",
      "Live metrics for crew capacity, SLA risk, and daily closeout.",
      "This route uses charts, tables, progress, workflow status, and scheduling widgets to model a real dispatcher dashboard.",
      `
        <corva-toolbar label="Dashboard actions" justify="between" wrap>
          <corva-button size="sm" id="refresh-dashboard">Refresh signals</corva-button>
          <corva-button size="sm" variant="secondary">Export board</corva-button>
          <corva-badge tone="success">07:42 sync</corva-badge>
        </corva-toolbar>

        <div class="dashboard-grid">
          <corva-card eyebrow="SLA protection" heading="94%">
            <corva-progress label="Jobs on protected schedule" value="94"></corva-progress>
          </corva-card>
          <corva-card eyebrow="First visit fix" heading="78%">
            <corva-progress label="Resolved without return trip" value="78"></corva-progress>
          </corva-card>
          <corva-card eyebrow="Safety packet" heading="19 gaps">
            <corva-progress label="Orders ready for dispatch" value="69"></corva-progress>
          </corva-card>
          <corva-chart id="dashboard-chart" label="Crew capacity by region"></corva-chart>
        </div>

        <figure class="dashboard-photo">
          <img src="/images/northstar-control-room.jpg" alt="Control room used to coordinate field operations" />
          <figcaption><span>Regional desk</span><strong>Exceptions, ownership, and readiness stay visible.</strong></figcaption>
        </figure>

        <div class="split-grid wide-left">
          <corva-data-table id="dashboard-table" caption="High priority work orders"></corva-data-table>
          <corva-calendar label="June dispatch board" month-label="June 2026"></corva-calendar>
        </div>

        <corva-paper>
          <corva-stack gap="md">
            <corva-typography as="h2" variant="title">Workflow board</corva-typography>
            <corva-workflow-board id="dispatch-board"></corva-workflow-board>
          </corva-stack>
        </corva-paper>
      `,
    ),

  "work-orders": () =>
    pageShell(
      "work-orders",
      "Dispatch intake",
      "Create a work order with assignment, schedule, validation, and field evidence.",
      "The sample form validates required customer, site, date, and problem fields before showing a saved state.",
      `
        <form class="form-grid" id="work-order-form" novalidate>
          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Request details</corva-typography>
              <corva-text-field id="wo-customer" label="Customer" name="customer" value="Harborline Utilities" hint="Account or organization"></corva-text-field>
              <corva-text-field id="wo-site" label="Service site" name="site" placeholder="Facility, address, or asset tag" hint="Required for dispatch"></corva-text-field>
              <corva-textarea id="wo-problem" label="Problem summary" name="problem" rows="5" placeholder="Describe failure, access notes, and visible hazards"></corva-textarea>
              <corva-file-upload id="wo-files" label="Field evidence" action-label="Attach files" description="PDF, JPG, PNG up to 10 MB" accept=".pdf,.jpg,.jpeg,.png" multiple></corva-file-upload>
            </corva-stack>
          </corva-paper>

          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Dispatch plan</corva-typography>
              <corva-date-picker id="wo-date" label="Target date" name="targetDate" value="2026-06-18" hint="Crew commitment date"></corva-date-picker>
              <corva-time-picker id="wo-time" label="Arrival window" name="arrival" value="09:30" hint="Local site time"></corva-time-picker>
              <corva-select id="wo-region" label="Region" name="region" value="north" hint="Routes the order to a dispatcher"></corva-select>
              <corva-autocomplete id="wo-owner" label="Lead technician" placeholder="Select technician" value="Maya Chen" hint="Optional until scheduled"></corva-autocomplete>
              <corva-radio-group id="wo-priority" label="Priority" name="priority" value="same-day"></corva-radio-group>
              <corva-checkbox label="Customer has confirmed access window" checked></corva-checkbox>
              <corva-button type="submit">Save work order</corva-button>
            </corva-stack>
          </corva-paper>
        </form>

        <corva-stepper id="wo-stepper" active-index="1"></corva-stepper>
      `,
    ),

  customers: () =>
    pageShell(
      "customers",
      "Customer operations",
      "Pipeline, records, and account detail in one route.",
      "Account managers can scan renewals, sort active records, and inspect work history patterns without leaving the customer workspace.",
      `
        <corva-toolbar label="Customer tools" wrap>
          <corva-search-form id="customer-search" label="Find customer" placeholder="Search company, region, owner"></corva-search-form>
          <corva-button size="sm" variant="secondary">Import accounts</corva-button>
          <corva-button size="sm">Add record</corva-button>
        </corva-toolbar>

        <div class="split-grid wide-left">
          <corva-data-grid id="customer-grid" caption="Customer records"></corva-data-grid>
          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Harborline Utilities</corva-typography>
              <div class="detail-row"><span>Owner</span><strong>Priya Kapoor</strong></div>
              <div class="detail-row"><span>Renewal</span><strong>2026-09-30</strong></div>
              <div class="detail-row"><span>Open work</span><strong>18 orders</strong></div>
              <div class="section-rule" role="presentation"></div>
              <corva-list>
                <li class="corva-list-item"><span>North substations access list refreshed</span><corva-badge tone="success">Done</corva-badge></li>
                <li class="corva-list-item"><span>Generator inspection needs quote approval</span><corva-badge tone="warning">Risk</corva-badge></li>
                <li class="corva-list-item"><span>Q3 capacity review scheduled</span><corva-badge tone="info">Next</corva-badge></li>
              </corva-list>
            </corva-stack>
          </corva-paper>
        </div>

        <corva-paper>
          <corva-stack gap="md">
            <corva-typography as="h2" variant="title">Pipeline board</corva-typography>
            <corva-workflow-board id="customer-board"></corva-workflow-board>
          </corva-stack>
        </corva-paper>
      `,
    ),

  settings: () =>
    pageShell(
      "settings",
      "Account controls",
      "Preferences for identity, notification policy, locale, and theme.",
      "Settings demonstrate tabs, toggles, selection controls, sliders, and theme mode updates inside the same token scope.",
      `
        <corva-tabs id="settings-tabs" label="Settings sections" active-id="profile"></corva-tabs>

        <div class="split-grid">
          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Profile</corva-typography>
              <corva-text-field label="Workspace name" value="CorvaUI Field Services"></corva-text-field>
              <corva-text-field label="Account owner" value="Maya Chen"></corva-text-field>
              <corva-select id="settings-locale" label="Locale" value="en-us" hint="Used for date and number formatting"></corva-select>
              <corva-toggle-group id="settings-theme" label="Theme mode"></corva-toggle-group>
            </corva-stack>
          </corva-paper>

          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Preferences</corva-typography>
              <corva-switch label="Notify dispatcher when SLA risk changes" checked></corva-switch>
              <corva-switch label="Require photo evidence before closeout" checked></corva-switch>
              <corva-switch label="Send daily customer health digest"></corva-switch>
              <corva-slider label="Default drive buffer minutes" min="5" max="45" step="5" value="20"></corva-slider>
              <corva-button id="save-settings">Save settings</corva-button>
            </corva-stack>
          </corva-paper>
        </div>

        <corva-alert tone="info" heading="Theme scope">The assigned theme defaults to indigo-dark. The toggle switches the same CorvaUI token family to indigo-light.</corva-alert>
      `,
    ),

  about: () =>
    pageShell(
      "about",
      "Implementation proof",
      "Installed packages, routing strategy, and framework integration notes.",
      "This route is a proof page for reviewers: it describes how the vanilla demo consumes CorvaUI packages without adding a framework runtime.",
      `
        <div class="split-grid wide-left">
          <corva-paper>
            <corva-stack gap="md">
              <corva-typography as="h2" variant="title">Package proof</corva-typography>
              <corva-data-table id="package-table" caption="Installed CorvaUI packages"></corva-data-table>
            </corva-stack>
          </corva-paper>
          <corva-card eyebrow="Router" heading="Small hash router">
            <corva-list ordered>
              <li class="corva-list-item"><span>Read location hash</span><corva-badge tone="success">Vanilla</corva-badge></li>
              <li class="corva-list-item"><span>Render route template</span><corva-badge tone="info">TypeScript</corva-badge></li>
              <li class="corva-list-item"><span>Assign CorvaUI component data</span><corva-badge tone="success">Props</corva-badge></li>
            </corva-list>
          </corva-card>
        </div>

        <div class="split-grid">
          <corva-timeline id="about-timeline"></corva-timeline>
          <corva-tree-view id="about-tree" label="Integration map"></corva-tree-view>
        </div>

        <corva-alert tone="success" heading="No framework dependency">The route shell is plain DOM, local CSS composes layout, and all controls are CorvaUI web components.</corva-alert>
      `,
    ),
};

function configureRoute(route: RouteId) {
  if (route === "home") {
    setChart("#home-chart", [
      { label: "On-time arrival", value: 92 },
      { label: "Return trips avoided", value: 78 },
      { label: "Renewals protected", value: 83 },
    ]);
  }

  if (route === "dashboard") {
    setChart("#dashboard-chart", [
      { label: "North", value: 88 },
      { label: "Central", value: 73 },
      { label: "South", value: 81 },
      { label: "Coastal", value: 66 },
    ]);
    setRows(
      "#dashboard-table",
      [
        { key: "order", header: "Order" },
        { key: "customer", header: "Customer" },
        { key: "owner", header: "Owner" },
        { key: "status", header: "Status" },
      ],
      [
        { customer: "Harborline Utilities", order: "WO-1842", owner: "Maya Chen", status: "Access check" },
        { customer: "PrairieCare Campuses", order: "WO-1847", owner: "Omar Haddad", status: "Parts hold" },
        { customer: "MetroGrid Facilities", order: "WO-1851", owner: "Elena Rossi", status: "Ready" },
        { customer: "Crownline Health", order: "WO-1856", owner: "Jon Bell", status: "Safety packet" },
      ],
    );
    setWorkflow("#dispatch-board", [
      { id: "intake", items: [{ id: "wo-1842", meta: "12 min", title: "Confirm north gate access" }], title: "Intake" },
      {
        id: "scheduled",
        items: [
          { id: "wo-1847", meta: "10:00", title: "Boiler room pressure test" },
          { id: "wo-1851", meta: "13:30", title: "Generator relay inspection" },
        ],
        title: "Scheduled",
      },
      { id: "closed", items: [{ id: "wo-1831", meta: "08:20", title: "Cooling tower closeout" }], title: "Closed today" },
    ]);
    routeView.querySelector("#refresh-dashboard")?.addEventListener("click", () => notify("Dashboard signals refreshed"));
  }

  if (route === "work-orders") {
    setOptions("#wo-region", [
      { label: "North region", value: "north" },
      { label: "Central region", value: "central" },
      { label: "South region", value: "south" },
    ]);
    setOptions("#wo-owner", ["Maya Chen", "Omar Haddad", "Elena Rossi", "Jon Bell"]);
    setOptions("#wo-priority", [
      { description: "Dispatch before end of current operating day", label: "Same day", value: "same-day" },
      { description: "Schedule within two business days", label: "Standard", value: "standard" },
      { description: "Needs quote or customer approval first", label: "Hold", value: "hold" },
    ]);
    const files = routeView.querySelector("#wo-files") as DataElement<{
      files?: Array<{ meta?: string; name: string }>;
    }> | null;
    if (files) {
      files.files = [{ meta: "sample", name: "north-substation-panel.jpg" }];
    }
    const stepper = routeView.querySelector("#wo-stepper") as DataElement<{
      steps?: Array<{ description?: string; id: string; label: string }>;
    }> | null;
    if (stepper) {
      stepper.steps = [
        { description: "Customer and site", id: "intake", label: "Intake" },
        { description: "Crew and arrival window", id: "dispatch", label: "Dispatch" },
        { description: "Closeout packet", id: "closeout", label: "Closeout" },
      ];
    }
    bindWorkOrderForm();
  }

  if (route === "customers") {
    setRows(
      "#customer-grid",
      [
        { key: "account", header: "Account" },
        { key: "segment", header: "Segment" },
        { key: "owner", header: "Owner" },
        { key: "health", header: "Health" },
        { key: "renewal", header: "Renewal" },
      ],
      [
        { account: "Harborline Utilities", health: "At risk", owner: "Priya Kapoor", renewal: "2026-09-30", segment: "Utility" },
        { account: "MetroGrid Facilities", health: "Healthy", owner: "Maya Chen", renewal: "2027-01-15", segment: "Facilities" },
        { account: "PrairieCare Campuses", health: "Pilot", owner: "Omar Haddad", renewal: "2026-12-01", segment: "Education" },
        { account: "Crownline Health", health: "Expanding", owner: "Elena Rossi", renewal: "2026-10-18", segment: "Healthcare" },
      ],
    );
    setWorkflow("#customer-board", [
      { id: "lead", items: [{ id: "acct-91", meta: "$48k", title: "Riverbend Transit" }], title: "Qualified" },
      { id: "proposal", items: [{ id: "acct-42", meta: "$132k", title: "Crownline Health expansion" }], title: "Proposal" },
      { id: "renewal", items: [{ id: "acct-17", meta: "Sep 30", title: "Harborline rescue plan" }], title: "Renewal" },
    ]);
  }

  if (route === "settings") {
    const storedTheme = appShell.dataset.corvaTheme === "indigo-light" ? "light" : "dark";
    setOptions("#settings-locale", [
      { label: "English (United States)", value: "en-us" },
      { label: "English (Canada)", value: "en-ca" },
      { label: "Spanish (United States)", value: "es-us" },
    ]);
    setOptions("#settings-theme", [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ]);
    const themeToggle = routeView.querySelector("#settings-theme") as DataElement<{ value?: string }> | null;
    if (themeToggle) {
      themeToggle.value = storedTheme;
      themeToggle.addEventListener("corvaChange", (event) => {
        const nextMode = (event as CustomEvent<{ value: ThemeMode }>).detail.value;
        setTheme(nextMode);
      });
    }
    const tabs = routeView.querySelector("#settings-tabs") as DataElement<{
      items?: Array<{ id: string; label: string }>;
    }> | null;
    if (tabs) {
      tabs.items = [
        { id: "profile", label: "Profile" },
        { id: "notifications", label: "Notifications" },
        { id: "security", label: "Security" },
      ];
    }
    routeView.querySelector("#save-settings")?.addEventListener("click", () => notify("Settings saved"));
  }

  if (route === "about") {
    setRows(
      "#package-table",
      [
        { key: "package", header: "Package" },
        { key: "usage", header: "Usage" },
        { key: "proof", header: "Proof" },
      ],
      [
        { package: "@corvaui/web-components", proof: "Direct custom element imports", usage: "Controls and data display" },
        { package: "@corvaui/tokens", proof: "data-corva-theme scope", usage: "Indigo light/dark themes" },
        { package: "vite", proof: "Static Vercel build", usage: "Vanilla TypeScript bundling" },
      ],
    );
    setTimeline("#about-timeline", [
      { description: "Hash is parsed into a RouteId", id: "hash", label: "Route", meta: "router" },
      { description: "Template HTML is rendered into the route view", id: "render", label: "Render", meta: "DOM" },
      { description: "CorvaUI props receive typed rows, charts, options, and board data", id: "hydrate", label: "Hydrate", meta: "components" },
    ]);
    const tree = routeView.querySelector("#about-tree") as DataElement<{
      items?: Array<{ children?: Array<{ id: string; label: string }>; id: string; label: string }>;
    }> | null;
    if (tree) {
      tree.items = [
        {
          children: [
            { id: "components", label: "@corvaui/web-components" },
            { id: "tokens", label: "@corvaui/tokens/css" },
          ],
          id: "packages",
          label: "Installed packages",
        },
        {
          children: [
            { id: "router", label: "src/main.ts hash router" },
            { id: "layout", label: "src/styles.css composition" },
          ],
          id: "vanilla",
          label: "Vanilla app",
        },
      ];
    }
  }

  window.setTimeout(() => {
    routeView.querySelectorAll<HTMLElement>(".corva-table-container").forEach((container) => {
      const caption = container.querySelector("caption")?.textContent?.trim() ?? "Data table";
      container.tabIndex = 0;
      container.setAttribute("role", "region");
      container.setAttribute("aria-label", `${caption}, horizontally scrollable`);
    });
    routeView.querySelectorAll<HTMLElement>("corva-workflow-board").forEach((board) => {
      board.tabIndex = 0;
      board.setAttribute("role", "region");
      board.setAttribute("aria-label", "Workflow board, horizontally scrollable");
    });
  }, 0);
}

function bindWorkOrderForm() {
  const form = routeView.querySelector("#work-order-form") as HTMLFormElement | null;
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [
      { id: "wo-customer", message: "Customer is required" },
      { id: "wo-site", message: "Service site is required" },
      { id: "wo-problem", message: "Problem summary is required" },
      { id: "wo-date", message: "Target date is required" },
    ];
    let valid = true;

    for (const field of fields) {
      const element = routeView.querySelector(`#${field.id}`) as DataElement<{ error?: string; value?: string }> | null;
      if (!element) {
        continue;
      }
      const value = (element.value ?? element.getAttribute("value") ?? "").trim();
      element.error = value ? "" : field.message;
      if (!value) {
        valid = false;
      }
    }

    notify(valid ? "Work order saved as WO-1862" : "Complete required work order fields", valid ? "success" : "danger");
  });
}

lightButton.addEventListener("click", () => setTheme("light"));
darkButton.addEventListener("click", () => setTheme("dark"));
sidebar.addEventListener("corvaSelect", (event) => {
  const selected = (event as CustomEvent<RouteId>).detail;
  if (routes.some((route) => route.id === selected)) {
    window.location.hash = routeHref(selected);
  }
});
window.addEventListener("hashchange", render);

setTheme((window.localStorage.getItem("northstar-theme") as ThemeMode | null) ?? "dark");
render();
