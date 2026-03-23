"use client";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { TestResults } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11, color: "#2c2417" },
  cover: { textAlign: "center", marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 12, color: "#8b7355", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 8 },
  eyebrow: { fontSize: 9, color: "#8b7355", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
  body: { fontSize: 11, lineHeight: 1.6, color: "#4a3f2f", marginBottom: 12, maxWidth: 480 },
  badge: { fontSize: 10, color: "#fff", backgroundColor: "#2c2417", padding: "3 10", borderRadius: 12, alignSelf: "flex-start", marginBottom: 6 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e8e0d4", marginVertical: 16 },
  scoreRow: { flexDirection: "row", gap: 12, marginBottom: 12, flexWrap: "wrap" },
  scoreCard: { padding: 12, borderRadius: 12, border: "1 solid #e8e0d4", minWidth: 80, alignItems: "center" },
  scoreName: { fontSize: 8, color: "#8b7355", textTransform: "uppercase", letterSpacing: 1 },
  scoreValue: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  listItem: { fontSize: 11, color: "#4a3f2f", marginBottom: 4, paddingLeft: 12 },
});

const DIM_COLORS: Record<string, string> = {
  "Honesty-Humility": "#14b8a6",
  Emotionality: "#f43f5e",
  Extraversion: "#f97316",
  Agreeableness: "#22c55e",
  Conscientiousness: "#3b82f6",
  Openness: "#8b5cf6",
};

interface ReportPDFProps {
  name: string;
  results: TestResults;
  report: Record<string, unknown>;
}

function formatSectionName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function renderSection(section: unknown): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  if (typeof section === "string") {
    elements.push(
      <Text key="str" style={styles.body}>
        {section}
      </Text>
    );
  } else if (section !== null && typeof section === "object" && !Array.isArray(section)) {
    Object.entries(section as Record<string, unknown>).forEach(([k, v]) => {
      if (typeof v === "string" && v.length > 10) {
        elements.push(
          <Text key={k} style={styles.body}>
            {v}
          </Text>
        );
      }
    });
  }
  return elements;
}

function ReportPDFDocument({ name, results, report }: ReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover */}
        <View style={styles.cover}>
          <Text style={styles.eyebrow}>Complete Learning Profile</Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Dimension scores */}
        {results.dimensions && Array.isArray(results.dimensions) && (
          <View style={styles.scoreRow}>
            {results.dimensions.map((dim) => (
              <View key={dim.name} style={styles.scoreCard}>
                <Text style={styles.scoreName}>{dim.name.split("-")[0]}</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { color: DIM_COLORS[dim.name] || "#2c2417" },
                  ]}
                >
                  {dim.score.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* Render report sections generically */}
        {Object.entries(report).map(([key, section]) => {
          if (
            !section ||
            typeof section !== "object" ||
            key.startsWith("has") ||
            key === "quizMode"
          ) {
            return null;
          }
          return (
            <View key={key} wrap={false}>
              <Text style={styles.eyebrow}>{formatSectionName(key)}</Text>
              {renderSection(section)}
              <View style={styles.divider} />
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export async function downloadReportPDF(
  name: string,
  results: TestResults,
  report: Record<string, unknown>
) {
  const blob = await pdf(
    <ReportPDFDocument name={name} results={results} report={report} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-")}-learning-profile.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { ReportPDFDocument };
