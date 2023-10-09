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
	

	// Function to handle changes in the selected option
	function handleSelectChange(event) {
		const selectedOption = event.target.value;

		if (selectedOption === '/NewAdmin-Dashboard') {
			window.location.href = selectedOption;
		}

		if (selectedOption === '/Student-List') {
			window.location.href = selectedOption;
		}

		if (selectedOption === '/Teacher-List') {
			window.location.href = selectedOption;
		}
	}

	// RETRIEVE PART

	let classArray = [];
	let subjectArray = [];
	async function classCheck() {
		const collectionRef = collection(firestore, 'classes');
		const querySnapshot = await getDocs(collectionRef);

		classArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
	}

	async function subjectCheck() {
		const collectionRef = collection(firestore, 'Subject');
		const querySnapshot = await getDocs(collectionRef);

		subjectArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
	}

	async function getTeacherName(teacherID) {
		const queryRef = collection(firestore, 'users');
		const querySnapshot = await getDocs(query(queryRef, where('UID', '==', teacherID)));

		if (!querySnapshot.empty) {
			// Assuming you have a 'name' field in your user document
			const userData = querySnapshot.docs[0].data();
			return userData.Name;
		}

		return 'Unknown'; // Return a default value if teacher is not found
	}

	let teacherData = [];

	async function getTeachers() {
		const queryRef = collection(firestore, 'users');
		const querySnapshot = await getDocs(query(queryRef, where('userRole', '==', 'teacher')));

		teacherData = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
	}

	let studentList = [];

	async function getStudentList(classID) {
		const queryRef = collection(firestore, 'classes');
		const querySnapshot = await getDocs(query(queryRef, where('className', '==', classID)));
		if (querySnapshot.size === 1) {
			const doc = querySnapshot.docs[0];
			studentList = {
				id: doc.id,
				data: doc.data()
			};
		} else {
			console.log('cant find');
		}
		return studentList.data.students;
	}
	// CREATION PART

	let className;
	let gradeLevel;

	async function createClass() {
		const classQuery = query(collection(firestore, 'classes'), where('className', '==', className));

		const querySnapshot = await getDocs(classQuery);
		if (querySnapshot.empty) {
			const docRef = doc(firestore, 'classes', className);
			const classData = {
				className: className,
				grade: gradeLevel,
				teachers: [],
				students: []
			};

			await setDoc(docRef, classData);
			console.log('Class created successfully!');
			toast.success('Class created successfully!');
			location.reload();
		} else {
			console.log('A class with the same name already exists. Creation aborted.');
		}
	}

	let subjectName;
	let teacherSet;
	let classSet;
	let timeIn;
	let timeOut;

	async function createSubject() {
		const timeSubject = timeIn + ' - ' + timeOut;

		const classQuery = query(
			collection(firestore, 'Subject'),
			where('subjectName', '==', subjectName)
		);

		const querySnapshot = await getDocs(classQuery);
		const studentArray = await getStudentList(classSet);
		const tempName = classSet + " - "+ subjectName;
		if (querySnapshot.empty) {
			const docRef = doc(firestore, 'Subject', tempName);
			const classData = {
				subjectName: subjectName,
				className: classSet,
				teacherID: teacherSet,
				students: studentArray,
				time: timeSubject
			};
			console.log(docRef, classData);
			await setDoc(docRef, classData);
			console.log('Class created successfully!');
			toast.success('Class created successfully!');
			location.reload();
		} else {
			console.log('A class with the same name already exists. Creation aborted.');
			toast.error('A class with the same name already exists. Creation aborted.');
		}
	}

	// DELETE PART
	subjectCheck();
	classCheck();
	getTeachers();
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
					<option disabled selected hidden class="rounded-3xl">Class - Subject</option>
					<option value="/NewAdmin-Dashboard" id="NewAdmin-Dashboard" class="rounded-3xl"
						>Dashboard</option
					>
					<option value="/Student-List" id="Student-List" class="rounded-xl">Students</option>
					<option class="rounded-xl">Teachers</option>
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
				<!--ADD CLASS, DELETE CLASS, DATE  -->
				<div class="flex flex-row w-full justify-end mb-7 mt-5">
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
						<a class="font-medium text-sm p-2">09/29/23</a>
					</div>
				</div>
				<!--END DATE -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card h-3/4 w-full px-10 justify-center">
		<!--CLASS LISTS-->
		<div class="w-1/2 h-full bg-white bg-opacity-75 rounded-3xl pb-20 text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row">
					<img src="class.png" class="h-8 pl-6 mt-2" alt="..." />
					<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Class List</h1>
				</div>

				<div class="flex flex-row">
					<!--ADD CLASS-->
					<label
						for="AddClass"
						class="text-sm cursor-pointer px-4 h-8 mt-2 mr-1 bg-blue-500 hover:bg-blue-700 flex items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
					>
						Add Class</label
					>
					<input type="checkbox" id="AddClass" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-72 max-w-xl">
							<label for="AddClass" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
							<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
								<p>Add Class</p>
							</div>

							<div
								class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
							>
								<div class="mx-auto w-full">
									<h1 class="text-left my-2 mx-5">
										Class Name
										<input
											class="mt-2 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
											placeholder="Class Name"
											type="text"
											bind:value={className}
										/>
									</h1>

									<h1 class="text-left my-2 mx-5">
										Grade Level
										<input
											bind:value={gradeLevel}
											class="mt-2 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
											placeholder="Class Name"
											type="number"
										/>
									</h1>

									<div class="justify-end flex mt-5 mb-3">
										<button
											on:click={createClass}
											id="add"
											class="py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
										>
											Add</button
										>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--END ADD CLASS-->

					<label
						for="DeleteClass"
						class="cursor-pointer px-4 h-8 mt-2 mr-6 bg-red-500 hover:bg-red-700 flex text-sm items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
					>
						Delete Class</label
					>
					<input type="checkbox" id="DeleteClass" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-72 max-w-xl">
							<label for="DeleteClass" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
							>
							<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
								<p>Delete Class</p>
								<span />
							</div>

							<div
								class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
							>
								<div class="mx-auto w-full">
									<h1 class="text-left my-2 mx-5">
										Select Class Name:

										<select
											class="select select-sm select-bordered focus:border-none border-gray-200 w-full h-5 rounded-3xl shadow-sm mt-2"
										>
											<option disabled selected hidden class="rounded-3xl">Select Class</option>
											{#each classArray as item1 (item1.id)}
												<option class="rounded-3xl" value={item1.id}>{item1.id}</option>
											{/each}
										</select>
									</h1>

									<div class="justify-end flex mt-5 mb-3">
										<button
											id="delete"
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
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-5/6">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Class Name</th>
							<th scope="col" class="px-6 py-4 text-center">Total Students</th>
							<th scope="col" class="px-6 py-4 text-center">Grade Level</th>
						</tr>
					</thead>
					<tbody>
						{#each classArray as item1 (item1.id)}
							<tr
								class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<td class="text-center">{item1.id}</td>
								<td class="px-6 py-2">
									<!--FOR MODAL-->
									<label for="ClassSubjectStudentLists" class="cursor-pointer"
										>  {item1.data.students ? item1.data.students.length : 'N/A'}</label
									></td
								>
								<td class="text-center">{item1.data.grade}</td>
							</tr>
						{/each}
						<!-- MODAL-->
						<input type="checkbox" id="ClassSubjectStudentLists" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-2/5 max-w-xl">
								<label
									for="ClassSubjectStudentLists"
									class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
								>
								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Student Lists</p>
									<span />
								</div>

								<div class="w-full flex flex-col mx-auto rounded-3xl outline-gray-50 mt-7">
									<table class="w-full text-sm text-gray-500 dark:text-gray-400">
										<thead
											class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
										>
											<tr>
												<th scope="col" class="px-6 py-4 text-center">Student Name</th>
												<th scope="col" class="px-6 py-4 text-center">RFID</th>
											</tr>
										</thead>
										<tbody>
											<tr
												class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
											>
												<td class="px-6 py-2 text-center">Ace Dela Cuesta</td>
												<td class="py-1 px-6 text-center">4e2abbab</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</tbody>
				</table>
			</div>
		</div>
		<!--END CLASS LIST-->

		<!-- SUBJECT LIST-->
		<div class="w-1/2 h-full bg-white bg-opacity-75 rounded-3xl pb-20 text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row">
					<img src="class.png" class="h-8 pl-6 mt-2" alt="..." />
					<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Subject List</h1>
				</div>

				<div class="flex flex-row">
					<!--ADD CLASS-->
					<label
						for="AddSubject"
						class="text-sm cursor-pointer px-4 h-8 mt-2 mr-1 bg-blue-500 hover:bg-blue-700 flex items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
					>
						Add Subject</label
					>
					<input type="checkbox" id="AddSubject" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-2/4 max-w-xl">
							<label for="AddSubject" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
							<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
								<p>Add Subject</p>
							</div>

							<div
								class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
							>
								<div class="mx-auto w-full">
									<h1 class="text-left my-2 mx-5">
										Subject Name
										<input
											bind:value={subjectName}
											class="mt-2 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
											placeholder="Subject Name"
											type="text"
										/>
									</h1>

									<h1 class="text-left my-2 mx-5">
										Teacher
										<select
											class="mt-2 select select-bordered select-sm w-full focus:border-none rounded-3xl"
											bind:value={teacherSet}
										>
											<option disabled selected hidden>Add to Teacher</option>
											{#each teacherData as item1 (item1.id)}
												<option value={item1.data.UID}>{item1.data.Name}</option>
											{/each}
										</select>
									</h1>

									<h1 class="text-left my-2 mx-5">
										Class
										<select
											class="mt-2 select select-bordered select-sm w-full focus:border-none rounded-3xl"
											bind:value={classSet}
										>
											<option disabled selected hidden>Add to Class</option>
											{#each classArray as item1 (item1.id)}
												<option value={item1.id}>{item1.id}</option>
											{/each}
										</select>
									</h1>

									<h1 class="text-left my-2 mx-5">
										Time
										<div class="flex flex-row">
											<input
												class="mt-2 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-1/2 h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Start"
												type="time"
												bind:value={timeIn}
											/>
											<p class="items-center flex text-lg font-medium px-2">-</p>
											<input
												class="mt-2 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-1/2 h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="End"
												type="time"
												bind:value={timeOut}
											/>
										</div>
									</h1>

									<div class="justify-end flex mt-5 mb-3">
										<button
											on:click={createSubject}
											id="add"
											class="py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
										>
											Add</button
										>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--END ADD CLASS-->

					<label
						for="DeleteSubject"
						class="cursor-pointer px-4 h-8 mt-2 mr-6 bg-red-500 hover:bg-red-700 flex text-sm items-center text-white font-medium rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
					>
						Delete Subject</label
					>
					<input type="checkbox" id="DeleteSubject" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-72 max-w-xl">
							<label for="DeleteSubject" class="btn btn-sm btn-circle absolute right-2 top-2"
								>✕</label
							>
							<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
								<p>Delete Subject</p>
								<span />
							</div>

							<div
								class="w-full flex flex-col mx-auto py-3 px-4 outline rounded-3xl outline-gray-50 mt-7"
							>
								<div class="mx-auto w-full">
									<h1 class="text-left my-2 mx-5">
										Select Subject Name:

										<select
											class="select select-sm select-bordered focus:border-none border-gray-200 w-full h-5 rounded-3xl shadow-sm mt-2"
										>
											<option disabled selected hidden class="rounded-3xl">Select Subject</option>
											<option
												value="/NewAdmin-Dashboard"
												id="NewAdmin-Dashboard"
												class="rounded-3xl"
											/>
										</select>
									</h1>

									<div class="justify-end flex mt-5 mb-3">
										<button
											id="delete"
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
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-5/6">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Class Name - Subject Name</th>
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
								<td class="px-6 py-2">
									<label for="ClassSubjectStudentLists" class="cursor-pointer"
										>  {item1.data.students ? item1.data.students.length : 'N/A'}</label
									></td
								>
								{#await getTeacherName(item1.data.teacherID) then teacherName}
									<td class="py-1 px-6 text-center">{teacherName}</td>
								{:catch error}
									<td class="py-1 px-6 text-center">Error fetching teacher name</td>
								{/await}
								<td class="text-center">8:00 AM - 10:00 AM</td>
							</tr>
						{/each}
						<!-- MODAL-->
						<input type="checkbox" id="ClassSubjectStudentLists" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-2/5 max-w-xl">
								<label
									for="ClassSubjectStudentLists"
									class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
								>
								<div class="text-xl font-bold text-center w-full justify-center flex flex-row mb-5">
									<p>Student Lists</p>
									<span />
								</div>

								<div class="w-full flex flex-col mx-auto rounded-3xl outline-gray-50 mt-7">
									<table class="w-full text-sm text-gray-500 dark:text-gray-400">
										<thead
											class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
										>
											<tr>
												<th scope="col" class="px-6 py-4 text-center">Student Name</th>
												<th scope="col" class="px-6 py-4 text-center">RFID</th>
											</tr>
										</thead>
										<tbody>
											<tr
												class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
											>
												<td class="px-6 py-2 text-center">Ace Dela Cuesta</td>
												<td class="py-1 px-6 text-center">4e2abbab</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</tbody>
				</table>
			</div>
		</div>
		<!-- END SUBJECT LIST-->
	</div>
	<Toaster />
</body>
