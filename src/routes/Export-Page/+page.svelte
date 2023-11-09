<script>
	import { auth, database } from '$lib/firebase';
	import {
		doc,
		setDoc,
		query,
		where,
		getDocs,
		collection,
		getDoc,
		onSnapshot,
		updateDoc,
		addDoc,
		deleteDoc
	} from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue, get, child } from 'firebase/database';
	import { subjectSelected1, userId, timeFrom, timeTo } from '../../lib/userStorage';
	import { onMount } from 'svelte';
	import { current_component, text } from 'svelte/internal';

	async function setDetails() {
		const timeDate = document.getElementById('timeDuration');

		const subject = localStorage.getItem('subjectSelected1');
		const timeIn = localStorage.getItem('timeIn');
		const timeFrom = localStorage.getItem('timeFrom');
		console.log(timeIn);
		console.log(timeFrom);
		const text1 = timeFrom + ' - ' + timeIn;
		timeDate.textContent = text1;
	}
	setDetails();
	onMount(() => {
		userId.subscribe((val) => {
			if (browser) localStorage.userId = val;
		});

		subjectSelected1.subscribe((val) => {
			if (browser) localStorage.subjectSelected1 = val;
		});

		timeFrom.subscribe((val) => {
			if (browser) localStorage.timeFrom = val;
		});

		timeTo.subscribe((val) => {
			if (browser) localStorage.timeTo = val;
		});
		setDetails();
	});
</script>

<!DOCTYPE html>
<html lang="en" class="bg-gray-50">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Your Page Title</title>
		<style>
			@media print {
				/* Add print-specific styles here, e.g., hiding unwanted elements */
				body * {
					visibility: hidden;
				}
				#printableArea1,
				#printableArea1 * {
					visibility: visible;
				}
				#printableArea1 {
					position: absolute;
					left: 0;
					top: 0;
				}
			}
		</style>
	</head>
	<body class="bg-gray-50 h-screen w-full">
		<div class="mx-12 flex pt-5 justify-between">
			<div>
				<a href="/NewTeacher-Dashboard">
					<img src="Mwenzi.png" class="h-14 pb-2" alt="..." />
				</a>
			</div>
			<div class="flex items-end mb-2">
				<button
					class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 px-10 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
					onclick="printDiv()">Print</button
				>
			</div>
		</div>

		<div class="w-full flex flex-col items-center">
			<div class="w-2/4 bg-white pt-8 px-14 mb-8 pb-16 flex flex-col">
				<!-- PAPER 1 -->

				<!--PRINTABLE AREA 1 -->
				<div class="w-full" id="printableArea1">
					<div class="flex items-center flex-col mb-5 mt-2">
						<p class="text-center text-lg font-medium">Attendance Record</p>
						<p class="text-center text-md font-medium">6 Rambutan - Science | Ruffa May Monis</p>
						<p id="timeDuration" class="text-center text-md">January 1, 2023 - January 29, 2023</p>
					</div>
					<table class="w-full mt-3 border text-sm">
						<thead>
							<tr class="border border-black text-center text-sm" />
							<th class="border border-black px-1 w-24 text-sm">Student ID:</th>
							<th class="border border-black px-1 w-24 text-sm">Student Name:</th>
							<th class="border px-1 border-black w-28 text-sm">Total Absent:</th>
							<th class="border px-1 border-black w-24 text-sm">Total Present:</th>
						</thead>
						<tbody>
							<tr class="border border-black text-center text-sm">
								<td class="border border-black text-sm">201175</td>
								<td class="border border-black text-sm">Luis Santiago</td>
								<td class="border border-black text-sm">1 </td>
								<td class="border border-black text-sm">20</td>
							</tr>
							<tr class="border border-black text-center text-sm">
								<td class="border border-black text-sm">201175</td>
								<td class="border border-black text-sm">Ace Gabriel Dela Cuesta</td>
								<td class="border border-black text-sm">1 </td>
								<td class="border border-black text-sm">20</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- END PRINTABLE AREA 1-->

				<!-- END PAPER 1 -->
			</div>

			<script>
				function printDiv() {
					const printableDiv = document.getElementById('printableArea1');
					if (printableDiv) {
						const originalDisplay = printableDiv.style.display;
						printableDiv.style.display = 'block'; // Show the div
						window.print(); // Open the print dialog
						printableDiv.style.display = originalDisplay; // Restore the original display style
					}
				}
			</script>
		</div>
	</body>
</html>
