<script>
	import { auth, database } from '$lib/firebase';
	import {
		doc,
		setDoc,
		query,
		where,
		getDocs,
		getDoc,
		collection,
		addDoc,
		updateDoc,
		arrayUnion
	} from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue, get, set } from 'firebase/database';

	let className = '';
	let gradeLevel = '';
	let selectClass = '';

	let teachFullName = '';
	let teachPassword = '';
	let teachPasswordCon = '';
	let tSelectClass = '';
	let tSubject = '';
	let teachEmail = '';
	let teachSubject = '';

	let studentName = '';
	let studentRFID = '';
	let studentID = '';
	let studentEmail = '';
	let studentClass = '';

	let myVariable = '';
	let rfidMode = '';

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

				// const docRef = await setDoc(doc(firestore, 'users', userID), {
				// 	UID: userID,
				// 	email: teachEmail,
				// 	userRole: 'teacher',
				// 	Name: teachFullName
				// });

				const docRef2 = doc(firestore, 'classes', tSelectClass);
				await updateDoc(docRef2, {
					teachers: arrayUnion(userID)
				});

				const docSnapshot = await getDoc(doc(firestore, 'classes', tSelectClass));

				teachSubject = tSelectClass + ' - ' + teachSubject;

				if (docSnapshot.exists()) {
					// Get the student array from the document data
					const { students } = docSnapshot.data();

					// Update the document in the "Subject" collection
					const subjectDocRef = doc(firestore, 'Subject', teachSubject);
					await setDoc(subjectDocRef, {
						teacherID: userID,
						students: [...students] // Insert the copied students array
					});

					// Create a subcollection "Recitation" inside the "Subject" document
					const recitationCollectionRef = collection(subjectDocRef, 'Recitation');

					// Loop through the students array and create documents in the "Recitation" subcollection
					for (const student of students) {
						const recitationDocRef = doc(recitationCollectionRef, student);
						await setDoc(recitationDocRef, {
							totalPoints: 0 // Set the initial value of totalPoints to 0
							// Add more fields as needed for each student in the Recitation document
						});
					}
				} else {
					console.log('Document does not exist');
				}

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
				teachers: [],
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

	async function createStudent() {
		if (rfidMode == 'On') {
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
					studentRFID: myVariable
				});

				const docRef2 = doc(firestore, 'classes', studentClass);
				await updateDoc(docRef2, {
					students: arrayUnion(myVariable)
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
					studentRFID: studentRFID
				});

				const docRef2 = doc(firestore, 'classes', studentClass);
				await updateDoc(docRef2, {
					students: arrayUnion(studentRFID)
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

	function writeUserData1() {
		set(ref(database, 'rfid/' + myVariable), myVariable);
		console.error('Using Arduino RFID');
	}

	function writeUserData2() {
		set(ref(database, 'rfid/' + studentRFID), studentRFID);
		console.error('Using Normal Way');
	}

	displayClasses();
	listenForChanges();
	displayData();
</script>

<!-- Header Logo Center -->
<header class="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
	<div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">
		<button>
			<a href="/Admin-Dashboard" id="Teacher">
				<img src="back.png" class="w-8 h-8 ml-5" alt="..." />
			</a>
		</button>
		<nav class="flex flex-wrap items-center text-base lg:w-50 md:ml-auto" />
		<p
			class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0"
		>
			<img src="Mwenzi.png" class="w-30 h-24" alt="..." />
		</p>

		<div class="inline-flex items-center h-full lg:w-2/5 lg:justify-start lg:ml-0" />
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
									<label for="class" class="block mb-6 text-lg font-medium text-gray"
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
								<label for="student" class="block mb-6 text-lg font-medium text-gray"
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
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
								<input
									bind:value={studentRFID}
									type="text"
									name="rfidStudent"
									id="rfidStudent"
									placeholder={rfidMode === 'On' ? myVariable : 'Student RFID'}
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
								<input
									bind:value={studentID}
									type="text"
									name="studentid"
									id="studentid"
									placeholder="Student ID"
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
								/>
							</div>

							<div class="mb-6">
								<label for="class" class="block mb-2 text-md font-medium text-gray"
									>Select Class</label
								>

								<select
									bind:value={studentClass}
									id="classSelect1"
									class="pl-2 py-2 w-full rounded-md border placeholder-gray-300 border-gray-300 text-md"
								>
									{#each data as item1}
										<option value={item1.className}>{item1.className}</option>
									{/each}
								</select>
								<button
									on:click={createStudent}
									class="mt-3 w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
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
					class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-12 rounded-lg overflow-hidden text-center relative"
				>
					<!--CREATE TEACHER'S ACCOUNT-->
					<div class="max-w-md mx-auto">
						<div class="text-center" />
						<div class="m-7">
							<div class="mb-6">
								<label for="teacher" class="block mb-6 text-lg font-medium text-gray"
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
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
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

								<div class="mb-2 mt-4">
									<label for="teacher" class="block mb-2 text-md font-medium text-gray"
										>Add Subject</label
									>
									<input
										bind:value={teachSubject}
										type="name"
										name="fullname"
										id="teacherfullname"
										placeholder="Add Subject"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
									/>
								</div>
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
