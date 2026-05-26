import { useState, useEffect } from "react";

const DEFAULT_MEMBERS = [
  { id: "waki", name: "脇", role: "分団長", isKikan: false },
  { id: "adachi", name: "安達", role: "", isKikan: false },
  { id: "nagata", name: "長田", role: "機関員", isKikan: true },
  { id: "yamauchi", name: "山内", role: "", isKikan: false },
  { id: "takada", name: "髙田", role: "機関員", isKikan: true },
  { id: "akiyama", name: "秋山", role: "機関員", isKikan: true },
  { id: "shimoda", name: "下田", role: "", isKikan: false },
  { id: "hirashiro", name: "平城", role: "機関員", isKikan: true },
  { id: "saito", name: "齋藤(友)", role: "", isKikan: false },
];

const DEFAULT_SCHEDULE = [
  { id: "s1", date: "4/19", day: "日", type: "自主", training: "", attendance: { nagata: "○", takada: "○" } },
  { id: "s2", date: "5/17", day: "日", type: "ポンプ", training: "", attendance: { waki: "×", adachi: "×", takada: "○", akiyama: "○", hirashiro: "○" } },
  { id: "s3", date: "6/21", day: "日", type: "自主", training: "機関員講習 6/14", attendance: { adachi: "○", nagata: "○", takada: "○" } },
  { id: "s4", date: "7/19", day: "日", type: "自主", training: "", attendance: { adachi: "×", yamauchi: "○", takada: "○" } },
  { id: "s5", date: "8/16", day: "日", type: "ポンプ", training: "", attendance: { adachi: "○", akiyama: "○", hirashiro: "○" } },
  { id: "s6", date: "9/20", day: "日", type: "ポンプ", training: "", attendance: { nagata: "○", yamauchi: "○", akiyama: "○" } },
  { id: "s7", date: "10/18", day: "日", type: "自主", training: "部隊訓練 10/4(日)", attendance: {} },
  { id: "s8", date: "11/15", day: "日", type: "自主", training: "秋季火災予防運動 11/9(月)〜11/15(日)", attendance: {} },
  { id: "s9", date: "12/20", day: "日", type: "ポンプ", training: "", attendance: { yamauchi: "○", akiyama: "○", hirashiro: "○" } },
  { id: "s10", date: "1/17", day: "日", type: "ポンプ", training: "", attendance: { nagata: "○", yamauchi: "○", takada: "×", shimoda: "○" } },
  { id: "s11", date: "2/21", day: "日", type: "自主", training: "", attendance: { adachi: "○", takada: "○" } },
  { id: "s12", date: "3/21", day: "日", type: "自主", training: "春季火災予防運動 3/1(月)〜3/7(日)", attendance: {} },
];

const DEFAULT_EVENTS = [
  { id: "e1", date: "5/24(日)", title: "水防訓練", location: "酒匂川防災ステーション", participants: ["脇", "平城", "秋山"], type: "訓練" },
  { id: "e2", date: "6/14(日)", title: "機関員講習会", location: "鴨宮運動広場および消防本部講堂", participants: ["脇", "長田", "髙田"], type: "講習" },
  { id: "e3", date: "6/25(木)or 6/26(金)", title: "健康診断", location: "", participants: ["安達", "長田", "山内", "下田"], type: "健診" },
];

const DEFAULT_NOTICES = [
  { id: "n1", text: "齋藤(友)さんと連絡が付かない状況。機関員を平城さんに変更可能か分団長(脇さん)から本署に確認する。", urgent: true },
  { id: "n2", text: "本年度の会計を下田さんに変更する。引継ぎを秋山が計画する。", urgent: false },
  { id: "n3", text: "ポンプ点検と自主点検の割り当て表を最新にして本グループに展開する。", urgent: false },
  { id: "n4", text: "平城さんからビール１ケースいただきました。🍺", urgent: false },
];

const typeColor = (type) => type === "ポンプ" ? "#f59e0b" : "#3b82f6";
const eventTypeColor = (type) => ({ 訓練: "#ef4444", 講習: "#8b5cf6", 健診: "#10b981" }[type] || "#6b7280");

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

// ── 出席ボタン ──────────────────────────────────────────
function AttendanceButton({ status, onClick }) {
  const styles = {
    "○": { bg: "#166534", color: "#86efac", border: "#166534", label: "○" },
    "×": { bg: "#7f1d1d", color: "#fca5a5", border: "#7f1d1d", label: "×" },
    "": { bg: "#1e293b", color: "#475569", border: "#334155", label: "ー" },
  };
  const s = styles[status] || styles[""];
  return (
    <button onClick={onClick} style={{
      padding: "4px 10px", borderRadius: 6, fontSize: 13, fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      cursor: "pointer", fontFamily: "inherit", minWidth: 36
    }}>{s.label}</button>
  );
}

export default function App() {
  const [members, setMembers] = useLocalStorage("members_v1", DEFAULT_MEMBERS);
  const [schedule, setSchedule] = useLocalStorage("schedule_v1", DEFAULT_SCHEDULE);
  const [events, setEvents] = useLocalStorage("events_v1", DEFAULT_EVENTS);
  const [notices, setNotices] = useLocalStorage("notices_v1", DEFAULT_NOTICES);

  const [tab, setTab] = useState("schedule");
  const [expandedRow, setExpandedRow] = useState(null);
  const [adminMode, setAdminMode] = useState(false);

  // 編集用state
  const [editingNotice, setEditingNotice] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [newNoticeText, setNewNoticeText] = useState("");
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);

  const tabs = [
    { id: "schedule", label: "点検日程", icon: "📋" },
    { id: "events", label: "行事予定", icon: "📅" },
    { id: "members", label: "班員", icon: "👥" },
    { id: "notices", label: "連絡事項", icon: "📢" },
  ];

  // 出席トグル
  const toggleAttendance = (scheduleId, memberId) => {
    setSchedule(prev => prev.map(s => {
      if (s.id !== scheduleId) return s;
      const cur = s.attendance[memberId] || "";
      const next = cur === "" ? "○" : cur === "○" ? "×" : "";
      const att = { ...s.attendance };
      if (next === "") delete att[memberId];
      else att[memberId] = next;
      return { ...s, attendance: att };
    }));
  };

  const getTotal = (s) => Object.values(s.attendance).filter(v => v === "○").length;

  const getMemberTotal = (memberId) =>
    schedule.reduce((acc, s) => s.attendance[memberId] === "○" ? acc + 1 : acc, 0);

  // ── 管理者モード ──────────────────────────────────────
  const AdminBadge = () => (
    <button onClick={() => setAdminMode(!adminMode)} style={{
      padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
      background: adminMode ? "#dc2626" : "#334155",
      color: adminMode ? "#fff" : "#94a3b8",
      border: "none", cursor: "pointer", fontFamily: "inherit"
    }}>
      {adminMode ? "✏️ 編集中" : "⚙️ 管理"}
    </button>
  );

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#0f172a", minHeight: "100vh", color: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderBottom: "2px solid #dc2626",
        padding: "16px 16px 10px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🚒</span>
            <div>
              <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 2 }}>令和8年度(2026年度)</div>
              <div style={{ fontSize: 17, fontWeight: 900 }}>第16分団 一班</div>
            </div>
          </div>
          <AdminBadge />
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === t.id ? "#dc2626" : "#1e293b",
              color: tab === t.id ? "#fff" : "#94a3b8",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              whiteSpace: "nowrap",
              boxShadow: tab === t.id ? "0 2px 8px rgba(220,38,38,0.4)" : "none",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px", maxWidth: 700, margin: "0 auto" }}>

        {/* ══ 点検日程 ══════════════════════════════════════════ */}
        {tab === "schedule" && (
          <div>
            {adminMode && (
              <div style={{ background: "#1e3a5f", border: "1px solid #3b82f6", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 13, color: "#93c5fd" }}>
                ✏️ 編集モード：各日程を展開して出席状況をタップで変更できます（ー→○→×→ー）
              </div>
            )}
            {schedule.map((row, i) => {
              const isExpanded = expandedRow === i;
              const color = typeColor(row.type);
              const total = getTotal(row);
              return (
                <div key={row.id} style={{
                  background: "#1e293b", border: `1px solid ${isExpanded ? color : "#334155"}`,
                  borderLeft: `4px solid ${color}`, borderRadius: 10, marginBottom: 8,
                  cursor: "pointer", overflow: "hidden",
                }}>
                  <div onClick={() => setExpandedRow(isExpanded ? null : i)}
                    style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ minWidth: 56 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color }}>{row.date}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>({row.day})</div>
                    </div>
                    <div style={{
                      background: color + "22", color, fontSize: 12, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 6, border: `1px solid ${color}55`, whiteSpace: "nowrap"
                    }}>{row.type}点検</div>
                    <div style={{ flex: 1, fontSize: 12, color: "#94a3b8" }}>
                      {row.training && <span>📌 {row.training}</span>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: total === 0 ? "#64748b" : "#f1f5f9" }}>{total}</span>
                      <span style={{ fontSize: 10, color: "#64748b" }}>名</span>
                    </div>
                    <span style={{ color: "#475569", fontSize: 12 }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #334155", padding: "12px 14px", background: "#0f172a" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                        {adminMode ? "タップして出席状況を変更" : "出席状況"}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {members.map(m => {
                          const status = row.attendance[m.id] || "";
                          return (
                            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                                {m.isKikan && <span style={{ fontSize: 9 }}>⚙</span>}{m.name}
                              </div>
                              {adminMode ? (
                                <AttendanceButton status={status} onClick={() => toggleAttendance(row.id, m.id)} />
                              ) : (
                                <div style={{
                                  padding: "4px 10px", borderRadius: 6, fontSize: 13, fontWeight: 700,
                                  background: status === "○" ? "#166534" : status === "×" ? "#7f1d1d" : "#1e293b",
                                  color: status === "○" ? "#86efac" : status === "×" ? "#fca5a5" : "#475569",
                                  border: `1px solid ${status === "○" ? "#166534" : status === "×" ? "#7f1d1d" : "#334155"}`,
                                }}>{status || "ー"}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 年間集計 */}
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>年間出席回数</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {members.map(m => {
                  const days = getMemberTotal(m.id);
                  return (
                    <div key={m.id} style={{
                      background: "#0f172a", borderRadius: 8, padding: "6px 12px",
                      display: "flex", alignItems: "center", gap: 6, border: "1px solid #334155"
                    }}>
                      <span style={{ fontSize: 13, color: "#e2e8f0" }}>{m.name}</span>
                      <span style={{ fontSize: 16, fontWeight: 900, color: days >= 4 ? "#10b981" : days >= 2 ? "#f59e0b" : "#ef4444" }}>{days}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>日</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ 行事予定 ══════════════════════════════════════════ */}
        {tab === "events" && (
          <div>
            {adminMode && (
              <button onClick={() => {
                const newEv = { id: "e" + Date.now(), date: "", title: "新しい行事", location: "", participants: [], type: "訓練" };
                setEvents(prev => [...prev, newEv]);
                setEditingEvent(newEv.id);
              }} style={{
                width: "100%", padding: "10px", borderRadius: 10, border: "2px dashed #334155",
                background: "transparent", color: "#64748b", fontSize: 14, cursor: "pointer",
                fontFamily: "inherit", marginBottom: 12
              }}>＋ 行事を追加</button>
            )}
            {events.map(ev => (
              <div key={ev.id} style={{
                background: "#1e293b", border: "1px solid #334155",
                borderLeft: `4px solid ${eventTypeColor(ev.type)}`,
                borderRadius: 10, padding: 14, marginBottom: 12
              }}>
                {adminMode && editingEvent === ev.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input value={ev.title} onChange={e => setEvents(prev => prev.map(x => x.id === ev.id ? { ...x, title: e.target.value } : x))}
                      placeholder="タイトル" style={inputStyle} />
                    <input value={ev.date} onChange={e => setEvents(prev => prev.map(x => x.id === ev.id ? { ...x, date: e.target.value } : x))}
                      placeholder="日付（例: 5/24(日)）" style={inputStyle} />
                    <input value={ev.location} onChange={e => setEvents(prev => prev.map(x => x.id === ev.id ? { ...x, location: e.target.value } : x))}
                      placeholder="場所" style={inputStyle} />
                    <select value={ev.type} onChange={e => setEvents(prev => prev.map(x => x.id === ev.id ? { ...x, type: e.target.value } : x))}
                      style={inputStyle}>
                      <option>訓練</option><option>講習</option><option>健診</option>
                    </select>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>参加者（タップで選択）</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {members.map(m => {
                        const selected = ev.participants.includes(m.name);
                        return (
                          <button key={m.id} onClick={() => setEvents(prev => prev.map(x => {
                            if (x.id !== ev.id) return x;
                            const p = selected ? x.participants.filter(n => n !== m.name) : [...x.participants, m.name];
                            return { ...x, participants: p };
                          }))} style={{
                            padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: selected ? "#166534" : "#1e293b",
                            color: selected ? "#86efac" : "#64748b",
                            border: `1px solid ${selected ? "#166534" : "#334155"}`,
                            cursor: "pointer", fontFamily: "inherit"
                          }}>{m.name}</button>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <button onClick={() => setEditingEvent(null)} style={btnStyle("#10b981")}>保存</button>
                      <button onClick={() => { setEvents(prev => prev.filter(x => x.id !== ev.id)); setEditingEvent(null); }} style={btnStyle("#ef4444")}>削除</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{
                          display: "inline-block", background: eventTypeColor(ev.type) + "22",
                          color: eventTypeColor(ev.type), fontSize: 11, fontWeight: 700,
                          padding: "2px 8px", borderRadius: 4, marginBottom: 6
                        }}>{ev.type}</div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>{ev.title}</div>
                        <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>{ev.date}</div>
                      </div>
                      {adminMode && (
                        <button onClick={() => setEditingEvent(ev.id)} style={btnStyle("#3b82f6", true)}>編集</button>
                      )}
                    </div>
                    {ev.location && <div style={{ fontSize: 12, color: "#94a3b8", margin: "8px 0" }}>📍 {ev.location}</div>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {ev.participants.map(p => (
                        <span key={p} style={{ background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "1px solid #334155" }}>{p}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ 班員 ══════════════════════════════════════════════ */}
        {tab === "members" && (
          <div>
            {adminMode && (
              <button onClick={() => {
                const newM = { id: "m" + Date.now(), name: "新しい班員", role: "", isKikan: false };
                setMembers(prev => [...prev, newM]);
                setEditingMember(newM.id);
              }} style={{
                width: "100%", padding: "10px", borderRadius: 10, border: "2px dashed #334155",
                background: "transparent", color: "#64748b", fontSize: 14, cursor: "pointer",
                fontFamily: "inherit", marginBottom: 12
              }}>＋ 班員を追加</button>
            )}
            {members.map(m => {
              const days = getMemberTotal(m.id);
              return (
                <div key={m.id} style={{
                  background: "#1e293b", border: "1px solid #334155",
                  borderRadius: 10, padding: 14, marginBottom: 8,
                }}>
                  {adminMode && editingMember === m.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input value={m.name} onChange={e => setMembers(prev => prev.map(x => x.id === m.id ? { ...x, name: e.target.value } : x))}
                        placeholder="名前" style={inputStyle} />
                      <input value={m.role} onChange={e => setMembers(prev => prev.map(x => x.id === m.id ? { ...x, role: e.target.value } : x))}
                        placeholder="役職（例: 機関員, 分団長）" style={inputStyle} />
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
                        <input type="checkbox" checked={m.isKikan} onChange={e => setMembers(prev => prev.map(x => x.id === m.id ? { ...x, isKikan: e.target.checked } : x))} />
                        機関員
                      </label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setEditingMember(null)} style={btnStyle("#10b981")}>保存</button>
                        <button onClick={() => { setMembers(prev => prev.filter(x => x.id !== m.id)); setEditingMember(null); }} style={btnStyle("#ef4444")}>削除</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: m.role === "分団長" ? "#7f1d1d" : m.isKikan ? "#1e3a5f" : "#1e293b",
                        border: `2px solid ${m.role === "分団長" ? "#dc2626" : m.isKikan ? "#3b82f6" : "#334155"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 900,
                      }}>{m.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 16, fontWeight: 700 }}>{m.name}</span>
                          {m.role && (
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                              background: m.role === "分団長" ? "#7f1d1d" : "#1e3a5f",
                              color: m.role === "分団長" ? "#fca5a5" : "#93c5fd",
                            }}>{m.role}</span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                          出席: <span style={{ color: days >= 4 ? "#10b981" : days >= 2 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{days}日</span>
                        </div>
                      </div>
                      {adminMode && (
                        <button onClick={() => setEditingMember(m.id)} style={btnStyle("#3b82f6", true)}>編集</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ 連絡事項 ══════════════════════════════════════════ */}
        {tab === "notices" && (
          <div>
            {adminMode && (
              <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>＋ 新しい連絡事項</div>
                <textarea value={newNoticeText} onChange={e => setNewNoticeText(e.target.value)}
                  placeholder="連絡事項を入力..." rows={3}
                  style={{ ...inputStyle, resize: "vertical" }} />
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8", cursor: "pointer", margin: "8px 0" }}>
                  <input type="checkbox" checked={newNoticeUrgent} onChange={e => setNewNoticeUrgent(e.target.checked)} />
                  緊急（赤表示）
                </label>
                <button onClick={() => {
                  if (!newNoticeText.trim()) return;
                  setNotices(prev => [...prev, { id: "n" + Date.now(), text: newNoticeText, urgent: newNoticeUrgent }]);
                  setNewNoticeText(""); setNewNoticeUrgent(false);
                }} style={btnStyle("#dc2626")}>追加</button>
              </div>
            )}

            {notices.map(n => (
              <div key={n.id} style={{
                background: n.urgent ? "#450a0a" : "#1e293b",
                border: `1px solid ${n.urgent ? "#dc2626" : "#334155"}`,
                borderRadius: 10, padding: 14, marginBottom: 10,
              }}>
                {adminMode && editingNotice === n.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <textarea value={n.text} onChange={e => setNotices(prev => prev.map(x => x.id === n.id ? { ...x, text: e.target.value } : x))}
                      rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
                      <input type="checkbox" checked={n.urgent} onChange={e => setNotices(prev => prev.map(x => x.id === n.id ? { ...x, urgent: e.target.checked } : x))} />
                      緊急
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEditingNotice(null)} style={btnStyle("#10b981")}>保存</button>
                      <button onClick={() => { setNotices(prev => prev.filter(x => x.id !== n.id)); setEditingNotice(null); }} style={btnStyle("#ef4444")}>削除</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{n.urgent ? "⚠️" : "📌"}</span>
                    <div style={{ fontSize: 14, color: n.urgent ? "#fca5a5" : "#e2e8f0", lineHeight: 1.7, flex: 1 }}>{n.text}</div>
                    {adminMode && (
                      <button onClick={() => setEditingNotice(n.id)} style={btnStyle("#3b82f6", true)}>編集</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 8,
  background: "#0f172a", border: "1px solid #334155",
  color: "#f1f5f9", fontSize: 14, fontFamily: "inherit",
  boxSizing: "border-box",
};

const btnStyle = (color, small = false) => ({
  padding: small ? "4px 10px" : "8px 16px",
  borderRadius: 8, border: "none", cursor: "pointer",
  background: color, color: "#fff",
  fontSize: small ? 12 : 14, fontWeight: 700,
  fontFamily: "inherit",
});
