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
	import toast, { Toaster } from 'svelte-french-toast';

	let userUID = '';
	let currentDatee;
	let selecTSub;
	let subjects = [];
	let recitation = [];
	let notes = [];
	let weekStatus;

	let dateArray = {};
	let dateArrayAsArray = [];

	async function updateLessonText() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const weekSelector = document.getElementById('weekSelector');
		const selectedValue = weekSelector.value;
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Lessons');
		const week1DocRef = doc(collectionRef, selectedValue); // Use the selectedValue
		try {
			const docSnapshot = await getDoc(week1DocRef);

			if (docSnapshot.exists()) {
				const queriedData = docSnapshot.data();
				console.log(queriedData);

				for (let day = 1; day <= 5; day++) {
					const inputElement = document.getElementById(`day${day}input`);

					if (dayData.Share == 'Current Class') {
						const dayData = queriedData[`day${day}`];
						if (dayData) {
							if (dayData.Link !== null) {
								inputElement.value = dayData.Link || '';
							}
						}
					}
				}
			} else {
				console.log('Document does not exist.');
				for (let day = 1; day <= 5; day++) {
					const inputElement = document.getElementById(`day${day}input`);
					inputElement.value = '';
				}
			}
		} catch (error) {
			console.error('Error getting document:', error);
		}
	}

	function resetTotal() {}

	function redirectToLink(id) {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const inputElement = document.getElementById(id);
		const inputValue = inputElement.value.trim();
		const link = 'https:' + inputValue;
		if (inputValue) {
			window.open(link, '_blank');
		}
	}

	async function getSubjectTime() {
		const docRef = doc(firestore, 'Subject', selecTSub);
		const docSnapshot = await getDoc(docRef);

		if (docSnapshot.exists()) {
			console.log(docSnapshot.data().timeIn);
			const timeIn = docSnapshot.data().timeIn || '';
			const timeOut = docSnapshot.data().timeOut || '';

			const timeText = document.getElementById('subjectTime');
			timeText.textContent = timeIn + ' - ' + timeOut;
		} else {
			console.log('No documents found in the collection.');
		}
	}

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

	async function sortRecitation() {
		const selectOption = document.getElementById('SortRec').value;
		const totalElements = document.getElementsByClassName('pointsDisplay1');
		const weekElements = document.getElementsByClassName('pointsDisplay2');
		const dayElements = document.getElementsByClassName('pointsDisplay3');

		if (selectOption === 'Total Points') {
			for (let i = 0; i < totalElements.length; i++) {
				totalElements[i].hidden = false;
			}
			for (let i = 0; i < weekElements.length; i++) {
				weekElements[i].hidden = true;
			}
			for (let i = 0; i < dayElements.length; i++) {
				dayElements[i].hidden = true;
			}

			recitation.sort((a, b) => b.totalPoints - a.totalPoints);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});
		}

		if (selectOption === 'Weekly') {
			for (let i = 0; i < totalElements.length; i++) {
				totalElements[i].hidden = true;
			}
			for (let i = 0; i < weekElements.length; i++) {
				weekElements[i].hidden = true;
			}
			for (let i = 0; i < dayElements.length; i++) {
				dayElements[i].hidden = false;
			}

			recitation.sort((a, b) => b.week - a.week);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});
		}

		if (selectOption === 'Daily') {
			for (let i = 0; i < totalElements.length; i++) {
				totalElements[i].hidden = true;
			}
			for (let i = 0; i < weekElements.length; i++) {
				weekElements[i].hidden = false;
			}
			for (let i = 0; i < dayElements.length; i++) {
				dayElements[i].hidden = true;
			}

			recitation.sort((a, b) => b.day - a.day);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});
		}
		recitationCheck();
	}

	async function classCheck() {
		const subjectRef = collection(firestore, 'Subject');
		const queryRef = query(subjectRef, where('students', 'array-contains', userUID));

		const querySnapshot = await getDocs(queryRef);

		subjects = querySnapshot.docs.map((doc) => doc.id);
	}

	async function getNotes() {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(collectionRef, where('Archive', '==', 'false'));
		const querySnapshot = await getDocs(queryRef2);

		querySnapshot.forEach((doc) => {
			// Access the document ID
			const docId = doc.id;
			// Access the document data
			const docData = doc.data();

			// Push an object containing the ID and data to the 'notes' array
			notes.push({ id: docId, data: docData });
		});

		notes.forEach(function (note) {
			console.log(note.data.Date);
		});
	}

	let presentCount = 0;
	let absentCount = 0;
	async function attendanceCheck() {
		presentCount = 0;
		absentCount = 0;
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');

		// Use the getDocs function to retrieve all documents in the subcollection
		const querySnapshot = await getDocs(attendanceCollectionRef);

		querySnapshot.forEach((doc) => {
			// Access the document data using doc.data()
			const documentData = doc.data();

			// Check if the document has the specific row
			if (documentData[userUID]) {
				dateArray[doc.id] = documentData[userUID];
			}
		});

		dateArrayAsArray = Object.keys(dateArray).map((date) => ({
			date,
			...dateArray[date]
		}));

		dateArrayAsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

		for (const item of dateArrayAsArray) {
			if (item.status === 'Present') {
				presentCount++;
			} else if (item.status === 'Absent') {
				absentCount++;
			}
		}

		document.getElementById('present1').textContent = presentCount.toString();
		document.getElementById('absent1').textContent = absentCount.toString();

		console.log('Present Count:', presentCount);
		console.log('Absent Count:', absentCount);
	}

	async function recitationCheck() {
		const selectOption = document.getElementById('SortRec').value;
		const attendanceCollectionReflll = collection(
			firestore,
			'Subject',
			`${selecTSub}`,
			'Recitation'
		);
		return onSnapshot(attendanceCollectionReflll, (snapshot) => {
			recitation = [];
			// Clear the recitation array before populating it again
			snapshot.forEach((doc) => {
				const documentData = doc.data();
				const documentName = doc.id;
				const totalPoints = documentData.totalPoints;
				const week = documentData.week || 0;
				const day = documentData.day || 0;

				const documentInfo = {
					id: documentName,
					totalPoints: totalPoints,
					week: week,
					day: day
				};

				recitation.push(documentInfo);
			});

			if (selectOption == 'Total Points') {
				recitation.sort((a, b) => b.totalPoints - a.totalPoints);

				recitation.forEach((item, index) => {
					item.ranking = index + 1;
				});

				console.log('Updated recitation array with ranking:', recitation);
				console.log('recitation array:', recitation);
			} else if (selectOption == 'Weekly') {
				recitation.sort((a, b) => b.week - a.week);

				recitation.forEach((item, index) => {
					item.ranking = index + 1;
				});
			} else if (selectOption == 'Daily') {
				recitation.sort((a, b) => b.day - a.day);

				recitation.forEach((item, index) => {
					item.ranking = index + 1;
				});
			}

			fetchNamesTwo();
		});
	}

	async function fetchNamesTwo() {
		const refer = collection(firestore, 'users');
		const ids = recitation.map((item) => item.id); // Extract all IDs from the recitation array

		// Query the Firestore documents by IDs
		const snapshot = await getDocs(refer, where('studentRFID', 'in', ids));

		snapshot.forEach((doc) => {
			const id = doc.data().studentRFID;
			const name = doc.data().Name;

			// Find the item in the recitation array with the matching ID
			const item = recitation.find((el) => el.id === id);

			if (item) {
				// Update the name property for the matching item
				item.name = name;
			}
		});
		recitation = recitation;
	}
	let noteArray = [];
	function fetchAndDisplayNotes(type) {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(
			collectionRef,
			where('Archive', '==', 'false'),
			where('Status', '==', 'Current Class')
		);

		const unsubscribe = onSnapshot(queryRef2, (snapshot) => {
			// Clear the existing array when there's an update
			noteArray = [];

			// Iterate over each document in the snapshot
			snapshot.forEach((doc) => {
				// Get the data of each document
				const noteData = doc.data();
				noteData.id = doc.id;
				// Push the data into the array
				noteArray.push(noteData);
			});

			if (type === 'Recent') {
				noteArray = noteArray.sort((a, b) => {
					console.log('Sorting Recent:', new Date(b.Date), new Date(a.Date));
					return new Date(b.Date) - new Date(a.Date);
				});
			}
			if (type === 'Old') {
				noteArray = noteArray.sort((a, b) => {
					console.log('Sorting Old:', new Date(a.Date), new Date(b.Date));
					return new Date(a.Date) - new Date(b.Date);
				});
			}
			// Now, noteArray contains the updated data of all documents in the query
			console.log(noteArray);
		});
	}

	let noteArchive = [];

	function fetchAndDisplayNotes2(type) {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(
			collectionRef,
			where('Archive', '==', 'true'),
			where('Status', '==', 'Current Class')
		);

		const unsubscribe = onSnapshot(queryRef2, (snapshot) => {
			// Clear the existing array when there's an update
			noteArchive = [];
			// Iterate over each document in the snapshot
			snapshot.forEach((doc) => {
				// Get the data of each document
				const noteData = doc.data();
				noteData.id = doc.id;
				// Push the data into the array
				noteArchive.push(noteData);
			});

			if (type === 'Recent') {
				noteArchive = noteArchive.sort((a, b) => {
					console.log('Sorting Recent:', new Date(b.Date), new Date(a.Date));
					return new Date(b.Date) - new Date(a.Date);
				});
			}
			if (type === 'Old') {
				noteArchive = noteArchive.sort((a, b) => {
					console.log('Sorting Old:', new Date(a.Date), new Date(b.Date));
					return new Date(a.Date) - new Date(b.Date);
				});
			}
			// Now, noteArray contains the updated data of all documents in the query
			console.log('testing: ', noteArchive);
		});
	}

	async function change() {
		console.log(selecTSub);
		attendanceCheck();
		recitationCheck();
		getNotes();
		fetchAndDisplayNotes();
		getSubjectTime();
		updateLessonText();
		fetchAndDisplayNotes2('Recent');
		fetchAndDisplayNotes('Recent');
	}

	async function getuserName(id) {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('studentRFID', '==', id));
		const querySnapshot = await getDocs(queryRef2);
		if (querySnapshot.docs.length > 0) {
			const doc = querySnapshot.docs[0];
			document.getElementById('userName').textContent =
				doc.data().firstName + ' ' + doc.data().lastName;
		} else {
			window.location.replace('../Student');
			return 'Student not found';
		}
	}

	getDate();

	onMount(() => {
		const unsubscribe = userId.subscribe((value) => {
			userUID = localStorage.getItem('userId');
			getuserName(userUID);
			classCheck();
			return () => {
				unsubscribe();
			};
		});
	});
</script>

<body class=" bg-gray-50 h-screen">
	<header class="text-gray-600 body-font">
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class="mx-12 flex flex-wrap pt-5 flex-col md:flex-row items-center">
			<div class="w-full flex flex-row justify-between">
				<nav class="flex items-center text-base">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img src="Mwenzi5.png" class="h-14 pb-2" alt="..." />
				</nav>
				<div class="flex flex-row">
					<p class="font-medium text-md my-auto mr-3" id="userName">Hi, Mwenzi Student</p>
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
			</div>

			<div class="flex justify-between w-full">
				<!--ATTENDANCE SUMMARY-->
				<div class="flex flex-row">
					<div
						class="container h-10 my-6 mx-1 border border-gray-200 rounded-3xl w-48 flex justify-center items-center"
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
						<a class="font-medium text-sm p-2">{currentDatee}</a>
					</div>

					<div
						class="container h-10 w-80 my-6 mx-1 px-2 border border-gray-200 rounded-3xl flex justify-center items-center"
					>
						<svg
							viewBox="0 0 24 24"
							fill="#ADADAD"
							width="20"
							height="20"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							/><g id="SVGRepo_iconCarrier">
								<path
									d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
									fill="#ADADAD"
								/>
								<path
									d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
									fill="#ADADAD"
								/>
							</g></svg
						>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2"> Subject Time: </a>
						<a id="subjectTime" class="font-semibold text-sm" />
					</div>

					<div
						class="container h-10 my-6 mx-2 pr-3 pl-1 border border-gray-200 rounded-3xl w-auto flex flex-row justify-center items-center"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2">Total Present: </a>
						<a id="present1" class="font-semibold text-sm text-green-500"> 0</a>
						<a class="font-medium text-sm p-2">Total Absent: </a>
						<a id="absent1" class="font-semibold text-sm text-red-500">0</a>
					</div>
				</div>
				<!--END SUMMARY ATTENDANCE -->

				<!--RFID STATUS, DATE, SUBJECT TIME -->
				<div class="flex flex-row w-64">
					<a
						class="flex order-first title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center md:mb-0"
					>
						<select
							bind:value={selecTSub}
							on:change={change}
							class="select select-bordered focus:border-none border-gray-200 w-64 h-5 rounded-3xl shadow-sm"
						>
							<option disabled selected hidden class="rounded-3xl">Select Class</option>
							{#each subjects as subject (subject)}
								<option class="rounded-xl" value={subject}>{subject}</option>
							{/each}
						</select>
					</a>
				</div>
				<!--END RFID STATUS, DATE, SUBJECT TIME -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card mx-10 h-3/4">
		<!--ATTENDANCE-->
		<div class="w-3/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row">
					<img src="addclass.png" class="h-8 pl-6 mt-2" alt="..." />
					<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Attendance</h1>
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-4/5 max-h-4/5">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Date</th>
							<th scope="col" class="px-6 py-4 text-center">Time</th>
							<th scope="col" class="px-6 py-4 text-center">Status</th>
							<th scope="col" class="px-6 py-4 text-left">Late</th>
						</tr>
					</thead>
					<tbody>
						{#each dateArrayAsArray as date}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<th
									scope="row"
									class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
								>
									{date.date}
								</th>
								<td class="px-6 py-2 text-center">{date.time}</td>
								<td class="py-1 px-6 flex justify-center">
									{#if date.status == 'Present'}
										<td class="py-1 px-6 flex justify-center">
											<span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
												>Present</span
											>
										</td>
									{:else if date.status == 'Late'}
										<td class="py-1 px-6 flex justify-center">
											<span class="bg-orange-500 text-white py-1 px-3 rounded-full text-xs"
												>Late</span
											>
										</td>
									{:else}
										<td class="py-1 px-6 flex justify-center">
											<span class="bg-red-500 text-white py-1 px-3 rounded-full text-xs"
												>Absent</span
											>
										</td>
									{/if}
								</td>
								<td class="px-6 py-2 text-left">
									<input
										type="checkbox"
										checked={date.late === 'True' ? true : false}
										class="checkbox checkbox-warning"
										style="pointer-events: none;"
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!--POINTS-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="leaderboard.png" class="h-8 pl-6 pr-1 mt-1" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Points</h1>
			</div>
			<select
				id="SortRec"
				on:change={sortRecitation}
				class="mt-2 border-gray-200 w-56 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
			>
				<option selected class="rounded-3xl">Total Points</option>
				<option class="rounded-xl">Daily</option>
				<option class="rounded-xl">Weekly</option>
			</select>
			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-4 max-h-4/5">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center"> Rank </th>
							<th scope="col" class="px-6 py-4 text-center"> Name </th>
							<th scope="col" class="px-6 py-4 text-center"> Points </th>
						</tr>
					</thead>
					<tbody>
						{#each recitation as data}
							<!-- Table row for each recitation item -->
							<tr class="border-b bg-white">
								<!-- Display the data for each recitation item -->
								<td class="text-sm text-gray-500 font-medium px-6 py-4 whitespace-nowrap">
									{data.ranking}
								</td>
								<td
									class="text-center text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap"
								>
									{data.name}
								</td>
								<td
									id="pointsDisplay1"
									class="pointsDisplay1 text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"
								>
									{data.totalPoints}
								</td>
								<td
									hidden
									id="pointsDisplay2"
									class="pointsDisplay2 text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"
								>
									{data.day}
								</td>
								<td
									hidden
									id="pointsDisplay3"
									class="pointsDisplay3 text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"
								>
									{data.week}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!--NOTES AND MATERIAL -->
		<div class="flex-row w-2/5">
			<!--NOTES-->
			<div class="h-2/4 pb-2">
				<div class="w-full bg-white bg-opacity-75 rounded-3xl text-center shadow-lg h-full">
					<div class="flex flex-row justify-between">
						<div class="flex flex-row pt-2">
							<img src="todo.png" class="h-7 pl-6 mt-2" alt="..." />
							<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Notes</h1>
						</div>
						<label for="NotesArchives" class="mr-8 mt-2 rounded-3xl cursor-pointer">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier" ble-fi
									><path
										d="M8.707 6.707a1 1 0 0 0-1.414-1.414L4 8.586 2.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4ZM12 7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12ZM8.707 13.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L4 16.586l3.293-3.293a1 1 0 0 1 1.414 0ZM12 15a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12Z"
										fill="#currentColor"
										class="fill-current text-gray-600 hover:text-blue-500"
									/></g
								></svg
							>
						</label>
						<!--NOTE ARCHIVES -->
					</div>
					<input type="checkbox" id="NotesArchives" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-4/6 max-w-3xl text-left">
							<label for="NotesArchives" class="btn btn-sm btn-circle absolute right-2 top-2"
								>✕</label
							>
							<h3 class="text-xl font-bold text-center">Note Archives</h3>

							<div class="mx-auto w-full mt-5">
								<table class="text-sm text-gray-500 dark:text-gray-400 w-full rounded-lg shadow-sm">
									<thead
										class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
									>
										<tr>
											<th scope="col" class="pr-5 pl-3 py-4 text-left">Note</th>
										</tr>
									</thead>

									<tbody>
										{#each noteArchive as item1}
											<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
												<td class="px-2 pb-1 pt-1 w-36">
													<h1 class="font-medium text-left text-sm">
														<span class="text-xs font-normal">{item1.Date}</span><br />
														{item1.Title}
													</h1>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- <div class="flex flex-row items-center mt-2 justify-center">
						<input
							class="pl-4 border border-r-0 rounded-l-3xl focus:ring-0 text-sm block bg-white w-64 h-7 border-slate-300 shadow-sm focus:outline-none"
							placeholder="Add Notes"
							type="text"
							name="search"
						/>
						<button
							class="add-button w-12 h-7 border border-slate-300 rounded-r-3xl bg-blue-500 hover:bg-blue-700 border-none transform transition-transform focus:scale-100 active:scale-95"
						>
							<svg
								width="20px"
								height="20px"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								class="ml-3"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<path
										fill="#f2f2f2"
										fill-rule="evenodd"
										d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"
									/>
								</g></svg
							>
						</button>
					</div> -->
					<div class="divider mb-1" />

					<!--TO DO LIST-->
					<table class="text-sm text-gray-500 dark:text-gray-400 w-full rounded-lg shadow-sm">
						<thead
							class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
						>
							<tr>
								<th scope="col" class="pr-5 pl-3 py-4 text-left">Note</th>
							</tr>
						</thead>

						<tbody>
							{#each noteArray as item1}
								<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
									<td class="px-2 pb-1 pt-1 w-36">
										<h1 class="font-medium text-left text-sm">
											<span class="text-xs font-normal">{item1.Date}</span><br />
											{item1.Title}
										</h1>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<!--OVERFLOW-->
				</div>
			</div>
			<!--END NOTES-->

			<div class="w-full bg-white bg-opacity-75 rounded-3xl text-center shadow-lg h-1/2">
				<div class="flex flex-row pt-4">
					<img src="lessonplan.png" class="h-7 pl-6" alt="..." />
					<h1 class="pl-1 font-medium text-md text-gray-700">Learning Materials</h1>
				</div>
				<div class="px-5">
					<div class="divider my-0" />
					<div class="flex flex-row justify-center mt-2">
						<select
							id="weekSelector"
							bind:value={weekStatus}
							on:change={updateLessonText}
							class="w-40 border-gray-200 h-8 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
						>
							<option disabled selected class="rounded-3xl">Select Week</option>
							<option class="rounded-3xl">Week 1</option>
							<option class="rounded-3xl">Week 2</option>
							<option class="rounded-3xl">Week 3</option>
							<option class="rounded-3xl">Week 4</option>
							<option class="rounded-3xl">Week 5</option>
							<option class="rounded-3xl">Week 6</option>
							<option class="rounded-3xl">Week 7</option>
							<option class="rounded-3xl">Week 8</option>
						</select>
					</div>
					<div class="divider my-0 mt-2" />
					<div class="h-56 overflow-auto">
						<h1 class="text-left mt-2 ml-5 text-sm">Day 1</h1>
						<div class="flex items-center mt-1 pl-4" on:click={() => redirectToLink('day1input')}>
							<input
								id="day1input"
								type="text"
								placeholder="www.googledrive.com/lesson1/"
								class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
								readonly
							/>
						</div>

						<h1 class="text-left mt-2 ml-5 text-sm">Day 2</h1>
						<div class="flex items-center mt-1 pl-4">
							<input
								id="day2input"
								type="text"
								placeholder="www.googledrive.com/lesson1/"
								class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
								readonly
							/>
						</div>

						<h1 class="text-left mt-2 ml-5 text-sm">Day 3</h1>
						<div class="flex items-center mt-1 pl-4">
							<input
								id="day3input"
								type="text"
								placeholder="www.googledrive.com/lesson1/"
								class="input input-bordered w-11/12 focus.border-none cursor-pointer text-sm"
								readonly
							/>
						</div>

						<h1 class="text-left mt-2 ml-5 text-sm">Day 4</h1>
						<div class="flex items-center mt-1 pl-4">
							<input
								id="day4input"
								type="text"
								placeholder="www.googledrive.com/lesson1/"
								class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
								readonly
							/>
						</div>

						<h1 class="text-left mt-2 ml-5 text-sm">Day 5</h1>
						<div class="flex items-center mt-1 pl-4">
							<input
								id="day5input"
								type="text"
								placeholder="www.googledrive.com/lesson1/"
								class="input input-bordered w-11/12 focus.border-none cursor-pointer text-sm"
								readonly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Toaster />
</body>
