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
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		if (action === 'present') {
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
		} else if (action === 'absent') {
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
			console.log("HAAAAA");

			if (presentStudentIds.length > 0) {
				console.log('Present student IDs:', presentStudentIds);
				// You can perform further actions with these IDs if needed
			} else {
				console.log('No students with status "Present"');
			}
		});
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
	console.log('BAANGH', attendance);
</script>

<body class="bg-gray-100 w-screen h-screen">
	<!--HEADER-->
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
	<!--ENDHEADER-->

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
		<!--SELECTSUBJECT-->
		<div class="flex flex-row justify-center">
			<div class="basis-1/2 container mt-2 pt-4 lg:w-3/6">
				<div class="h-full bg-white bg-opacity-75 pb-12 rounded-3xl shadow-lg">
					<div class="flex flex-row mt-2">
						<img src="addclass.png" class="h-9 mt-4 pl-8" alt="..." />
						<h1 class="pl-1 pt-5 pb-2 font-medium text-xl mb-5 text-gray-700">Attendance</h1>
						<div class="w-full flex flex-row-reverse mr-5">
							<select
								class="w-1/3 mt-4 h-8 flex rounded-xl border-none placeholder-gray-300 font-medium text-center bg-white shadow-md"
							>
								<option class="rounded-xl" value={currentDatee}>{currentDatee}</option>
							</select>
						</div>
					</div>

					<!-- ADDED CLASS-->
					<div class="flex justify-center font-sans">
						<div class="flex justify-center lg:w-5/6">
							<div class="bg-white shadow-md rounded-xl h-64 overflow-y-scroll snap-y">
								<table class="rounded-2xl">
									<thead>
										<tr class="bg-gray-100 text-gray-600 text-sm leading-normal sticky top-0">
											<th class="py-3 px-6 text-left">Student</th>
											<th class="py-3 px-6 text-center">RFID Tag</th>
											<th class="py-3 px-6 text-center">Time</th>
											<th class="py-3 px-6 text-center">Status</th>
											<th class="py-3 px-6 text-center">Actions</th>
										</tr>
									</thead>
									<!--ROW 1-->

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
															>Present</span
														>
													</td>
												{:else}
													<td class="py-1 px-6 text-center">
														<span class="bg-red-500 text-white py-1 px-3 rounded-full text-xs"
															>Absent</span
														>
													</td>
												{/if}
												<!--ACTIONS-->
												<td class="py-1 px-6 text-center justify-center">
													{#if data.status == 'Present'}
														<input
															type="radio"
															name={data.id}
															class="radio w-5 h-5 radio-error"
															on:click={() => changeStatus('absent', data.id)}
														/>
														<input
															type="radio"
															name={data.id}
															class="radio w-5 h-5 radio-success"
															checked
															on:click={() => changeStatus('present', data.id)}
														/>
													{:else}
														<input
															type="radio"
															name={data.id}
															class="radio w-5 h-5 radio-error"
															on:click={() => changeStatus('absent', data.id)}
															checked
														/>
														<input
															type="radio"
															name={data.id}
															class="radio w-5 h-5 radio-success"
															on:click={() => changeStatus('present', data.id)}
														/>
													{/if}
												</td>
												<!--END ACTION-->
											</tr>
										{/each}
									</tbody>
									<!--END ROW 1-->
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--LEADERBOARDS-->
			<div class="basis-1/2 ml-4 container mt-2 pt-4 lg:w-3/6">
				<div class="h-full bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
					<div class="flex flex-row mt-2">
						<img src="leaderboard.png" class="h-9 mt-4 pl-9 pr-1" alt="..." />
						<h1 class="pl-1 pt-5 pb-4 w-80 font-medium text-xl text-gray-700">Recitation Points</h1>
						<div class="w-full flex flex-row-reverse items-center">
							<div class="form-control">
								<div class="input-group scale-75">
									<input
										type="text"
										placeholder="Search student"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
									<button class="btn btn-square">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/></svg
										>
									</button>
								</div>
							</div>
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
												<th scope="col" class="text-sm font-medium text-gray-900 px-1 py-4">
													Update Points
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
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--LEADERBOARDS-->

		<!--RANDOMIZER-->
		<div class="flex flex-row justify-center">
			<div class="basis-1/2 container mt-7 lg:w-1/4">
				<div
					class="h-full bg-white shadow-xl bg-opacity-75 pb-16 rounded-3xl overflow-hidden text-center"
				>
					<div class="flex flex-row mt-2">
						<img src="randomizer.png" class="h-9 mt-4 pl-8" alt="..." />
						<h1 class="pl-1 pt-5 pb-2 font-medium text-xl mb-5 text-gray-700">Randomizer</h1>
					</div>

					<label
						for="randomizer"
						class="btn h-24 w-56 bg-[#EF5051] border-transparent hover:bg-red-600 hover:border-none text-xl rounded-3xl"
						>Randomizer</label
					>

					<!-- Put this part before </body> tag -->
					<input type="checkbox" id="randomizer" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative outline-dashed h-96">
							<label for="randomizer" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
							<h3 class="text-xl font-bold text-center">Randomizer</h3>
							<button
								on:click={getRandomName}
								class="btn mt-10 w-1/2 bg-[#EF5051] hover:bg-red-600 border-none"
							>
								START
							</button>
							<!--KULANG PA NG LOADING ANIMATION AFTER START BUTTON CLICK-->
							<p class="mt-20 text-3xl font-bold text-center" id="randomizerName">STUDENT NAME</p>
						</div>
					</div>
				</div>
			</div>

			<div class="basis-1/2 container mt-7 lg:w-1/4">
				<div
					class="ml-2 h-full bg-white shadow-xl bg-opacity-75 pb-16 rounded-3xl overflow-hidden text-center"
				>
					<div class="flex flex-row mt-2">
						<img src="group.png" class="h-8 mt-4 pl-8 pr-1" alt="..." />
						<h1 class="pl-1 pt-5 pb-2 font-medium text-xl mb-5 text-gray-700">Create Group</h1>
					</div>
					<div>
						<button
							class="btn h-24 w-56 bg-[#0A805E] border-transparent hover:bg-[#08664b] hover:border-transparent text-xl rounded-3xl"
							>CREATE</button
						>
					</div>
				</div>
			</div>

			<div class="basis-1/3 container mt-7 lg:w-96">
				<div
					class="ml-2 h-full bg-white shadow-xl bg-opacity-75 pb-16 rounded-3xl overflow-hidden text-center"
				>
					<div class="flex flex-row mt-2">
						<img src="timer.png" class="h-9 mt-3 pl-8" alt="..." />
						<h1 class="pl-1 pt-4 pb-2 font-medium text-xl mb-5 text-gray-700">Timer</h1>
					</div>
					<div>
						<button
							class="btn h-24 w-48 bg-[#5E59C0] border-transparent hover:bg-[#3a3691] hover:border-transparent text-xl rounded-3xl"
							>START</button
						>
					</div>
				</div>
			</div>
		</div>
		<!--ENDRANDOMIZER-->
	</div>

	<!--VIEW OUR POLICY-->
	<!-- The button to open modal -->
	<div class="w-full flex justify-end mt-24 px-10">
		<label
			for="my-modal-3"
			class="btn bg-gray-50 border-none shadow-xl text-gray-800 hover:bg-gray-300 normal-case"
			>View Policy</label
		>

		<!-- Put this part before </body> tag -->
		<input type="checkbox" id="my-modal-3" class="modal-toggle" />
		<div class="modal">
			<div class="modal-box relative">
				<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
				<h3 class="text-lg font-bold text-center">Mwenzi's Policy</h3>
				<p class="py-4" />
			</div>
		</div>
	</div>
	<!--END VIEW OUR POLICY-->
</body>
