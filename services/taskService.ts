import axios from 'axios';

const API_URL = 'https://ecsdevapi.nextline.mx/vdev/tasks-challenge/tasks';
const TOKEN =
	'e864a0c9eda63181d7d65bc73e61e3dc6b74ef9b82f7049f1fc7d9fc8f29706025bd271d1ee1822b15d654a84e1a0997b973a46f923cc9977b3fcbb064179ecd';

const headers = {
	Authorization: `Bearer ${TOKEN}`,
	'Content-Type': 'application/x-www-form-urlencoded',
};

export interface Task {
	id?: number;
	title: string;
	is_completed: number;
	due_date?: string;
	comments?: string;
	description?: string;
	tags?: string;
}

export const taskService = {
	async getAllTasks() {
		const response = await axios.get(API_URL, {
			headers,
			params: { token: TOKEN },
		});
		return response.data;
	},

	async getTaskById(taskId: number) {
		const response = await axios.get(`${API_URL}/${taskId}`, {
			headers,
			params: { token: TOKEN },
		});
		return response.data;
	},

	async createTask(task: Task) {
		const formData = new URLSearchParams();
		formData.append('token', TOKEN);
		formData.append('title', task.title);
		formData.append('is_completed', task.is_completed.toString());
		if (task.due_date) formData.append('due_date', task.due_date);
		if (task.comments) formData.append('comments', task.comments);
		if (task.description) formData.append('description', task.description);
		if (task.tags) formData.append('tags', task.tags);

		const response = await axios.post(API_URL, formData, { headers });
		return response.data;
	},

	async updateTask(taskId: number, task: Task) {
		const formData = new URLSearchParams();
		formData.append('token', TOKEN);
		formData.append('title', task.title);
		formData.append('is_completed', task.is_completed.toString());
		if (task.due_date) formData.append('due_date', task.due_date);
		if (task.comments) formData.append('comments', task.comments);
		if (task.description) formData.append('description', task.description);
		if (task.tags) formData.append('tags', task.tags);

		const response = await axios.put(`${API_URL}/${taskId}`, formData, {
			headers,
		});
		return response.data;
	},

	async deleteTask(taskId: number) {
		const response = await axios.delete(`${API_URL}/${taskId}`, {
			headers,
			params: { token: TOKEN },
		});
		return response.data;
	},
};
