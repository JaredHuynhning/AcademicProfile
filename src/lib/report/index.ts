/**
 * Report Generator — orchestrates all section templates.
 * Pure function: results + name → complete report data.
 */
import { generateCover } from './section-01-cover';
import { generateGlance } from './section-02-glance';
import { generateDeepDive } from './section-03-deep-dive';
import { generateLearning } from './section-04-learning';
import { generateDrives } from './section-05-drives';
import { generateStudy } from './section-06-study';
import { generateGroup } from './section-07-group';
import { generateStrengths } from './section-08-strengths';
import { generateGuide } from './section-09-guide';
import { generateTutor } from './section-10-tutor';
import { generateStudyProfile } from './section-11-study-profile';
import { generateAcademicCharacter } from './section-12-academic-character';
import { generateSubjectFit } from './section-13-subject-fit';
import { generateWhatWorks } from './section-14-what-works';
import { generateRootCause } from './section-15-root-cause';
import { generateAcademicGuide } from './section-16-academic-guide';
import { generateExecutiveSummary } from './section-c1-executive-summary';
import { generateWhoYouAre } from './section-c2-who-you-are';
import { generateHowYouLearn } from './section-c3-how-you-learn';
import { generateWhatsWorking } from './section-c4-whats-working';
import { generateBarriers } from './section-c5-barriers';
import { generateActionPlan } from './section-c6-action-plan';
import { generateUnifiedGuide } from './section-c7-guide';
import { runCrossReferenceEngine } from './cross-reference-engine';
import { toDimensionsMap, type DimensionsMap } from './helpers';
import { TestResults } from '../types';

/**
 * Generate the full report.
 * Adapts based on which quiz data is available:
 *   - Personality sections (1-10) require HEXACO dimensions
 *   - Learning sections (11-14) require studyProfile/learnerProfile
 *   - Cross-system insights require both
 *
 * @param {TestResults} results - Results with dimensions, studyProfile, learnerProfile
 * @param {string} name - Student name
 * @returns {MegaReport} All section data for rendering
 */
export type { MegaReport, MegaSection, MegaSectionContent, DimensionDetail, SubjectAlignment } from './mega-sections';
import { consolidateToMegaReport, MegaReport } from './mega-sections';

export function generateMegaReport(results: TestResults, name: string): MegaReport {
	const rawReport = generateReport(results, name);
	return consolidateToMegaReport(rawReport, results, name);
}

export function generateReport(results: TestResults, name: string) {
	const hasPersonality = !!results.dimensions && Array.isArray(results.dimensions) && results.dimensions.length > 0;
	const hasStudy = !!results.studyProfile;
	const hasLearner = !!results.learnerProfile;
	const hasComplete = hasPersonality && hasStudy && hasLearner;

	// Convert scorer's dimension array to the map format expected by report templates
	// Inject studentName (first name) so all generators can personalize narratives
	const first = name ? name.split(' ')[0] : 'This student';
	const enriched = {
		...results, 
		...(hasPersonality && { dimensions: toDimensionsMap(results.dimensions!) }),
		studentName: first,
		narrative: { summary: '', dimension_insights: {} }
	};

	let crossRefResult = null;
	if (hasComplete) {
		const dimensions = enriched.dimensions as DimensionsMap;
		const studyProfile = enriched.studyProfile as any;
		const learnerProfile = enriched.learnerProfile as any;
		crossRefResult = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);
	}

	return {
		// Personality sections (require HEXACO)
		cover: hasPersonality ? generateCover(enriched as any, name) : null,
		glance: hasPersonality ? generateGlance(enriched as any) : null,
		deepDive: hasPersonality ? generateDeepDive(enriched as any) : null,
		learning: hasPersonality ? generateLearning(enriched as any) : null,
		drives: hasPersonality ? generateDrives(enriched as any) : null,
		study: hasPersonality ? generateStudy(enriched as any) : null,
		group: hasPersonality ? generateGroup(enriched as any) : null,
		strengths: hasPersonality ? generateStrengths(enriched as any) : null,
		guide: hasPersonality ? generateGuide(enriched as any) : null,
		tutor: hasPersonality ? generateTutor(enriched as any) : null,

		// Learning sections (require studyProfile / learnerProfile)
		studyProfile: hasStudy ? generateStudyProfile(enriched as any) : null,
		academicCharacter: hasLearner ? generateAcademicCharacter(enriched as any) : null,
		subjectFit: hasLearner ? generateSubjectFit(enriched as any) : null,
		whatWorks: hasLearner ? generateWhatWorks(enriched as any) : null,
		rootCause: hasLearner ? generateRootCause(enriched as any) : null,
		academicGuide: (hasStudy || hasLearner) ? generateAcademicGuide(enriched as any) : null,

		// Complete Profile sections (require all three datasets)
		executiveSummary: hasComplete ? generateExecutiveSummary(enriched, crossRefResult) : null,
		whoYouAre: hasComplete ? generateWhoYouAre(enriched, crossRefResult) : null,
		howYouLearn: hasComplete ? generateHowYouLearn(enriched, crossRefResult) : null,
		whatsWorking: hasComplete ? generateWhatsWorking(enriched, crossRefResult) : null,
		barriers: hasComplete ? generateBarriers(enriched, crossRefResult) : null,
		actionPlan: hasComplete ? generateActionPlan(enriched, crossRefResult) : null,
		unifiedGuide: hasComplete ? generateUnifiedGuide(enriched, crossRefResult) : null,

		// Metadata
		quizMode: results.quizMode || 'complete',
		hasPersonality,
		hasStudy,
		hasLearner,
		hasComplete,
		hasLearning: hasStudy || hasLearner
	};
}
