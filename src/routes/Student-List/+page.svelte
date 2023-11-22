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
		deleteDoc,
		arrayUnion
	} from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue, get, child, set } from 'firebase/database';
	import { userId } from '../../lib/userStorage';
	import { onMount } from 'svelte';
	import Papa from 'papaparse';
	import toast, { Toaster } from 'svelte-french-toast';

	async function deleteStudents() {
		const deleteStudent = document.getElementById('selectDelete').value;

		const collectionRef2 = collection(firestore, 'classes');
		const query3 = query(collectionRef2, where('students', 'array-contains', deleteStudent));

		getDocs(query3)
			.then((querySnapshot12) => {
				querySnapshot12.forEach((doc) => {
					const docRef = doc.ref; // Reference to the document

					// Get the current 'students' array from the document data
					const studentsArray = doc.data().students;

					// Remove idToSearch from the 'students' array
					const updatedStudentsArray = studentsArray.filter(
						(studentId) => studentId !== deleteStudent
					);

					// Update the document in Firestore with the modified 'students' array
					updateDoc(docRef, { students: updatedStudentsArray })
						.then(() => {
							toast.success(`Removed ${deleteStudent} from document ID: ${doc.id}`);
						})
						.catch((error) => {
							toast.error(`Error updating document: ${error}`);
						});
				});
			})
			.catch((error) => {
				console.error('Error getting documents: ', error);
			});

		const collectionRef23 = collection(firestore, 'Subject');
		const query43 = query(collectionRef23, where('students', 'array-contains', deleteStudent));

		getDocs(query43)
			.then((querySnapshot123) => {
				querySnapshot123.forEach((doc) => {
					const docRef = doc.ref; // Reference to the document

					// Get the current 'students' array from the document data
					const studentsArray = doc.data().students;

					// Remove idToSearch from the 'students' array
					const updatedStudentsArray = studentsArray.filter(
						(studentId) => studentId !== deleteStudent
					);

					// Update the document in Firestore with the modified 'students' array
					updateDoc(docRef, { students: updatedStudentsArray })
						.then(() => {
							console.log(`Removed ${deleteStudent} from document ID: ${doc.id}`);
						})
						.catch((error) => {
							console.error(`Error updating document: ${error}`);
						});
				});
			})
			.catch((error) => {
				console.error('Error getting documents: ', error);
			});

		const collectionRef = collection(firestore, 'users');
		const query1 = query(collectionRef, where('studentRFID', '==', deleteStudent));
		const querySnapshot = await getDocs(query1);
		querySnapshot.forEach(async (doc) => {
			// Delete the document
			await deleteDoc(doc.ref);
			console.log('Document deleted:', doc.id);
		});
	}

	function handleSelectChange(event) {
		const selectedOption = event.target.value;

		if (selectedOption === '/NewAdmin-Dashboard') {
			window.location.href = selectedOption;
		}
		if (selectedOption === '/Section-Subject') {
			window.location.href = selectedOption;
		}
		if (selectedOption === '/Teacher-List') {
			window.location.href = selectedOption;
		}
	}

	let studentInformation;

	async function updateStudentDetail() {
		const id = document.getElementById('studentRFID').value;
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('studentRFID', '==', id));

		const firstName1 = document.getElementById('firstName').value;
		const lastName1 = document.getElementById('lastName').value;
		const birthday1 = document.getElementById('bday').value;
		const studentID1 = document.getElementById('studentID').value;
		const studentRFID1 = document.getElementById('studentRFID').value;

		try {
			const querySnapshot = await getDocs(queryRef2);

			querySnapshot.forEach(async (doc) => {
				// Assuming docRef is the reference to the document you want to update
				await updateDoc(doc.ref, {
					firstName: firstName1,
					lastName: lastName1,
					birthday: birthday1,
					studentID: studentID1,
					studentRFID: studentRFID1
				});

				toast.success('Student data updated successfully');
			});
		} catch (error) {
			toast.error('Error updating documents:', error);
		}
	}

	function toggleEdit() {
		const firstName = document.getElementById('firstName');
		const lastName = document.getElementById('lastName');
		const bday = document.getElementById('bday');
		const studentID = document.getElementById('studentID');
		const studentRFID = document.getElementById('studentRFID');
		const saveButton = document.getElementById('saveButton12');

		if (firstName.readOnly) {
			// Fields are currently read-only, so enable editing
			firstName.readOnly = false;
			lastName.readOnly = false;
			bday.readOnly = false;
			studentID.readOnly = false;
			studentRFID.readOnly = false;
			saveButton.classList.remove('pointer-events-none');
		} else {
			// Fields are currently editable, so disable editing
			firstName.readOnly = true;
			lastName.readOnly = true;
			bday.readOnly = true;
			studentID.readOnly = true;
			studentRFID.readOnly = true;
			saveButton.classList.add('pointer-events-none');
		}
	}

	async function getStudentDetail(id) {
		const collectionRef = collection(firestore, 'users');
		const query1 = query(collectionRef, where('studentRFID', '==', id));
		const querySnapshot = await getDocs(query1);

		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0]; // Access the first (and only) document in the result
			studentInformation = {
				id: doc.id,
				data: doc.data()
			};
			// Now, studentInformation contains the data of the matching document
		} else {
			// Handle the case where no matching document was found
		}
		document.getElementById('firstName').value = studentInformation.data.firstName;
		document.getElementById('lastName').value = studentInformation.data.lastName;
		document.getElementById('bday').value = studentInformation.data.birthday;
		document.getElementById('studentID').value = studentInformation.data.studentID;
		document.getElementById('studentID2').textContent = studentInformation.data.studentID;
		document.getElementById('studentName').textContent =
			studentInformation.data.firstName + ' ' + studentInformation.data.lastName;
		document.getElementById('studentRFID').value = studentInformation.data.studentRFID;
	}

	let students = [];
	let subjectArray = [];
	let firstName;
	let lastName;

	async function studentCheck(option) {
		if (option === 'Alphabetical') {
			const collectionRef = collection(firestore, 'users');
			const filter = query(collectionRef, where('userRole', '==', 'student'));

			// Use onSnapshot to listen for real-time updates
			const unsubscribe = onSnapshot(filter, (snapshot) => {
				const studentsData = snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data()
				}));

				studentsData.sort((a, b) => {
					const lastNameA = a.data.lastName || ''; // Handle cases where lastName might be undefined
					const lastNameB = b.data.lastName || ''; // Handle cases where lastName might be undefined

					return lastNameA.localeCompare(lastNameB);
				});

				students = [];
				students = studentsData;
				// You can update your UI or perform other actions with the updated data here
			});

			// To stop listening to updates, call the returned unsubscribe function
			// Make sure to store this function if you need to unsubscribe later
			// Example: unsubscribe();
		}

		// Handle the 'Section' case in a similar manner
		if (option === 'Section') {
			const collectionRef = collection(firestore, 'users');
			const filter = query(collectionRef, where('userRole', '==', 'student'));

			const unsubscribe = onSnapshot(filter, (snapshot) => {
				const studentsData = snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data()
				}));

				studentsData.sort((a, b) => {
					const lastNameA = a.data.class || ''; // Handle cases where class might be undefined
					const lastNameB = b.data.class || ''; // Handle cases where class might be undefined

					return lastNameA.localeCompare(lastNameB);
				});

				// Update your 'students' array with the sorted data
				students = [];
				students = studentsData;
				// You can update your UI or perform other actions with the updated data here
			});

			// To stop listening to updates, call the returned unsubscribe function
			// Make sure to store this function if you need to unsubscribe later
			// Example: unsubscribe();
		}
	}

	async function classCheck() {
		const collectionRef = collection(firestore, 'classes');
		const querySnapshot = await getDocs(collectionRef);

		subjectArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
	}

	studentCheck('Alphabetical');
	classCheck();

	let studentName;
	let bday;
	let studentID;
	let studentRFID;
	let classSelect1;
	let classSelect2;

	let myVariable = '';
	let rfidMode = '';
	let modeSwitch;

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

	function handleCSVUpload() {
		const inp_file = document.getElementById('csvUpload');
		let arrayobj = [];

		if (classSelect2 !== null) {
			Papa.parse(inp_file.files[0], {
				download: true,
				header: true,
				skipEmptyLines: true,
				complete: function (results) {
					arrayobj = results.data;
					console.log(arrayobj);
					createStudentImport(arrayobj);
				}
			});
		} else {
			toast.error('Please Select a Section');
		}
	}

	async function createStudentImport(csvFile) {
		for (const student of csvFile) {
			const docRef2 = doc(firestore, 'classes', classSelect2);
			let grade;
			getDoc(docRef2)
				.then((docSnapshot) => {
					if (docSnapshot.exists()) {
						const data = docSnapshot.data();
						grade = data.grade;
						console.log('Grade:', grade);
					} else {
						console.log('Document does not exist.');
					}
				})
				.catch((error) => {
					console.error('Error getting document:', error);
				});

			const userID = await generateAndCheckUID();
			const docRef = await setDoc(doc(firestore, 'users', userID), {
				UID: userID,
				userRole: 'student',
				firstName: student.FirstName,
				lastName: student.LastName,
				studentID: student.StudentID,
				studentRFID: student.StudentRFID,
				class: classSelect2,
				gradeLevel: grade,
				birthday: student.Birthday
			});

			await updateDoc(docRef2, {
				students: arrayUnion(student.StudentRFID)
			});

			writeUserData3(student.StudentRFID);
		}

		toast.success('Students succesfully added');
	}

	async function createStudent() {
		if (
			firstName == null ||
			lastName == null ||
			bday == null ||
			studentID == null ||
			studentRFID == null ||
			classSelect1 == null
		) {
			// At least one of the variables is null
			toast.error('One or more input/s are empty');
		} else {
			// None of the variables are null
			toast.success('All variables have values');

			if (rfidMode == 'On') {
				try {
					const userID = await generateAndCheckUID();
					console.log('createAccount');
					console.log(userID);

					const docRef2 = doc(firestore, 'classes', classSelect1);
					let grade;
					getDoc(docRef2)
						.then((docSnapshot) => {
							if (docSnapshot.exists()) {
								const data = docSnapshot.data();
								grade = data.grade;
								console.log('Grade:', grade);
							} else {
								console.log('Document does not exist.');
							}
						})
						.catch((error) => {
							console.error('Error getting document:', error);
						});

					await updateDoc(docRef2, {
						students: arrayUnion(myVariable)
					});

					const docRef = await setDoc(doc(firestore, 'users', userID), {
						UID: userID,
						userRole: 'student',
						firstName: firstName,
						lastName: lastName,
						studentID: studentID,
						studentRFID: myVariable,
						class: classSelect1,
						birthday: bday,
						gradeLevel: grade
					});

					const collectionRef1 = collection(firestore, 'Subject');
					const query3 = query(collectionRef1, where('className', '==', classSelect1));

					// Get the documents that match the query
					const querySnapshot34 = await getDocs(query3);

					// Update the matching documents
					querySnapshot34.forEach((doc) => {
						const docRef12 = doc.ref; // Reference to the document

						// Append the data to the 'students' array
						updateDoc(docRef12, {
							students: arrayUnion(myVariable)
						})
							.then(() => {
								toast.success('Document successfully updated!');
							})
							.catch((error) => {
								toast.error('Error updating document: ', error);
							});
					});

					writeUserData1();

					console.log('Document created in Firestore with ID:', userID);
				} catch (error) {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.error('Error creating user and document:', errorCode, errorMessage);
				}
			} else {
				try {
					const userID = await generateAndCheckUID();
					console.log('createAccount');
					console.log(userID);

					const docRef2 = doc(firestore, 'classes', classSelect1);
					let grade;
					getDoc(docRef2)
						.then((docSnapshot) => {
							if (docSnapshot.exists()) {
								const data = docSnapshot.data();
								grade = data.grade;
								console.log('Grade:', grade);
							} else {
								console.log('Document does not exist.');
							}
						})
						.catch((error) => {
							console.error('Error getting document:', error);
						});

					await updateDoc(docRef2, {
						students: arrayUnion(myVariable)
					});

					const docRef = await setDoc(doc(firestore, 'users', userID), {
						UID: userID,
						userRole: 'student',
						firstName: firstName,
						lastName: lastName,
						studentID: studentID,
						studentRFID: studentRFID,
						class: classSelect1,
						gradeLevel: grade,
						birthday: bday
					});

					await updateDoc(docRef2, {
						students: arrayUnion(studentRFID)
					});

					const collectionRef1 = collection(firestore, 'Subject');
					const query3 = query(collectionRef1, where('className', '==', classSelect1));

					// Get the documents that match the query
					const querySnapshot3 = await getDocs(query3);

					// Update the matching documents
					querySnapshot3.forEach((doc) => {
						const docRef6 = doc.ref; // Reference to the document

						// Append the data to the 'students' array
						updateDoc(docRef6, {
							students: arrayUnion(myVariable)
						})
							.then(() => {
								toast.success('Document successfully updated!');
							})
							.catch((error) => {
								toast.error('Error updating document: ', error);
							});
					});

					writeUserData2();

					console.log('Document created in Firestore with ID:', userID);
				} catch (error) {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.error('Error creating user and document:', errorCode, errorMessage);
				}
			}
		}
	}

	async function generateAndCheckUID() {
		// Define a set of characters and numbers to choose from
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		// Set the desired length of your UID
		const uidLength = 10;

		let uid = '';

		// Generate the UID by randomly selecting characters from the set
		for (let i = 0; i < uidLength; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			uid += characters.charAt(randomIndex);
		}

		const collectionRef = collection(firestore, 'users');
		const docRef = doc(collectionRef, uid);

		try {
			const docSnapshot = await getDoc(docRef);
			if (docSnapshot.exists()) {
				// If the document with this UID already exists, generate a new one
				return generateAndCheckUID();
			} else {
				// If the document doesn't exist, return the unique UID
				return uid;
			}
		} catch (error) {
			console.error('Error checking document: ', error);
			throw error; // Rethrow the error
		}
	}

	function writeUserData1() {
		set(ref(database, 'rfid/' + myVariable), myVariable);
		console.error('Using Arduino RFID');
	}

	function writeUserData2() {
		set(ref(database, 'rfid/' + studentRFID), studentRFID);
		console.error('Using Normal Way');
	}

	function writeUserData3(rfid1) {
		set(ref(database, 'rfid/' + rfid1), rfid1);
		console.error('Using Normal Way');
	}

	function toggleSwitch() {
		console.log(modeSwitch.checked);

		if (modeSwitch.checked) {
			// Checkbox is checked
			set(ref(database, 'rfidMode/register'), 'On');
			console.log('Using Arduino RFID');
		} else {
			// Checkbox is not checked
			set(ref(database, 'rfidMode/register'), 'Off');
			console.log('Using Normal Way');
		}
	}

	async function displayData() {
		var rfidRef = ref(database, 'rfidRegisterValue/RFID');
		var rfidModex = ref(database, 'rfidMode/register');

		try {
			const snapshot = await get(rfidRef);
			const rfidValue = snapshot.val();
			myVariable = rfidValue;
			console.log('RFID value:', myVariable);
		} catch (error) {
			console.log('Error retrieving RFID value:', error);
		}

		try {
			const snapshot = await get(rfidModex);
			const mode = snapshot.val();
			rfidMode = mode;
			console.log('RFID mode:', rfidMode);
		} catch (error) {
			console.log('Error retrieving RFID mode:', error);
		}
	}

	// Listen for changes in the data
	function listenForChanges() {
		var rfidRef = ref(database, 'rfidRegisterValue/RFID');
		var rfidModex = ref(database, 'rfidMode/register');

		onValue(rfidRef, (snapshot) => {
			const rfidValue = snapshot.val();
			myVariable = rfidValue;
			console.log('RFID value changed:', myVariable);
		});

		onValue(rfidModex, (snapshot) => {
			const mode = snapshot.val();
			rfidMode = mode;
			console.log('RFID mode changed:', rfidMode);
		});
	}

	let selectedOption; // Create a reactive variable to store the selected option
	let sortedStudents;

	function handleSortChange(event) {
		selectedOption = event.target.value;
	}

	listenForChanges();
	displayData();

	async function getuserName(id) {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('UID', '==', id), where('userRole', '==', 'admin'));
		const querySnapshot = await getDocs(queryRef2);
		if (querySnapshot.docs.length > 0) {
			const doc = querySnapshot.docs[0];
			console.log(doc.data().Name);
		} else {
			window.location.replace('../Admin');
			return 'Admin not found';
		}
	}
	let userUID;

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

<body class=" bg-gray-50 h-screen w-full">
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
					<option disabled selected hidden class="rounded-3xl">Students</option>
					<option value="/NewAdmin-Dashboard" id="NewAdmin-Dashboard" class="rounded-3xl"
						>Dashboard</option
					>
					<option value="/Section-Subject" id="Section-Subject" class="rounded-xl"
						>Section - Subject</option
					>
					<option value="/Teacher-List" id="Teacher-List" class="rounded-xl">Teachers</option>
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

				<!--ADD CLASS, DELETE CLASS, DATE  -->
				<div class="flex flex-row w-full mx-36 justify-between mb-7 mt-5">
					<div class="flex flex-row">
						<!--ADD CLASS-->
						<label
							for="AddStudent"
							class="text-sm cursor-pointer px-6 mr-1 bg-blue-500 hover:bg-blue-700 flex items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
						>
							Add Student</label
						>
						<input type="checkbox" id="AddStudent" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-4/5 max-w-xl">
								<label for="AddStudent" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>
								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Add Student/s</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
								>
									<div class="mx-auto w-full">
										<h1 class="text-left my-2 mx-5">
											First Name
											<input
												bind:value={firstName}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="First Name"
												type="text"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Last Name
											<input
												bind:value={lastName}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Last Name"
												type="text"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Birthdate
											<input
												bind:value={bday}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Birthdate"
												type="date"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Student ID
											<input
												bind:value={studentID}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Student ID"
												type="number"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Student RFID
											<div class="flex flex-row items-center">
												{#if rfidMode == 'On'}
													<input
														bind:this={modeSwitch}
														on:change={toggleSwitch}
														type="checkbox"
														id="toggleMode"
														name="toggleMode"
														class="toggle checked:bg-[#2ea44f] ml-3"
														checked
													/>
												{:else}
													<input
														bind:this={modeSwitch}
														on:change={toggleSwitch}
														type="checkbox"
														id="toggleMode"
														name="toggleMode"
														class="toggle checked:bg-[#2ea44f] ml-3"
													/>
												{/if}

												{#if rfidMode == 'On'}
													<input
														bind:value={studentRFID}
														type="text"
														name="rfidStudent"
														id="rfidStudent"
														placeholder={myVariable}
														class="ml-3 w-full px-3 py-2 placeholder-gray-700 border border-gray-300 rounded-2xl focus:outline-none"
														disabled
													/>
												{:else}
													<input
														bind:value={studentRFID}
														type="text"
														name="rfidStudent"
														id="rfidStudent"
														placeholder="Student RFID"
														class="ml-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
													/>
												{/if}
											</div>
										</h1>

										<h1 class="text-left mt-3 mb-2 mx-5">
											Select Section:

											<select
												bind:value={classSelect1}
												class="select select-sm select-bordered focus:border-none border-gray-200 w-full h-5 rounded-3xl shadow-sm mt-2"
											>
												{#each subjectArray as item1 (item1.id)}
													<option disabled selected hidden class="rounded-3xl"
														>Select Section</option
													>
													<option class="rounded-3xl" value={item1.id}>{item1.id}</option>
												{/each}
											</select>
										</h1>

										<div class="justify-end flex mt-5 mb-3">
											<button
												on:click={createStudent}
												id="saveButton"
												class="py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
											>
												Add</button
											>
										</div>
									</div>
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-4"
								>
									<div class="mx-auto w-full">
										<h1 class="text-left font-medium my-2 mx-5 flex flex-col">
											Import
											<input
												type="file"
												id="csvUpload"
												class="file-input file-input-bordered file-input-xs w-full mt-2"
												accept=".csv"
											/>
										</h1>
										<h1 class="text-left mt-3 mb-2 mx-5">
											Select Section:
											<select
												bind:value={classSelect2}
												class="select select-sm select-bordered focus:border-none border-gray-200 w-full h-5 rounded-3xl shadow-sm mt-2"
											>
												{#each subjectArray as item1 (item1.id)}
													<option disabled selected hidden class="rounded-3xl"
														>Select Section</option
													>
													<option class="rounded-3xl" value={item1.id}>{item1.id}</option>
												{/each}
											</select>
										</h1>

										<div class="justify-end flex mt-5 mb-3">
											<button
												on:click={handleCSVUpload}
												id="uploadButton"
												class="py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
											>
												Import</button
											>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--END ADD CLASS-->

						<label
							for="DeleteStudent"
							class="cursor-pointer px-5 ml-1 bg-red-500 hover:bg-red-700 flex text-sm items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
						>
							Delete Students</label
						>
						<input type="checkbox" id="DeleteStudent" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-72 max-w-xl">
								<label for="DeleteStudent" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>
								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Delete Student</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
								>
									<div class="mx-auto w-full">
										<h1 class="text-left my-2 mx-5">
											Select Student Name:

											<select
												id="selectDelete"
												class="select select-sm select-bordered focus:border-none border-gray-200 w-full h-5 rounded-3xl shadow-sm mt-2"
											>
												<option disabled selected hidden class="rounded-3xl">Select Student</option>
												{#each students as item1 (item1.id)}
													<option value={item1.data.studentRFID}
														>{item1.data.firstName} {item1.data.lastName}</option
													>
												{/each}
											</select>
										</h1>

										<div class="justify-end flex mt-5 mb-3">
											<button
												on:click={deleteStudents}
												id="saveButton"
												class="py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
											>
												Delete</button
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						class="container h-8 mx-1 border border-gray-200 rounded-3xl w-48 flex justify-center items-center"
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
				<!--END DATE -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card h-3/4 w-full justify-center">
		<!--CLASS SUBJECT LISTS-->
		<div class="w-4/5 h-full bg-white bg-opacity-75 rounded-3xl pb-20 text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row justify-between w-full">
					<div class="flex flex-row">
						<img src="student.png" class="h-8 pl-6 mt-2" alt="..." />
						<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Student List</h1>
					</div>
					<select
						id="sortSelect"
						on:change={(event) => studentCheck(event.target.value)}
						class="mt-2 border-gray-200 w-56 h-6 font-medium text-sm text-center mr-6 border border-gray focus:none rounded-3xl shadow-sm"
					>
						<option disabled selected hidden class="rounded-3xl">Sort by</option>
						<option class="rounded-xl" value="Alphabetical">Alphabetical</option>
						<option class="rounded-xl" value="Section">Section</option>
					</select>
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-5/6">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Section</th>
							<th scope="col" class="px-6 py-4 text-center">Student Name</th>
							<th scope="col" class="px-6 py-4 text-center">Birthdate</th>
							<th scope="col" class="px-6 py-4 text-center">Student ID</th>
							<th scope="col" class="px-6 py-4 text-center">RFID</th>
						</tr>
					</thead>
					<tbody>
						{#each students as item1 (item1.id)}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<td class="px-6 py-2">{item1.data.class}</td>
								<td class="text-center">
									<label
										for="StudentInformation"
										class="cursor-pointer"
										on:click={() => getStudentDetail(item1.data.studentRFID)}
										>{item1.data.firstName} {item1.data.lastName}</label
									>
								</td>
								<td class="px-6 py-2">{item1.data.birthday}</td>
								<td class="px-6 py-2">{item1.data.studentID}</td>
								<td class="px-6 py-2">{item1.data.studentRFID}</td>
							</tr>
						{/each}
						<!--MEDIC MODAL-->
						<input type="checkbox" id="StudentInformation" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative max-w-xl">
								<label for="StudentInformation" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>

								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Student Information</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50"
								>
									<div class="mx-auto w-full">
										<div class="flex flex-row justify-between mt-5 mx-2">
											<h1 id="studentName" class="text-left font-medium text-lg">
												Ace Dela Cuesta
											</h1>
											<h1 id="studentID2" class="text-left font-medium text-lg">19-1064</h1>
										</div>
										<div class="divider mt-0" />
										<h1 class="text-left my-2 mx-5">
											First Name
											<input
												id="firstName"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Ace"
												type="text"
												readonly
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Last Name
											<input
												id="lastName"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Dela Cuesta"
												type="text"
												readonly
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Birthdate
											<input
												id="bday"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="01/01/2001"
												type="date"
												readonly
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Student ID
											<input
												id="studentID"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="19-1064"
												type="text"
												readonly
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Student RFID
											<div class="flex flex-row items-center">
												<input
													id="studentRFID"
													class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
													placeholder="4e2abbab"
													type="text"
													readonly
												/>
											</div>
										</h1>

										<div class="justify-end flex mt-5 mb-2">
											<button
												on:click={toggleEdit}
												id="editButton"
												class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
											>
												Edit</button
											>
											<button
												on:click={updateStudentDetail}
												id="saveButton12"
												class="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 py-1 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95 pointer-events-none"
											>
												Save</button
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<Toaster />
</body>
