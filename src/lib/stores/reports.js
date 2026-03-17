import { writable } from 'svelte/store';
import { testResults, studentName } from './test.js';
import { sampleProfiles } from '$lib/data/sample-profiles.js';

const REPORTS_KEY = 'hexaco_saved_reports';

function loadReports() {
	if (typeof window === 'undefined') return [];
	try {
		const stored = localStorage.getItem(REPORTS_KEY);
		if (stored === null) {
			// First load — seed with sample profiles
			localStorage.setItem(REPORTS_KEY, JSON.stringify(sampleProfiles));
			return [...sampleProfiles];
		}
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

function persist(reports) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
	}
}

export const savedReportsStore = writable(loadReports());

savedReportsStore.subscribe((reports) => {
	persist(reports);
});

export function saveReport(name, results) {
	savedReportsStore.update((reports) => {
		const entry = {
			id: crypto.randomUUID(),
			name,
			date: new Date().toISOString(),
			results
		};
		try {
			const updated = [entry, ...reports];
			persist(updated);
			return updated;
		} catch (e) {
			if (e.name === 'QuotaExceededError') {
				// Drop oldest non-sample reports to make room
				const trimmed = reports.filter((r) => r.id.startsWith('sample-')).concat(
					reports.filter((r) => !r.id.startsWith('sample-')).slice(0, -1)
				);
				return [entry, ...trimmed];
			}
			return reports;
		}
	});
}

export function loadReport(report) {
	testResults.set(report.results);
	studentName.set(report.name);
}

export function deleteReport(id) {
	savedReportsStore.update((reports) => reports.filter((r) => r.id !== id));
}
