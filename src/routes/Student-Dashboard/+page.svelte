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
		FieldPath
	} from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue, get, child } from 'firebase/database';
	import { userId } from '../../lib/userStorage';
	import { onMount } from 'svelte';

	let userUID;
	let selecTSub;
	let docsArray = [];
	let attendance = [];
	let recitation = [];
	let rank = 0;

	let userRFID;

	async function getRFID() {
		const collectionRef = collection(firestore, 'users');
		const queryOne = query(collectionRef, where('UID', '==', userUID));
		const querySnapshot = await getDocs(queryOne);

		if (!querySnapshot.empty) {
			querySnapshot.forEach((doc) => {
				userRFID = doc.data().studentRFID;
				console.log(userRFID);
			});
		} else {
			console.log('No matching documents found.');
		}

		classCheck();
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

			rank = recitation.find((item) => item.id === userRFID).ranking;
			fetchNamesTwo();
		});
	}

	async function classCheck() {
		const collectionRef = collection(firestore, 'Subject');
		const queryRef = query(collectionRef, where('students', 'array-contains', userRFID));
		const querySnapshot = await getDocs(queryRef);

		docsArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
	}

	async function attendanceCheck() {
		const query = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		const snapshot = await getDocs(query);

		snapshot.forEach((doc) => {
			const data = doc.data();
			if (data.hasOwnProperty(userRFID)) {
				const fieldValue = data[userRFID];
				const attendanceObject = { id: userRFID, ...fieldValue };
				attendance.push(attendanceObject);
			}
		});

		fetchNames();
	}

	async function fetchNames() {
		const refers = collection(firestore, 'users');
		const ids = attendance.map((item) => item.id); // Extract all IDs from the attendance array

		// Query the Firestore documents by IDs
		const snapshot = await getDocs(refers, where('studentRFID', 'in', ids));

		snapshot.forEach((doc) => {
			const id = doc.data().studentRFID;
			const name = doc.data().Name;

			// Find all items in the attendance array with the matching ID
			const matchingItems = attendance.filter((el) => el.id === id);

			if (matchingItems.length > 0) {
				// Update the name property for all matching items
				matchingItems.forEach((item) => {
					item.name = name;
				});
			}
		});
		attendance = attendance;
		console.log(attendance);
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

	async function change() {
		attendanceCheck();
		recitationCheck();
	}
	onMount(() => {
		const unsubscribe = userId.subscribe((value) => {
			// Use the value of userId here
			userUID = localStorage.getItem('userId');
			console.log(userUID);
			// You can perform any other actions with the user ID
			getRFID();
			return () => {
				unsubscribe();
			};
		});
	});
</script>

<!-- Header Logo Center -->
<body class="bg-gray-100 w-screen h-screen">
	<header class="w-full text-gray-700 bg-gray-50 border-t border-gray-100 shadow-sm body-font">
		<div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">
			<nav class="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto" />
			<p
				class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0"
			>
				<img src="Mwenzi.png" class="w-30 h-20 pb-2" alt="..." />
			</p>
			<div class="inline-flex items-center h-full lg:w-2/5 lg:justify-end lg:ml-0">
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
						class="text-center mt-2 dropdown-content shadow bg-base-100 rounded-md w-40 h-20"
					>
						<li class="rounded-md hover:bg-gray-200">
							<a href="/" class="ml-12 py-2 flex align-center font-medium">Settings</a>
						</li>
						<li class="rounded-md hover:bg-gray-200">
							<a href="/Login" class="ml-12 py-2 flex text-center font-medium">Log out</a>
						</li>
					</ul>
				</button>
			</div>
		</div>
	</header>
	<div class="mx-20 my-8 px-44 bg-gray-100">
		<!--SELECTSUBJECT-->
		<div class="w-1/2 flex flex-row mr-4 mt-1">
			<select
				bind:value={selecTSub}
				on:change={change}
				class="mr-2 h-8 w-1/3 rounded-xl border-none placeholder-gray-300 font-medium text-center bg-white shadow-md"
			>
				{#each docsArray as item1}
					<option class="rounded-xl" value={item1.id}>{item1.id}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-row mx-20 my-20 justify-center">
			<div class="basis-1/2 container mt-2 pt-4 lg:w-3/6">
				<div class="h-full bg-white shadow-xl bg-opacity-75 pb-12 rounded-3xl">
					<div class="flex flex-row mt-2">
						<img src="addclass.png" class="h-10 mt-4 pl-8" alt="..." />
						<h1 class="pl-1 pt-5 pb-2 font-medium text-xl mb-5 text-gray-700">Attendance Logs</h1>
					</div>

					<!-- ADDED CLASS-->
					<div class="flex justify-center font-sans">
						<div class="flex scale-110 mt-3">
							<div class="bg-white shadow-md rounded-xl h-64 overflow-y-scroll snap-y">
								<table class="rounded-2xl w-full">
									<thead>
										<tr
											class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal sticky top-0"
										>
											<th class="py-3 px-6 text-left">Student</th>
											<th class="py-3 px-6 text-center">RFID Tag</th>
											<th class="py-3 px-6 text-center">Time</th>
											<th class="py-3 px-6 text-center">Status</th>
										</tr>
									</thead>

									<tbody class="text-gray-600 text-sm font-light">
										{#each attendance as data}
											<tr class="border-b border-gray-200 hover:bg-gray-100">
												<td class="py-1 px-6 text-left">
													<div class="flex items-center">
														<span>{data.name}</span>
													</div>
												</td>
												<td class="py-1 px-6 text-center">
													<div class="flex items-center justify-center">
														<p>{data.id}</p>
													</div>
												</td>
												<td class="py-1 px-6 text-center">
													<span class="">{data.time}</span>
												</td>
												{#if data.status == 'Present'}
													<td class="py-1 px-6 text-center">
														<span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
															>Present
														</span>
													</td>
												{:else}
													<td class="py-1 px-6 text-center">
														<span class="bg-red-500 text-white py-1 px-3 rounded-full text-xs"
															>Absent
														</span>
													</td>
												{/if}
											</tr>{/each}
									</tbody>

									<!--END ROW 1-->
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!--LEADERBOARDS-->
			<div class="basis-1/2 ml-2 container mt-2 pt-4 lg:w-3/6">
				<div class="h-full bg-white shadow-lg bg-opacity-75 pb-12 rounded-3xl text-center">
					<div class="flex flex-row mt-2">
						<img src="leaderboard.png" class="h-10 mt-4 pl-9 pr-1" alt="..." />
						<h1 class="pl-1 pt-5 pb-4 font-medium text-xl text-gray-700">Leaderboards</h1>
						<div class="w-full flex flex-row-reverse items-center">
							<h1 class="mr-12 font-medium text-xl text-gray-700">Your Rank: {rank}</h1>
						</div>
						<!--button class="btn">Sections</button-->
					</div>

					<!-- component -->
					<div class="flex flex-col">
						<div class="overflow-x-auto">
							<div class="py-2 w-full sm:px-6 lg:px-8">
								<div class=" overflow-y-scroll h-64 bg-white shadow-md rounded-xl">
									<table class="w-full text-center">
										<thead class="border-b sticky top-0 bg-gray-100">
											<tr>
												<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
													Rank
												</th>
												<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
													Name
												</th>
												<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
													Points
												</th>
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
													<td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
														{data.name}
													</td>
													<td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
														{data.totalPoints}
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div></body
>
