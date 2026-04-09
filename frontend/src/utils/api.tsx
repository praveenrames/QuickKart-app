const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

type RegisterPayload = {
	firstname: string;
	lastname?: string;
	email: string;
	mobile?: string | number;
	password: string;
	role?: string;
};

type LoginPayload = {
	email: string;
	password: string;
};

export async function registerUser(payload: RegisterPayload) {
	const res = await fetch(`${API_BASE}/api/user/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Register failed");
	return data;
}

export async function loginUser(payload: LoginPayload) {
	const res = await fetch(`${API_BASE}/api/user/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Login failed");
	return data;
}

export default { registerUser, loginUser };
