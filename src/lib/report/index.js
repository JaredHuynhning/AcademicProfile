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

/**
 * Generate the full 10-section report.
 * @param {object} results - The HEXACO results object with dimensions, narrative, archetypes
 * @param {string} name - Student name
 * @returns {object} All section data for rendering
 */
export function generateReport(results, name) {
	return {
		cover: generateCover(results, name),
		glance: generateGlance(results),
		deepDive: generateDeepDive(results),
		learning: generateLearning(results),
		drives: generateDrives(results),
		study: generateStudy(results),
		group: generateGroup(results),
		strengths: generateStrengths(results),
		guide: generateGuide(results),
		tutor: generateTutor(results)
	};
}
