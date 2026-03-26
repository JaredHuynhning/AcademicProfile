import { View, Text, StyleSheet } from "@react-pdf/renderer";
import {
  parseTopAction,
  parseQuickWin,
  parseStopDoing,
  parseWeeklyRhythm,
} from "@/lib/report/action-sheet-parser";

const ESPRESSO = "#2c2417";
const WARM_GRAY = "#8b7355";
const PARCHMENT = "#faf5eb";
const BORDER = "#e8e0d4";

const s = StyleSheet.create({
  container: {
    margin: 20,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: WARM_GRAY,
    borderRadius: 10,
    backgroundColor: PARCHMENT,
  },
  scissors: {
    position: "absolute",
    top: -8,
    left: 20,
    fontSize: 12,
    backgroundColor: PARCHMENT,
    paddingHorizontal: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: WARM_GRAY,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: ESPRESSO,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 9,
    color: WARM_GRAY,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: WARM_GRAY,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 3,
  },
  section: {
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  actionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ESPRESSO,
    justifyContent: "center",
    alignItems: "center",
  },
  actionCircleText: {
    color: "#fdfbf7",
    fontSize: 10,
    fontWeight: "bold",
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: ESPRESSO,
  },
  actionWhy: {
    fontSize: 8,
    color: WARM_GRAY,
    marginTop: 1,
  },
  prescriptionBorder: {
    borderLeftWidth: 3,
    borderLeftColor: ESPRESSO,
    paddingLeft: 10,
  },
  prescriptionMethod: {
    fontSize: 12,
    fontWeight: "bold",
    color: ESPRESSO,
  },
  prescriptionRationale: {
    fontSize: 8,
    color: WARM_GRAY,
    marginTop: 3,
    lineHeight: 1.5,
  },
  quickWinGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  quickWinCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 6,
    padding: 8,
  },
  quickWinText: {
    fontSize: 8,
    color: ESPRESSO,
  },
  stopItem: {
    fontSize: 9,
    color: ESPRESSO,
    marginBottom: 3,
  },
  rhythmGrid: {
    flexDirection: "row",
    gap: 6,
  },
  rhythmCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 6,
    padding: 8,
  },
  rhythmLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 3,
  },
  rhythmText: {
    fontSize: 8,
    color: ESPRESSO,
    lineHeight: 1.4,
  },
  closing: {
    fontSize: 8,
    color: WARM_GRAY,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 6,
  },
});

interface PDFActionSheetProps {
  data: {
    topActions: Array<{ rank: number; description: string }>;
    quickWins: Array<{ description: string }>;
    studyPrescription: { method: string; rationale: string };
    stopDoing: Array<{ description: string }>;
    weeklyRhythm: { description: string };
  };
  studentName: string;
}

export function PDFActionSheet({ data, studentName }: PDFActionSheetProps) {
  const actions = data.topActions.map((a) => ({
    rank: a.rank,
    ...parseTopAction(a.description),
  }));
  const quickWins = data.quickWins.map((q) => parseQuickWin(q.description));
  const stopItems = data.stopDoing.map((si) => parseStopDoing(si.description));
  const rhythm = parseWeeklyRhythm(data.weeklyRhythm.description);

  return (
    <View style={s.container}>
      <Text style={s.scissors}>✂</Text>

      <View style={s.header}>
        <Text style={s.eyebrow}>What To Do Monday</Text>
        <Text style={s.title}>Your Action Plan</Text>
        <Text style={s.subtitle}>
          Personalised for {studentName} — based on your HEXACO profile
        </Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Priority Actions</Text>
        {actions.map((a) => (
          <View key={a.rank} style={s.actionRow}>
            <View style={s.actionCircle}>
              <Text style={s.actionCircleText}>{a.rank}</Text>
            </View>
            <View style={s.actionText}>
              <Text style={s.actionTitle}>{a.action}</Text>
              {a.why ? <Text style={s.actionWhy}>Why: {a.why}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Study Prescription</Text>
        <View style={s.prescriptionBorder}>
          <Text style={s.prescriptionMethod}>{data.studyPrescription.method}</Text>
          <Text style={s.prescriptionRationale}>{data.studyPrescription.rationale}</Text>
        </View>
      </View>

      {quickWins.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>Quick Wins</Text>
          <View style={s.quickWinGrid}>
            {quickWins.map((q, i) => (
              <View key={i} style={s.quickWinCard}>
                <Text style={s.quickWinText}>✓ {q.action}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {stopItems.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>Stop Doing</Text>
          {stopItems.map((si, i) => (
            <Text key={i} style={s.stopItem}>
              ✕ {si.stop}{si.instead ? ` — instead, ${si.instead}` : ""}
            </Text>
          ))}
        </View>
      )}

      <View>
        <Text style={s.sectionLabel}>Weekly Rhythm</Text>
        <View style={s.rhythmGrid}>
          {rhythm.weekday ? (
            <View style={s.rhythmCard}>
              <Text style={s.rhythmLabel}>Mon — Fri</Text>
              <Text style={s.rhythmText}>{rhythm.weekday}</Text>
            </View>
          ) : null}
          {rhythm.weekend ? (
            <View style={s.rhythmCard}>
              <Text style={s.rhythmLabel}>Weekend</Text>
              <Text style={s.rhythmText}>{rhythm.weekend}</Text>
            </View>
          ) : null}
        </View>
        {rhythm.closing ? <Text style={s.closing}>{rhythm.closing}</Text> : null}
      </View>
    </View>
  );
}
