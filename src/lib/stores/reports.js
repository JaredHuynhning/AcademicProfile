import { writable } from 'svelte/store';
import { testResults, studentName } from './test.js';
import { sampleProfiles } from '$lib/data/sample-profiles.js';

const REPORTS_KEY = 'hexaco_saved_reports';

// Bump this when sample profile data changes to force refresh from code
const SAMPLE_VERSION = 2;
const SAMPLE_VERSION_KEY = 'hexaco_sample_version';

function loadReports() {
	if (typeof window === 'undefined') return [...sampleProfiles];
	try {
		const stored = localStorage.getItem(REPORTS_KEY);
		const reports = stored ? JSON.parse(stored) : [];
		const storedVersion = parseInt(localStorage.getItem(SAMPLE_VERSION_KEY) || '0');

		// Always replace sample profiles with latest code versions
		const userReports = reports.filter((r) => !r.id.startsWith('sample-'));
		const existingSampleIds = new Set(
			reports.filter((r) => r.id.startsWith('sample-')).map((r) => r.id)
		);
		const needsUpdate =
			storedVersion < SAMPLE_VERSION ||
			sampleProfiles.length !== existingSampleIds.size ||
			sampleProfiles.some((s) => !existingSampleIds.has(s.id));

		if (needsUpdate) {
			const merged = [...userReports, ...sampleProfiles];
			localStorage.setItem(REPORTS_KEY, JSON.stringify(merged));
			localStorage.setItem(SAMPLE_VERSION_KEY, String(SAMPLE_VERSION));
			return merged;
		}
		return reports;
	} catch {
		return [...sampleProfiles];
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
