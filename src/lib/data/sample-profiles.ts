import type { SavedReport } from "../types";

// Sample profiles carry extra fields (narrative, archetypes, facet detail) beyond
// the strict SavedReport type. Cast via unknown to accommodate the richer shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawProfiles: any[] = [
  // ─── 1. Liam Torres — The Anxious Perfectionist ────────────────────────────
  // Year 11. Extremely diligent but crippled by test anxiety and self-criticism.
  // High C, High E, Low X, High O, Moderate H/A. Deep learner but paralysed by fear of failure.
  {
    id: "sample-liam-torres",
    name: "Liam Torres",
    date: "2026-03-28T10:00:00.000Z",
    results: {
      dimensions: {
        H: {
          name: "Honesty-Humility",
          score: 3.6,
          level: "high",
          facets: {
            sincerity: { name: "Sincerity", score: 3.67, level: "high", item_count: 3 },
            fairness: { name: "Fairness", score: 4, level: "high", item_count: 3 },
            greed_avoidance: { name: "Greed Avoidance", score: 3.5, level: "high", item_count: 2 },
            modesty: { name: "Modesty", score: 3, level: "moderate", item_count: 2 },
          },
        },
        E: {
          name: "Emotionality",
          score: 4.3,
          level: "high",
          facets: {
            fearfulness: { name: "Fearfulness", score: 4.33, level: "high", item_count: 3 },
            anxiety: { name: "Anxiety", score: 4.5, level: "very_high", item_count: 2 },
            dependence: { name: "Dependence", score: 4, level: "high", item_count: 2 },
            sentimentality: { name: "Sentimentality", score: 4.33, level: "high", item_count: 3 },
          },
        },
        X: {
          name: "Extraversion",
          score: 2.2,
          level: "low",
          facets: {
            social_self_esteem: { name: "Social Self-Esteem", score: 2.33, level: "low", item_count: 3 },
            social_boldness: { name: "Social Boldness", score: 1.67, level: "low", item_count: 3 },
            sociability: { name: "Sociability", score: 2.5, level: "moderate", item_count: 2 },
            liveliness: { name: "Liveliness", score: 2.5, level: "moderate", item_count: 2 },
          },
        },
        A: {
          name: "Agreeableness",
          score: 3.4,
          level: "moderate",
          facets: {
            forgiveness: { name: "Forgiveness", score: 3.5, level: "high", item_count: 2 },
            gentleness: { name: "Gentleness", score: 3.67, level: "high", item_count: 3 },
            flexibility: { name: "Flexibility", score: 3, level: "moderate", item_count: 3 },
            patience: { name: "Patience", score: 3.5, level: "high", item_count: 2 },
          },
        },
        C: {
          name: "Conscientiousness",
          score: 4.6,
          level: "very_high",
          facets: {
            organisation: { name: "Organisation", score: 5, level: "very_high", item_count: 2 },
            diligence: { name: "Diligence", score: 4.5, level: "very_high", item_count: 2 },
            perfectionism: { name: "Perfectionism", score: 4.67, level: "very_high", item_count: 3 },
            prudence: { name: "Prudence", score: 4.33, level: "high", item_count: 3 },
          },
        },
        O: {
          name: "Openness to Experience",
          score: 3.9,
          level: "high",
          facets: {
            aesthetic_appreciation: { name: "Aesthetic Appreciation", score: 4, level: "high", item_count: 2 },
            inquisitiveness: { name: "Inquisitiveness", score: 4.5, level: "very_high", item_count: 2 },
            creativity: { name: "Creativity", score: 3.33, level: "moderate", item_count: 3 },
            unconventionality: { name: "Unconventionality", score: 3.67, level: "high", item_count: 3 },
          },
        },
      } as any,
      narrative: {
        summary: "Anxious perfectionist — extremely diligent but paralysed by self-doubt. Year 11.",
        dimension_insights: {},
        strengths: [],
        growth_areas: [],
        study_recommendations: [],
      } as any,
      archetypes: [] as any,
      studyProfile: {
        studyApproaches: {
          deep: { score: 4.5, level: "high", items: 4 },
          strategic: { score: 3.7, level: "high", items: 3 },
          surface: { score: 2.3, level: "low", items: 3 },
        },
        motivation: {
          intrinsic: { score: 4, level: "high", items: 3 },
          identified: { score: 4.5, level: "high", items: 2 },
          external: { score: 3.5, level: "high", items: 2 },
          amotivation: { score: 1.3, level: "low", items: 3 },
          sdi: 6.7,
        },
        selfRegulation: {
          selfEfficacy: { score: 2.5, level: "moderate", items: 2 },
          planning: { score: 4.5, level: "high", items: 2 },
          effortRegulation: { score: 4, level: "high", items: 2 },
          testAnxiety: { score: 4.5, level: "high", items: 2 },
          helpSeeking: { score: 2, level: "low", items: 2 },
        },
        dominantApproach: "deep",
        motivationProfile: "self-determined",
        regulationStrength: "moderate",
      } as any,
      learnerProfile: {
        grit: {
          perseverance: { score: 4.3, level: "high", items: 3 },
          consistency: { score: 3.7, level: "high", items: 3 },
          overall: { score: 4, level: "high" },
        },
        focus: {
          concentration: { score: 3.7, level: "high", items: 3 },
          procrastination: { score: 3.3, level: "moderate", items: 3 },
        },
        energy: {
          vitality: { score: 2.5, level: "moderate", items: 2 },
          depletion: { score: 2, level: "low", items: 2 },
          netEnergy: { score: 2.25, level: "low" },
        },
        subjectFit: {
          maths: { passion: 3.5, confidence: 2, alignment: "confidence-gap" },
          english: { passion: 4.5, confidence: 3.5, alignment: "aligned" },
          science: { passion: 4, confidence: 2.5, alignment: "confidence-gap" },
        },
        teacherPreference: {
          structure: 5,
          warmth: 4,
          profile: "warm-structured",
          carrot: 4,
          stick: 2,
          responseType: "encouragement",
        },
        examBarriers: {
          preparation: 4,
          external: 2,
          anxiety: 5,
          timeManagement: 3,
          primaryBarrier: "anxiety",
        },
      } as any,
      quizMode: "complete",
    },
  },

  // ─── 2. Zara Okafor — The Social Butterfly Creative ────────────────────────
  // Year 9. Life of the party, highly creative, but can't sit still or follow through.
  // Very High X, High O, Low C, Low E, Moderate H/A. Surface learner, externally motivated.
  {
    id: "sample-zara-okafor",
    name: "Zara Okafor",
    date: "2026-03-25T11:00:00.000Z",
    results: {
      dimensions: {
        H: {
          name: "Honesty-Humility",
          score: 3.1,
          level: "moderate",
          facets: {
            sincerity: { name: "Sincerity", score: 3, level: "moderate", item_count: 3 },
            fairness: { name: "Fairness", score: 3, level: "moderate", item_count: 3 },
            greed_avoidance: { name: "Greed Avoidance", score: 3.5, level: "high", item_count: 2 },
            modesty: { name: "Modesty", score: 3, level: "moderate", item_count: 2 },
          },
        },
        E: {
          name: "Emotionality",
          score: 2.0,
          level: "low",
          facets: {
            fearfulness: { name: "Fearfulness", score: 1.67, level: "low", item_count: 3 },
            anxiety: { name: "Anxiety", score: 2, level: "low", item_count: 2 },
            dependence: { name: "Dependence", score: 2.5, level: "moderate", item_count: 2 },
            sentimentality: { name: "Sentimentality", score: 2, level: "low", item_count: 3 },
          },
        },
        X: {
          name: "Extraversion",
          score: 4.7,
          level: "very_high",
          facets: {
            social_self_esteem: { name: "Social Self-Esteem", score: 5, level: "very_high", item_count: 3 },
            social_boldness: { name: "Social Boldness", score: 4.67, level: "very_high", item_count: 3 },
            sociability: { name: "Sociability", score: 4.5, level: "very_high", item_count: 2 },
            liveliness: { name: "Liveliness", score: 4.5, level: "very_high", item_count: 2 },
          },
        },
        A: {
          name: "Agreeableness",
          score: 3.5,
          level: "high",
          facets: {
            forgiveness: { name: "Forgiveness", score: 4, level: "high", item_count: 2 },
            gentleness: { name: "Gentleness", score: 3, level: "moderate", item_count: 3 },
            flexibility: { name: "Flexibility", score: 3.67, level: "high", item_count: 3 },
            patience: { name: "Patience", score: 3.5, level: "high", item_count: 2 },
          },
        },
        C: {
          name: "Conscientiousness",
          score: 1.9,
          level: "low",
          facets: {
            organisation: { name: "Organisation", score: 1.5, level: "low", item_count: 2 },
            diligence: { name: "Diligence", score: 2, level: "low", item_count: 2 },
            perfectionism: { name: "Perfectionism", score: 2, level: "low", item_count: 3 },
            prudence: { name: "Prudence", score: 2, level: "low", item_count: 3 },
          },
        },
        O: {
          name: "Openness to Experience",
          score: 4.4,
          level: "high",
          facets: {
            aesthetic_appreciation: { name: "Aesthetic Appreciation", score: 5, level: "very_high", item_count: 2 },
            inquisitiveness: { name: "Inquisitiveness", score: 4, level: "high", item_count: 2 },
            creativity: { name: "Creativity", score: 4.67, level: "very_high", item_count: 3 },
            unconventionality: { name: "Unconventionality", score: 4, level: "high", item_count: 3 },
          },
        },
      } as any,
      narrative: {
        summary: "Creative social butterfly — bursting with ideas but can't follow through. Year 9.",
        dimension_insights: {},
        strengths: [],
        growth_areas: [],
        study_recommendations: [],
      } as any,
      archetypes: [] as any,
      studyProfile: {
        studyApproaches: {
          deep: { score: 2.5, level: "moderate", items: 4 },
          strategic: { score: 1.7, level: "low", items: 3 },
          surface: { score: 4, level: "high", items: 3 },
        },
        motivation: {
          intrinsic: { score: 3, level: "moderate", items: 3 },
          identified: { score: 2, level: "low", items: 2 },
          external: { score: 4, level: "high", items: 2 },
          amotivation: { score: 2.7, level: "moderate", items: 3 },
          sdi: -1.4,
        },
        selfRegulation: {
          selfEfficacy: { score: 4, level: "high", items: 2 },
          planning: { score: 1.5, level: "low", items: 2 },
          effortRegulation: { score: 1.5, level: "low", items: 2 },
          testAnxiety: { score: 2, level: "low", items: 2 },
          helpSeeking: { score: 4.5, level: "high", items: 2 },
        },
        dominantApproach: "surface",
        motivationProfile: "controlled",
        regulationStrength: "low",
      } as any,
      learnerProfile: {
        grit: {
          perseverance: { score: 2, level: "low", items: 3 },
          consistency: { score: 1.7, level: "low", items: 3 },
          overall: { score: 1.85, level: "low" },
        },
        focus: {
          concentration: { score: 1.7, level: "low", items: 3 },
          procrastination: { score: 1.7, level: "low", items: 3 },
        },
        energy: {
          vitality: { score: 4.5, level: "high", items: 2 },
          depletion: { score: 4, level: "high", items: 2 },
          netEnergy: { score: 4.25, level: "high" },
        },
        subjectFit: {
          maths: { passion: 1.5, confidence: 2, alignment: "disengaged" },
          english: { passion: 4, confidence: 4, alignment: "aligned" },
          science: { passion: 2.5, confidence: 2, alignment: "disengaged" },
        },
        teacherPreference: {
          structure: 2,
          warmth: 4,
          profile: "warm-flexible",
          carrot: 5,
          stick: 2,
          responseType: "encouragement",
        },
        examBarriers: {
          preparation: 2,
          external: 3,
          anxiety: 1.5,
          timeManagement: 4.5,
          primaryBarrier: "time-management",
        },
      } as any,
      quizMode: "complete",
    },
  },

  // ─── 3. Ethan Bridges — The Steady Pragmatist ──────────────────────────────
  // Year 10. Reliable, practical, emotionally unflappable. Gets things done without fuss.
  // High H, Low E, Moderate X, High C, Low O, High A. Strategic learner, moderate motivation.
  {
    id: "sample-ethan-bridges",
    name: "Ethan Bridges",
    date: "2026-03-20T09:00:00.000Z",
    results: {
      dimensions: {
        H: {
          name: "Honesty-Humility",
          score: 4.4,
          level: "high",
          facets: {
            sincerity: { name: "Sincerity", score: 4.33, level: "high", item_count: 3 },
            fairness: { name: "Fairness", score: 4.67, level: "very_high", item_count: 3 },
            greed_avoidance: { name: "Greed Avoidance", score: 4, level: "high", item_count: 2 },
            modesty: { name: "Modesty", score: 4.5, level: "very_high", item_count: 2 },
          },
        },
        E: {
          name: "Emotionality",
          score: 1.8,
          level: "low",
          facets: {
            fearfulness: { name: "Fearfulness", score: 1.67, level: "low", item_count: 3 },
            anxiety: { name: "Anxiety", score: 2, level: "low", item_count: 2 },
            dependence: { name: "Dependence", score: 1.5, level: "low", item_count: 2 },
            sentimentality: { name: "Sentimentality", score: 2, level: "low", item_count: 3 },
          },
        },
        X: {
          name: "Extraversion",
          score: 3.1,
          level: "moderate",
          facets: {
            social_self_esteem: { name: "Social Self-Esteem", score: 3.67, level: "high", item_count: 3 },
            social_boldness: { name: "Social Boldness", score: 2.67, level: "moderate", item_count: 3 },
            sociability: { name: "Sociability", score: 3, level: "moderate", item_count: 2 },
            liveliness: { name: "Liveliness", score: 3, level: "moderate", item_count: 2 },
          },
        },
        A: {
          name: "Agreeableness",
          score: 4.0,
          level: "high",
          facets: {
            forgiveness: { name: "Forgiveness", score: 4, level: "high", item_count: 2 },
            gentleness: { name: "Gentleness", score: 4, level: "high", item_count: 3 },
            flexibility: { name: "Flexibility", score: 3.67, level: "high", item_count: 3 },
            patience: { name: "Patience", score: 4.5, level: "very_high", item_count: 2 },
          },
        },
        C: {
          name: "Conscientiousness",
          score: 4.0,
          level: "high",
          facets: {
            organisation: { name: "Organisation", score: 4, level: "high", item_count: 2 },
            diligence: { name: "Diligence", score: 4, level: "high", item_count: 2 },
            perfectionism: { name: "Perfectionism", score: 3.67, level: "high", item_count: 3 },
            prudence: { name: "Prudence", score: 4.33, level: "high", item_count: 3 },
          },
        },
        O: {
          name: "Openness to Experience",
          score: 2.3,
          level: "low",
          facets: {
            aesthetic_appreciation: { name: "Aesthetic Appreciation", score: 2, level: "low", item_count: 2 },
            inquisitiveness: { name: "Inquisitiveness", score: 2.5, level: "moderate", item_count: 2 },
            creativity: { name: "Creativity", score: 2.33, level: "low", item_count: 3 },
            unconventionality: { name: "Unconventionality", score: 2.33, level: "low", item_count: 3 },
          },
        },
      } as any,
      narrative: {
        summary: "Steady pragmatist — reliable and practical, gets things done without fuss. Year 10.",
        dimension_insights: {},
        strengths: [],
        growth_areas: [],
        study_recommendations: [],
      } as any,
      archetypes: [] as any,
      studyProfile: {
        studyApproaches: {
          deep: { score: 2.8, level: "moderate", items: 4 },
          strategic: { score: 4.3, level: "high", items: 3 },
          surface: { score: 2.3, level: "low", items: 3 },
        },
        motivation: {
          intrinsic: { score: 2.7, level: "moderate", items: 3 },
          identified: { score: 4, level: "high", items: 2 },
          external: { score: 3, level: "moderate", items: 2 },
          amotivation: { score: 1.3, level: "low", items: 3 },
          sdi: 3.8,
        },
        selfRegulation: {
          selfEfficacy: { score: 3.5, level: "high", items: 2 },
          planning: { score: 4, level: "high", items: 2 },
          effortRegulation: { score: 4, level: "high", items: 2 },
          testAnxiety: { score: 1.5, level: "low", items: 2 },
          helpSeeking: { score: 3, level: "moderate", items: 2 },
        },
        dominantApproach: "strategic",
        motivationProfile: "moderate",
        regulationStrength: "high",
      } as any,
      learnerProfile: {
        grit: {
          perseverance: { score: 3.7, level: "high", items: 3 },
          consistency: { score: 4, level: "high", items: 3 },
          overall: { score: 3.85, level: "high" },
        },
        focus: {
          concentration: { score: 3.7, level: "high", items: 3 },
          procrastination: { score: 4, level: "high", items: 3 },
        },
        energy: {
          vitality: { score: 3.5, level: "high", items: 2 },
          depletion: { score: 3.5, level: "high", items: 2 },
          netEnergy: { score: 3.5, level: "high" },
        },
        subjectFit: {
          maths: { passion: 4, confidence: 4, alignment: "aligned" },
          english: { passion: 2, confidence: 3, alignment: "passion-gap" },
          science: { passion: 3.5, confidence: 4, alignment: "aligned" },
        },
        teacherPreference: {
          structure: 4,
          warmth: 3,
          profile: "structured-neutral",
          carrot: 3,
          stick: 3.5,
          responseType: "accountability",
        },
        examBarriers: {
          preparation: 4,
          external: 2,
          anxiety: 1.5,
          timeManagement: 4,
          primaryBarrier: "none",
        },
      } as any,
      quizMode: "complete",
    },
  },

  // ─── 4. Priya Nair — The Gifted Underachiever ─────────────────────────────
  // Year 12. Brilliant mind, reads voraciously, debates passionately — but grades don't show it.
  // Very High O, High X, Low C, Low H, Low A. Deep learner but amotivated by school structure.
  {
    id: "sample-priya-nair",
    name: "Priya Nair",
    date: "2026-03-22T14:00:00.000Z",
    results: {
      dimensions: {
        H: {
          name: "Honesty-Humility",
          score: 2.4,
          level: "low",
          facets: {
            sincerity: { name: "Sincerity", score: 2.33, level: "low", item_count: 3 },
            fairness: { name: "Fairness", score: 2.67, level: "moderate", item_count: 3 },
            greed_avoidance: { name: "Greed Avoidance", score: 2, level: "low", item_count: 2 },
            modesty: { name: "Modesty", score: 2.5, level: "moderate", item_count: 2 },
          },
        },
        E: {
          name: "Emotionality",
          score: 2.6,
          level: "moderate",
          facets: {
            fearfulness: { name: "Fearfulness", score: 2, level: "low", item_count: 3 },
            anxiety: { name: "Anxiety", score: 3, level: "moderate", item_count: 2 },
            dependence: { name: "Dependence", score: 2.5, level: "moderate", item_count: 2 },
            sentimentality: { name: "Sentimentality", score: 3, level: "moderate", item_count: 3 },
          },
        },
        X: {
          name: "Extraversion",
          score: 3.9,
          level: "high",
          facets: {
            social_self_esteem: { name: "Social Self-Esteem", score: 4.33, level: "high", item_count: 3 },
            social_boldness: { name: "Social Boldness", score: 4, level: "high", item_count: 3 },
            sociability: { name: "Sociability", score: 3.5, level: "high", item_count: 2 },
            liveliness: { name: "Liveliness", score: 3.5, level: "high", item_count: 2 },
          },
        },
        A: {
          name: "Agreeableness",
          score: 2.3,
          level: "low",
          facets: {
            forgiveness: { name: "Forgiveness", score: 2.5, level: "moderate", item_count: 2 },
            gentleness: { name: "Gentleness", score: 2, level: "low", item_count: 3 },
            flexibility: { name: "Flexibility", score: 2.33, level: "low", item_count: 3 },
            patience: { name: "Patience", score: 2.5, level: "moderate", item_count: 2 },
          },
        },
        C: {
          name: "Conscientiousness",
          score: 2.1,
          level: "low",
          facets: {
            organisation: { name: "Organisation", score: 2, level: "low", item_count: 2 },
            diligence: { name: "Diligence", score: 2.5, level: "moderate", item_count: 2 },
            perfectionism: { name: "Perfectionism", score: 2, level: "low", item_count: 3 },
            prudence: { name: "Prudence", score: 2, level: "low", item_count: 3 },
          },
        },
        O: {
          name: "Openness to Experience",
          score: 4.8,
          level: "very_high",
          facets: {
            aesthetic_appreciation: { name: "Aesthetic Appreciation", score: 4.5, level: "very_high", item_count: 2 },
            inquisitiveness: { name: "Inquisitiveness", score: 5, level: "very_high", item_count: 2 },
            creativity: { name: "Creativity", score: 5, level: "very_high", item_count: 3 },
            unconventionality: { name: "Unconventionality", score: 4.67, level: "very_high", item_count: 3 },
          },
        },
      } as any,
      narrative: {
        summary: "Gifted underachiever — brilliant, opinionated, bored by structure. Year 12.",
        dimension_insights: {},
        strengths: [],
        growth_areas: [],
        study_recommendations: [],
      } as any,
      archetypes: [] as any,
      studyProfile: {
        studyApproaches: {
          deep: { score: 4.3, level: "high", items: 4 },
          strategic: { score: 1.7, level: "low", items: 3 },
          surface: { score: 3, level: "moderate", items: 3 },
        },
        motivation: {
          intrinsic: { score: 4.3, level: "high", items: 3 },
          identified: { score: 1.5, level: "low", items: 2 },
          external: { score: 1.5, level: "low", items: 2 },
          amotivation: { score: 3.7, level: "high", items: 3 },
          sdi: 2.4,
        },
        selfRegulation: {
          selfEfficacy: { score: 4, level: "high", items: 2 },
          planning: { score: 1.5, level: "low", items: 2 },
          effortRegulation: { score: 1.5, level: "low", items: 2 },
          testAnxiety: { score: 2.5, level: "moderate", items: 2 },
          helpSeeking: { score: 2, level: "low", items: 2 },
        },
        dominantApproach: "deep",
        motivationProfile: "amotivated",
        regulationStrength: "low",
      } as any,
      learnerProfile: {
        grit: {
          perseverance: { score: 2.3, level: "low", items: 3 },
          consistency: { score: 1.7, level: "low", items: 3 },
          overall: { score: 2, level: "low" },
        },
        focus: {
          concentration: { score: 2.3, level: "low", items: 3 },
          procrastination: { score: 2, level: "low", items: 3 },
        },
        energy: {
          vitality: { score: 3.5, level: "high", items: 2 },
          depletion: { score: 3, level: "moderate", items: 2 },
          netEnergy: { score: 3.25, level: "moderate" },
        },
        subjectFit: {
          maths: { passion: 2, confidence: 4, alignment: "passion-gap" },
          english: { passion: 5, confidence: 4.5, alignment: "aligned" },
          science: { passion: 4.5, confidence: 3, alignment: "confidence-gap" },
        },
        teacherPreference: {
          structure: 1.5,
          warmth: 2,
          profile: "flexible-neutral",
          carrot: 2,
          stick: 2,
          responseType: "balanced",
        },
        examBarriers: {
          preparation: 2,
          external: 3.5,
          anxiety: 2,
          timeManagement: 4,
          primaryBarrier: "preparation",
        },
      } as any,
      quizMode: "complete",
    },
  },
];

export const sampleProfiles: SavedReport[] = rawProfiles as unknown as SavedReport[];
export const SAMPLE_VERSION = 3;
