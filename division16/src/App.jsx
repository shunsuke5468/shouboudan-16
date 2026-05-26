import { useState } from "react";

const MEMBERS = [
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

const SCHEDULE = [
  { date: "4/19", day: "日", type: "自主", training: "", attendance: { nagata: "○", takada: "○" }, total: 2 },
  { date: "5/17", day: "日", type: "ポンプ", training: "", attendance: { waki: "×", adachi: "×", takada: "○", akiyama: "○", hirashiro: "○" }, total: 3 },
  { date: "6/21", day: "日", type: "自主", training: "機関員講習 6/14", attendance: { adachi: "○", nagata: "○", takada: "○" }, total: 3 },
  { date: "7/19", day: "日", type: "自主", training: "", attendance: { adachi: "×", yamauchi: "○", takada: "○" }, total: 2 },
  { date: "8/16", day: "日", type: "ポンプ", training: "", attendance: { adachi: "○", akiyama: "○", hirashiro: "○" }, total: 3 },
  { date: "9/20", day: "日", type: "ポンプ", training: "", attendance: { nagata: "○", yamauchi: "○", akiyama: "○" }, total: 3 },
  { date: "10/18", day: "日", type: "自主", training: "部隊訓練 10/4(日)", attendance: {}, total: 0 },
  { date: "11/15", day: "日", type: "自主", training: "秋季火災予防運動 11/9(月)〜11/15(日)", attendance: {}, total: 0 },
  { date: "12/20", day: "日", type: "ポンプ", training: "", attendance: { yamauchi: "○", akiyama: "○", hirashiro: "○" }, total: 3 },
  { date: "1/17", day: "日", type: "ポンプ", training: "", attendance: { nagata: "○", yamauchi: "○", takada: "×", shimoda: "○" }, total: 3 },
  { date: "2/21", day: "日", type: "自主", training: "", attendance: { adachi: "○", takada: "○" }, total: 2 },
  { date: "3/21", day: "日", type: "自主", training: "春季火災予防運動 3/1(月)〜3/7(日)", attendance: {}, total: 0 },
];

const EVENTS = [
  { date: "5/24(日)", title: "水防訓練", location: "酒匂川防災ステーション", participants: ["脇", "平城", "秋山"], type: "訓練" },
  { date: "6/14(日)", title: "機関員講習会", location: "鴨宮運動広場および消防本部講堂", participants: ["脇", "長田", "髙田"], type: "講習" },
  { date: "6/25(木)or 6/26(金)", title: "健康診断", location: "", participants: ["安達", "長田", "山内", "下田"], type: "健診" },
];

const NOTICES = [
  { text: "齋藤(友)さんと連絡が付かない状況。機関員を平城さんに変更可能か分団長(脇さん)から本署に確認する。", urgent: true },
  { text: "本年度の会計を下田さんに変更する。引継ぎを秋山が計画する。", urgent: false },
  { text: "ポンプ点検と自主点検の割り当て表を最新にして本グループに展開する。", urgent: false },
  { text: "平城さんからビール１ケースいただきました。🍺", urgent: false },
];

const typeColor = (type) => type === "ポンプ" ? "#f59e0b" : "#3b82f6";
const eventTypeColor = (type) => ({ 訓練: "#ef4444", 講習: "#8b5cf6", 健診: "#10b981" }[type] || "#6b7280");

export default function App() {
  const [tab, setTab] = useState("schedule");
  const [expandedRow, setExpandedRow] = useState(null);

  const tabs = [
    { id: "schedule", label: "点検日程", icon: "📋" },
    { id: "events", label: "行事予定", icon: "📅" },
    { id: "members", label: "班員", icon: "👥" },
    { id: "notices", label: "連絡事項", icon: "📢" },
  ];

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#0f172a", minHeight: "100vh", color: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderBottom: "2px solid #dc2626",
        padding: "20px 16px 12px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>🚒</span>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 2, fontWeight: 500 }}>令和8年度(2026年度)</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.1 }}>第16分団 一班</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 12, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === t.id ? "#dc2626" : "#1e293b",
              color: tab === t.id ? "#fff" : "#94a3b8",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              whiteSpace: "nowrap", transition: "all 0.2s",
              boxShadow: tab === t.id ? "0 2px 8px rgba(220,38,38,0.4)" : "none",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px", maxWidth: 700, margin: "0 auto" }}>

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
              ポンプ点検 8:30詰所→9:00現地 ／ 自主点検 9:00詰所
            </div>

            {/* Summary row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "ポンプ点検", count: SCHEDULE.filter(s => s.type === "ポンプ").length, color: "#f59e0b" },
                { label: "自主点検", count: SCHEDULE.filter(s => s.type === "自主").length, color: "#3b82f6" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#1e293b", border: `1px solid ${s.color}33`,
                  borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>回</span>
                </div>
              ))}
            </div>

            {SCHEDULE.map((row, i) => {
              const isExpanded = expandedRow === i;
              const isPast = false; // simplified
              const color = typeColor(row.type);
              const attendees = Object.entries(row.attendance);

              return (
                <div key={i} onClick={() => setExpandedRow(isExpanded ? null : i)} style={{
                  background: "#1e293b",
                  border: `1px solid ${isExpanded ? color : "#334155"}`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 10, marginBottom: 8, cursor: "pointer",
                  transition: "all 0.2s",
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Date */}
                    <div style={{ minWidth: 56 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color }}>{row.date}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>({row.day})</div>
                    </div>

                    {/* Badge */}
                    <div style={{
                      background: color + "22", color, fontSize: 12, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 6, border: `1px solid ${color}55`,
                      whiteSpace: "nowrap"
                    }}>
                      {row.type}点検
                    </div>

                    {/* Training */}
                    <div style={{ flex: 1, fontSize: 12, color: "#94a3b8" }}>
                      {row.training && <span>📌 {row.training}</span>}
                    </div>

                    {/* Total */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: row.total === 0 ? "#64748b" : "#f1f5f9" }}>
                        {row.total}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>名</div>
                    </div>
                    <div style={{ color: "#475569", fontSize: 12 }}>{isExpanded ? "▲" : "▼"}</div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #334155", padding: "10px 14px", background: "#0f172a" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>出席状況</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {MEMBERS.map(m => {
                          const status = row.attendance[m.id];
                          return (
                            <div key={m.id} style={{
                              padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                              background: status === "○" ? "#166534" : status === "×" ? "#7f1d1d" : "#1e293b",
                              color: status === "○" ? "#86efac" : status === "×" ? "#fca5a5" : "#475569",
                              border: `1px solid ${status === "○" ? "#166534" : status === "×" ? "#7f1d1d" : "#334155"}`,
                              display: "flex", alignItems: "center", gap: 4
                            }}>
                              {m.isKikan && <span style={{ fontSize: 9, opacity: 0.7 }}>⚙</span>}
                              {m.name}
                              {status && <span>{status === "○" ? " ✓" : " ✗"}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Totals */}
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>年間出席回数</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { name: "脇", days: 1 }, { name: "安達", days: 3 }, { name: "長田", days: 4 },
                  { name: "山内", days: 3 }, { name: "髙田", days: 3 }, { name: "秋山", days: 4 },
                  { name: "下田", days: 3 }, { name: "平城", days: 3 }, { name: "齋藤(友)", days: 0 },
                ].map(m => (
                  <div key={m.name} style={{
                    background: "#0f172a", borderRadius: 8, padding: "6px 12px",
                    display: "flex", alignItems: "center", gap: 6,
                    border: "1px solid #334155"
                  }}>
                    <span style={{ fontSize: 13, color: "#e2e8f0" }}>{m.name}</span>
                    <span style={{
                      fontSize: 16, fontWeight: 900,
                      color: m.days >= 4 ? "#10b981" : m.days >= 2 ? "#f59e0b" : "#ef4444"
                    }}>{m.days}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>日</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {tab === "events" && (
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>令和8年度 行事・講習・健診</div>
            {EVENTS.map((ev, i) => (
              <div key={i} style={{
                background: "#1e293b", border: "1px solid #334155",
                borderLeft: `4px solid ${eventTypeColor(ev.type)}`,
                borderRadius: 10, padding: 16, marginBottom: 12
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{
                      display: "inline-block", background: eventTypeColor(ev.type) + "22",
                      color: eventTypeColor(ev.type), fontSize: 11, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 4, marginBottom: 6
                    }}>{ev.type}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>{ev.title}</div>
                    <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700, marginTop: 2 }}>{ev.date}</div>
                  </div>
                </div>
                {ev.location && (
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                    📍 {ev.location}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>参加者</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ev.participants.map(p => (
                    <span key={p} style={{
                      background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontWeight: 600,
                      padding: "4px 10px", borderRadius: 6, border: "1px solid #334155"
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>📋 点検器具</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>
                積載車、小型ポンプ、エンジンカッター、チェーンソー、発電機
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "12px 0 6px" }}>🔧 実施内容</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>
                エンジン始動確認、不具合確認、燃料補給
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {tab === "members" && (
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>班員一覧</div>
            {MEMBERS.map((m, i) => {
              const totalDays = [1, 3, 4, 3, 3, 4, 3, 3, 0][i];
              return (
                <div key={m.id} style={{
                  background: "#1e293b", border: "1px solid #334155",
                  borderRadius: 10, padding: 14, marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12,
                  opacity: m.id === "saito" ? 0.6 : 1
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: m.id === "waki" ? "#7f1d1d" : m.isKikan ? "#1e3a5f" : "#1e293b",
                    border: `2px solid ${m.id === "waki" ? "#dc2626" : m.isKikan ? "#3b82f6" : "#334155"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 900, color: "#f1f5f9"
                  }}>
                    {m.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{m.name}</span>
                      {m.role && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                          background: m.id === "waki" ? "#7f1d1d" : "#1e3a5f",
                          color: m.id === "waki" ? "#fca5a5" : "#93c5fd",
                          border: `1px solid ${m.id === "waki" ? "#dc2626" : "#3b82f6"}33`
                        }}>{m.role}</span>
                      )}
                      {m.id === "saito" && (
                        <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>連絡不通</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      年間出席: <span style={{ color: totalDays >= 4 ? "#10b981" : totalDays >= 2 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{totalDays}日</span>
                    </div>
                  </div>
                  {/* Role badges */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    {m.id === "waki" && <span style={{ fontSize: 11, color: "#94a3b8" }}>水防訓練参加</span>}
                    {m.id === "akiyama" && <span style={{ fontSize: 11, color: "#94a3b8" }}>引継ぎ計画</span>}
                    {m.id === "shimoda" && <span style={{ fontSize: 11, color: "#f59e0b" }}>★会計</span>}
                    {m.id === "hirashiro" && <span style={{ fontSize: 11, color: "#8b5cf6" }}>機関員(検討中)</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NOTICES TAB */}
        {tab === "notices" && (
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>班会議事録より（★追記）</div>

            {NOTICES.map((n, i) => (
              <div key={i} style={{
                background: n.urgent ? "#450a0a" : "#1e293b",
                border: `1px solid ${n.urgent ? "#dc2626" : "#334155"}`,
                borderRadius: 10, padding: 14, marginBottom: 10,
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{n.urgent ? "⚠️" : "📌"}</span>
                  <div style={{ fontSize: 14, color: n.urgent ? "#fca5a5" : "#e2e8f0", lineHeight: 1.7 }}>{n.text}</div>
                </div>
              </div>
            ))}

            {/* Rules */}
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>📋 その他ルール</div>
              {[
                "都合が合わない場合は、連絡を取り合って交代の段取りをお願いします。",
                "担当者の交代が発生した場合は、連絡をお願いします。",
                "雨天時のポンプ点検は、自主点検に変更する場合があります。決まり次第、連絡を実施します。",
              ].map((rule, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "#cbd5e1", lineHeight: 1.7,
                  padding: "6px 0",
                  borderBottom: i < 2 ? "1px solid #334155" : "none",
                }}>
                  • {rule}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
