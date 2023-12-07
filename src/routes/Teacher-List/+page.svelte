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
	import toast, { Toaster } from 'svelte-french-toast';
	import { each } from 'svelte/internal';

	let currentDatee;
	let teachers = [];
	let firstName;
	let lastName;

	let studentInformation = [];

	async function updateStudentDetail() {
		const id = document.getElementById('uid').value;
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('UID', '==', id));

		const firstName1 = document.getElementById('firstName').value;
		const lastName1 = document.getElementById('lastName').value;
		const birthday1 = document.getElementById('email').value;
		const studentID1 = document.getElementById('password1').value;

		try {
			const querySnapshot = await getDocs(queryRef2);

			querySnapshot.forEach(async (doc) => {
				// Assuming docRef is the reference to the document you want to update
				await updateDoc(doc.ref, {
					firstName: firstName1,
					lastName: lastName1,
					birthday: birthday1,
					studentID: studentID1
				});

				toast.success('Teacher Information Updated Successfully');
			});
		} catch (error) {
			toast.error('Error updating documents:', error);
		}
	}

	async function getStudentDetail(id) {
		const collectionRef = collection(firestore, 'users');
		const query1 = query(collectionRef, where('UID', '==', id));
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
		document.getElementById('email').value = studentInformation.data.email;
		document.getElementById('password1').value = studentInformation.data.password;
		document.getElementById('uid').value = studentInformation.data.UID;
		document.getElementById('fullName').textContent =
			studentInformation.data.firstName + ' ' + studentInformation.data.lastName;
	}

	function toggleEdit() {
		const firstName = document.getElementById('firstName');
		const lastName = document.getElementById('lastName');
		const bday = document.getElementById('email');
		const studentID = document.getElementById('password1');
		const saveButton = document.getElementById('saveButton12');

		if (firstName.readOnly) {
			// Fields are currently read-only, so enable editing
			firstName.readOnly = false;
			lastName.readOnly = false;
			bday.readOnly = false;
			studentID.readOnly = false;
			saveButton.classList.remove('pointer-events-none');
		} else {
			// Fields are currently editable, so disable editing
			firstName.readOnly = true;
			lastName.readOnly = true;
			bday.readOnly = true;
			studentID.readOnly = true;
			saveButton.classList.add('pointer-events-none');
		}
	}

	async function deleteTeacher() {
		const deleteStudent = document.getElementById('selectDelete1').value;

		const collectionRef2 = collection(firestore, 'classes');
		const query3 = query(collectionRef2, where('teacher', '==', deleteStudent)); // Assuming 'deleteTeacher' is the teacher you want to remove

		const docSnapshots = await getDocs(query3);

		docSnapshots.forEach((doc) => {
			const docRef = doc.ref;

			// Update the document to remove the teacher by setting 'teachers' to an empty string
			updateDoc(docRef, { teacher: '' })
				.then(() => {
					console.log('Teacher removed successfully.');
				})
				.catch((error) => {
					console.error('Error removing teacher: ', error);
				});
		});

		const collectionRef23 = collection(firestore, 'Subject');
		const query43 = query(collectionRef23, where('teacher', '==', deleteStudent));

		const docSnapshotsx = await getDocs(query43);

		docSnapshotsx.forEach((doc) => {
			const docRef = doc.ref;

			// Update the document to remove the teacher by setting 'teachers' to an empty string
			updateDoc(docRef, { teacher: '' })
				.then(() => {
					console.log('Teacher removed successfully.');
				})
				.catch((error) => {
					console.error('Error removing teacher: ', error);
				});
		});

		const collectionRef = collection(firestore, 'users');
		const query1 = query(collectionRef, where('UID', '==', deleteStudent));
		const querySnapshot = await getDocs(query1);
		querySnapshot.forEach(async (doc) => {
			// Delete the document
			await deleteDoc(doc.ref);
			toast.success('Document deleted:', doc.id);
		});
	}

	async function teacherCheck(option) {
		const collectionRef = collection(firestore, 'users');
		const filter = query(collectionRef, where('userRole', '==', 'teacher'));

		const unsubscribe = onSnapshot(filter, (querySnapshot) => {
			// Initialize an array to store the teachers
			const teachers1 = [];

			querySnapshot.forEach((doc) => {
				// Process each document
				teachers1.push({
					id: doc.id,
					data: doc.data()
				});
			});

			console.log(option);

			if (option === 'Alphabetical') {
				// Sort teachers alphabetically by last name
				teachers.sort((a, b) => {
					const lastNameA = a.data.lastName || '';
					const lastNameB = b.data.lastName || '';
					return lastNameA.localeCompare(lastNameB);
				});
			} else if (option === 'Section') {
				// Sort teachers by their class or section
				teachers.sort((a, b) => {
					const classA = a.data.class || '';
					const classB = b.data.class || '';
					return classA.localeCompare(classB);
				});
			}

			// Now you can access the sorted teachers here or update your UI with them
			teachers = [];
			teachers = teachers1;
		});

		// To stop listening to changes, you can call the unsubscribe function
		// For example, to stop listening when the component unmounts or when needed
	}

	function getDate() {
		fetch('https://worldtimeapi.org/api/timezone/Asia/Manila')
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

		if (selectedOption === '/NewAdmin-Dashboard') {
			window.location.href = selectedOption;
		}
		if (selectedOption === '/Section-Subject') {
			window.location.href = selectedOption;
		}
		if (selectedOption === '/Student-List') {
			window.location.href = selectedOption;
		}
	}

	async function getSubjectName(id) {
		const collectionRef = collection(firestore, 'Subject');
		const filter = query(collectionRef, where('teacherID', '==', id));
		const querySnapshot = await getDocs(filter);
		const dataSub = [];
		const subjectName = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));

		subjectName.forEach((subject) => {
			dataSub.push(subject.id);
		});
		const commaSeparatedString = dataSub.join(' , ');
		return commaSeparatedString;
	}

	let email;
	let password;
	let passwordCon;

	async function createTeacher() {
		if (!firstName || !lastName || !email || !password || !passwordCon) {
			// At least one of the variables is null or undefined
			toast.error('Please fill in all required fields.');
		} else {
			if (password === passwordCon) {
				try {
					const userID = await generateAndCheckUID();
					const docRef = doc(firestore, 'users', userID);
					await setDoc(docRef, {
						UID: userID,
						email: email,
						userRole: 'teacher',
						firstName: firstName,
						lastName: lastName,
						password: password
					});
					// Success message or any other logic after creating the teacher
					toast.success('Teacher created successfully.');
				} catch (error) {
					console.error('Error creating teacher: ', error);
					// Handle the error, display an error message, etc.
					toast.error('An error occurred while creating the teacher.');
				}
			} else {
				toast.error('Password does not match');
			}
		}
	}

	async function generateAndCheckUID() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const uidLength = 10;

		let uid = '';

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
			teacherCheck('Alphabetical');
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
					<option disabled selected hidden class="rounded-3xl">Teachers</option>
					<option value="/NewAdmin-Dashboard" id="NewAdmin-Dashboard" class="rounded-3xl"
						>Dashboard</option
					>
					<option value="/Section-Subject" id="Section-Subject" class="rounded-xl"
						>Section - Subject</option
					>
					<option value="/Student-List" id="Student-List" class="rounded-xl">Students</option>
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
				<!--ADD CLASS, DELETE CLASS, DATE  -->
				<div class="flex flex-row w-full mx-36 justify-between mb-7 mt-5">
					<div class="flex flex-row">
						<!--ADD CLASS-->
						<label
							for="AddStudent"
							class="text-sm cursor-pointer px-6 mr-1 bg-blue-500 hover:bg-blue-700 flex items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
						>
							Add Teacher</label
						>
						<input type="checkbox" id="AddStudent" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative max-w-xl">
								<label for="AddStudent" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>
								<div class="text-xl font-bold text-center w-full justify-center flex flex-row">
									<p>Add Teacher</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-4"
								>
									<div class="mx-auto w-full">
										<h1 class="text-left my-2 mx-5">
											First Name
											<input
												bind:value={firstName}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Full Name"
												type="text"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Last Name
											<input
												bind:value={lastName}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Full Name"
												type="text"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Email
											<input
												bind:value={email}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Email"
												type="email"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Password
											<input
												bind:value={password}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Password"
												type="password"
											/>
										</h1>
										<h1 class="text-left my-2 mx-5">
											Confirm Password
											<input
												bind:value={passwordCon}
												class="mt-2 border rounded-3xl px-2 py-1 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Password"
												type="password"
											/>
										</h1>

										<div class="justify-end flex mt-5 mb-3">
											<button
												on:click={createTeacher}
												id="saveButton"
												class="py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
											>
												Save</button
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
							Delete Teacher</label
						>
						<input type="checkbox" id="DeleteStudent" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-72 max-w-xl">
								<label for="DeleteStudent" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>
								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Delete Teacher</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
								>
									<div class="mx-auto w-full">
										<h1 class="text-left my-2 mx-5">
											Select Teacher Name:

											<select
												id="selectDelete1"
												class="select select-sm select-bordered focus:border-none border-gray-200 w-full h-5 rounded-3xl shadow-sm mt-2"
											>
												<option disabled selected hidden class="rounded-3xl">Select Teacher</option>
												{#each teachers as item1 (item1.id)}
													<option value={item1.data.UID}
														>{item1.data.firstName}, {item1.data.lastName}</option
													>
												{/each}
											</select>
										</h1>

										<div class="justify-end flex mt-5 mb-3">
											<button
												on:click={deleteTeacher}
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
						<img src="teacher.png" class="h-8 pl-6 mt-2" alt="..." />
						<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Teacher List</h1>
					</div>
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-5/6">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Teacher Name</th>
							<th scope="col" class="px-6 py-4 text-center">Email</th>
							<th scope="col" class="px-6 py-4 text-center">Subject Section</th>
						</tr>
					</thead>
					<tbody>
						{#if teachers.length > 0}
							{#each teachers as item1 (item1.id)}
								<tr
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<td class="text-center"
										><!--FOR MODAL--><label
											for="StudentInformation"
											class="cursor-pointer"
											on:click={() => getStudentDetail(item1.data.UID)}
											>{item1.data.firstName} {item1.data.lastName}</label
										>
									</td>

									<td class="px-6 py-2">{item1.data.email}</td>

									{#await getSubjectName(item1.id) then subjectName}
										<td class="px-6 py-2">{subjectName}</td>
									{/await}
								</tr>
							{/each}
						{/if}
						<!--MEDIC MODAL-->
						<input type="checkbox" id="StudentInformation" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative max-w-xl">
								<label for="StudentInformation" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>

								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Teacher Information</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
								>
									<div class="mx-auto w-full">
										<div class="flex flex-row justify-betweenmx-2">
											<h1 class="text-left font-medium text-lg mt-3" id="fullName">
												Ruffa May Monis
											</h1>
										</div>
										<div class="divider mt-0" />
										<h1 class="text-left my-2 mx-5">
											First Name
											<input
												id="firstName"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Ruffa May Monis"
												type="text"
												readonly
											/>
										</h1>
										<h1 class="text-left my-2 mx-5" hidden>
											First Name
											<input
												id="uid"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Ruffa May Monis"
												type="text"
												readonly
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Last Name
											<input
												id="lastName"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Ruffa May Monis"
												type="text"
												readonly
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Email
											<input
												id="email"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="ruffamaymonis@gmail.com"
												type="text"
												readonly
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Password
											<input
												id="password1"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="54321"
												type="password"
												readonly
											/>
										</h1>
										<div class="justify-end flex mt-5">
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
												class="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 py-1 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
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
