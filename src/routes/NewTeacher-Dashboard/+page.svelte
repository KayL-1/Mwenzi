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
	import { subjectSelected1, userId, timeFrom, timeTo } from '../../lib/userStorage';
	import { onMount } from 'svelte';
	import { current_component } from 'svelte/internal';
	import toast, { Toaster } from 'svelte-french-toast';

	let userUID = '';
	let selecTSub;
	let docsArray = [];
	let attendance = [];
	let nameArray = [];
	let recitation = [];
	let attendanceDates = [];
	let currentDatee;
	let dateSelected;

	async function getSubjectTime() {
		const docRef = doc(firestore, 'Subject', selecTSub);
		const docSnapshot = await getDoc(docRef);

		if (docSnapshot.exists()) {
			console.log(docSnapshot.data().timeIn);
			const timeIn = docSnapshot.data().timeIn || '';
			const timeOut = docSnapshot.data().timeOut || '';

			const timeText = document.getElementById('subjectTime');
			timeText.textContent = timeIn + ' - ' + timeOut;
		} else {
			console.log('No documents found in the collection.');
		}
	}

	async function noteStatus(id) {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const optionValue = document.getElementById('selectOption').value;
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const docRef = doc(collectionRef, id);
		console.log(id);

		try {
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				// The document with the specified ID exists
				const doc = docSnapshot.ref;

				// Update the "Archive" field to "true"
				await updateDoc(doc, { Status: optionValue });

				// Optionally, retrieve and return the updated data
				const updatedDocSnapshot = await getDoc(doc);
				const updatedData = updatedDocSnapshot.data();
				toast.success('Updated the status of a note');
				return updatedData;
			} else {
				// Document does not exist
				console.log('No such document!');
				return null;
			}
		} catch (error) {
			console.error('Error updating document:', error);
			throw error;
		}
	}

	async function noteCompletion(id) {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const docRef = doc(collectionRef, id);
		console.log(id);

		try {
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				// The document with the specified ID exists
				const doc = docSnapshot.ref;

				await updateDoc(doc, { Archive: 'true' });

				// Optionally, retrieve and return the updated data
				const updatedDocSnapshot = await getDoc(doc);
				const updatedData = updatedDocSnapshot.data();
				toast.success('Archived a note');
				return updatedData;
			} else {
				// Document does not exist
				console.log('No such document!');
				return null;
			}
		} catch (error) {
			console.error('Error updating document:', error);
			throw error;
		}
	}

	async function noteUndo(id) {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const docRef = doc(collectionRef, id);
		console.log(id);

		try {
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				// The document with the specified ID exists
				const doc = docSnapshot.ref;

				await updateDoc(doc, { Archive: 'false' });

				// Optionally, retrieve and return the updated data
				const updatedDocSnapshot = await getDoc(doc);
				const updatedData = updatedDocSnapshot.data();
				toast.success('Unarchived a note');
				return updatedData;
			} else {
				// Document does not exist
				console.log('No such document!');
				return null;
			}
		} catch (error) {
			console.error('Error updating document:', error);
			throw error;
		}
	}
	let noteArray = [];
	let noteArchive = [];

	async function noteDelete(id) {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const docRef = doc(collectionRef, id);

		try {
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				// The document with the specified ID exists
				const doc = docSnapshot.ref;

				// Delete the document
				await deleteDoc(doc);

				console.log('Document successfully deleted!');

				// Optionally, you can return some information about the deleted document if needed
				const deletedData = docSnapshot.data();
				toast.success('Deleted a note');
				return deletedData;
			} else {
				// Document does not exist
				console.log('No such document!');
				return null;
			}
		} catch (error) {
			console.error('Error deleting document:', error);
			throw error;
		}
	}

	async function getDates() {
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');

		getDocs(attendanceCollectionRef)
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					attendanceDates.push(doc.id);
					// You can also access the document data using doc.data()
					// const data = doc.data();
					// console.log("Document Data:", data);
				});
			})
			.catch((error) => {
				console.error('Error fetching documents:', error);
			});
		attendanceDates.sort((a, b) => {
			// Convert the dates to Date objects for comparison
			const dateA = new Date(a);
			const dateB = new Date(b);

			// Sort in descending order (latest date first)
			return dateB - dateA;
		});

		// Remove the first element from the arrayrecitation
		attendanceDates.shift();

		const dateInput = document.getElementById('dateSelector1');
		dateInput.value = currentDatee;
		// const selectElement = document.querySelector('#dateSelector1'); // Select by id

		// attendanceDates.forEach((date) => {
		// 	const optionElement = document.createElement('option');
		// 	optionElement.textContent = date;
		// 	selectElement.appendChild(optionElement);
		// });
	}

	async function classCheck() {
		const collectionRef = collection(firestore, 'Subject');
		const queryRef = query(collectionRef, where('teacherID', '==', userUID));
		const querySnapshot = await getDocs(queryRef);

		docsArray = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			data: doc.data()
		}));
	}

	async function resetRecitationPoints() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const attendanceCollectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Recitation');

		const querySnapshot = await getDocs(attendanceCollectionRef);

		querySnapshot.forEach(async (doc) => {
			const docRef = doc.ref;
			await updateDoc(docRef, {
				totalPoints: 0, // Set to the desired value for totalPoints
				day: 0, // Set to the desired value for day
				week: 0 // Set to the desired value for week
			});
		});

		toast.success('Fields reset successfully.');
	}

	async function recitationCheck() {
		const selectOption = document.getElementById('SortRec').value;
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
				const week = documentData.week || 0;
				const day = documentData.day || 0;

				const documentInfo = {
					id: documentName,
					totalPoints: totalPoints,
					week: week,
					day: day
				};

				recitation.push(documentInfo);
			});

			if (selectOption == 'Total Points') {
				recitation.sort((a, b) => b.totalPoints - a.totalPoints);

				recitation.forEach((item, index) => {
					item.ranking = index + 1;
				});

				console.log('Updated recitation array with ranking:', recitation);
				console.log('recitation array:', recitation);
			} else if (selectOption == 'Weekly') {
				recitation.sort((a, b) => b.week - a.week);

				recitation.forEach((item, index) => {
					item.ranking = index + 1;
				});
			} else if (selectOption == 'Daily') {
				recitation.sort((a, b) => b.day - a.day);

				recitation.forEach((item, index) => {
					item.ranking = index + 1;
				});
			}

			fetchNamesTwo();
		});
	}

	let presentCount = 0;
	let absentCount = 0;

	async function attendanceCheck(type) {
		presentCount = 0;
		absentCount = 0;
		const date123 = document.getElementById('dateSelector1').value;

		if (type === 1) {
			const attendanceCollectionRef = collection(
				firestore,
				'Subject',
				`${selecTSub}`,
				'Attendance'
			);
			const attendanceDocRef = doc(attendanceCollectionRef, currentDatee);

			return onSnapshot(attendanceDocRef, (attendanceDocSnapshot) => {
				attendance = Object.entries(attendanceDocSnapshot.data()).map(([key, value]) => ({
					id: key,
					...value
				}));

				console.log(attendance);
				for (const record of attendance) {
					if (record.status === 'Present') {
						presentCount++;
					} else if (record.status === 'Absent') {
						absentCount++;
					}
				}

				console.log(presentCount, absentCount);
				document.getElementById('present1').textContent = presentCount;
				document.getElementById('absent1').textContent = absentCount;
				fetchTime();
				fetchNames();
			});
			attendance = attendance;
		}

		if (type === 2) {
			const attendanceCollectionRef = collection(
				firestore,
				'Subject',
				`${selecTSub}`,
				'Attendance'
			);
			const attendanceDocRef = doc(attendanceCollectionRef, date123);
			return onSnapshot(attendanceDocRef, (attendanceDocSnapshot) => {
				attendance = Object.entries(attendanceDocSnapshot.data()).map(([key, value]) => ({
					id: key,
					...value
				}));

				console.log(attendance);
				for (const record of attendance) {
					if (record.status === 'Present') {
						presentCount++;
					} else if (record.status === 'Absent') {
						absentCount++;
					}
				}

				console.log(presentCount, absentCount);
				document.getElementById('present1').textContent = presentCount;
				document.getElementById('absent1').textContent = absentCount;
				fetchTime();
				fetchNames();
			});

			attendance = attendance;
		}
	}

	// Iterate over each object
	async function fetchNamesTwo() {
		const refer = collection(firestore, 'users');
		const ids = recitation.map((item) => item.id); // Extract all IDs from the recitation array

		// Query the Firestore documents by IDs
		const snapshot = await getDocs(refer, where('studentRFID', 'in', ids));

		snapshot.forEach((doc) => {
			const id = doc.data().studentRFID;
			const name = doc.data().firstName + ' ' + doc.data().lastName;

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
			const name = doc.data().firstName + ' ' + doc.data().lastName;

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

	async function changeDocumentID(action, documentID) {
		const recitationCollectionReflllty = collection(
			firestore,
			'Subject',
			`${selecTSub}`,
			'Recitation'
		);

		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}

		if (action === 'minus') {
			const recitationDocRef = doc(recitationCollectionReflllty, documentID);

			// Retrieve the document data
			const docSnapshot = await getDoc(recitationDocRef);
			if (docSnapshot.exists()) {
				const docData = docSnapshot.data();

				// Decrease the value of the totalPoint field by 1
				const newTotalPoint = docData.totalPoints - 1;
				const WeekTotalPoint = docData.week - 1;
				const DayTotalPoint = docData.day - 1;

				// Update the document with the new value
				await updateDoc(recitationDocRef, {
					totalPoints: newTotalPoint,
					week: WeekTotalPoint,
					day: DayTotalPoint
				});
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
				const WeekTotalPoint = docData.week + 1;
				const DayTotalPoint = docData.day + 1;
				// Update the document with the new value
				await updateDoc(recitationDocRefe, {
					totalPoints: newTotalPoint,
					week: WeekTotalPoint,
					day: DayTotalPoint
				});
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
	const calledNames = [];
	let recitationType;
	async function getRandomName() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		if (isRolling) return; // Prevent multiple clicks while rolling
		const collectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		const queryRef = doc(collectionRef, currentDatee);

		try {
			const querySnapshot = await getDoc(queryRef);
			if (querySnapshot.exists()) {
				const data = querySnapshot.data();

				// Assuming 'data' is an object with map fields, iterate through the fields
				const presentNames = [];

				if (recitationType === 'Present Only') {
					for (const field in data) {
						if (data[field].status === 'Present' && !calledNames.includes(field)) {
							// Do something with the map field where status is "Present"
							console.log(`Field ${field} is Present`);
							presentNames.push(field);
						}
					}
				}

				if (recitationType === 'All Students') {
					for (const field in data) {
						presentNames.push(field);
					}
				}

				if (presentNames.length > 0) {
					const randomIndex = Math.floor(Math.random() * presentNames.length);
					const randomStudentId = presentNames[randomIndex];
					const randomStudentName = await getNameRecitation(randomStudentId);

					// Update the UI with the random student name
					updateRandomizerName(randomStudentName);

					// Add the called name to the list
					calledNames.push(randomStudentId);
				} else {
					if (calledNames.length > 0) {
						updateRandomizerName('All present students have been called');
					} else {
						updateRandomizerName('There are no currently Present students');
					}
				}
			} else {
				console.log('Document does not exist');
			}
		} catch (error) {
			console.error('Error retrieving document:', error);
		}
	}

	function resetRecitation() {
		// Reset the list of called names
		calledNames.length = 0;

		// You can also update the UI to indicate that the list has been reset
		updateRandomizerName('List of called students has been reset');
	}

	var isEditing = false;

	function toggleEditButton() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		isEditing = !isEditing; // Toggle the editing state
		var saveButton = document.getElementById('saveButton1'); // You need to define 'saveButton' if it's used elsewhere.

		// Loop through the selected elements and enable/disable them based on the editing state
		var elementsToEnable = [
			'day1select',
			'day1input',
			'day1checkbox',
			'day2select',
			'day2input',
			'day2checkbox',
			'day3select',
			'day3input',
			'day3checkbox',
			'day4select',
			'day4input',
			'day4checkbox',
			'day5select',
			'day5input',
			'day5checkbox'
			// Add IDs for other days here as needed
		];

		for (var i = 0; i < elementsToEnable.length; i++) {
			var element = document.getElementById(elementsToEnable[i]);
			if (element) {
				if (isEditing) {
					element.removeAttribute('disabled');
					element.removeAttribute('readonly');
				} else {
					element.setAttribute('disabled', 'disabled');
					element.setAttribute('readonly', 'readonly');
				}
			}
		}

		// Add or remove the "pointer-events-none" class based on the editing state
		if (!isEditing) {
			saveButton.classList.add('pointer-events-none');
		} else {
			saveButton.classList.remove('pointer-events-none');
		}

		// Update the button text based on the editing state
		var editButton = document.getElementById('editButton');
		editButton.textContent = isEditing ? 'Done' : 'Edit';
	}

	function updateRandomizerName(name) {
		const randomizerNameElement = document.getElementById('randomizerName');
		if (randomizerNameElement) {
			randomizerNameElement.textContent = name;
		}
	}

	async function getNameRecitation(id) {
		try {
			const queryRef1 = collection(firestore, 'users');
			const queryRef2 = query(queryRef1, where('studentRFID', '==', id));
			const querySnapshot = await getDocs(queryRef2);

			if (querySnapshot.docs.length > 0) {
				const doc = querySnapshot.docs[0];
				return doc.data().Name;
			} else {
				return 'Student not found';
			}
		} catch (error) {
			console.error('Error retrieving student name:', error);
			throw error; // Re-throw the error to handle it in the calling function
		}
	}
	let groupType;
	async function groupStudents() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		if (groupType === 'Select') {
			toast.error('Please select a students');
			return;
		}

		const grpnum = document.getElementById('groupSize').value;
		if (grpnum === 'Number of Members') {
			toast.error('Please select a number of students');
			return;
		}
		// Create a reference to the specific document within the 'Subject' collection

		if (groupType === 'Present Only') {
			try {
				const collectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
				const queryRef = doc(collectionRef, currentDatee);
				const querySnapshot123 = await getDoc(queryRef);
				const selectedGroupSize = parseInt(document.getElementById('groupSize').value);
				if (querySnapshot123.exists()) {
					const data = querySnapshot123.data();
					const studentIdsx = [];
					console.log('yeahS');
					if (recitationType === 'Present Only') {
						for (const field in data) {
							if (data[field].status === 'Present') {
								// Do something with the map field where status is "Present"
								console.log(`Field ${field} is Present`);
								studentIdsx.push(field);
							}
						}

						if (!isNaN(selectedGroupSize) && selectedGroupSize > 0) {
							const studentNames = await fetchStudentNames(studentIdsx);

							const groupedStudents = [];

							// Iterate through the student names and group them
							for (let i = 0; i < studentNames.length; i += selectedGroupSize) {
								groupedStudents.push(studentNames.slice(i, i + selectedGroupSize));
							}

							displayGroupedStudents(groupedStudents);
						} else {
							console.log('Please select a valid group size.');
						}
					}
				}
			} catch (error) {
				console.error('Error fetching document:', error);
			}
		}

		if (groupType === 'All Students') {
			try {
				const docRef = doc(firestore, 'Subject', selecTSub);
				const docSnapshot = await getDoc(docRef);

				if (docSnapshot.exists()) {
					// Assuming 'students' is the name of the field containing the student array
					const studentIDs = docSnapshot.data().students;

					if (studentIDs) {
						// Get the selected group size from the select element with the 'groupSize' id
						const selectedGroupSize = parseInt(document.getElementById('groupSize').value);

						if (!isNaN(selectedGroupSize) && selectedGroupSize > 0) {
							// Fetch student names based on their IDs
							const studentNames = await fetchStudentNames(studentIDs);
							// Create an array to store the grouped students
							const groupedStudents = [];

							// Iterate through the student names and group them
							for (let i = 0; i < studentNames.length; i += selectedGroupSize) {
								groupedStudents.push(studentNames.slice(i, i + selectedGroupSize));
							}
							console.log(groupedStudents);
							// Display the grouped students in the HTML table
							displayGroupedStudents(groupedStudents);
						} else {
							console.log('Please select a valid group size.');
						}
					} else {
						console.log("No 'students' field found in the document.");
					}
				} else {
					console.log('Document does not exist.');
				}
			} catch (error) {
				console.error('Error fetching document:', error);
			}
		}
	}

	// Function to fetch student names based on their IDs
	async function fetchStudentNames(studentIDs) {
		const studentNames = [];

		for (const studentID of studentIDs) {
			try {
				const queryRef = collection(firestore, 'users');
				const querySnapshot = await getDocs(query(queryRef, where('studentRFID', '==', studentID)));

				if (!querySnapshot.empty) {
					const studentData = querySnapshot.docs[0].data();
					if (studentData && studentData.Name) {
						// Use "Name" here
						studentNames.push(studentData.Name); // Use "Name" here
					} else {
						console.log('No valid Name found for student ID:', studentID);
					}
				} else {
					console.log('No document found for student ID:', studentID);
				}
			} catch (error) {
				console.error('Error fetching student data:', error);
			}
		}

		return studentNames;
	}

	function displayGroupedStudents(groupedStudents) {
		// Get a reference to the table body
		const tableBody = document.getElementById('groupTableBody');

		// Clear any existing rows in the table body
		tableBody.innerHTML = '';

		// Iterate through the grouped students and create rows for each group
		groupedStudents.forEach((group, index) => {
			// Create a new table row
			const row = document.createElement('tr');

			// Add inline style to add spacing between rows (adjust the margin value as needed)
			row.style.marginBottom = '20px'; // You can adjust the spacing as needed

			// Create a table cell for the group number
			const groupNumberCell = document.createElement('th');
			groupNumberCell.classList.add('text-center', 'border-b', 'py-2');
			groupNumberCell.setAttribute('scope', 'row');
			groupNumberCell.textContent = index + 1;

			// Create a table cell for the group members
			const groupMembersCell = document.createElement('td');
			groupMembersCell.classList.add('text-center', 'border-b', 'py-1');

			// Iterate through the group members and add them to the cell
			group.forEach((member) => {
				const memberElement = document.createElement('div');
				memberElement.textContent = member;
				groupMembersCell.appendChild(memberElement);
			});

			// Add the cells to the row
			row.appendChild(groupNumberCell);
			row.appendChild(groupMembersCell);

			// Add the row to the table body
			tableBody.appendChild(row);
		});
	}

	let title = ''; // Declare a variable to hold the input value

	function addNote() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		if (title.trim() !== '') {
			const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');

			addDoc(collectionRef, {
				Title: title,
				Date: currentDatee,
				Status: 'Only Me',
				Archive: 'false'
			})
				.then((docRef) => {
					console.log('Document written with ID: ', docRef.id);
				})
				.catch((error) => {
					console.error('Error writing document: ', error);
				});

			title = '';
		} else {
			toast.error('Please enter a title before adding notes.');
		}
	}

	function fetchAndDisplayNotes(type) {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(collectionRef, where('Archive', '==', 'false'));

		const unsubscribe = onSnapshot(queryRef2, (snapshot) => {
			// Clear the existing array when there's an update
			noteArray = [];

			// Iterate over each document in the snapshot
			snapshot.forEach((doc) => {
				// Get the data of each document
				const noteData = doc.data();
				noteData.id = doc.id;
				// Push the data into the array
				noteArray.push(noteData);
			});

			if (type === 'Recent') {
				noteArray = noteArray.sort((a, b) => {
					console.log('Sorting Recent:', new Date(b.Date), new Date(a.Date));
					return new Date(b.Date) - new Date(a.Date);
				});
			}
			if (type === 'Old') {
				noteArray = noteArray.sort((a, b) => {
					console.log('Sorting Old:', new Date(a.Date), new Date(b.Date));
					return new Date(a.Date) - new Date(b.Date);
				});
			}
			// Now, noteArray contains the updated data of all documents in the query
			console.log(noteArray);
		});
	}

	function fetchAndDisplayNotes2(type) {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(collectionRef, where('Archive', '==', 'true'));

		const unsubscribe = onSnapshot(queryRef2, (snapshot) => {
			// Clear the existing array when there's an update
			noteArchive = [];
			// Iterate over each document in the snapshot
			snapshot.forEach((doc) => {
				// Get the data of each document
				const noteData = doc.data();
				noteData.id = doc.id;
				// Push the data into the array
				noteArchive.push(noteData);
			});

			if (type === 'Recent') {
				noteArchive = noteArchive.sort((a, b) => {
					console.log('Sorting Recent:', new Date(b.Date), new Date(a.Date));
					return new Date(b.Date) - new Date(a.Date);
				});
			}
			if (type === 'Old') {
				noteArchive = noteArchive.sort((a, b) => {
					console.log('Sorting Old:', new Date(a.Date), new Date(b.Date));
					return new Date(a.Date) - new Date(b.Date);
				});
			}
			// Now, noteArray contains the updated data of all documents in the query
			console.log(noteArchive);
		});
	}

	// Call the function to fetch and display notes
	async function change() {
		console.log(selecTSub);
		classCheck();
		await getDates();
		attendanceCheck(1);
		recitationCheck();
		fetchAndDisplayNotes('Recent');
		fetchAndDisplayNotes2('Recent');
		updateLessonText();
		sortRecitation();
		getSubjectTime();
	}

	async function getuserName(id) {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('UID', '==', id));
		const querySnapshot = await getDocs(queryRef2);
		if (querySnapshot.docs.length > 0) {
			const doc = querySnapshot.docs[0];
			console.log(doc.data().Name);
			document.getElementById('userName').textContent =
				doc.data().firstName + ' ' + doc.data().lastName;
		} else {
			return 'Teacher not found';
		}
	}
	let day1x = '';
	let day2x = '';
	let day3x = '';
	let day4x = '';
	let day5x = '';

	let day1status = '';
	let day2status = '';
	let day3status = '';
	let day4status = '';
	let day5status = '';

	let day1status2 = '';
	let day2status2 = '';
	let day3status2 = '';
	let day4status2 = '';
	let day5status2 = '';

	let weekStatus = '';

	async function createWeeklyLesson() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Lessons');
		const week1DocRef = doc(collectionRef, weekStatus); // Create a document reference with 'week1' as the ID
		const data1 = {
			day1: {
				Link: day1x,
				Status: day1status,
				Share: day1status2
			},
			day2: {
				Link: day2x,
				Status: day2status,
				Share: day2status2
			},
			day3: {
				Link: day3x,
				Status: day3status,
				Share: day3status2
			},
			day4: {
				Link: day4x,
				Status: day4status,
				Share: day4status2
			},
			day5: {
				Link: day5x,
				Status: day5status,
				Share: day5status2
			}
		};

		try {
			await setDoc(week1DocRef, data1);
			console.log('Document written with ID: week1');
		} catch (error) {
			console.error('Error writing document: ', error);
		}
	}

	async function resetWeeklyLesson() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Lessons');
		const week1DocRef = doc(collectionRef, weekStatus); // Create a document reference with 'week1' as the ID
		const data1 = {
			day1: {
				Link: '',
				Status: '',
				Share: ''
			},
			day2: {
				Link: '',
				Status: '',
				Share: ''
			},
			day3: {
				Link: '',
				Status: '',
				Share: ''
			},
			day4: {
				Link: '',
				Status: '',
				Share: ''
			},
			day5: {
				Link: '',
				Status: '',
				Share: ''
			}
		};

		try {
			await setDoc(week1DocRef, data1);
			console.log('Document written with ID: week1');
		} catch (error) {
			console.error('Error writing document: ', error);
		}
	}

	async function redirectToURL() {}

	async function updateLessonText() {
		const weekSelector = document.getElementById('weekSelector');
		const selectedValue = weekSelector.value;
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Lessons');
		const week1DocRef = doc(collectionRef, selectedValue); // Use the selectedValue
		try {
			const docSnapshot = await getDoc(week1DocRef);

			if (docSnapshot.exists()) {
				const queriedData = docSnapshot.data();

				for (let day = 1; day <= 5; day++) {
					const inputElement = document.getElementById(`day${day}input`);
					const selectElement = document.getElementById(`day${day}Select`);
					const checkboxElement = document.getElementById(`day${day}checkbox`);

					const dayData = queriedData[`day${day}`];
					if (dayData) {
						if (dayData.Link !== null) {
							inputElement.value = dayData.Link || '';
						}

						// Update the select value
						if (dayData.Share !== null) {
							selectElement.value = dayData.Share || '';
						}

						if (dayData.Status !== null) {
							checkboxElement.checked = dayData.Status === 'finish';
						}
					}
				}
			} else {
				console.log('Document does not exist.');
				for (let day = 1; day <= 5; day++) {
					const inputElement = document.getElementById(`day${day}input`);
					const selectElement = document.getElementById(`day${day}Select`);
					const checkboxElement = document.getElementById(`day${day}checkbox`);
					inputElement.value = '';

					selectElement.value = '';
					checkboxElement.checked = '';
				}
			}
		} catch (error) {
			console.error('Error getting document:', error);
		}
	}

	let studentIDxx;

	function redirectToLink(id) {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		const inputElement = document.getElementById(id);
		const inputValue = inputElement.value.trim();
		const link = 'https:' + inputValue;
		if (inputValue) {
			window.open(link, '_blank');
		}
	}

	async function studentInformation(id) {
		studentIDxx = id;
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('studentRFID', '==', id));
		const querySnapshot = await getDocs(queryRef2);
		const namex = document.getElementById('studentNamex');
		const idx = document.getElementById('studentIDx');
		const addressx = document.getElementById('studentAddressx');
		const parent = document.getElementById('studentParentx');
		const contact = document.getElementById('studentContactx');
		const medical = document.getElementById('studentMedicalx');

		querySnapshot.forEach((doc) => {
			// Access the data within each document
			const data = doc.data();
			namex.textContent = data.Name || '';

			// Update "studentIDx" element
			idx.textContent = data.studentID || '';

			// Update "studentParentx" element
			parent.value = data.parentName || '';

			// Update "studentContactx" element
			contact.value = data.contactNum || '';

			// Update "addressx" element
			addressx.value = data.address || '';

			// Update "medical" element
			medical.value = data.medicalCondition || '';
		});
	}

	function undisabledInputs() {
		const addressx = document.getElementById('studentAddressx');
		const parent = document.getElementById('studentParentx');
		const contact = document.getElementById('studentContactx');
		const medical = document.getElementById('studentMedicalx');
		const savebutton = document.getElementById('saveButtonx1');

		if (addressx.disabled) {
			addressx.removeAttribute('disabled');
			parent.removeAttribute('disabled');
			contact.removeAttribute('disabled');
			medical.removeAttribute('disabled');
			savebutton.classList.remove('pointer-events-none');
		} else {
			addressx.setAttribute('disabled', 'disabled');
			parent.setAttribute('disabled', 'disabled');
			contact.setAttribute('disabled', 'disabled');
			medical.setAttribute('disabled', 'disabled');
			savebutton.classList.add('pointer-events-none');
		}
	}

	async function saveStudentInformation() {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('studentRFID', '==', studentIDxx));

		const addressx = document.getElementById('studentAddressx').value;
		const parent = document.getElementById('studentParentx').value;
		const contact = document.getElementById('studentContactx').value;
		const medical = document.getElementById('studentMedicalx').value;

		try {
			const querySnapshot = await getDocs(queryRef2);

			querySnapshot.forEach(async (doc) => {
				// Assuming docRef is the reference to the document you want to update
				await updateDoc(doc.ref, {
					parentName: parent,
					contactNum: contact,
					address: addressx,
					medicalCondition: medical
				});
			});
		} catch (error) {
			console.error('Error updating documents:', error);
		}
	}

	async function sortRecitation() {
		const selectOption = document.getElementById('SortRec').value;
		const totalElements = document.getElementsByClassName('pointsDisplay1');
		const weekElements = document.getElementsByClassName('pointsDisplay2');
		const dayElements = document.getElementsByClassName('pointsDisplay3');

		if (selectOption === 'Total Points') {
			for (let i = 0; i < totalElements.length; i++) {
				totalElements[i].hidden = false;
			}
			for (let i = 0; i < weekElements.length; i++) {
				weekElements[i].hidden = true;
			}
			for (let i = 0; i < dayElements.length; i++) {
				dayElements[i].hidden = true;
			}

			recitation.sort((a, b) => b.totalPoints - a.totalPoints);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});
		}

		if (selectOption === 'Weekly') {
			for (let i = 0; i < totalElements.length; i++) {
				totalElements[i].hidden = true;
			}
			for (let i = 0; i < weekElements.length; i++) {
				weekElements[i].hidden = true;
			}
			for (let i = 0; i < dayElements.length; i++) {
				dayElements[i].hidden = false;
			}

			recitation.sort((a, b) => b.week - a.week);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});
		}

		if (selectOption === 'Daily') {
			for (let i = 0; i < totalElements.length; i++) {
				totalElements[i].hidden = true;
			}
			for (let i = 0; i < weekElements.length; i++) {
				weekElements[i].hidden = false;
			}
			for (let i = 0; i < dayElements.length; i++) {
				dayElements[i].hidden = true;
			}

			recitation.sort((a, b) => b.day - a.day);

			recitation.forEach((item, index) => {
				item.ranking = index + 1;
			});
		}
		recitationCheck();
	}

	let timeFrom1;
	let timeTo1;

	async function newPage() {
		if (selecTSub === 'Select Class') {
			toast.error('Please select a class');
			return;
		}
		if (timeFrom1 === null || timeFrom1 === undefined) {
			toast.error('Please select a date');
			return;
		}

		if (timeTo1 === null || timeTo1 === undefined) {
			toast.error('Please select a date');
			return;
		}

		const subjectSelected1 = selecTSub; // Assuming selecTSub is a value you want to store
		localStorage.setItem('subjectSelected1', subjectSelected1);
		localStorage.setItem('timeTo', timeTo1);
		localStorage.setItem('timeFrom', timeFrom1);
		const testing = localStorage.getItem('subjectSelected1');
		console.log(testing);
		location.window;
		window.location.href = '/Export-Page';
	}

	onMount(() => {
		const unsubscribe = userId.subscribe((value) => {
			// Use the value of userId here
			userUID = localStorage.getItem('userId');
			console.log(userUID);
			getuserName(userUID);
			classCheck();
			attendanceCheck(1);
			return () => {
				unsubscribe();
			};
		});

		subjectSelected1.subscribe((val) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.subjectSelected1 = val;
			}
		});

		timeFrom.subscribe((val) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.timeFrom = val;
			}
		});

		timeTo.subscribe((val) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.timeTo = val;
			}
		});

		// newPage();
	});
	getDate();
</script>

<body class=" bg-gray-50 h-screen">
	<header class="text-gray-600 body-font">
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class="mx-12 flex flex-wrap pt-5 flex-col md:flex-row items-center">
			<div class="w-full flex flex-row justify-between">
				<nav class="flex items-center text-base">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img src="Mwenzi5.png" class="h-14 pb-2" alt="..." />
				</nav>
				<div class="flex flex-row">
					<p class="font-medium text-md my-auto mr-3" id="userName" />
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
			</div>

			<div class="flex justify-between w-full">
				<!--ATTENDANCE SUMMARY-->
				<div class="flex flex-row">
					<div
						class="container h-10 my-6 mx-1 border border-gray-200 rounded-3xl w-40 flex justify-center items-center"
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
						class="container h-10 w-64 my-6 mx-1 px-2 border border-gray-200 rounded-3xl flex justify-center items-center"
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
						<a id="subjectTime" class="font-semibold text-sm"> 8:00 AM - 10:00 AM</a>
					</div>

					<div
						class="container h-10 my-6 mx-2 pr-3 pl-1 border border-gray-200 rounded-3xl w-auto flex flex-row justify-center items-center"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="font-medium text-sm p-2">Total Present: </a>
						<a id="present1" class="font-semibold text-sm text-green-500"> 0</a>
						<a class="font-medium text-sm p-2">Total Absent: </a>
						<a id="absent1" class="font-semibold text-sm text-red-500">0</a>
					</div>
				</div>
				<!--END SUMMARY ATTENDANCE -->

				<!--RFID STATUS, DATE, SUBJECT TIME -->
				<div class="flex flex-row w-64">
					<a
						class="flex order-first title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center md:mb-0"
					>
						<select
							bind:value={selecTSub}
							on:change={change}
							class="select select-bordered focus:border-none border-gray-200 w-64 h-5 rounded-3xl shadow-sm"
						>
							<option disabled selected hidden class="rounded-3xl">Select Class</option>
							{#each docsArray as item1}
								<option class="rounded-xl" value={item1.id}>{item1.id}</option>
							{/each}
						</select>
					</a>
				</div>
				<!--END RFID STATUS, DATE, SUBJECT TIME -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card h-3/4 mx-10">
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
					<div class="modal-box relative h-64">
						<label for="AttendanceSettings" class="btn btn-sm btn-circle absolute right-2 top-2"
							>✕</label
						>
						<h3 class="text-xl font-bold text-center">Export Attendance</h3>

						<p class="mt-7 mb-2 font-medium">Export Record:</p>
						<div class="w-full mt-3 justify-center flex flex-row">
							<input
								bind:value={timeFrom1}
								type="date"
								class="mx-2 rounded-xl border border-gray-400 px-2"
							/>
							<p class="font-medium">to</p>
							<input
								bind:value={timeTo1}
								type="date"
								class="mx-2 rounded-xl border border-gray-400 px-2"
							/>
							<!-- <select
								class="w-48 border-gray-200 h-6 font-medium text-sm mx-2 text-center border border-gray focus:none rounded-3xl shadow-sm"
							>
								<option class="rounded-3xl">Today</option>
								<option class="rounded-3xl">September 14, 2023</option>
							</select>
							
							<select
								class="w-48 border-gray-200 h-6 font-medium mx-2 text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
							>
								<option class="rounded-3xl">Today</option>
								<option class="rounded-3xl">September 14, 2023</option>
							</select> -->
						</div>
						<button class="btn btn-success mt-4 rounded-3xl text-white w-48" on:click={newPage}
							>Export Selected</button
						>
					</div>
				</div>
			</div>
			<!--END EXPORT ATT-->

			<input
				id="dateSelector1"
				type="date"
				class="w-56 h-6 font-medium text-sm text-center mx-2 rounded-xl border border-gray-400 px-2 focus:outline-1"
				value="{current_component};"
				on:change={() => attendanceCheck(2)}
			/>
			<!-- <select
				id="dateSelector1"
				bind:value={dateSelected}
				on:change={() => attendanceCheck(2)}
				class="justify-end border-gray-200 w-56 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
			>
				<option class="rounded-xl" value={currentDatee} selected>Today</option>
			</select> -->

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-5/6">
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
									<!--LABEL FOR MEDIC MODAL -->
									<label for="MedicalRecords" class="cursor-pointer">
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span on:click={() => studentInformation(data.id)}>{data.name}</span>
									</label>
									<!--END LABEL FOR MEDIC MODAL -->
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

							<!--MEDIC MODAL-->

							<!--END MEDIC MODAL-->
						{/each}

						<input type="checkbox" id="MedicalRecords" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-2/4 max-w-xl">
								<label for="MedicalRecords" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>

								<div class="text-xl font-bold text-center w-full justify-center flex flex-row">
									<p>Student Information</p>
									<span />
								</div>

								<div
									class="w-full flex flex-col mx-auto px-4 pb-4 outline rounded-3xl outline-gray-50 mt-3"
								>
									<div class="mx-auto w-full">
										<div class="flex flex-row justify-between mt-5 mx-2" />
										<div class="divider mt-0" />
										<h1 class="text-left my-2 mx-5">
											Parent/Guardian Name:
											<input
												id="studentParentx"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Yohan Dela Cuesta"
												type="text"
												disabled
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Contact Number:
											<input
												id="studentContactx"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="09355349012"
												type="text"
												disabled
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Address:
											<input
												id="studentAddressx"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Address"
												type="text"
												disabled
											/>
										</h1>

										<h1 class="text-left my-2 mx-5">
											Medical Condition/s:
											<input
												id="studentMedicalx"
												class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
												placeholder="Asthma"
												type="text"
												disabled
											/>
										</h1>
									</div>
								</div>

								<div class="justify-end flex mt-4">
									<button
										id="editButtonx1"
										class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
										on:click={undisabledInputs}
									>
										Edit</button
									>
									<button
										id="saveButtonx1"
										class="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 ml-1 py-1 rounded-3xl pointer-events-none"
										on:click={() => saveStudentInformation()}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</tbody>
				</table>
			</div>
		</div>

		<!--2ND COL-->
		<div class="flex flex-col w-full h-full">
			<!--POINTS AND NOTES DIV-->
			<div class="flex flex-row h-4/5">
				<!--POINTS-->
				<div class="w-1/2 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
					<div class="flex flex-row justify-between mt-2">
						<div class="flex flex-row mt-2">
							<img src="leaderboard.png" class="h-8 pl-6 pr-1 mt-1" alt="..." />
							<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Points</h1>
						</div>

						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<label
							for=""
							class="mr-8 mt-4 rounded-3xl cursor-pointer"
							on:click={resetRecitationPoints}
						>
							<svg
								fill="#3d3d3d"
								viewBox="0 0 1920 1920"
								xmlns="http://www.w3.org/2000/svg"
								transform="matrix(1, 0, 0, -1, 0, 0)"
								width="19"
								height="19"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<path
										d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0"
										fill-rule="evenodd"
										class="fill-current text-gray-600 hover:text-yellow-500"
									/>
								</g></svg
							>
						</label>
					</div>
					<select
						id="SortRec"
						class="mt-2 border-gray-200 w-56 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
						on:change={sortRecitation}
					>
						<option selected class="rounded-3xl">Total Points</option>
						<option class="rounded-xl">Daily</option>
						<option class="rounded-xl">Weekly</option>
					</select>
					<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-4 max-h-96">
						<table class="w-full text-sm text-gray-500 dark:text-gray-400">
							<thead
								class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
							>
								<tr>
									<th scope="col" class="px-6 py-4 text-left"> Rank </th>
									<th scope="col" class="px-6 py-4 text-left"> Name </th>
									<th scope="col" class="px-6 py-4 text-left"> Points </th>
									<th scope="col" class=" py-4 text-left"> Update Points </th>
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
										<td
											class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap text-left"
										>
											{data.name}
										</td>
										<td
											id="pointsDisplay1"
											class="pointsDisplay1 text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"
										>
											{data.totalPoints}
										</td>
										<td
											hidden
											id="pointsDisplay2"
											class="pointsDisplay2 text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"
										>
											{data.day}
										</td>
										<td
											hidden
											id="pointsDisplay3"
											class="pointsDisplay3 text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap"
										>
											{data.week}
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
				<div class="w-1/2 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
					<div class="flex flex-row justify-between mt-2">
						<div class="flex flex-row">
							<img src="todo.png" class="h-7 pl-6 mt-2" alt="..." />
							<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Notes</h1>
						</div>
						<!--NOTE ARCHIVES -->
						<label for="NotesArchives" class="mr-8 mt-2 rounded-3xl cursor-pointer">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier" ble-fi
									><path
										d="M8.707 6.707a1 1 0 0 0-1.414-1.414L4 8.586 2.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4ZM12 7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12ZM8.707 13.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L4 16.586l3.293-3.293a1 1 0 0 1 1.414 0ZM12 15a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12Z"
										fill="#currentColor"
										class="fill-current text-gray-600 hover:text-blue-500"
									/></g
								></svg
							>
						</label>

						<input type="checkbox" id="NotesArchives" class="modal-toggle" />
						<div class="modal">
							<div class="modal-box relative h-4/6 max-w-3xl text-left">
								<label for="NotesArchives" class="btn btn-sm btn-circle absolute right-2 top-2"
									>✕</label
								>
								<h3 class="text-xl font-bold text-center">Note Archives</h3>

								<div
									class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-4/5 max-h-4/5"
								>
									<table
										class="text-sm text-gray-500 dark:text-gray-400 w-full rounded-lg shadow-sm"
									>
										<thead
											class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
										>
											<tr>
												<th scope="col" class="pr-5 pl-3 py-4 text-left">Note</th>
												<th scope="col" class="px-6 py-4 text-center">Status</th>
												<th scope="col" class="px-6 py-4 text-right">Action</th>
											</tr>
										</thead>

										<tbody>
											{#each noteArchive as item1}
												<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
													<td class="px-2 pb-1 pt-1 w-36">
														<h1 class="font-medium text-left text-sm">
															<span class="text-xs font-normal">{item1.Date}</span><br />
															{item1.Title}
														</h1>
													</td>
													<td class="text-center">
														<select
															on:change={(event) => {
																noteStatus(item1.id);
															}}
															id="selectOption"
															class="update-status-select border-gray-200 w-28 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
														>
															{#if item1.Status == 'Only Me'}
																<option selected value="Only Me">Only Me</option>
																<option value="Current Class">Share to Class</option>
															{/if}
															{#if item1.Status == 'Current Class'}
																<option value="Only Me">Only Me</option>
																<option selected value="Current Class">Current Class</option>
															{/if}
														</select>
													</td>
													<td class="text-center">
														<button
															class="px-3 bg-yellow-500 border-transparent hover:bg-yellow-600 hover:border-none text-sm text-white rounded-3xl"
															on:click={(event) => {
																noteUndo(item1.id);
															}}
														>
															Undo
														</button>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="flex flex-row items-center mt-2 justify-center">
						<input
							class="pl-4 border border-r-0 rounded-l-3xl focus:ring-0 text-sm block bg-white w-64 h-7 border-slate-300 shadow-sm focus:outline-none"
							placeholder="Add Notes"
							type="text"
							name="search12"
							bind:value={title}
						/>
						<button
							id="addButton"
							class="add-button w-12 h-7 border border-slate-300 rounded-r-3xl bg-blue-500 hover:bg-blue-700 border-none transform transition-transform focus:scale-100 active:scale-95"
							on:click={addNote}
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
					<table class="text-sm text-gray-500 dark:text-gray-400 w-full rounded-lg shadow-sm">
						<thead
							class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
						>
							<tr>
								<th scope="col" class="pr-5 pl-3 py-4 text-left">Note</th>
								<th scope="col" class="px-6 py-4 text-center">Status</th>
								<th scope="col" class="px-6 py-4 text-right">Action</th>
							</tr>
						</thead>

						<tbody>
							{#each noteArray as item1}
								<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
									<td class="px-2 pb-1 pt-1 w-36">
										<h1 class="font-medium text-left text-sm">
											<span class="text-xs font-normal">{item1.Date}</span><br />
											{item1.Title}
										</h1>
									</td>
									<td class="text-right">
										<select
											on:change={(event) => {
												noteStatus(item1.id);
											}}
											id="selectOption"
											class="update-status-select border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
										>
											{#if item1.Status == 'Only Me'}
												<option selected value="Only Me">Only Me</option>
												<option value="Current Class">Share to Class</option>
											{/if}
											{#if item1.Status == 'Current Class'}
												<option value="Only Me">Only Me</option>
												<option selected value="Current Class">Current Class</option>
											{/if}
										</select>
									</td>
									<td>
										<button
											class="update-status-button pl-1"
											on:click={(event) => {
												noteCompletion(item1.id);
											}}
										>
											<img
												src="done.png"
												class="h-7 transform transition-transform focus:scale-100 active:scale-90"
												alt="..."
											/>
										</button>
										<button
											class="delete-button"
											on:click={(event) => {
												noteDelete(item1.id);
											}}
										>
											<img
												src="delete.png"
												class="h-7 transform transition-transform focus:scale-100 active:scale-90"
												alt="..."
											/>
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!--ACTIONS DIV-->
			<div class="flex flex-row h-48 mt-2">
				<!--RANDOMIZER-->
				<div class="w-2/5 bg-red-600 bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
					<div class="flex flex-row mt-2">
						<img src="randomizer.png" class="h-7 mt-1 pl-6" alt="..." />
						<h1 class="pl-1 pt-2 font-medium text-md text-white">Randomizer</h1>
					</div>
					<!--RAN MODAL-->
					<label
						for="randomizer"
						class="my-5 btn h-20 w-56 bg-white text-red-600 border-transparent hover:bg-red-100 hover:border-none text-base rounded-3xl"
						>Pick</label
					>
					<input type="checkbox" id="randomizer" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-96">
							<label for="randomizer" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
							<h3 class="text-xl font-bold text-center">Randomizer</h3>
							<div class="mt-6 mb-1">
								<select
									bind:value={recitationType}
									class="w-1/2 mr-1 border-gray-200 h-6 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
								>
									<option class="rounded-3xl" selected>Present Only</option>
									<option class="rounded-3xl">All Students</option>
								</select>
							</div>
							<div class="divider mt-5" />
							<p class="font-medium text-lg text-center" id="randomizerName">STUDENT NAME</p>
							<div class="divider" />

							<div class="flex flex-row justify-center">
								<button
									on:click={resetRecitation}
									id="resetButton"
									class="start-button btn mt-8 w-40 mx-1 rounded-3xl bg-[#EF5051] hover:bg-red-600 border-none"
									>Reset</button
								>
								<button
									on:click={getRandomName}
									class="start-button btn mt-8 w-40 mx-1 rounded-3xl bg-[#EF5051] hover:bg-red-600 border-none"
									>START</button
								>
							</div>
						</div>
					</div>
				</div>
				<!--END RAN MODAL-->

				<!--GROUP CREATOR-->
				<div class="w-2/5 bg-green-500 bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
					<div class="flex flex-row mt-2">
						<img src="group.png" class="h-7 mt-1 pl-6" alt="..." />
						<h1 class="pl-2 pt-2 font-medium text-md text-white">Group Creator</h1>
					</div>

					<!--GRP CREATOR MODAL-->
					<label
						for="GroupCreator"
						class="my-5 btn h-20 w-56 bg-white text-green-500 border-transparent hover:bg-green-100 hover:border-none text-base rounded-3xl"
						>Create</label
					>
					<input type="checkbox" id="GroupCreator" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-auto">
							<label for="GroupCreator" class="btn btn-sm btn-circle absolute right-2 top-2"
								>✕</label
							>
							<h3 class="text-xl font-bold text-center">Group Creator</h3>
							<p class="mt-7 mb-2 font-medium">Group By</p>
							<div class="mt-3 mb-1 flex flex-row mx-10">
								<select
									bind:value={groupType}
									class="w-1/2 mr-1 border-gray-200 h-6 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
									id=""
								>
									<option disabled selected class="rounded-3xl">Select</option>
									<option class="rounded-3xl">Present Only</option>
									<option class="rounded-3xl">All Students</option>
								</select>
								<select
									class="w-1/2 ml-1 border-gray-200 h-6 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
									id="groupSize"
								>
									<option disabled selected class="rounded-3xl">Number of Members</option>
									<option class="rounded-3xl" value="2">2 Members Each</option>
									<option class="rounded-3xl" value="3">3 Members Each</option>
									<option class="rounded-3xl" value="4">4 Members Each</option>
									<option class="rounded-3xl" value="5">5 Members Each</option>
									<option class="rounded-3xl" value="6">6 Members Each</option>
									<option class="rounded-3xl" value="7">7 Members Each</option>
									<option class="rounded-3xl" value="8">8 Members Each</option>
									<option class="rounded-3xl" value="9">9 Members Each</option>
									<option class="rounded-3xl" value="10">10 Members Each</option>
								</select>
							</div>
							<button
								class="start-button btn mt-4 w-1/2 rounded-3xl bg-green-500 hover:bg-green-700 border-none transform transition-transform focus:scale-100 active:scale-95"
								on:click={groupStudents}>Create</button
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
									<tbody id="groupTableBody" />
								</table>
							</div>
						</div>
					</div>
					<!--GRP CREATOR MODAL-->
				</div>

				<!--JAMBOARD-->
				<div class="w-2/5 bg-purple-500 bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
					<div class="flex flex-row mt-2">
						<img src="jamboard.png" class="h-7 mt-1 pl-6" alt="..." />
						<h1 class="pl-1 pt-2 font-medium text-md text-white">Jamboard</h1>
					</div>

					<!--JAM MODAL-->
					<label
						for="Jamboard"
						class="my-5 btn h-20 w-56 bg-white text-purple-500 hover:bg-purple-100 border-transparent hover:border-none text-base rounded-3xl"
						>Draw</label
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
				<div class="w-2/5 bg-blue-500 bg-opacity-75 rounded-3xl text-center shadow-lg mr-1">
					<div class="flex flex-row mt-2">
						<img src="lessonplan.png" class="h-7 mt-1 pl-6" alt="..." />
						<h1 class="pl-1 pt-2 font-medium text-md text-white">Learning Materials</h1>
					</div>

					<label
						for="lessonplan"
						class="my-5 btn h-20 w-56 bg-white text-blue-500 border-transparent hover:bg-blue-100 hover:border-none text-base rounded-3xl"
						>Open</label
					>
					<input type="checkbox" id="lessonplan" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative h-4/6 max-w-3xl">
							<label for="lessonplan" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

							<div class="text-xl font-bold text-center w-full justify-center flex flex-row">
								<p>Learning Materials</p>
								<span />
							</div>

							<div
								class="w-full flex flex-col mx-auto
					 py-3 px-4 outline rounded-3xl outline-gray-50 mt-5"
							>
								<div class="mx-auto w-4/5 mt-3">
									<!--WEEK-->
									<!--WEEK-->
									<div class="flex flex-row justify-center">
										<select
											id="weekSelector"
											class="w-40 border-gray-200 h-8 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
											bind:value={weekStatus}
											on:change={updateLessonText}
										>
											<option disabled selected class="rounded-3xl">Select Week</option>
											<option class="rounded-3xl">Week 1</option>
											<option class="rounded-3xl">Week 2</option>
											<option class="rounded-3xl">Week 3</option>
											<option class="rounded-3xl">Week 4</option>
											<option class="rounded-3xl">Week 5</option>
											<option class="rounded-3xl">Week 6</option>
											<option class="rounded-3xl">Week 7</option>
											<option class="rounded-3xl">Week 8</option>
										</select>
									</div>
									<div class="divider my-0 mt-3" />

									<h1 class="text-left mt-2 ml-5 text-sm">Day 1</h1>
									<div class="flex items-center mt-1 pl-4">
										<select
											id="day1Select"
											class="w-32 border-gray-200 h-8 font-medium text-xs text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
											bind:value={day1status2}
										>
											<option disabled selected class="rounded-3xl">Share</option>
											<option class="rounded-3xl">Only Me</option>
											<option class="rounded-3xl">Current Class</option>
										</select>
										<input
											id="day1input"
											bind:value={day1x}
											type="text"
											placeholder="www.googledrive.com/lesson1/"
											class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
											readonly
										/>
										<button
											on:click={() => redirectToLink('day1input')}
											class="text-sm text-blue-500 hover:text-blue-400 ml-1">Open Link</button
										>
										<input
											id="day1checkbox"
											bind:value={day1status}
											type="checkbox"
											class="checkbox h-8 w-8 ml-2"
											on:change={() => {
												day1status = day1status === 'finish' ? '' : 'finish';
											}}
										/>
									</div>

									<h1 class="text-left mt-2 ml-5 text-sm">Day 2</h1>
									<div class="flex items-center mt-1 pl-4">
										<select
											id="day2Select"
											class="w-32 border-gray-200 h-8 font-medium text-xs text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
											bind:value={day2status2}
										>
											<option disabled selected class="rounded-3xl">Share</option>
											<option class="rounded-3xl">Only Me</option>
											<option class="rounded-3xl">Current Class</option>
										</select>
										<input
											id="day2input"
											bind:value={day2x}
											type="text"
											placeholder="www.googledrive.com/lesson1/"
											class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
											readonly
										/>
										<button
											on:click={() => redirectToLink('day2input')}
											class="text-sm text-blue-500 hover:text-blue-400 ml-1">Open Link</button
										>
										<input
											id="day2checkbox"
											bind:value={day2status}
											type="checkbox"
											class="checkbox h-8 w-8 ml-2"
											disabled="disabled"
										/>
									</div>

									<h1 class="text-left mt-2 ml-5 text-sm">Day 3</h1>
									<div class="flex items-center mt-1 pl-4">
										<select
											id="day3Select"
											class="w-32 border-gray-200 h-8 font-medium text-xs text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
											bind:value={day3status2}
										>
											<option disabled selected class="rounded-3xl">Share</option>
											<option class="rounded-3xl">Only Me</option>
											<option class="rounded-3xl">Current Class</option>
										</select>
										<input
											id="day3input"
											bind:value={day3x}
											type="text"
											placeholder="www.googledrive.com/lesson1/"
											class="input input-bordered w-11/12 focus.border-none cursor-pointer text-sm"
											readonly
										/>
										<button
											on:click={() => redirectToLink('day3input')}
											class="text-sm text-blue-500 hover:text-blue-400 ml-1">Open Link</button
										>
										<input
											id="day3checkbox"
											bind:value={day3status}
											type="checkbox"
											class="checkbox h-8 w-8 ml-2"
											disabled="disabled"
										/>
									</div>

									<h1 class="text-left mt-2 ml-5 text-sm">Day 4</h1>
									<div class="flex items-center mt-1 pl-4">
										<select
											id="day4Select"
											class="w-32 border-gray-200 h-8 font-medium text-xs text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
											bind:value={day4status2}
										>
											<option disabled selected class="rounded-3xl">Share</option>
											<option class="rounded-3xl">Only Me</option>
											<option class="rounded-3xl">Current Class</option>
										</select>
										<input
											id="day4input"
											bind:value={day4x}
											type="text"
											placeholder="www.googledrive.com/lesson1/"
											class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
											readonly
										/>
										<button
											on:click={() => redirectToLink('day4input')}
											class="text-sm text-blue-500 hover:text-blue-400 ml-1">Open Link</button
										>
										<input
											id="day4checkbox"
											bind:value={day4status}
											type="checkbox"
											class="checkbox h-8 w-8 ml-2"
											disabled="disabled"
										/>
									</div>

									<h1 class="text-left mt-2 ml-5 text-sm">Day 5</h1>
									<div class="flex items-center mt-1 pl-4">
										<select
											id="day5Select"
											class="w-32 border-gray-200 h-8 font-medium text-xs text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
											bind:value={day5status2}
										>
											<option disabled selected class="rounded-3xl">Share</option>
											<option class="rounded-3xl">Only Me</option>
											<option class="rounded-3xl">Current Class</option>
										</select>
										<input
											id="day5input"
											bind:value={day5x}
											type="text"
											placeholder="www.googledrive.com/lesson1/"
											class="input input-bordered w-11/12 focus.border-none cursor-pointer text-sm"
											readonly
										/>
										<button
											on:click={() => redirectToLink('day5input')}
											class="text-sm text-blue-500 hover:text-blue-400 ml-1">Open Link</button
										>
										<input
											id="day5checkbox"
											bind:value={day5status}
											type="checkbox"
											class="checkbox h-8 w-8 ml-2"
											disabled="disabled"
										/>
									</div>
									<!--END WEEK-->
								</div>

								<div class="justify-between flex mt-9 mb-2 mx-4">
									<button
										on:click={resetWeeklyLesson}
										id=""
										class="text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-6 ml-1 py-1 rounded-3xl"
									>
										Reset</button
									>
									<div class="flex flex-row">
										<button
											on:click={toggleEditButton}
											id="editButton"
											class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-6 ml-1 py-1 rounded-3xl"
										>
											Edit</button
										>
										<button
											on:click={toggleEditButton}
											on:click={createWeeklyLesson}
											id="saveButton1"
											class="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 ml-1 py-1 rounded-3xl pointer-events-none"
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--ACTIONS-->
	<div class="flex flex-row card mx-10 my-auto pt-3" />
	<Toaster />
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
