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

	let userUID = '';
	let currentDatee;
	let selecTSub;
	let subjects = [];
	let recitation = [];
	let notes = [];

	let dateArray = {};
	let dateArrayAsArray = [];
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

	async function classCheck() {
		const subjectRef = collection(firestore, 'Subject');
		const queryRef = query(subjectRef, where('students', 'array-contains', userUID));

		const querySnapshot = await getDocs(queryRef);

		subjects = querySnapshot.docs.map((doc) => doc.id);
	}

	async function getNotes() {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(collectionRef, where('Archive', '==', "false"));
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

		document.getElementById('presentCount').textContent = presentCount.toString();
		document.getElementById('absentCount').textContent = absentCount.toString();

		console.log('Present Count:', presentCount);
		console.log('Absent Count:', absentCount);
	}

	async function recitationCheck() {
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

				const documentInfo = {
					id: documentName,
					totalPoints: totalPoints
				};

				recitation.push(documentInfo);
			});

			recitation.sort((a, b) => b.totalPoints - a.totalPoints);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});

			console.log('Updated recitation array with ranking:', recitation);
			console.log('recitation array:', recitation);
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
	async function fetchAndDisplayNotes() {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');

		try {
			const querySnapshot = await getDocs(collectionRef);

			querySnapshot.forEach((doc) => {
				const title1 = doc.data().Title;
				const status = doc.data().Status;
				const date1 = doc.data().Date;
				const id = doc.id;

				// Check if the status is not "Only Me" before appending
				if (status !== 'Only Me') {
					const noteElement = document.createElement('div');
					noteElement.className =
						'mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1';
					noteElement.innerHTML = `
        <div class="mt-2 flex flex-row justify-between w-full items-center px-7 pb-1">
          <h1 class="font-medium text-sm">${title1}</h1>
          <div class="flex items-center">
            <label
                class="border-gray-200 w-36 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
            >${date1}</label>
          </div>
        </div>`;

					const notesContainer = document.getElementById('notes-container');
					notesContainer.appendChild(noteElement);
				}
			});
		} catch (error) {
			console.error('Error fetching documents: ', error);
		}
	}

	async function change() {
		console.log(selecTSub);
		attendanceCheck();
		recitationCheck();
		getNotes();
		fetchAndDisplayNotes();
	}

	async function getuserName(id) {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('studentRFID', '==', id));
		const querySnapshot = await getDocs(queryRef2);
		if (querySnapshot.docs.length > 0) {
			const doc = querySnapshot.docs[0];
			document.getElementById('userName').textContent = doc.data().Name;
		} else {
			return 'Student not found';
		}
	}

	getDate();

	onMount(() => {
		const unsubscribe = userId.subscribe((value) => {
			userUID = localStorage.getItem('userId');
			console.log(userUID);
			classCheck();
			getuserName(userUID);
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
			<nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img src="Mwenzi.png" class="h-14 pb-2" alt="..." />
			</nav>

			<a
				class="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0"
			>
				<select
					bind:value={selecTSub}
					on:change={change}
					class="select select-bordered focus:border-none border-gray-200 w-full h-5 max-w-xs rounded-3xl shadow-sm"
				>
					<option disabled selected hidden class="rounded-3xl">Select Class</option>
					{#each subjects as subject (subject)}
						<option class="rounded-xl" value={subject}>{subject}</option>
					{/each}
				</select></a
			>
			<div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 ou">
				<p class="font-medium text-md mr-5 mt-1" id="userName">Hi, Mwenzi Student</p>
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
						class="text-center rounded-2xl mt-2 dropdown-content shadow bg-base-100 w-40 h-16"
					>
						<li class="rounded-2xl hover:bg-gray-200">
							<a href="/" class="ml-12 py-1 flex align-center font-medium">Settings</a>
						</li>
						<li class="rounded-2xl hover:bg-gray-200">
							<a href="/Login" class="ml-12 py-1 flex text-center font-medium">Log out</a>
						</li>
					</ul>
				</button>
			</div>

			<div class="flex justify-between w-full">
				<!--ATTENDANCE SUMMARY-->
				<div class="flex flex-row">
					<div
						class="container h-8 my-6 mx-2 pr-3 pl-1 border border-gray-200 rounded-3xl w-auto flex flex-row justify-center items-center"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2">Total Present: </a>
						<a id="presentCount" class="font-semibold text-sm text-green-500">0</a>
						<a class="font-medium text-sm p-2">Total Absent: </a>
						<a id="absentCount" class="font-semibold text-sm text-red-500">0</a>
					</div>
				</div>
				<!--END SUMMARY ATTENDANCE -->

				<!--RFID STATUS, DATE, SUBJECT TIME -->
				<div class="flex flex-row w-1/3 justify-end">
					<div
						class="container h-8 my-6 mx-1 px-2 border border-gray-200 rounded-3xl w-1/2 flex justify-center items-center"
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
						<a class="font-semibold text-sm"> 8:00 AM - 10:00 AM</a>
					</div>

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
						<a class="font-medium text-sm p-2">09/29/23</a>
					</div>
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
				class="mt-2 border-gray-200 w-56 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
			>
				<option disabled selected hidden class="rounded-3xl">Sort by</option>
				<option class="rounded-xl">Daily</option>
				<option class="rounded-xl">Weekly</option>
				<option class="rounded-xl">Monthly</option>
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
								<td class="text-center text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
									{data.name}
								</td>
								<td class="text-center text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
									{data.totalPoints}
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
						<!--NOTE ARCHIVES -->
						<label for="NotesArchives" class="mr-8 mt-3 rounded-3xl cursor-pointer">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier"
									><path
										d="M8.707 6.707a1 1 0 0 0-1.414-1.414L4 8.586 2.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4ZM12 7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12ZM8.707 13.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L4 16.586l3.293-3.293a1 1 0 0 1 1.414 0ZM12 15a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12Z"
										fill="#currentColor"
										class="fill-current text-gray-600 hover:text-blue-500"
									/></g
								></svg
							>
						</label>
					</div>
					<input type="checkbox" id="NotesArchives" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-4/6 max-w-3xl text-left">
							<label for="NotesArchives" class="btn btn-sm btn-circle absolute right-2 top-2"
								>✕</label
							>
							<h3 class="text-xl font-bold text-center">Note Archives</h3>

							<div class="mx-auto w-full mt-5">
								<table
									class="w-full text-sm text-gray-500 dark:text-gray-400 table-fixed overflow-x-auto"
								>
									<thead
										class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
									>
										<tr>
											<th scope="col" class="pl-6 py-4 text-left">Date </th>
											<th scope="col" class="px-1 py-4 text-left">Note </th>
											<th scope="col" class="px-6 py-4 text-left">Status </th>
											<th scope="col" class="px-9 py-4 text-left"> Action </th>
										</tr>
									</thead>
									<tbody>
										<!-- Table row for each recitation item -->
										<tr class="border-b bg-white">
											<!-- Display the data for each recitation item -->
											<td class="text-sm text-gray-500 font-medium px-6 py-4"> 2023-10-16 </td>
											<td class="text-md text-gray-900 font-medium px- py-3"> Study Lesson 1 </td>
											<td class="text-sm text-gray-900 font-medium px-6 py-4">
												<select
													class=" border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
												>
													<option disabled selected hidden class="rounded-xl">Subject Class</option>
												</select>
											</td>
											<td class="text-sm text-gray-900 font-medium px-6 py-4">
												<label
													for=""
													class="px-4 bg-yellow-500 border-transparent hover:bg-yellow-600 hover:border-none text-sm text-white rounded-3xl"
													>Undo</label
												>
											</td>
										</tr>

										<!-- Table row for each recitation item -->
										<tr class="border-b bg-white">
											<!-- Display the data for each recitation item -->
											<td class="text-sm text-gray-500 font-medium px-6 py-4"> 2023-10-16 </td>
											<td class="text-md text-gray-900 font-medium px- py-3"> Study Lesson 1 </td>
											<td class="text-sm text-gray-900 font-medium px-6 py-4">
												<select
													class=" border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
												>
													<option disabled selected hidden class="rounded-xl">Only Me</option>
												</select>
											</td>
											<td class="text-sm text-gray-900 font-medium px-6 py-4">
												<label
													for=""
													class="px-4 bg-yellow-500 border-transparent hover:bg-yellow-600 hover:border-none text-sm text-white rounded-3xl"
													>Undo</label
												>
											</td>
										</tr>

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
					<div class="h-80 overflow-auto" id="notes-container">
						<!--OVERFLOW-->
						<!-- {#each notes as note}
							<div
								class="mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1"
							>
								<h1 class="font-medium text-sm">· {note.data.Title}</h1>

								<div class="flex items-center">
									<label
										class="border-gray-200 w-36 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
										>{note.data.Date}
									</label>
								</div>
							</div>
						{/each} -->

						<!-- <div class="mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1">
							<h1 class="font-medium text-sm">· Study Lesson 1</h1>

							<div class="flex items-center">
								<button>
									<img
										src="done.png"
										class="h-7 transform transition-transform focus:scale-100 active:scale-90"
										alt="..."
									/>
								</button>
								<button>
									<img
										src="delete.png"
										class="h-7 transform transition-transform focus:scale-100 active:scale-90"
										alt="..."
									/>
								</button>
							</div>
						</div> -->
					</div>
					<!--OVERFLOW-->
				</div>
			</div>
			<!--END NOTES-->

			<div class="w-full bg-white bg-opacity-75 rounded-3xl text-center shadow-lg h-1/2">
				<div class="flex flex-row pt-4">
					<img src="todo.png" class="h-7 pl-6" alt="..." />
					<h1 class="pl-1 font-medium text-md text-gray-700">Learning Materials</h1>
				</div>
				<div class="px-5">
					<div class="divider my-0" />
					<div class="flex flex-row justify-center mt-2">
						<select
							class="w-40 border-gray-200 h-8 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
						>
							<option disabled selected class="rounded-3xl">Select Week</option>
							<option class="rounded-3xl">Week 1</option>
							<option class="rounded-3xl">Week 2</option>
						</select>
					</div>
					<div class="divider my-0 mt-2" />
					<div class="h-56 overflow-auto">
						<h1 class="text-left mt-2 ml-5 text-sm">Day 1</h1>
						<div class="flex items-center mt-1 pl-4">
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
</body>
