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
										:model-value="task.is_completed === 1"
										:readonly="true"
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

		<!-- Lazy loaded dialogs to avoid loading all dialogs at once -->
		<LazyTaskDialog
			v-if="dialog"
			v-model="dialog"
			:task-id="selectedTaskId"
			@save="saveTask"
		/>

		<LazyDeleteTaskDialog
			v-if="deleteDialog"
			v-model="deleteDialog"
			@confirm="deleteTask"
		/>
	</v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { taskService, type Task } from '~/services/taskService';

const tasks = ref<Task[]>([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const taskToDelete = ref<Task | null>(null);
const selectedTaskId = ref<number | undefined>();

const loadTasks = async () => {
	try {
		tasks.value = await taskService.getAllTasks();
	} catch (error) {
		console.error('Error loading tasks:', error);
	}
};

const openTaskDialog = (task?: Task) => {
	selectedTaskId.value = task?.id;
	dialog.value = true;
};

const saveTask = async (task: Task) => {
	try {
		if (task.id) {
			await taskService.updateTask(task.id, task);
		} else {
			await taskService.createTask(task);
		}
		dialog.value = false;
		loadTasks();
	} catch (error) {
		// TODO: show error message on dialog
		console.error('Error saving task:', error);
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
