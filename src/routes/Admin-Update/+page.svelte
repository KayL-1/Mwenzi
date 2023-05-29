<script>
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue, get, set, remove } from 'firebase/database';
	import { auth, database } from '$lib/firebase';
	import { onMount } from 'svelte';
	import { query, collection, where, getDocs, Firestore } from 'firebase/firestore';

	import {
		updateDoc,
		arrayUnion,
		doc,
		arrayRemove,
		collectionGroup,
		setDoc,
		addDoc,
		deleteDoc,
		deleteField
	} from 'firebase/firestore';
	import { FieldPath, FieldValue } from 'firebase/firestore';

	let studentNumber;
	let rfidTag;
	let studentInfo = [];
	let studentGetRFID;

	let teacherUID;

	// Create a reference to the 'users' collection
	async function studentUpdate() {
		const collectionRef = collection(firestore, 'users');
		const queryRef = query(collectionRef, where('studentID', '==', studentNumber));
		const querySnapshot = await getDocs(queryRef);
		querySnapshot.forEach((doc) => {
			const docData = doc.data();

			if (docData.hasOwnProperty('studentRFID')) {
				studentGetRFID = docData.studentRFID;
			}

			// Use the `studentRFID` variable as needed
			console.log(studentGetRFID);
		});

		const tasksRef = ref(database, 'rfid/' + studentGetRFID);

		remove(tasksRef).then(() => {
			console.log('location removed');
		});

		set(ref(database, 'rfid/' + rfidTag), rfidTag);
		studentClassUpdate();
		studentSubjectUpdate();
		studentRecitationUpdate();
		searchCopyAndCreate();
		updateStudUser();
	}

	async function updateStudUser() {
		const collectionRef = collection(firestore, 'users');
		const queryRef = query(collectionRef, where('studentID', '==', studentNumber));
		const querySnapshot = await getDocs(queryRef);

		querySnapshot.forEach((doc) => {
			updateDoc(doc.ref, { studentRFID: rfidTag });
		});
		console.log("HAHHAH")
	}

	async function studentClassUpdate() {
		const collectionRef = collection(firestore, 'classes');
		const queryRef = query(collectionRef, where('students', 'array-contains', studentGetRFID));
		const querySnapshot = await getDocs(queryRef);

		querySnapshot.forEach((document) => {
			const docRef = doc(firestore, 'classes', document.id);
			const studentsArray = document.data().students;
			const updatedStudents = studentsArray.filter((student) => student !== studentGetRFID);
			const updatedStudentsWithNewValue = [...updatedStudents, rfidTag];
			const updateData = {
				students: updatedStudentsWithNewValue
			};

			updateDoc(docRef, updateData)
				.then(() => {
					console.log('Element removed and new value inserted successfully');
				})
				.catch((error) => {
					console.error('Error removing element and inserting new value:', error);
				});
		});
	}

	async function studentSubjectUpdate() {
		const collectionRef = collection(firestore, 'Subject');
		const queryRef = query(collectionRef, where('students', 'array-contains', studentGetRFID));
		const querySnapshot = await getDocs(queryRef);

		querySnapshot.forEach((document) => {
			const docRef = doc(firestore, 'Subject', document.id);
			const studentsArray = document.data().students;
			const updatedStudents = studentsArray.filter((student) => student !== studentGetRFID);
			const updatedStudentsWithNewValue = [...updatedStudents, rfidTag];
			const updateData = {
				students: updatedStudentsWithNewValue
			};

			updateDoc(docRef, updateData)
				.then(() => {
					console.log('Element removed and new value inserted successfully');
				})
				.catch((error) => {
					console.error('Error removing element and inserting new value:', error);
				});
		});
	}

	async function studentRecitationUpdate() {
		const subjectQuerySnapshot = await getDocs(collection(firestore, 'Subject'));

		subjectQuerySnapshot.forEach(async (subjectDoc) => {
			const recitationQuerySnapshot = await getDocs(collection(subjectDoc.ref, 'Recitation'));

			recitationQuerySnapshot.forEach(async (recitationDoc) => {
				if (recitationDoc.id === studentGetRFID) {
					console.log('Found Document:', recitationDoc.data());

					// Delete the document
					const docRef = doc(collection(subjectDoc.ref, 'Recitation'), recitationDoc.id);
					await deleteDoc(docRef);
					console.log('Document deleted successfully');
				}
			});
		});
	}
	async function searchCopyAndCreate() {
		const subjectQuerySnapshot = await getDocs(collection(firestore, 'Subject'));

		for (const subjectDoc of subjectQuerySnapshot.docs) {
			const attendanceQuerySnapshot = await getDocs(collection(subjectDoc.ref, 'Attendance'));

			for (const attendanceDoc of attendanceQuerySnapshot.docs) {
				const attendanceData = attendanceDoc.data();

				const fieldsToDelete = [];

				for (const [key, value] of Object.entries(attendanceData)) {
					if (typeof value === 'object' && key.includes(studentGetRFID)) {
						console.log('Map name:', key);
						console.log('Map value:', value);

						// Create a new field map with the name from the rfidTag variable
						const insertAtt = { [rfidTag]: { ...value } };

						// Add field name to the list of fields to delete
						fieldsToDelete.push(key);

						// Update the document with the new field
						try {
							await updateDoc(attendanceDoc.ref, insertAtt);
							console.log('New field inserted successfully!');
						} catch (error) {
							console.error('Error inserting new field:', error);
						}
					}
				}

				// Delete the fields
				const deleteFieldsPromises = fieldsToDelete.map((fieldName) => {
					const fieldPath = fieldName;
					return updateDoc(attendanceDoc.ref, fieldPath, deleteField());
				});

				try {
					await Promise.all(deleteFieldsPromises);
					console.log('Fields deleted successfully!');
				} catch (error) {
					console.error('Error deleting fields:', error);
				}
			}
		}
	}
</script>

<body class="bg-gray-100 w-screen h-screen">
	<header class="w-full text-gray-700 bg-gray-50 border-t border-gray-100 shadow-sm body-font">
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
				<img src="Mwenzi.png" class="w-30 h-20 pb-2" alt="..." />
			</p>

			<div class="inline-flex items-center h-full lg:w-2/5 lg:justify-start lg:ml-0" />
		</div>
	</header>

	<section class="text-gray-600 body-font">
		<div class="container px-5 py-24 mx-auto">
			<div class="flex flex-row m-4 justify-center">
				<div class="p-4 lg:w-2/5">
					<div
						class="h-full bg-white bg-opacity-75 px-8 pt-16 pb-24 rounded-2xl shadow-2xl overflow-hidden text-center relative"
					>
						<!--ADD CLASS-->
						<div class=" max-w-md mx-auto">
							<div class="text-center" />
							<div class="m-7">
								<div class="mb-6">
									<label for="class" class="block mb-6 text-lg font-medium text-gray"
										>Update Student Data</label
									>
									<input
										bind:value={studentNumber}
										type="name"
										name="gradelevel"
										id="grade"
										placeholder="Student Number"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>

									<input
										bind:value={rfidTag}
										type="name"
										name="classname"
										id="classname"
										placeholder="RFID Tag"
										class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
								</div>
								<button
									on:click={studentUpdate}
									class=" w-full px-3 py-4 text-white font-medium rounded-2xl bg-[#2ea44f] focus:outline-none"
									>Update</button
								>
							</div>
						</div>
						<!--END-->
					</div>
				</div>
				<div class="p-4 lg:w-2/5">
					<div
						class="h-full bg-white shadow-2xl bg-opacity-75 px-8 pt-16 pb-24 rounded-2xl overflow-hidden text-center relative"
					>
						<!--REGISTER STUDENT-->
						<div class="max-w-md mx-auto">
							<div class="text-center" />
							<div class="m-7">
								<div class="mb-6">
									<label for="student" class="block mb-6 text-lg font-medium text-gray"
										>Update Teacher's Subject</label
									>
									<input
										type="name"
										name="fullname"
										id="studentfullname"
										placeholder="Teacher UID"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
									<input
										type="text"
										name="rfidStudent"
										id="rfidStudent"
										placeholder="Class"
										class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
									<input
										type="text"
										name="rfidStudent"
										id="rfidStudent"
										placeholder="Subject"
										class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
								</div>

								<button
									class="mt-3 w-full px-3 py-4 text-white font-medium rounded-2xl bg-[#2ea44f] focus:outline-none"
									>Update</button
								>
							</div>
						</div>
						<!--END-->
					</div>
				</div>

				<div class="p-4 lg:w-2/5">
					<div
						class="h-full bg-white shadow-2xl bg-opacity-75 px-8 pt-16 pb-24 rounded-2xl overflow-hidden text-center relative"
					>
						<!--REGISTER STUDENT-->
						<div class="max-w-md mx-auto">
							<div class="text-center" />
							<div class="m-7">
								<div class="mb-6">
									<label for="student" class="block mb-6 text-lg font-medium text-gray"
										>Delete Data</label
									>
									<select
										id=""
										class="mb-3 pl-2 py-2 w-full rounded-2xl border placeholder-gray-300 border-gray-300 text-md"
									/>
									<input
										type="name"
										name="fullname"
										id="studentfullname"
										placeholder="UID"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
									<input
										type="email"
										name="studentEmail"
										id="studentEmail"
										placeholder="Class"
										class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
								</div>

								<button
									class="mt-3 w-full px-3 py-4 text-white font-medium rounded-2xl bg-red-500 focus:outline-none"
									>Delete</button
								>
							</div>
						</div>
						<!--END-->
					</div>
				</div>
			</div>
		</div>
	</section>
</body>
