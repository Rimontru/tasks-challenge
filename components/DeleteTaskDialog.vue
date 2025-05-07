<template>
	<v-dialog
		:model-value="modelValue"
		max-width="400px"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<v-card>
			<v-card-title>Delete Task</v-card-title>
			<v-card-text>Are you sure you want to delete this task?</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn
					color="primary"
					@click="$emit('update:modelValue', false)"
					>Cancel</v-btn
				>
				<v-btn
					color="error"
					@click="$emit('confirm')"
					>Delete</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
defineProps<{
	modelValue: boolean;
}>();

defineEmits<{
	'update:modelValue': [value: boolean];
	confirm: [];
}>();
</script>
