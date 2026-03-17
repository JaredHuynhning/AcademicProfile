import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'hexaco_answers';
const RESULTS_KEY = 'hexaco_results';
const NAME_KEY = 'hexaco_name';
const QUIZ_MODE_KEY = 'hexaco_quiz_mode';

function loadFromStorage(key, fallback) {
	if (typeof window === 'undefined') return fallback;
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : fallback;
	} catch {
		return fallback;
	}
}

function persistedWritable(key, fallback) {
	const store = writable(loadFromStorage(key, fallback));
	store.subscribe((value) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(key, JSON.stringify(value));
		}
	});
	return store;
}

export const testItems = writable([]);
export const answers = persistedWritable(STORAGE_KEY, {});
export const currentIndex = writable(0);
export const testResults = persistedWritable(RESULTS_KEY, null);
export const studentName = persistedWritable(NAME_KEY, '');
export const quizMode = persistedWritable(QUIZ_MODE_KEY, 'complete');

export const progress = derived(
	[answers, testItems],
	([$answers, $testItems]) => {
		const total = $testItems.length || 60;
		const answered = Object.keys($answers).length;
		return {
			answered,
			total,
			percent: total > 0 ? Math.round((answered / total) * 100) : 0
		};
	}
);

export const isComplete = derived(
	[answers, testItems],
	([$answers, $testItems]) => {
		if ($testItems.length === 0) return false;
		return $testItems.every((item) => $answers[item.id] !== undefined);
	}
);

export function resetTest() {
	answers.set({});
	currentIndex.set(0);
	testResults.set(null);
	if (typeof window !== 'undefined') {
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(RESULTS_KEY);
	}
}
