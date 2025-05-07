<template>
	<v-dialog
		:model-value="modelValue"
		max-width="600px"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<v-card>
			<v-card-title>
				<span>{{ taskId ? 'Edit Task' : 'New Task' }}</span>
			</v-card-title>
			<v-card-text>
				<v-form
					ref="form"
					v-model="valid"
				>
					<v-text-field
						v-model="localTask.title"
						label="Title"
						:rules="[(v) => !!v || 'Title is required']"
						required
					/>
					<v-checkbox
						label="Completed"
						:model-value="localTask.is_completed === 1"
						@update:model-value="updateCompleted"
					/>
					<v-text-field
						v-model="localTask.due_date"
						label="Due Date"
						type="date"
					/>
					<v-textarea
						v-model="localTask.description"
						label="Description"
					/>
					<v-textarea
						v-model="localTask.comments"
						label="Comments"
					/>
					<v-text-field
						v-model="localTask.tags"
						label="Tags"
						hint="Separate tags with commas"
					/>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn
					color="error"
					@click="$emit('update:modelValue', false)"
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { taskService, type Task } from '~/services/taskService';

const props = defineProps<{
	modelValue: boolean;
	taskId?: number;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	save: [task: Task];
}>();

const valid = ref(false);
const form = ref();

const defaultTask: Task = {
	title: '',
	is_completed: 0,
	due_date: '',
	description: '',
	comments: '',
	tags: '',
};

const localTask = ref<Task>({ ...defaultTask });

const updateCompleted = (value: boolean | null) => {
	localTask.value.is_completed = value ? 1 : 0;
};

const loadTask = async () => {
	if (props.taskId) {
		try {
			const response = await taskService.getTaskById(props.taskId);
			console.log('API Response:', response);

			// Handle both array and single object responses
			const taskData = Array.isArray(response) ? response[0] : response;

			if (taskData) {
				localTask.value = { ...taskData };
			} else {
				localTask.value = { ...defaultTask };
				throw new Error('No task data found');
			}
		} catch (error) {
			console.error('Error loading task:', error);
			localTask.value = { ...defaultTask };
		}
	} else {
		localTask.value = { ...defaultTask };
	}
};

watch(
	() => props.taskId,
	() => {
		if (props.modelValue) {
			loadTask();
		}
	},
	{ immediate: true }
);

// Load task when dialog opens
watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue) {
			loadTask();
		}
	},
	{ immediate: true }
);

// watch for dialog open/close
watch(
	() => props.modelValue,
	(isOpen) => {
		if (isOpen) {
			loadTask();
		}
	},
	{ immediate: true }
);

const saveTask = () => {
	if (!form.value.validate()) return;
	emit('save', localTask.value);
};
</script>
