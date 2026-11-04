"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowDownUp, Bell, CheckCircle2, ChevronDown, CircleHelp, Clock3, Download, Filter, LayoutDashboard, LogOut, Mail, MapPin, MessageSquareText, Phone, RefreshCw, Search, ShieldCheck, Users, X } from "lucide-react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Status = "New" | "Contacted" | "Qualified" | "Closed";
type Enquiry = { id: number; name: string; phone: string; email: string; interest: string; message: string | null; ip_location: string | null; created_at: string; status: Status | null };
const statuses: Status[] = ["New", "Contacted", "Qualified", "Closed"];

function dateLabel(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export default function AdminPage() {
  const [session, setSession] = useState<{ access_token: string; user: { email?: string } } | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Enquiry[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const knownLeadIds = useRef<Set<number>>(new Set());
  const initialLeadsLoaded = useRef(false);

  useEffect(() => {
    let alive = true;
    try {
      getSupabaseBrowserClient().auth.getSession().then(({ data }) => { if (alive) { setSession(data.session ? { access_token: data.session.access_token, user: data.session.user } : null); setReady(true); } });
    } catch (e) { setLoginError(e instanceof Error ? e.message : "Supabase login is not configured."); setReady(true); }
    return () => { alive = false; };
  }, []);

  const loadLeads = useCallback(async (token: string, showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load enquiries.");
      const currentLeads = (result.enquiries as Enquiry[]).map((lead) => ({ ...lead, status: lead.status || "New" }));
      if (initialLeadsLoaded.current) {
        const newLeads = currentLeads.filter((lead) => !knownLeadIds.current.has(lead.id));
        if (newLeads.length) {
          newLeads.forEach((lead) => knownLeadIds.current.add(lead.id));
          setNotifications((current) => [...newLeads, ...current].slice(0, 8));
          setUnreadNotifications((count) => count + newLeads.length);
        }
      } else {
        currentLeads.forEach((lead) => knownLeadIds.current.add(lead.id));
        initialLeadsLoaded.current = true;
      }
      setLeads(currentLeads);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load enquiries."); }
    finally { if (showLoading) setLoading(false); }
  }, []);

  useEffect(() => {
    if (!session) return;
    const token = session.access_token;
    void loadLeads(token);

    // Realtime gives an immediate bell update when enabled for the enquiries table.
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("admin-enquiry-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "enquiries" }, () => {
        void loadLeads(token, false);
      })
      .subscribe();

    // Polling is a fallback if Realtime is not enabled for this Supabase table.
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadLeads(token, false);
    }, 15000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadLeads(token, false);
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      void supabase.removeChannel(channel);
    };
  }, [session, loadLeads]);

  async function signIn(event: FormEvent) {
    event.preventDefault(); setLoginError("");
    try {
      const { data, error: authError } = await getSupabaseBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      if (!data.session) throw new Error("Login could not be completed.");
      setSession({ access_token: data.session.access_token, user: data.session.user }); setPassword("");
    } catch (e) { setLoginError(e instanceof Error ? e.message : "Unable to sign in."); }
  }

  async function signOut() { await getSupabaseBrowserClient().auth.signOut(); setSession(null); setLeads([]); setSelected(null); setNotifications([]); setUnreadNotifications(0); setNotificationsOpen(false); initialLeadsLoaded.current = false; knownLeadIds.current.clear(); }

  async function updateStatus(lead: Enquiry, status: Status) {
    if (!session) return;
    setUpdatingId(lead.id); setError("");
    try {
      const response = await fetch("/api/admin/enquiries", { method: "PATCH", headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not update status.");
      setLeads((items) => items.map((item) => item.id === lead.id ? { ...item, status } : item));
      setSelected((item) => item?.id === lead.id ? { ...item, status } : item);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update status."); }
    finally { setUpdatingId(null); }
  }

  const filtered = useMemo(() => leads.filter((lead) => {
    const matchesStatus = filter === "All" || (lead.status || "New") === filter;
    const haystack = [lead.name, lead.email, lead.phone, lead.interest, lead.message].join(" ").toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [leads, filter, query]);
  const counts = useMemo(() => ({ total: leads.length, fresh: leads.filter((l) => (l.status || "New") === "New").length, active: leads.filter((l) => ["Contacted", "Qualified"].includes(l.status || "New")).length, closed: leads.filter((l) => l.status === "Closed").length }), [leads]);

  function exportCsv() {
    const columns = ["id", "name", "phone", "email", "interest", "message", "status", "created_at"] as const;
    const csv = [columns.join(","), ...filtered.map((lead) => columns.map((key) => `"${String(lead[key] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "corner-coworks-enquiries.csv"; a.click(); URL.revokeObjectURL(url);
  }

  if (!ready) return <div className="admin-loading">Preparing secure admin access…</div>;
  if (!session) return <main className="admin-login-shell"><div className="admin-login-card"><div className="admin-login-brand"><Image className="brand-logo brand-logo-color" src="/images/logo-color.png" alt="Corner Coworks" width={140} height={44} priority /></div><div className="admin-login-icon"><ShieldCheck size={25} /></div><p className="admin-eyebrow">SECURE ADMIN ACCESS</p><h1>Welcome <em>back.</em></h1><p className="admin-login-copy">Sign in with your authorised administrator account to manage website enquiries.</p><form onSubmit={signIn} className="admin-login-form"><label>Email address<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourdomain.com" required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /></label>{loginError && <p className="admin-alert">{loginError}</p>}<button className="admin-primary-btn" type="submit">Sign in to dashboard <span>↗</span></button></form><p className="admin-login-foot"><ShieldCheck size={13} /> Protected administrator area</p></div></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><div className="admin-side-brand"><Image className="brand-logo" src="/images/logo-white.png" alt="Corner Coworks" width={180} height={58} priority />
  {/* <small className="admin-brand-caption">ADMIN CONSOLE</small> */}
  </div><p className="admin-side-label">WORKSPACE</p><div className="admin-side-active"><LayoutDashboard size={17} /> Overview</div><div className="admin-side-muted"><MessageSquareText size={17} /> Enquiries <span>{counts.total}</span></div><div className="admin-side-bottom"><div className="admin-secure-note"><ShieldCheck size={16} /><span><strong>Secure workspace</strong><small>Authorised access only</small></span></div><button onClick={signOut}><LogOut size={16} /> Sign out</button></div></aside>
    <section className="admin-main"><header className="admin-topbar"><div><p className="admin-eyebrow">MANAGEMENT / OVERVIEW</p><h1>Enquiry <em>dashboard</em></h1></div><div className="admin-top-actions"><span className="admin-user-pill"><span className="admin-avatar">{(session.user.email || "A").slice(0, 1).toUpperCase()}</span>{session.user.email}</span><div className="admin-notification-wrap"><button className="admin-icon-btn admin-notification-btn" type="button" onClick={() => { setNotificationsOpen((open) => !open); setUnreadNotifications(0); }} aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`} aria-expanded={notificationsOpen} title="Notifications"><Bell size={18} />{unreadNotifications > 0 && <span className="admin-notification-count">{unreadNotifications > 99 ? "99+" : unreadNotifications}</span>}</button>{notificationsOpen && <div className="admin-notification-menu" role="region" aria-label="Recent enquiry notifications"><div className="admin-notification-heading"><strong>Notifications</strong><span>{notifications.length ? `${notifications.length} recent` : "Live updates on"}</span></div>{notifications.length ? <ul>{notifications.map((lead) => <li key={lead.id}><span className="admin-notification-dot" /><div><strong>{lead.name}</strong><p>{lead.interest}</p><small>{dateLabel(lead.created_at)}</small></div></li>)}</ul> : <p className="admin-notification-empty">New enquiries will appear here automatically.</p>}</div>}</div><button className="admin-icon-btn" onClick={() => loadLeads(session.access_token)} title="Refresh"><RefreshCw size={17} className={loading ? "spin" : ""} /></button></div></header>
      <div className="admin-welcome"><div><span className="admin-welcome-dot" /> LIVE LEAD MONITORING</div><p>Here’s what’s happening with your website enquiries.</p></div>
      {error && <div className="admin-alert admin-alert-wide">{error}</div>}
      <div className="admin-stats"><article><div className="admin-stat-top"><span>Total enquiries</span><Users size={17} /></div><strong>{counts.total}</strong><small>All captured website leads</small></article><article><div className="admin-stat-top"><span>New enquiries</span><Clock3 size={17} /></div><strong>{counts.fresh}</strong><small>Awaiting first response</small></article><article><div className="admin-stat-top"><span>In progress</span><ArrowDownUp size={17} /></div><strong>{counts.active}</strong><small>Contacted or qualified</small></article><article><div className="admin-stat-top"><span>Closed</span><CheckCircle2 size={17} /></div><strong>{counts.closed}</strong><small>Completed conversations</small></article></div>
      <section className="admin-leads-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">LEAD MANAGEMENT</p><h2>Website enquiries <span>{filtered.length}</span></h2></div><button className="admin-export-btn" onClick={exportCsv} disabled={!filtered.length}><Download size={15} /> Export CSV</button></div><div className="admin-toolbar"><div className="admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone…" /></div><div className="admin-filter"><Filter size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select><ChevronDown size={14} /></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CONTACT</th><th>INTEREST</th><th>DATE RECEIVED</th><th>STATUS</th><th /></tr></thead><tbody>{loading && !leads.length ? <tr><td colSpan={5} className="admin-empty">Loading enquiries…</td></tr> : filtered.length ? filtered.map((lead) => <tr key={lead.id} onClick={() => setSelected(lead)}><td><div className="admin-contact-name">{lead.name}</div><div className="admin-contact-sub">{lead.email}</div></td><td>{lead.interest}</td><td>{dateLabel(lead.created_at)}</td><td onClick={(e) => e.stopPropagation()}><select className={`admin-status-select status-${(lead.status || "New").toLowerCase()}`} value={lead.status || "New"} disabled={updatingId === lead.id} onChange={(e) => updateStatus(lead, e.target.value as Status)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></td><td><button className="admin-view-btn" onClick={() => setSelected(lead)}>View <span>↗</span></button></td></tr>) : <tr><td colSpan={5} className="admin-empty"><CircleHelp size={22} /><strong>No enquiries found</strong><span>Try changing your search or status filter.</span></td></tr>}</tbody></table></div><div className="admin-table-foot">Showing {filtered.length} of {leads.length} enquiries <span>Latest 500 records</span></div></section>
      <footer className="admin-footer">CORNER COWORKS MANAGEMENT PORTAL <span>PRIVATE &amp; SECURE</span></footer></section>
    {selected && <div className="admin-modal-backdrop" onClick={() => setSelected(null)}><section className="admin-detail-modal" onClick={(e) => e.stopPropagation()}><div className="admin-modal-head"><div><p className="admin-eyebrow">ENQUIRY #{selected.id}</p><h2>Lead <em>details</em></h2></div><button className="admin-icon-btn" onClick={() => setSelected(null)}><X size={18} /></button></div><div className="admin-detail-name"><div className="admin-detail-avatar">{selected.name.slice(0, 1).toUpperCase()}</div><div><strong>{selected.name}</strong><small>{dateLabel(selected.created_at)}</small></div></div><div className="admin-detail-grid"><div><small>EMAIL ADDRESS</small><a href={`mailto:${selected.email}`}><Mail size={15} />{selected.email}</a></div><div><small>PHONE NUMBER</small><a href={`tel:${selected.phone}`}><Phone size={15} />{selected.phone}</a></div><div><small>INTERESTED IN</small><strong>{selected.interest}</strong></div><div><small>APPROX. LOCATION</small><strong><MapPin size={14} />{selected.ip_location || "Not available"}</strong></div></div><div className="admin-message-box"><small>MESSAGE</small><p>{selected.message || "No additional message provided."}</p></div><label className="admin-modal-status">LEAD STATUS<select value={selected.status || "New"} onChange={(e) => updateStatus(selected, e.target.value as Status)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label><div className="admin-modal-actions"><a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="admin-whatsapp-btn">Open WhatsApp ↗</a><button onClick={() => setSelected(null)} className="admin-close-btn">Close details</button></div></section></div>}
  </main>;
}
