/**
 * Report Generator — orchestrates all section templates.
 * Pure function: results + name → complete report data.
 */
import { generateCover } from './section-01-cover.js';
import { generateGlance } from './section-02-glance.js';
import { generateDeepDive } from './section-03-deep-dive.js';
import { generateLearning } from './section-04-learning.js';
import { generateDrives } from './section-05-drives.js';
import { generateStudy } from './section-06-study.js';
import { generateGroup } from './section-07-group.js';
import { generateStrengths } from './section-08-strengths.js';
import { generateGuide } from './section-09-guide.js';
import { generateTutor } from './section-10-tutor.js';
import { generateStudyProfile } from './section-11-study-profile.js';
import { generateAcademicCharacter } from './section-12-academic-character.js';
import { generateSubjectFit } from './section-13-subject-fit.js';
import { generateWhatWorks } from './section-14-what-works.js';
import { generateRootCause } from './section-15-root-cause.js';
import { generateAcademicGuide } from './section-16-academic-guide.js';
import { generateExecutiveSummary } from './section-c1-executive-summary.js';
import { generateWhoYouAre } from './section-c2-who-you-are.js';
import { generateHowYouLearn } from './section-c3-how-you-learn.js';
import { generateWhatsWorking } from './section-c4-whats-working.js';
import { generateBarriers } from './section-c5-barriers.js';
import { generateActionPlan } from './section-c6-action-plan.js';
import { generateUnifiedGuide } from './section-c7-guide.js';
import { runCrossReferenceEngine } from './cross-reference-engine.js';

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
export function generateReport(results, name) {
	const hasPersonality = !!results.dimensions;
	const hasStudy = !!results.studyProfile;
	const hasLearner = !!results.learnerProfile;
	const hasComplete = hasPersonality && hasStudy && hasLearner;

	let crossRefResult = null;
	if (hasComplete) {
		crossRefResult = runCrossReferenceEngine(results.dimensions, results.studyProfile, results.learnerProfile);
	}

	return {
		// Personality sections (require HEXACO)
		cover: hasPersonality ? generateCover(results, name) : null,
		glance: hasPersonality ? generateGlance(results) : null,
		deepDive: hasPersonality ? generateDeepDive(results) : null,
		learning: hasPersonality ? generateLearning(results) : null,
		drives: hasPersonality ? generateDrives(results) : null,
		study: hasPersonality ? generateStudy(results) : null,
		group: hasPersonality ? generateGroup(results) : null,
		strengths: hasPersonality ? generateStrengths(results) : null,
		guide: hasPersonality ? generateGuide(results) : null,
		tutor: hasPersonality ? generateTutor(results) : null,

		// Learning sections (require studyProfile / learnerProfile)
		studyProfile: hasStudy ? generateStudyProfile(results) : null,
		academicCharacter: hasLearner ? generateAcademicCharacter(results) : null,
		subjectFit: hasLearner ? generateSubjectFit(results) : null,
		whatWorks: hasLearner ? generateWhatWorks(results) : null,
		rootCause: hasLearner ? generateRootCause(results) : null,
		academicGuide: (hasStudy || hasLearner) ? generateAcademicGuide(results) : null,

		// Complete Profile sections (require all three datasets)
		executiveSummary: hasComplete ? generateExecutiveSummary(results, crossRefResult) : null,
		whoYouAre: hasComplete ? generateWhoYouAre(results, crossRefResult) : null,
		howYouLearn: hasComplete ? generateHowYouLearn(results, crossRefResult) : null,
		whatsWorking: hasComplete ? generateWhatsWorking(results, crossRefResult) : null,
		barriers: hasComplete ? generateBarriers(results, crossRefResult) : null,
		actionPlan: hasComplete ? generateActionPlan(results, crossRefResult) : null,
		unifiedGuide: hasComplete ? generateUnifiedGuide(results, crossRefResult) : null,

		// Metadata
		quizMode: results.quizMode || 'complete',
		hasPersonality,
		hasStudy,
		hasLearner,
		hasComplete,
		hasLearning: hasStudy || hasLearner
	};
}
