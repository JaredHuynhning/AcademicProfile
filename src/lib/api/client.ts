import { Answers } from "../types";

const BASE = '/api/hexaco';

export async function fetchItems() {
	const res = await fetch(`${BASE}/items`);
	if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
	return res.json();
}

export async function submitAnswers(answers: Answers) {
	const res = await fetch(`${BASE}/score`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ answers })
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail || `Scoring failed: ${res.status}`);
	}
	return res.json();
}

export async function fetchArchetypes() {
	const res = await fetch(`${BASE}/archetypes`);
	if (!res.ok) throw new Error(`Failed to fetch archetypes: ${res.status}`);
	return res.json();
}
