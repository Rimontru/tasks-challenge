<template>
	<v-app>
		<v-app-bar color="primary">
			<v-app-bar-title>Task Manager</v-app-bar-title>
		</v-app-bar>

		<v-main>
			<TaskList />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import TaskList from '~/components/TaskList.vue';
</script>

<style>
.v-application {
	font-family: 'Roboto', sans-serif;
}
</style>
