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
import { toDimensionsMap } from './helpers';

/**
 * Generate the full report.
 * Adapts based on which quiz data is available:
 *   - Personality sections (1-10) require HEXACO dimensions
 *   - Learning sections (11-14) require studyProfile/learnerProfile
 *   - Cross-system insights require both
 *
 * @param {object} results - Results with dimensions, studyProfile, learnerProfile
 * @param {string} name - Student name
 * @returns {object} All section data for rendering
 */
export function generateReport(results: any, name: string) {
	const hasPersonality = !!results.dimensions && Array.isArray(results.dimensions) && results.dimensions.length > 0;
	const hasStudy = !!results.studyProfile;
	const hasLearner = !!results.learnerProfile;
	const hasComplete = hasPersonality && hasStudy && hasLearner;

	// Convert scorer's dimension array to the map format expected by report templates
	const enriched = hasPersonality
		? { ...results, dimensions: toDimensionsMap(results.dimensions) }
		: results;

	let crossRefResult = null;
	if (hasComplete) {
		crossRefResult = runCrossReferenceEngine(enriched.dimensions, enriched.studyProfile, enriched.learnerProfile);
	}

	return {
		// Personality sections (require HEXACO)
		cover: hasPersonality ? generateCover(enriched, name) : null,
		glance: hasPersonality ? generateGlance(enriched) : null,
		deepDive: hasPersonality ? generateDeepDive(enriched) : null,
		learning: hasPersonality ? generateLearning(enriched) : null,
		drives: hasPersonality ? generateDrives(enriched) : null,
		study: hasPersonality ? generateStudy(enriched) : null,
		group: hasPersonality ? generateGroup(enriched) : null,
		strengths: hasPersonality ? generateStrengths(enriched) : null,
		guide: hasPersonality ? generateGuide(enriched) : null,
		tutor: hasPersonality ? generateTutor(enriched) : null,

		// Learning sections (require studyProfile / learnerProfile)
		studyProfile: hasStudy ? generateStudyProfile(enriched) : null,
		academicCharacter: hasLearner ? generateAcademicCharacter(enriched) : null,
		subjectFit: hasLearner ? generateSubjectFit(enriched) : null,
		whatWorks: hasLearner ? generateWhatWorks(enriched) : null,
		rootCause: hasLearner ? generateRootCause(enriched) : null,
		academicGuide: (hasStudy || hasLearner) ? generateAcademicGuide(enriched) : null,

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
