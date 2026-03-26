import { View, Text, StyleSheet } from "@react-pdf/renderer";

const ESPRESSO = "#2c2417";
const WARM_GRAY = "#8b7355";
const BORDER = "#e8e0d4";

const s = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: ESPRESSO,
    textAlign: "center",
    marginBottom: 8,
  },
  rule: {
    width: 40,
    height: 3,
    backgroundColor: ESPRESSO,
    alignSelf: "center",
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "baseline",
  },
  number: {
    fontSize: 9,
    color: WARM_GRAY,
    width: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 11,
    color: ESPRESSO,
  },
  dots: {
    flex: 1,
    fontSize: 9,
    color: BORDER,
    marginHorizontal: 8,
    overflow: "hidden",
  },
});

interface PDFTableOfContentsProps {
  sections: Array<{ number: string; title: string }>;
}

export function PDFTableOfContents({ sections }: PDFTableOfContentsProps) {
  const dotLeader = " . ".repeat(80);

  return (
    <View style={s.container}>
      <Text style={s.title}>Contents</Text>
      <View style={s.rule} />

      {sections.map((section) => (
        <View key={section.number} style={s.row}>
          <Text style={s.number}>{section.number}</Text>
          <Text style={s.sectionTitle}>{section.title}</Text>
          <Text style={s.dots}>{dotLeader}</Text>
        </View>
      ))}
    </View>
  );
}
