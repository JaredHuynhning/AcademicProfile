/**
 * Section 13: Subject Interests & Confidence
 * Generates per-subject narrative with passion + confidence gap analysis.
 */

interface SubjectData {
	passion: number;
	confidence: number;
	alignment: string;
}

interface SubjectFit {
	maths: SubjectData;
	english: SubjectData;
	science: SubjectData;
	[key: string]: SubjectData;
}

interface LearnerProfile {
	subjectFit: SubjectFit;
	[key: string]: unknown;
}

interface Results {
	learnerProfile?: LearnerProfile;
	[key: string]: unknown;
}

const SUBJECT_META: Record<string, { name: string; icon: string; color: string }> = {
	maths: { name: 'Mathematics', icon: '🔢', color: '#3b82f6' },
	english: { name: 'English & Language', icon: '📖', color: '#8b5cf6' },
	science: { name: 'Science & Technology', icon: '🔬', color: '#22c55e' }
};

const PASSION_TIPS: Record<string, { strength: string; weakness: string }> = {
	maths: {
		strength: 'Your interest in maths is a real asset. Explore problem-solving competitions or real-world applications to deepen it.',
		weakness: 'Maths may feel dry right now. Try connecting it to things you care about: games, music, sports statistics, or coding.'
	},
	english: {
		strength: 'Your love of language is a strength. Explore creative writing, journalism, or debate to stretch it further.',
		weakness: "English might feel pointless right now. Try podcasts, song lyrics, or stories in genres you actually enjoy."
	},
	science: {
		strength: 'Your curiosity about science is powerful. Explore experiments, science YouTube channels, or STEM clubs.',
		weakness: "Science may seem disconnected from your life. Look for the 'why' behind everyday things: cooking, weather, your phone."
	}
};

const CONFIDENCE_TIPS: Record<string, { strength: string; weakness: string }> = {
	maths: {
		strength: 'You trust your maths ability. Use this confidence to tackle extension problems and help classmates.',
		weakness: 'You doubt yourself in maths, but confidence builds through small wins. Start with problems you CAN solve and work up.'
	},
	english: {
		strength: 'You believe in your English skills. Push yourself with longer essays, creative pieces, or public speaking.',
		weakness: 'Confidence in English grows through practice, not talent. Ask for specific feedback on one skill at a time.'
	},
	science: {
		strength: 'You feel capable in science. Challenge yourself with independent experiments or research projects.',
		weakness: 'Science confidence comes from doing, not reading. Hands-on experiments and practice problems build real self-belief.'
	}
};

const ALIGNMENT_NARRATIVES: Record<string, Record<string, string>> = {
	aligned: {
		maths: 'You both enjoy maths and believe you can do well in it. This alignment of passion and confidence is the ideal combination, lean into problem-solving challenges and consider maths-related enrichment.',
		english: 'You enjoy language and feel confident in your English abilities. This is a strong foundation, keep reading widely and consider creative writing or debate to stretch your skills further.',
		science: 'You find science fascinating and trust your ability to succeed in it. This is a powerful combination, explore hands-on experiments, science fairs, or STEM clubs to fuel your interest.'
	},
	'passion-gap': {
		maths: 'You feel confident in maths but don\'t particularly enjoy it. You have the ability, the missing piece is engagement. Try mathematical puzzles, real-world applications, or competition maths to spark interest.',
		english: 'You feel capable in English but it doesn\'t excite you. You have the skills, try genres or formats you haven\'t explored. Podcasts, journalism, screenwriting, or coding documentation can make language feel more relevant.',
		science: 'You believe you can do well in science but it doesn\'t fascinate you yet. The confidence is there, try connecting science to something you care about: sports science, environmental issues, gaming physics.'
	},
	'confidence-gap': {
		maths: 'You love maths but doubt your ability. This is the "confidence gap": you enjoy it but don\'t trust yourself to succeed. Build confidence through small wins: master one concept at a time and track your progress.',
		english: 'You enjoy reading and writing but don\'t feel confident in your abilities. This gap between enjoyment and self-belief is common. Seek regular, specific feedback (not just grades) to build a realistic picture of your strengths.',
		science: 'You find science fascinating but doubt your ability to do well. This is exciting, the interest is there, which is the hardest part to build. Focus on understanding concepts through experiments rather than memorisation.'
	},
	disengaged: {
		maths: 'Maths currently doesn\'t interest you and you don\'t feel confident in it. This is a common pattern that can change with the right approach. A tutor who makes maths visual and practical, connecting it to real life, can shift this.',
		english: 'English feels neither interesting nor accessible right now. This is worth addressing because language skills underpin every subject. Start with content you actually enjoy: song lyrics, game stories, social media writing.',
		science: 'Science doesn\'t grab your attention or your confidence right now. Before writing it off, try experiential learning: cooking (chemistry), sports (physics), gardening (biology). The subject may click in a different context.'
	}
};

/**
 * @param results - Full results with learnerProfile
 */
export function generateSubjectFit(results: Results) {
	if (!results.learnerProfile) return null;

	const sf = results.learnerProfile.subjectFit;

	const subjects = ['maths', 'english', 'science'].map((key) => {
		const subject = sf[key];
		const meta = SUBJECT_META[key];
		const narrative = ALIGNMENT_NARRATIVES[subject.alignment]?.[key] || '';

		const passionClassification = subject.passion >= 3.5 ? 'strength' : 'weakness';
		const confidenceClassification = subject.confidence >= 3.5 ? 'strength' : 'weakness';

		const passionTip = PASSION_TIPS[key][passionClassification];
		const confidenceTip = CONFIDENCE_TIPS[key][confidenceClassification];

		const strengths: string[] = [];
		const weaknesses: string[] = [];
		const actions: string[] = [];

		if (passionClassification === 'strength') {
			strengths.push(`Passion (${subject.passion}/5): You genuinely enjoy this subject.`);
		} else {
			weaknesses.push(`Interest (${subject.passion}/5): This subject doesn't engage you right now.`);
			actions.push(passionTip);
		}

		if (confidenceClassification === 'strength') {
			strengths.push(`Confidence (${subject.confidence}/5): You believe you can do well here.`);
		} else {
			weaknesses.push(`Confidence (${subject.confidence}/5): You doubt your ability in this subject.`);
			actions.push(confidenceTip);
		}

		return {
			key,
			...meta,
			passion: subject.passion,
			confidence: subject.confidence,
			alignment: subject.alignment,
			alignmentLabel: formatAlignment(subject.alignment),
			passionClassification,
			confidenceClassification,
			passionTip,
			confidenceTip,
			narrative,
			strengths,
			weaknesses,
			actions
		};
	});

	// Summary: which subjects are strongest/weakest
	const aligned = subjects.filter((s) => s.alignment === 'aligned');
	const disengaged = subjects.filter((s) => s.alignment === 'disengaged');
	const confidenceGaps = subjects.filter((s) => s.alignment === 'confidence-gap');

	let summary = '';
	if (aligned.length === 3) {
		summary = 'You show strong engagement and confidence across all three core subjects. This is an excellent foundation for academic success.';
	} else if (disengaged.length === 3) {
		summary = 'You\'re currently disengaged from all three core subjects. This is a signal worth paying attention to: it may indicate a need for different teaching approaches, more relevant content, or support with underlying barriers.';
	} else {
		const parts: string[] = [];
		if (aligned.length > 0) parts.push(`strong alignment in ${aligned.map((s) => s.name).join(' and ')}`);
		if (confidenceGaps.length > 0) parts.push(`confidence gaps in ${confidenceGaps.map((s) => s.name).join(' and ')} (you enjoy it but doubt yourself)`);
		if (disengaged.length > 0) parts.push(`disengagement from ${disengaged.map((s) => s.name).join(' and ')}`);
		summary = `Your subject profile shows ${parts.join(', and ')}.`;
	}

	return { subjects, summary };
}

function formatAlignment(alignment: string): string {
	const labels: Record<string, string> = {
		aligned: 'Aligned',
		'passion-gap': 'Passion Gap',
		'confidence-gap': 'Confidence Gap',
		disengaged: 'Disengaged'
	};
	return labels[alignment] || alignment;
}
