<script>
	import { auth } from '$lib/firebase';
	import { doc, setDoc, query, where, getDocs, collection, addDoc } from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';

	let className = '';
	let gradeLevel = '';
	let selectClass = '';

	let teachFullName = '';
	let teachPassword = '';
	let teachPasswordCon = '';
	let tSelectClass = '';
	let teachEmail = '';

	let studentName = '';
	let studentRFID = '';
	let studentID = '';
	let studentEmail = '';
	let studentClass = '';

	async function createStudent() {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, studentEmail, studentID);
			const user = userCredential.user;
			const userID = user.uid;
			console.log('createAccount');
			console.log(userID);

			const docRef = await setDoc(doc(firestore, 'users', userID), {
				UID: userID,
				email: studentEmail,
				userRole: 'student',
				Name: studentName,
				studentID: studentID,
				studentRFID: studentRFID,
				studentClass: studentClass
			});

			console.log('Document created in Firestore with ID:', userID);
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error('Error creating user and document:', errorCode, errorMessage);
		}
	}

	// CREATE TEACHERS ACC
	async function createTeacher() {
		if (teachPassword === teachPasswordCon) {
			try {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					teachEmail,
					teachPassword
				);
				const user = userCredential.user;
				const userID = user.uid;
				console.log('createAccount');
				console.log(userID);

				const docRef = await setDoc(doc(firestore, 'users', userID), {
					UID: userID,
					email: teachEmail,
					userRole: 'teacher',
					Name: teachFullName,
					teachingClass: tSelectClass
				});

				console.log('Document created in Firestore with ID:', userID);
			} catch (error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error('Error creating user and document:', errorCode, errorMessage);
			}
		} else {
			console.log('Error: Password and confirm password do not match');
		}
	}

	async function createClass() {
		const classQuery = query(collection(firestore, 'classes'), where('className', '==', className));

		const querySnapshot = await getDocs(classQuery);

		if (querySnapshot.empty) {
			const docRef = doc(firestore, 'classes', className);
			const classData = {
				className: className,
				grade: gradeLevel,
				students: []
			};

			await setDoc(docRef, classData);
			console.log('Class created successfully!');
		} else {
			console.log('A class with the same name already exists. Creation aborted.');
		}
	}

	let data = [];

	async function displayClasses() {
		const collectionRef = collection(firestore, 'classes');
		const querySnapshot = await getDocs(collectionRef);

		data = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		console.log(data);
	}

	displayClasses();
</script>

<!-- Header Logo Center -->
<header class="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
	<div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">
		<nav class="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto" />
		<p
			class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0"
		>
			<img src="Mwenzi.png" class="w-30 h-20" alt="..." />
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
						<a href="/.." class="ml-12 py-2 flex align-center font-medium">Settings</a>
					</li>
					<li class="rounded-md hover:bg-gray-200">
						<a href="/.." class="ml-12 py-2 flex text-center font-medium">Log out</a>
					</li>
				</ul>
			</button>
		</div>
	</div>
</header>

<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
		<div class="flex flex-wrap -m-4">
			<div class="p-4 lg:w-1/3">
				<div
					class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative"
				>
					<!--ADD CLASS-->
					<div class="container mx-auto">
						<div class="max-w-md mx-auto">
							<div class="text-center" />
							<div class="m-7">
								<div class="mb-6">
									<label for="class" class="block mb-2 text-md font-medium text-gray"
										>Add Class</label
									>
									<input
										bind:value={gradeLevel}
										type="name"
										name="gradelevel"
										id="grade"
										placeholder="Grade Level"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
									<input
										bind:value={className}
										type="name"
										name="classname"
										id="classname"
										placeholder="Class Name"
										class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
								</div>
								<button
									on:click={createClass}
									class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
									>Add</button
								>
							</div>
						</div>
					</div>
					<!--END-->
				</div>
			</div>
			<div class="p-4 lg:w-1/3">
				<div
					class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative"
				>
					<!--REGISTER STUDENT-->
					<div class="max-w-md mx-auto">
						<div class="text-center" />
						<div class="m-7">
								<div class="mb-6">
									<label for="student" class="block mb-2 text-md font-medium text-gray"
										>Register Student</label
									>
									<input
										bind:value={studentName}
										type="name"
										name="fullname"
										id="studentfullname"
										placeholder="Full Name"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
									<input
										bind:value={studentEmail}
										type="email"
										name="studentEmail"
										id="studentEmail"
										placeholder="Student Email"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
									<input
										bind:value={studentRFID}
										type="text"
										name="rfidStudent"
										id="rfidStudent"
										placeholder="Student RFID"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
									<input
										bind:value={studentID}
										type="text"
										name="studentid"
										id="studentid"
										placeholder="Student ID"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
								</div>

									<div class="mb-6">
										<label for="class" class="block mb-2 text-md font-medium text-gray"
											>Select Class</label
										>

										<select
											bind:value={studentClass}
											id="classSelect1"
											class="pl-2 py-2 w-full rounded-md border border-gray-300 focus:bg-white text-md"
										>
											{#each data as item1}
												<option value={item1.className}>{item1.className}</option>
											{/each}
										</select>
										<button
                    on:click={createStudent}
											class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
											>Add</button
										>
									</div>
						</div>
					</div>
					<!--END-->
				</div>
			</div>

			<div class="p-4 lg:w-1/3">
				<div
					class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative"
				>
					<!--CREATE TEACHER'S ACCOUNT-->
					<div class="max-w-md mx-auto">
						<div class="text-center" />
						<div class="m-7">
							<div class="mb-6">
								<label for="teacher" class="block mb-2 text-md font-medium text-gray"
									>Create Teacher's Account</label
								>
								<input
									bind:value={teachFullName}
									type="name"
									name="fullname"
									id="teacherfullname"
									placeholder="Full Name"
									class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
								<input
									bind:value={teachEmail}
									type="email"
									name="teachEmail"
									id="teachEmail"
									placeholder="Email"
									class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
								<input
									bind:value={teachPassword}
									type="password"
									name="password"
									id="password"
									placeholder="Password"
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
								<input
									bind:value={teachPasswordCon}
									type="password"
									name="confpassword"
									id="confpassword"
									placeholder="Confirm Password"
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
							</div>

							<div class="mb-6">
								<label for="teacherclass" class="block mb-2 text-md font-medium text-gray"
									>Add Class to Teacher</label
								>
								<select
									bind:value={tSelectClass}
									id="classSelect2"
									class="pl-2 py-2 w-full rounded-md border border-gray-300 focus:bg-white text-md"
								>
									{#each data as item2}
										<option value={item2.className}>{item2.className}</option>
									{/each}
								</select>
							</div>

							<button
								on:click={createTeacher}
								class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
								>Add</button
							>
						</div>
					</div>
					<!--END-->
				</div>
			</div>
		</div>
	</div>
</section>

<!--div class='flex items-center flex-col justify-center pt-20 bg-slate-white'>
    <div class="container mx-auto">
        <div class="max-w-md mx-auto">
            <div class="text-center">
            </div>
            <div class="m-7">   
                <form action="?/" method="POST">
                    <div class="mb-6">
                        <label for="username" class="block mb-2 text-md font-medium text-gray">Add Class</label>
                        <input type="username" name="username" id="username" placeholder="Add Student" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                    </div>
                        <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>
                </form>
            </div>
        </div>
    </div>

    <div class="container mx-auto">
        <div class="max-w-md mx-auto">
            <div class="text-center">
            </div>
            <div class="m-7">   
                <form action="?/" method="POST">
                    <div class="mb-6">
                        <label for="username" class="block mb-2 text-md font-medium text-gray">Register Student</label>
                        <input type="username" name="username" id="username" placeholder="Full Name" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                    </div>

                    <form action="?/" method="POST">
                        <div class="mb-6">
                            <label for="username" class="block mb-2 text-md font-medium text-gray">Select Class</label>
                            <input type="username" name="username" id="username" placeholder="Full Name" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                        </div>

                        <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>
                </form>
            </div>
        </div>
    </div>

</div-->
