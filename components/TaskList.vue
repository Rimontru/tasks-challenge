<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-card-title class="d-flex justify-space-between align-center">
						<span>Task List</span>
						<v-btn
							color="primary"
							@click="openTaskDialog()"
						>
							<v-icon start>mdi-plus</v-icon>
							New Task
						</v-btn>
					</v-card-title>
					<v-card-text>
						<v-list>
							<v-list-item
								v-for="task in tasks"
								:key="task.id"
								:class="{ 'bg-grey-lighten-4': task.is_completed }"
							>
								<template #prepend>
									<v-checkbox
										v-model="task.is_completed"
										@change="updateTaskStatus(task)"
									/>
								</template>
								<v-list-item-title
									:class="{ 'text-decoration-line-through': task.is_completed }"
								>
									{{ task.title }}
								</v-list-item-title>
								<template #append>
									<v-btn
										icon="mdi-pencil"
										variant="text"
										@click="openTaskDialog(task)"
									/>
									<v-btn
										icon="mdi-delete"
										variant="text"
										color="error"
										@click="confirmDelete(task)"
									/>
								</template>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<!-- Task Dialog -->
		<v-dialog
			v-model="dialog"
			max-width="600px"
		>
			<v-card>
				<v-card-title>
					<span>{{ editedTask.id ? 'Edit Task' : 'New Task' }}</span>
				</v-card-title>
				<v-card-text>
					<v-form
						ref="form"
						v-model="valid"
					>
						<v-text-field
							v-model="editedTask.title"
							label="Title"
							:rules="[(v) => !!v || 'Title is required']"
							required
						/>
						<v-checkbox
							v-model="editedTask.is_completed"
							label="Completed"
						/>
						<v-text-field
							v-model="editedTask.due_date"
							label="Due Date"
							type="date"
						/>
						<v-textarea
							v-model="editedTask.description"
							label="Description"
						/>
						<v-textarea
							v-model="editedTask.comments"
							label="Comments"
						/>
						<v-text-field
							v-model="editedTask.tags"
							label="Tags"
							hint="Separate tags with commas"
						/>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						color="error"
						@click="dialog = false"
						>Cancel</v-btn
					>
					<v-btn
						color="primary"
						:disabled="!valid"
						@click="saveTask"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Delete Confirmation Dialog -->
		<v-dialog
			v-model="deleteDialog"
			max-width="400px"
		>
			<v-card>
				<v-card-title>Delete Task</v-card-title>
				<v-card-text> Are you sure you want to delete this task? </v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						color="primary"
						@click="deleteDialog = false"
						>Cancel</v-btn
					>
					<v-btn
						color="error"
						@click="deleteTask"
						>Delete</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { taskService, type Task } from '~/services/taskService';

const tasks = ref<Task[]>([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const valid = ref(false);
const form = ref();
const taskToDelete = ref<Task | null>(null);

const defaultTask: Task = {
	title: '',
	is_completed: 0,
	due_date: '',
	description: '',
	comments: '',
	tags: '',
};

const editedTask = ref<Task>({ ...defaultTask });

const loadTasks = async () => {
	try {
		tasks.value = await taskService.getAllTasks();
	} catch (error) {
		console.error('Error loading tasks:', error);
	}
};

const openTaskDialog = (task?: Task) => {
	if (task) {
		editedTask.value = { ...task };
	} else {
		editedTask.value = { ...defaultTask };
	}
	dialog.value = true;
};

const saveTask = async () => {
	if (!form.value.validate()) return;

	try {
		if (editedTask.value.id) {
			await taskService.updateTask(editedTask.value.id, editedTask.value);
		} else {
			await taskService.createTask(editedTask.value);
		}
		dialog.value = false;
		loadTasks();
	} catch (error) {
		console.error('Error saving task:', error);
	}
};

const updateTaskStatus = async (task: Task) => {
	try {
		await taskService.updateTask(task.id!, task);
	} catch (error) {
		console.error('Error updating task status:', error);
		task.is_completed = !task.is_completed; // Revert on error
	}
};

const confirmDelete = (task: Task) => {
	taskToDelete.value = task;
	deleteDialog.value = true;
};

const deleteTask = async () => {
	if (!taskToDelete.value?.id) return;

	try {
		await taskService.deleteTask(taskToDelete.value.id);
		deleteDialog.value = false;
		loadTasks();
	} catch (error) {
		console.error('Error deleting task:', error);
	}
};

onMounted(() => {
	loadTasks();
});
</script>
