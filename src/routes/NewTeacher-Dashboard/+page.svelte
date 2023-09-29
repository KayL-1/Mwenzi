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
		updateDoc
	} from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue, get, child } from 'firebase/database';
	import { userId } from '../../lib/userStorage';
	import { onMount } from 'svelte';

	let userUID = '';
	let selecTSub;
	let docsArray = [];
	let attendance = [];
	let nameArray = [];
	let recitation = [];

	let currentDatee;

	async function classCheck() {
		const collectionRef = collection(firestore, 'Subject');
		const queryRef = query(collectionRef, where('teacherID', '==', userUID));
		const querySnapshot = await getDocs(queryRef);

		docsArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
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

	function attendanceCheck() {
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);

		return onSnapshot(attendanceDocRef, (attendanceDocSnapshot) => {
			attendance = Object.entries(attendanceDocSnapshot.data()).map(([key, value]) => ({
				id: key,
				...value
			}));

			console.log(attendance);
			// Update your UI or perform any other actions with the updated data here
			fetchTime();
			fetchNames();
		});
		attendance = attendance;
	}

	// Iterate over each object
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

	async function fetchNames() {
		const refers = collection(firestore, 'users');
		const ids = attendance.map((item) => item.id); // Extract all IDs from the attendance array

		// Query the Firestore documents by IDs
		const snapshot = await getDocs(refers, where('studentRFID', 'in', ids));

		snapshot.forEach((doc) => {
			const id = doc.data().studentRFID;
			const name = doc.data().Name;

			// Find the item in the attendance array with the matching ID
			const item = attendance.find((el) => el.id === id);

			if (item) {
				// Update the name property for the matching item
				item.name = name;
			}
		});
		attendance.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		attendance = attendance;
		console.log(attendance);
	}
	async function fetchTime() {
		const ids = attendance.map((item) => item.id); // Extract all IDs from the attendance array

		const dbRef = ref(getDatabase());
		const promises = ids.map((id) =>
			onValue(
				child(dbRef, `RFIDATTENDANCE/${currentDatee}/${id}`),
				async (snapshot) => {
					if (snapshot.exists()) {
						const attendanceCollectionRef = collection(
							firestore,
							'Subject',
							`${selecTSub}`,
							'Attendance'
						);
						const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);
						try {
							const attendanceDocSnapshot = await getDoc(attendanceDocRef);
							if (attendanceDocSnapshot.exists()) {
								const attendanceData = attendanceDocSnapshot.data();
								const fieldName = Object.keys(attendanceData).find((key) => key === id);
								if (fieldName && attendanceData[fieldName].dataStatus !== 'changed') {
									attendanceData[fieldName].time = snapshot.val().TIME;
									attendanceData[fieldName].status = 'Present';
									attendanceData[fieldName].dataStatus = 'changed';
									await setDoc(attendanceDocRef, attendanceData);
								} else {
									console.log(`Field with ID not found or data status is already changed: ${id}`);
								}
							} else {
								console.log('Attendance document does not exist');
							}
						} catch (error) {
							console.error('Error updating attendance document:', error);
						}
					} else {
						console.log(`No data available for ID: ${id}`);
					}
				},
				(error) => {
					console.error(error);
				}
			)
		);

		await Promise.all(promises);
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

	async function change() {
		console.log(selecTSub);
		classCheck();
		attendanceCheck();
		recitationCheck();
	}

	onMount(() => {
		const unsubscribe = userId.subscribe((value) => {
			// Use the value of userId here
			userUID = localStorage.getItem('userId');
			// You can perform any other actions with the user ID
			classCheck();
			attendanceCheck();
			return () => {
				unsubscribe();
			};
		});
	});
	getDate();

	async function changeDocumentID(action, documentID) {
		const recitationCollectionReflllty = collection(
			firestore,
			'Subject',
			`${selecTSub}`,
			'Recitation'
		);

		if (action === 'minus') {
			const recitationDocRef = doc(recitationCollectionReflllty, documentID);

			// Retrieve the document data
			const docSnapshot = await getDoc(recitationDocRef);
			if (docSnapshot.exists()) {
				const docData = docSnapshot.data();

				// Decrease the value of the totalPoint field by 1
				const newTotalPoint = docData.totalPoints - 1;

				// Update the document with the new value
				await updateDoc(recitationDocRef, { totalPoints: newTotalPoint });
				console.log('Minus button clicked for document ID:', documentID);
			}
		}

		// Perform the desired action based on the button clicked
		else if (action === 'add') {
			const recitationDocRefe = doc(recitationCollectionReflllty, documentID);

			// Retrieve the document data
			const docSnapshot = await getDoc(recitationDocRefe);
			if (docSnapshot.exists()) {
				const docData = docSnapshot.data();

				// Decrease the value of the totalPoint field by 1
				const newTotalPoint = docData.totalPoints + 1;

				// Update the document with the new value
				await updateDoc(recitationDocRefe, { totalPoints: newTotalPoint });
				console.log('Minus button clicked for document ID:', documentID);
			}
			console.log('Add button clicked for document ID:', documentID);
			// Perform any other actions specific to the add button
		}
	}

	async function changeStatus(action, documentID) {
		console.log(action);
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		if (action === 'Present') {
			console.log('CHECK CGHECK 2', action);
			const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);
			const attendanceDocSnapshot = await getDoc(attendanceDocRef);
			if (attendanceDocSnapshot.exists()) {
				console.log('EXIST');
				const attendanceData = attendanceDocSnapshot.data();
				const fieldName = Object.keys(attendanceData).find((key) => key === documentID);
				if (fieldName) {
					attendanceData[fieldName].status = 'Present';
					await setDoc(attendanceDocRef, attendanceData);
				}
			}
		} else if (action === 'Absent') {
			console.log('CHECK CGHECK 1', action);
			const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);
			const attendanceDocSnapshot = await getDoc(attendanceDocRef);
			if (attendanceDocSnapshot.exists()) {
				const attendanceData = attendanceDocSnapshot.data();
				const fieldName = Object.keys(attendanceData).find((key) => key === documentID);
				if (fieldName) {
					attendanceData[fieldName].status = 'Absent';
					await setDoc(attendanceDocRef, attendanceData);
				}
			}
		}
	}

	async function changeStatus2(action, documentID) {
		console.log(action);
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		if (action === 'True') {
			console.log('CHECK CGHECK 2', action);
			const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);
			const attendanceDocSnapshot = await getDoc(attendanceDocRef);
			if (attendanceDocSnapshot.exists()) {
				console.log('EXIST');
				const attendanceData = attendanceDocSnapshot.data();
				const fieldName = Object.keys(attendanceData).find((key) => key === documentID);
				if (fieldName) {
					attendanceData[fieldName].late = 'True';
					await setDoc(attendanceDocRef, attendanceData);
				}
			}
		} else if (action === 'False') {
			console.log('CHECK CGHECK 1', action);
			const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);
			const attendanceDocSnapshot = await getDoc(attendanceDocRef);
			if (attendanceDocSnapshot.exists()) {
				const attendanceData = attendanceDocSnapshot.data();
				const fieldName = Object.keys(attendanceData).find((key) => key === documentID);
				if (fieldName) {
					attendanceData[fieldName].late = 'False';
					await setDoc(attendanceDocRef, attendanceData);
				}
			}
		}
	}
	let studentNames = [];
	let isRolling = false;
	let previousStudentIndex = -1; // Initialize with an invalid index
	async function getRandomName() {
		if (isRolling) return; // Prevent multiple clicks while rolling
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Attendance');
		const queryRef = query(collectionRef, where('status', '==', 'Present'));

		return onSnapshot(queryRef, async (randomDocSnapshot) => {
			docsArray = randomDocSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));

			console.log(docsArray);

			const presentStudentIds = docsArray.map((doc) => doc.id);
			console.log(presentStudentIds);

			if (presentStudentIds.length > 0) {
				console.log('Present student IDs:', presentStudentIds);
				// You can perform further actions with these IDs if needed
				const randomStudentName = getRandomStudentName(docsArray);
				updateRandomizerName(randomStudentName);
			} else {
				console.log('No students with status "Present"');
				// Update the HTML element to display "No Currently Present"
				updateRandomizerName('No Currently Present');
			}
		});
	}
	function updateRandomizerName(name) {
		const randomizerNameElement = document.getElementById('randomizerName');
		if (randomizerNameElement) {
			randomizerNameElement.textContent = name;
		}
	}

	// Helper function to get a random student name
	function getRandomStudentName(studentArray) {
		// Implement your logic to get a random student name from the studentArray
		// For example, you can generate a random index and return the corresponding name
		const randomIndex = Math.floor(Math.random() * studentArray.length);
		return studentArray[randomIndex].name; // Replace with the correct property name for the student's name
	}
	function startRolling() {
		isRolling = true;
		const randomizerNameElement = document.getElementById('randomizerName');
		const iterations = 10;
		const delay = 100;

		function updateRandomName(iteration) {
			let randomIndex;
			do {
				randomIndex = Math.floor(Math.random() * studentNames.length);
			} while (randomIndex === previousStudentIndex); // Ensure a different student is selected

			randomizerNameElement.textContent = studentNames[randomIndex];
			previousStudentIndex = randomIndex;

			if (iteration < iterations) {
				setTimeout(() => updateRandomName(iteration + 1), delay);
			} else {
				// Stop rolling and set the final name to a random student
				isRolling = false;
				const finalRandomIndex = Math.floor(Math.random() * studentNames.length);
				randomizerNameElement.textContent = studentNames[finalRandomIndex];
			}
		}

		// Start the recursive rolling effect
		updateRandomName(0);
	}

	async function getStudentNames(studentIDs) {
		const studentNames = [];

		for (const studentID of studentIDs) {
			try {
				const queryRef1 = collection(firestore, 'users');
				const queryRef2 = query(queryRef1, where('studentRFID', '==', studentID));
				const studentDoc = await getDocs(queryRef2);
				const studentArrays2 = studentDoc.docs.map((doc) => ({
					id: doc.id,
					data: doc.data()
				}));

				if (studentArrays2.length > 0) {
					studentNames.push(studentArrays2[0].data.Name);
				}
			} catch (error) {
				console.error('Error fetching student data:', error);
			}
		}
		return studentNames;
	}
</script>

<body class=" bg-gray-50 min-h-screen">
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
					{#each docsArray as item1}
						<option class="rounded-xl" value={item1.id}>{item1.id}</option>
					{/each}
				</select>
			</a>
			<div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 ou">
				<p class="font-medium text-md mr-5 mt-1">Hi, Teacher Monis</p>
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
						<a class="font-semibold text-sm text-green-500"> 39</a>
						<a class="font-medium text-sm p-2">Total Absent: </a>
						<a class="font-semibold text-sm text-red-500"> 1</a>
					</div>

					<div
						class="container h-8 my-6 pr-3 pl-1 border border-gray-200 rounded-3xl w-auto flex flex-row justify-center items-center"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2">Boys: </a>
						<a class="font-semibold text-sm text-green-500"> 19</a>
						<a class="font-semibold text-sm mx-1"> | </a>
						<a class="font-semibold text-sm text-red-500">1</a>
					</div>

					<div
						class="container h-8 my-6 ml-2 pr-3 pl-1 border border-gray-200 rounded-3xl w-auto flex flex-row justify-center items-center"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2">Girls: </a>
						<a class="font-semibold text-sm text-green-500"> 20</a>
						<a class="font-semibold text-sm mx-1"> | </a>
						<a class="font-semibold text-sm text-red-500">0</a>
					</div>
				</div>
				<!--END SUMMARY ATTENDANCE -->

				<!--RFID STATUS, DATE, SUBJECT TIME -->
				<div class="flex flex-row">
					<div
						class="container h-8 my-6 mx-1 px-2 border border-gray-200 rounded-3xl w-2/5 flex justify-center items-center"
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
						<a class="font-medium text-sm p-2">{currentDatee}</a>
					</div>

					<div
						class="container h-8 my-6 mx-1 border border-gray-200 rounded-3xl w-48 flex justify-center items-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							enable-background="new 0 0 24 24"
							viewBox="0 0 24 24"
							id="nfc"
							height="20"
							width="20"
							><g
								><path
									d="M7,14c0-1.103,0.897-2,2-2h6c1.103,0,2,0.897,2,2v8h2v-8c0-2.2056-1.7944-4-4-4H9c-2.2056,0-4,1.7944-4,4v8h2V14z"
									fill="#ADADAD"
								/><path
									d="M11 13c-.5522 0-1 .4478-1 1s.4478 1 1 1h2c.5522 0 1-.4478 1-1s-.4478-1-1-1H11zM7.7554 6.7705C7.3691 7.1655 7.376 7.7983 7.7705 8.1851c.1948.1904.4473.2852.6997.2852.2593 0 .5186-.1006.7148-.3003.7817-.7993 1.8779-1.2222 3.02-1.1616.9971.0547 1.9253.4683 2.6133 1.1646.3887.3936 1.0215.3965 1.4141.0088.3931-.3882.397-1.0215.0088-1.4141-1.0376-1.0508-2.4321-1.6743-3.9277-1.7563C10.5933 4.9175 8.9404 5.561 7.7554 6.7705z"
									fill="#ADADAD"
								/><path
									d="M6.3501,6.3501c0.2583,0,0.5161-0.0991,0.7119-0.2979c1.3813-1.3994,3.3179-2.1436,5.2944-2.0439
                c1.7383,0.0933,3.3662,0.8198,4.584,2.0464c0.3887,0.3916,1.0225,0.3945,1.4141,0.0049c0.3921-0.3892,0.394-1.022,0.0049-1.4141
                c-1.5674-1.5791-3.6616-2.5146-5.8984-2.6343c-2.5527-0.1289-5.041,0.8315-6.8228,2.6367C5.2505,5.041,5.2544,5.6738,5.6479,6.062
                C5.8428,6.2544,6.0962,6.3501,6.3501,6.3501z"
									fill="#ADADAD"
								/></g
							></svg
						>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2"> RFID Status: </a>
						<a class="font-semibold text-sm text-green-500"> On</a>
					</div>
				</div>
				<!--END RFID STATUS, DATE, SUBJECT TIME -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card mx-10 my-auto">
		<!--ATTENDANCE-->
		<div class="w-3/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row">
					<img src="addclass.png" class="h-8 pl-6 mt-2" alt="..." />
					<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Attendance</h1>
				</div>
				<!--EXPORT ATT-->
				<label for="AttendanceSettings" class="mr-8 mt-2 rounded-3xl cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" id="download">
						<path
							fill="#3D3D3D"
							d="M12 4a1 1 0 0 0-1 1v9.529l-4.218-4.223a1.043 1.043 0 0 0-1.476 0 1.046 1.046 0 0 0 0 1.478l5.904 5.91c.217.217.506.319.79.305.284.014.573-.088.79-.305l5.904-5.91a1.046 1.046 0 0 0 0-1.478 1.043 1.043 0 0 0-1.476 0L13 14.529V5a1 1 0 0 0-1-1zM5 21a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
							class="fill-current text-gray-600 hover:text-green-500"
						/>
					</svg>
				</label>

				<input type="checkbox" id="AttendanceSettings" class="modal-toggle" />
				<div class="modal">
					<div class="modal-box relative h-96">
						<label for="AttendanceSettings" class="btn btn-sm btn-circle absolute right-2 top-2"
							>✕</label
						>
						<h3 class="text-xl font-bold text-center">Export Attendance</h3>

						<p class="mt-8 mb-2 font-medium">Export All Records:</p>
						<button class="btn btn-info rounded-3xl text-white w-48">Export All</button>
						<div class="divider" />
						<p class="mt-5 mb-2 font-medium">Export Selected Record:</p>
						<div class="my-2">
							<select
								class="w-48 border-gray-200 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
							>
								<option disabled selected class="rounded-3xl">Select Date</option>
								<option class="rounded-3xl">Today</option>
								<option class="rounded-3xl">September 14, 2023</option>s
							</select>
						</div>
						<button class="btn btn-success mt-1 rounded-3xl text-white w-48">Export Selected</button
						>
					</div>
				</div>
			</div>
			<!--END EXPORT ATT-->

			<select
				class="justify-end border-gray-200 w-56 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
			>
				<option disabled selected hidden class="rounded-3xl">Select Date</option>
				<option class="rounded-xl" value={currentDatee}>Today</option>
			</select>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-96 max-h-96">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-left">Student Name</th>
							<th scope="col" class="px-6 py-4 text-center">RFID Tag</th>
							<th scope="col" class="px-6 py-4 text-center">Time</th>
							<th scope="col" class="px-6 py-4 text-center">Status</th>
							<th scope="col" class="px-6 py-4 text-center">Manual Edit</th>
							<th scope="col" class="px-6 py-4 text-right">Late</th>
						</tr>
					</thead>
					<tbody>
						{#each attendance as data}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<th
									scope="row"
									class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left"
								>
									<span>{data.name}</span>
								</th>
								<td class="px-6 py-2 text-center"><p>{data.id}</p></td>
								<td class="px-6 py-2 text-center">{data.time}</td>
								{#if data.status == 'Present'}
									<td class="py-1 px-6 text-center">
										<span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
											>Present</span
										>
									</td>
								{:else if data.status == 'Late'}
									<td class="py-1 px-6 text-center">
										<span class="bg-orange-500 text-white py-1 px-3 rounded-full text-xs">Late</span
										>
									</td>
								{:else}
									<td class="py-1 px-6 text-center">
										<span class="bg-red-500 text-white py-1 px-3 rounded-full text-xs">Absent</span>
									</td>
								{/if}
								<td class="px-6 py-2">
									{#if data.status === 'Present'}
										<input
											type="checkbox"
											class="toggle toggle-success h-6 pt-2"
											checked
											on:click={() => changeStatus('Absent', data.id)}
										/>
									{:else}
										<input
											type="checkbox"
											class="toggle toggle-success h-6 pt-2"
											on:click={() => changeStatus('Present', data.id)}
										/>
									{/if}
								</td>

								<td class="px-6 py-2 text-right">
									<input
										type="checkbox"
										checked={data.late === 'True' ? true : false}
										class="checkbox checkbox-warning"
										on:click={() => changeStatus2(data.late === 'True' ? 'False' : 'True', data.id)}
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
				<option disabled selected hidden class="rounded-3xl">Select Interval</option>
				<option class="rounded-xl">Daily</option>
				<option class="rounded-xl">Weekly</option>
				<option class="rounded-xl">Monthly</option>
			</select>
			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-4 max-h-80">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-left"> Rank </th>
							<th scope="col" class="px-6 py-4 text-left"> Name </th>
							<th scope="col" class="px-6 py-4 text-left"> Points </th>
							<th scope="col" class="px-6 py-4 text-left"> Update Points </th>
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
								<td class="flex mt-2 justify-center">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<img
										src="minus.png"
										class="btn btn-sm px-1 bg-transparent hover:bg-transparent border-none"
										alt="..."
										on:click={() => changeDocumentID('minus', data.id)}
									/>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<img
										src="add.png"
										class="btn btn-sm px-1 bg-transparent hover:bg-transparent border-none"
										alt="..."
										on:click={() => changeDocumentID('add', data.id)}
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!--TO DO-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
			<div class="flex flex-row mt-2">
				<img src="todo.png" class="h-7 pl-6 mt-2" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">To Do</h1>
			</div>
			<div class="flex flex-row items-center mt-2 justify-center">
				<input
					class="pl-4 border border-r-0 rounded-l-3xl focus:ring-0 text-sm block bg-white w-64 h-7 border-slate-300 shadow-sm focus:outline-none"
					placeholder="Add To Do"
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
			</div>
			<div class="divider mb-1" />

			<!--TO DO LIST-->
			<div class="mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1">
				<h1 class="font-medium text-sm">· Present Lesson 1</h1>

				<div class="flex items-center">
					<select
						class=" border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
					>
						<option disabled selected hidden class="rounded-3xl">Share</option>
						<option class="rounded-xl">Only Me</option>
						<option class="rounded-xl">Subject Class</option>
					</select>

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
			</div>
		</div>
	</div>

	<!--ACTIONS-->
	<div class="flex flex-row card mx-10 my-auto pt-3">
		<!--RANDOMIZER-->
		<div class="w-2/5 pb-5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="randomizer.png" class="h-8 mt-2 pl-6" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Randomizer</h1>
			</div>
			<!--RAN MODAL-->
			<label
				for="randomizer"
				class="my-10 btn h-24 w-56 bg-[#EF5051] border-transparent hover:bg-red-600 hover:border-none text-xl rounded-3xl"
				>Randomizer</label
			>
			<input type="checkbox" id="randomizer" class="modal-toggle" />
			<div class="modal">
				<div class="modal-box relative h-96">
					<label for="randomizer" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 class="text-xl font-bold text-center">Randomizer</h3>
					<div class="divider mt-14" />
					<p class="font-medium text-lg text-center" id="randomizerName">STUDENT NAME</p>
					<div class="divider" />
					<button
						on:click={getRandomName}
						class="start-button btn mt-10 w-1/2 rounded-3xl bg-[#EF5051] hover:bg-red-600 border-none"
						>START</button
					>
				</div>
			</div>
		</div>
		<!--END RAN MODAL-->

		<!--GROUP CREATOR-->
		<div class="w-2/5 pb-5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="group.png" class="h-7 mt-1 pl-6" alt="..." />
				<h1 class="pl-2 pt-2 font-medium text-md text-gray-700">Group Creator</h1>
			</div>

			<!--GRP CREATOR MODAL-->
			<label
				for="GroupCreator"
				class="my-10 btn h-24 w-56 bg-green-500 border-transparent hover:bg-green-700 hover:border-none text-xl rounded-3xl"
				>Create Group</label
			>
			<input type="checkbox" id="GroupCreator" class="modal-toggle" />
			<div class="modal">
				<div class="modal-box relative h-auto">
					<label for="GroupCreator" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 class="text-xl font-bold text-center">Group Creator</h3>
					<p class="mt-7 mb-2 font-medium">Group By</p>
					<div class="mt-3 mb-1">
						<select
							class="w-1/2 border-gray-200 h-6 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
						>
							<option disabled selected class="rounded-3xl">Select</option>
							<option class="rounded-3xl">2 Members Each</option>
							<option class="rounded-3xl">3 Members Each</option>
							<option class="rounded-3xl">4 Members Each</option>
							<option class="rounded-3xl">5 Members Each</option>
							<option class="rounded-3xl">6 Members Each</option>
							<option class="rounded-3xl">7 Members Each</option>
							<option class="rounded-3xl">8 Members Each</option>
							<option class="rounded-3xl">9 Members Each</option>
							<option class="rounded-3xl">10 Members Each</option>
						</select>
					</div>
					<button
						class="start-button btn mt-4 w-1/2 rounded-3xl bg-green-500 hover:bg-green-700 border-none"
						>Create</button
					>

					<div class="divider" />
					<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-7 max-h-80">
						<table class="w-full text-sm text-gray-500 dark:text-gray-400">
							<thead
								class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
							>
								<tr>
									<th scope="col" class="px-6 py-4 text-center">Group #</th>
									<th scope="col" class="px-6 py-4 text-center">Members</th>
								</tr>
							</thead>
							<tbody>
								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
									>
										1
									</th>
									<td class="px-6 py-2 text-center">
										Luis Santiago <br />
										Kyle Dela Pena <br />
										Ace Dela Cuesta <br />
									</td>
								</tr>

								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
									>
										1
									</th>
									<td class="px-6 py-2 text-center">
										Luis Santiago <br />
										Kyle Dela Pena <br />
										Ace Dela Cuesta <br />
									</td>
								</tr>

								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
									>
										1
									</th>
									<td class="px-6 py-2 text-center">
										Luis Santiago <br />
										Kyle Dela Pena <br />
										Ace Dela Cuesta <br />
									</td>
								</tr>

								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
									>
										1
									</th>
									<td class="px-6 py-2 text-center">
										Luis Santiago <br />
										Kyle Dela Pena <br />
										Ace Dela Cuesta <br />
									</td>
								</tr>

								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
									>
										1
									</th>
									<td class="px-6 py-2 text-center">
										Luis Santiago <br />
										Kyle Dela Pena <br />
										Ace Dela Cuesta <br />
									</td>
								</tr>

								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										class="px-6 py-2 font-medium text-gray-900 dark:text-white text-center"
									>
										1
									</th>
									<td class="px-6 py-2 text-center">
										Luis Santiago <br />
										Kyle Dela Pena <br />
										Ace Dela Cuesta <br />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<!--GRP CREATOR MODAL-->
		</div>

		<!--JAMBOARD-->
		<div class="w-2/5 pb-5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="jamboard.png" class="h-7 mt-1 pl-6" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Jamboard</h1>
			</div>

			<!--JAM MODAL-->
			<label
				for="Jamboard"
				class="my-10 btn h-24 w-56 bg-purple-500 hover:bg-purple-700 border-transparent hover:border-none text-xl rounded-3xl"
				>Jamboard</label
			>
			<input type="checkbox" id="Jamboard" class="modal-toggle" />
			<div class="modal">
				<div class="modal-box relative h-5/6 max-w-6xl">
					<label for="Jamboard" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 class="mt-5 text-xl font-bold text-center">Jamboard</h3>
					<iframe
						title="Jamboard"
						class="mt-14 w-full h-4/5"
						src="https://www.web-whiteboard.io/"
					/>
				</div>
			</div>
		</div>
		<!--END JAM MODAL-->

		<!--LESSON PLAN-->
		<div class="w-2/5 pb-5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-1">
			<div class="flex flex-row mt-2">
				<img src="lessonplan.png" class="h-7 mt-1 pl-6" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Lesson Plan</h1>
			</div>

			<label
				for="lessonplan"
				class="my-10 btn h-24 w-56 bg-blue-500 border-transparent hover:bg-blue-700 hover:border-none text-xl rounded-3xl"
				>Open</label
			>
			<input type="checkbox" id="lessonplan" class="modal-toggle" />
			<div class="modal">
				<div class="modal-box relative h-5/6 max-w-4xl">
					<label for="lessonplan" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 class="text-xl font-bold text-center">Lesson Plan</h3>

					<div
						class="w-full flex flex-col mx-auto
					 py-3 px-4 outline rounded-3xl outline-gray-50 mt-5 overflow-y-auto"
					>
						<div class="mx-auto w-4/5 mt-5">

							<h1 class="text-left font-medium mt-5">Week 1</h1>
							<div class="divider my-0"></div>
							<h1 class="text-left my-1 ml-5">Day 1</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5" disabled
								/>
								<input type="checkbox" checked="checked" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 2</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5" disabled
								/>
								<input type="checkbox" checked="checked" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 3</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 4</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>
							
							<h1 class="text-left my-1 ml-5">Day 5</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							
							<h1 class="text-left font-medium mt-5">Week 2</h1>
							<div class="divider my-0"></div>
							<h1 class="text-left my-1 ml-5">Day 1</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 2</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 3</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 4</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>
							
							<h1 class="text-left my-1 ml-5">Day 5</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>



							<h1 class="text-left font-medium mt-5">Week 3</h1>
							<div class="divider my-0"></div>
							<h1 class="text-left my-1 ml-5">Day 1</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 2</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 3</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 4</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>
							
							<h1 class="text-left my-1 ml-5">Day 5</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>


							<h1 class="text-left font-medium mt-5">Week 4</h1>
							<div class="divider my-0"></div>
							<h1 class="text-left my-1 ml-5">Day 1</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 2</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 3</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>

							<h1 class="text-left my-1 ml-5">Day 4</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>
							
							<h1 class="text-left my-1 ml-5">Day 5</h1>
							<div class="flex flex-row items-center space-x-2">
								<input
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-full max-w-xl h-10 focus:border-none my-1 ml-5"
								/>
								<input type="checkbox" checked="" class="checkbox" />
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>

<style>
	/* Style for the toggle when it's checked (toggled) */
	.toggle-success:checked {
		background-color: #10b981; /* Green color */
	}

	/* Default style for the toggle when it's not checked (not toggled) */
	.toggle-success {
		background-color: #ef4444; /* Red color */
	}
</style>
