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

		// Metadata
		quizMode: results.quizMode || 'complete',
		hasPersonality,
		hasLearning: hasStudy || hasLearner
	};
}
