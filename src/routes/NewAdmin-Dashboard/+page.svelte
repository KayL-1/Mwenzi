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
	import { userId } from '../../lib/userStorage';
	import { onMount } from 'svelte';

	let currentDatee;
	function getDate() {
		fetch('http://worldtimeapi.org/api/timezone/Asia/Manila')
			.then((response) => response.json())
			.then((data) => {
				// Extract the date components
				var currentDate = new Date(data.datetime);
				var year = currentDate.getFullYear();
				var month = currentDate.getMonth() + 1;
				var day = currentDate.getDate();

				// Format the date as desired (e.g., YYYY-MM-DD)
				currentDatee =
					year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');

				console.log(currentDatee); // Output: 2023-05-26
			})
			.catch((error) => {
				console.log('Error:', error);
			});
	}
	getDate();

	// Function to handle changes in the selected option
	function handleSelectChange(event) {
		const selectedOption = event.target.value;

		if (selectedOption === '/Section-Subject') {
			window.location.href = selectedOption;
		}

		if (selectedOption === '/Student-List') {
			window.location.href = selectedOption;
		}

		if (selectedOption === '/Teacher-List') {
			window.location.href = selectedOption;
		}
	}

	let subjectArray = [];
	let students = [];
	let teachers = [];

	async function classCheck() {
		const collectionRef = collection(firestore, 'Subject');
		const querySnapshot = await getDocs(collectionRef);

		subjectArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));

		subjectArray.sort((a, b) => {
			const idA = a.id.toLowerCase(); // Convert to lowercase for case-insensitive sorting
			const idB = b.id.toLowerCase();

			if (idA < idB) {
				return -1;
			}
			if (idA > idB) {
				return 1;
			}
			return 0;
		});
	}

	async function studentCheck(option) {
		const collectionRef = collection(firestore, 'users');
		const filter = query(collectionRef, where('userRole', '==', 'student'));
		const querySnapshot = await getDocs(filter);
		students = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));

		if (option == 'Alphabetical') {
			students.sort((a, b) => {
				const lastNameA = a.data.lastName.toLowerCase(); // Convert to lowercase for case-insensitive sorting
				const lastNameB = b.data.lastName.toLowerCase();

				if (lastNameA < lastNameB) {
					return -1;
				}
				if (lastNameA > lastNameB) {
					return 1;
				}
				return 0;
			});
		}

		if (option == 'Grade') {
			students.sort((a, b) => {
				const gradeLevelA = a.data.gradeLevel; // Assuming gradeLevel is a property in data
				const gradeLevelB = b.data.gradeLevel;

				// Use the localeCompare() method to compare the strings
				return gradeLevelA.localeCompare(gradeLevelB);
			});
		}
	}

	async function teacherCheck() {
		const collectionRef = collection(firestore, 'users');
		const filter = query(collectionRef, where('userRole', '==', 'teacher'));
		const querySnapshot = await getDocs(filter);

		teachers = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
		teachers.sort((a, b) => {
				const lastNameA = a.data.lastName.toLowerCase(); // Convert to lowercase for case-insensitive sorting
				const lastNameB = b.data.lastName.toLowerCase();

				if (lastNameA < lastNameB) {
					return -1;
				}
				if (lastNameA > lastNameB) {
					return 1;
				}
				return 0;
			});
	}

	async function getTeacherName(teacherID) {
		console.log(teacherID);
		const queryRef = collection(firestore, 'users');
		const querySnapshot = await getDocs(query(queryRef, where('UID', '==', teacherID)));

		if (!querySnapshot.empty) {
			// Assuming you have a 'name' field in your user document
			const userData = querySnapshot.docs[0].data();
			return userData.Name;
		}

		return 'Unknown'; // Return a default value if teacher is not found
	}

	classCheck();
	studentCheck('Alphabetical');
	teacherCheck();
</script>

<body class=" bg-gray-50 h-screen">
	<header class="text-gray-600 body-font">
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class="mx-12 flex flex-wrap pt-5 flex-col md:flex-row items-center">
			<nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img src="Mwenzi.png" class="h-14 pb-2" alt="..." />
			</nav>

			<a
				class="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0"
			>
				<select
					class="select select-bordered focus:border-none border-gray-200 w-full h-5 max-w-xs rounded-3xl shadow-sm"
					on:change={handleSelectChange}
				>
					<option disabled selected hidden class="rounded-3xl">Dashboard</option>
					<option value="/Section-Subject" id="Section-Subject" class="rounded-3xl"
						>Section - Subject</option
					>
					<option value="/Student-List" id="Student-List" class="rounded-xl">Students</option>
					<option value="/Teacher-List" id="Teacher-List">Teachers</option>
				</select>
			</a>
			<div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 ou">
				<p class="font-medium text-md mr-5 mt-1">Hi, Mwenzi Admin</p>
				<button class="dropdown dropdown-end">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						fill="green"
						class="bi bi-person-circle"
						viewBox="0 0 16 16"
					>
						<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
						<path
							fill-rule="evenodd"
							d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
						/>
					</svg>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="text-center rounded-2xl mt-2 dropdown-content shadow bg-base-100 w-40"
					>
						<li class="rounded-2xl hover:bg-gray-200">
							<a href="/Login" class="ml-12 py-1 flex text-center font-medium">Log out</a>
						</li>
					</ul>
				</button>
			</div>

			<div class="flex justify-between w-full">
				<div />

				<!--RFID STATUS, DATE, SUBJECT TIME -->
				<div class="flex flex-row w-1/3 justify-end">
					<div
						class="container h-8 my-6 mx-1 border border-gray-200 rounded-3xl w-48 flex justify-center items-center"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							id="calendar"
							><g
								fill="none"
								fill-rule="evenodd"
								stroke="#ADADAD"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								><line x1=".093" x2="17.917" y1="7.404" y2="7.404" /><line
									x1="13.442"
									x2="13.451"
									y1="11.31"
									y2="11.31"
								/><line x1="9.005" x2="9.014" y1="11.31" y2="11.31" /><line
									x1="4.558"
									x2="4.567"
									y1="11.31"
									y2="11.31"
								/><line x1="13.442" x2="13.451" y1="15.196" y2="15.196" /><line
									x1="9.005"
									x2="9.014"
									y1="15.196"
									y2="15.196"
								/><line x1="4.558" x2="4.567" y1="15.196" y2="15.196" /><line
									x1="13.044"
									x2="13.044"
									y2="3.291"
								/><line x1="4.966" x2="4.966" y2="3.291" /><path
									d="M13.2382655,1.57919622 L4.77096342,1.57919622 C1.83427331,1.57919622 0,3.21513002 0,6.22222222 L0,15.2718676 C0,18.3262411 1.83427331,20 4.77096342,20 L13.2290015,20 C16.1749556,20 18,18.3546099 18,15.3475177 L18,6.22222222 C18.0092289,3.21513002 16.1842196,1.57919622 13.2382655,1.57919622 Z"
								/></g
							></svg
						>
						<!-- svelte-ignore a11y-missing-content -->
						<a class="font-medium text-sm p-2">{currentDatee}</a>
					</div>
				</div>
				<!--END RFID STATUS, DATE, SUBJECT TIME -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card mx-10 h-3/4">
		<!--ATTENDANCE-->
		<div class="w-3/5 h-full bg-white bg-opacity-75 rounded-3xl pb-20 text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row justify-between w-full">
					<div class="flex flex-row">
						<img src="class.png" class="h-8 pl-6 mt-2" alt="..." />
						<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Section - Subject List</h1>
					</div>
					<!-- <select
						id="sort1"
						class="mt-3 border-gray-200 w-40 h-6 font-medium text-sm text-center mr-6 border border-gray focus:none rounded-3xl shadow-sm"
					>
						<option disabled selected hidden class="rounded-3xl">Sort by</option>
						<option class="rounded-xl">Teacher</option>
						<option class="rounded-xl">Alphabetical</option>
					</select> -->
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-5/6">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Section - Subject </th>
							<th scope="col" class="px-6 py-4 text-center">Total Students</th>
							<th scope="col" class="px-6 py-4 text-center">Teacher</th>
							<th scope="col" class="px-6 py-4 text-center">Time</th>
						</tr>
					</thead>
					<tbody>
						{#each subjectArray as item1 (item1.id)}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<td class="text-center">{item1.id}</td>
								<td class="px-6 py-2 text-center">
									{item1.data.students ? item1.data.students.length : 'N/A'}</td
								>
								{#await getTeacherName(item1.data.teacherID) then teacherName}
									<td class="py-1 px-6 text-center">{teacherName}</td>
								{:catch error}
									<td class="py-1 px-6 text-center">Error fetching teacher name</td>
								{/await}
								<td>
									{#if item1.data.timeIn && item1.data.timeOut}
										{item1.data.timeIn} - {item1.data.timeOut}
									{:else}
										N/A
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!--POINTS-->
		<div class="w-2/5 h-full bg-white bg-opacity-75 pb-20 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row justify-between w-full">
					<div class="flex flex-row">
						<img src="student.png" class="h-8 pl-6 mt-2" alt="..." />
						<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Student List</h1>
					</div>
					<select
						class="mt-3 border-gray-200 w-40 h-6 font-medium text-sm text-center mr-6 border border-gray focus:none rounded-3xl shadow-sm"
						on:change={(event) => studentCheck(event.target.value)}
					>
						<option disabled selected hidden class="rounded-3xl">Sort by</option>
						<option class="rounded-xl">Grade</option>
						<option class="rounded-xl">Alphabetical</option>
					</select>
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-full">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Grade Level</th>
							<th scope="col" class="px-6 py-4 text-center">Student name</th>
							<th scope="col" class="px-6 py-4 text-center">RFID Tag</th>
							<th scope="col" class="px-6 py-4 text-center">Student ID</th>
						</tr>
					</thead>
					<tbody>
						{#each students as item1 (item1.id)}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<td class="text-center">{item1.data.gradeLevel}</td>
								<td class="text-center">{item1.data.lastName}, {item1.data.firstName}</td>
								<td class="px-6 py-2 text-center">{item1.data.studentRFID}</td>
								<td class="py-1 px-6 text-center">{item1.data.studentID}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!--TO DO-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row justify-between w-full">
					<div class="flex flex-row">
						<img src="teacher.png" class="h-8 pl-6 mt-2" alt="..." />
						<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Teachers List</h1>
					</div>
					<!-- <select
						class="mt-3 border-gray-200 w-40 h-6 font-medium text-sm text-center mr-6 border border-gray focus:none rounded-3xl shadow-sm"
					>
						<option disabled selected hidden class="rounded-3xl">Sort by</option>
						<option class="rounded-xl">Alphabetical</option>
						<option class="rounded-xl">Recently Added</option>
					</select> -->
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-full">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Teacher name</th>
							<th scope="col" class="px-6 py-4 text-center">Email</th>
						</tr>
					</thead>
					<tbody>
						{#each teachers as item1}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<td class="text-center">{item1.data.lastName}, {item1.data.firstName}</td>
								<td class="px-6 py-2 text-center">{item1.data.email}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</body>
