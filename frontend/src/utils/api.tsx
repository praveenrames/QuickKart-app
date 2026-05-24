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

export async function updatePassword(password: string) {
	const token = localStorage.getItem("ecom_token");
	const res = await fetch(`${API_BASE}/api/user/password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify({ password }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Password update failed");
	return data;
}

export async function updateUserDetails(payload: any) {
	const token = localStorage.getItem("ecom_token");
	const res = await fetch(`${API_BASE}/api/user/edit-user`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "User update failed");
	return data;
}

export async function logoutUser() {
	const token = localStorage.getItem("ecom_token");
	const res = await fetch(`${API_BASE}/api/user/logout`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Logout failed");
	return data;
}

export async function fetchUser() {
	const token = localStorage.getItem("ecom_token");
	const res = await fetch(`${API_BASE}/api/user/get-user`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Fetch user failed");
	return data;
}

export async function forgotPasswordToken(email: string) {
	const res = await fetch(`${API_BASE}/api/user/forgot-password-token`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Failed to send reset email");
	return data;
}

export async function resetPassword(token: string, password: string) {
	const res = await fetch(`${API_BASE}/api/user/reset-password/${token}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ password }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message || "Password reset failed");
	return data;
}

export default { registerUser, loginUser, updatePassword, updateUserDetails, logoutUser, fetchUser, forgotPasswordToken, resetPassword };
