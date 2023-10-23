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
	const calledNames = [];
	async function getRandomName() {
		if (isRolling) return; // Prevent multiple clicks while rolling
		const collectionRef = collection(firestore, 'Subject', `${selecTSub}`, 'Attendance');
		const queryRef = doc(collectionRef, currentDatee);

		try {
			const querySnapshot = await getDoc(queryRef);
			if (querySnapshot.exists()) {
				const data = querySnapshot.data();

				// Assuming 'data' is an object with map fields, iterate through the fields
				const presentNames = [];
				for (const field in data) {
					if (data[field].status === 'Present' && !calledNames.includes(field)) {
						// Do something with the map field where status is "Present"
						console.log(`Field ${field} is Present`);
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
				} else {
					element.setAttribute('disabled', 'disabled');
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

	async function groupStudents() {
		console.log(selecTSub);

		// Create a reference to the specific document within the 'Subject' collection
		const docRef = doc(firestore, 'Subject', selecTSub);

		try {
			// Get the data for the specific document
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
			alert('Please enter a title before adding notes.');
		}
	}

	async function fetchAndDisplayNotes2() {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(collectionRef, where('Archive', '==', 'true'));
		try {
			const querySnapshot = await getDocs(queryRef2);

			querySnapshot.forEach((doc) => {
				const title1 = doc.data().Title;
				let status = doc.data().Status;
				const id = doc.id;
				const noteElement = document.createElement('div');
				noteElement.className =
					'mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1';
				noteElement.innerHTML = `
        <div class="mt-2 flex flex-row justify-between w-full items-center px-7 pb-1">
          <h1 class="font-medium text-sm">${title1}</h1>
  
          <div class="flex items-center">
            <select
              class="update-status-select border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
            >
              <option disabled hidden class="rounded-3xl">Share</option>
              <option value="Only Me" ${status === 'Only Me' ? 'selected' : ''}>Only Me</option>
              <option value="Current Class" ${
								status === 'Current Class' ? 'selected' : ''
							}>Current Class</option>
            </select>
            <button class="update-status-button">
              <img
                src="done.png"
                class="h-7 transform transition-transform focus:scale-100 active:scale-90"
                alt="..."
              />
            </button>
            <button class="delete-button">
              <img
                src="delete.png"
                class="h-7 transform transition-transform focus:scale-100 active:scale-90"
                alt="..."
              />
            </button>
          </div>
        </div>`;

				const notesContainer = document.getElementById('notes-container2');
				notesContainer.appendChild(noteElement);

				// Add event listener to the update-status-button
				noteElement.querySelector('.update-status-button').addEventListener('click', async () => {
					const selectElement = noteElement.querySelector('select');
					const newStatus = selectElement.value;

					try {
						await updateDoc(doc.ref, { Archive: 'true' });
						Archive = 'true';
						location.reload();
					} catch (error) {
						console.error('Error updating document: ', error);
					}
				});

				noteElement.querySelector('.update-status-select').addEventListener('change', async () => {
					const selectElement = noteElement.querySelector('select');
					const newStatus = selectElement.value;
					try {
						await updateDoc(doc.ref, { Status: newStatus });
						status = newStatus;
					} catch (error) {
						console.error('Error updating document: ', error);
					}
				});

				noteElement.querySelector('.delete-button').addEventListener('click', async () => {
					try {
						// Delete the document from Firestore
						await deleteDoc(doc.ref);
						// Remove the note element from the UI
						noteElement.remove();
					} catch (error) {
						console.error('Error deleting document: ', error);
					}
				});
			});
		} catch (error) {
			console.error('Error fetching documents: ', error);
		}
	}

	async function fetchAndDisplayNotes() {
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Notes');
		const queryRef2 = query(collectionRef, where('Archive', '==', 'false'));
		try {
			const querySnapshot = await getDocs(queryRef2);

			querySnapshot.forEach((doc) => {
				const title1 = doc.data().Title;
				let status = doc.data().Status;
				const id = doc.id;
				const noteElement = document.createElement('div');
				noteElement.className =
					'mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1';
				noteElement.innerHTML = `
        <div class="mt-2 flex flex-row justify-between w-full items-center px-7 pb-1">
          <h1 class="font-medium text-sm">${title1}</h1>
  
          <div class="flex items-center">
            <select
              class="update-status-select border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
            >
              <option disabled hidden class="rounded-3xl">Share</option>
              <option value="Only Me" ${status === 'Only Me' ? 'selected' : ''}>Only Me</option>
              <option value="Current Class" ${
								status === 'Current Class' ? 'selected' : ''
							}>Current Class</option>
            </select>
            <button class="update-status-button">
              <img
                src="done.png"
                class="h-7 transform transition-transform focus:scale-100 active:scale-90"
                alt="..."
              />
            </button>
            <button class="delete-button">
              <img
                src="delete.png"
                class="h-7 transform transition-transform focus:scale-100 active:scale-90"
                alt="..."
              />
            </button>
          </div>
        </div>`;

				const notesContainer = document.getElementById('notes-container');
				notesContainer.appendChild(noteElement);

				// Add event listener to the update-status-button
				noteElement.querySelector('.update-status-button').addEventListener('click', async () => {
					const selectElement = noteElement.querySelector('select');
					const newStatus = selectElement.value;

					try {
						await updateDoc(doc.ref, { Archive: 'true' });
						Archive = 'true';
						location.reload();
					} catch (error) {
						console.error('Error updating document: ', error);
					}
				});

				noteElement.querySelector('.update-status-select').addEventListener('change', async () => {
					const selectElement = noteElement.querySelector('select');
					const newStatus = selectElement.value;
					try {
						await updateDoc(doc.ref, { Status: newStatus });
						status = newStatus;
					} catch (error) {
						console.error('Error updating document: ', error);
					}
				});

				noteElement.querySelector('.delete-button').addEventListener('click', async () => {
					try {
						// Delete the document from Firestore
						await deleteDoc(doc.ref);
						// Remove the note element from the UI
						noteElement.remove();
					} catch (error) {
						console.error('Error deleting document: ', error);
					}
				});
			});
		} catch (error) {
			console.error('Error fetching documents: ', error);
		}
	}

	function resetChanges() {
		const notesContainer = document.getElementById('notes-container');
		notesContainer.innerHTML = ''; // Clear all dynamically added notes
	}

	// Call the function to fetch and display notes
	async function change() {
		console.log(selecTSub);
		classCheck();
		attendanceCheck();
		recitationCheck();
		resetChanges();
		fetchAndDisplayNotes();
		getArchiveNotes();
	}

	async function getuserName(id) {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('UID', '==', id));
		const querySnapshot = await getDocs(queryRef2);
		if (querySnapshot.docs.length > 0) {
			const doc = querySnapshot.docs[0];
			console.log(doc.data().Name);
			document.getElementById('userName').textContent = doc.data().Name;
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

	async function createWeeklyLesson() {
		console.log('test');
		const collectionRef = collection(firestore, 'Subject', selecTSub, 'Lessons');
		const week1DocRef = doc(collectionRef, 'week1'); // Create a document reference with 'week1' as the ID
		const data1 = {
			day1: {
				Link: day1x,
				Status: day1status,
				Share: day1status2
			}
		};

		const data2 = {
			day1: {
				Link: day2x,
				Status: day2status,
				Share: day2status2
			}
		};

		const data3 = {
			day3: {
				Link: day3x,
				Status: day3status,
				Share: day3status2
			}
		};

		const data4 = {
			day4: {
				Link: day4x,
				Status: day4status,
				Share: day4status2
			}
		};

		const data5 = {
			day5: {
				Link: day5x,
				Status: day5status,
				Share: day5status2
			}
		};

		try {
			await setDoc(week1DocRef, data1, data2, data3, data4, data5);
			console.log('Document written with ID: week1');
		} catch (error) {
			console.error('Error writing document: ', error);
		}
	}

	onMount(() => {
		const unsubscribe = userId.subscribe((value) => {
			// Use the value of userId here
			userUID = localStorage.getItem('userId');
			getuserName(userUID);
			classCheck();
			attendanceCheck();
			return () => {
				unsubscribe();
			};
		});
	});
	getDate();
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
				<p class="font-medium text-md mr-5 mt-1" id="userName" />
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
									<!--LABEL FOR MEDIC MODAL -->
									<label for="MedicalRecords" class="cursor-pointer">
										<span>{data.name}</span>
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
											<div class="flex flex-row justify-between mt-5 mx-2">
												<h1 class="text-left font-medium text-lg mt-3">Ace Dela Cuesta</h1>
												<h1 class="text-left font-medium text-lg mt-3">19-1064</h1>
											</div>
											<div class="divider mt-0" />
											<h1 class="text-left my-2 mx-5">
												Parent/Guardian Name:
												<input
													class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
													placeholder="Yohan Dela Cuesta"
													type="text"
													readonly
												/>
											</h1>

											<h1 class="text-left my-2 mx-5">
												Contact Number:
												<input
													class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
													placeholder="09355349012"
													type="text"
													readonly
												/>
											</h1>

											<h1 class="text-left my-2 mx-5">
												Address:
												<input
													class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
													placeholder="Address"
													type="text"
													readonly
												/>
											</h1>

											<h1 class="text-left my-2 mx-5">
												Medical Condition/s:
												<input
													class="mt-1 border rounded-3xl px-2 focus:ring-0 text-sm block bg-white w-full h-7 border-slate-300 shadow-sm focus:outline-none"
													placeholder="Asthma"
													type="text"
													readonly
												/>
											</h1>
										</div>
									</div>

									<div class="justify-end flex mt-4">
										<button
											id="editButton"
											class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
										>
											Edit</button
										>
										<button
											id="saveButton"
											class="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-6 ml-1 py-1 rounded-3xl pointer-events-none"
										>
											Save
										</button>
									</div>
								</div>
							</div>
							<!--END MEDIC MODAL-->
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
				<option disabled selected hidden class="rounded-3xl">Sort by</option>
				<option class="rounded-xl">Daily</option>
				<option class="rounded-xl">Weekly</option>
				<option class="rounded-xl">Quarterly</option>
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
								<td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap text-left">
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
						/><g id="SVGRepo_iconCarrier"
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
						<label for="NotesArchives" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
						>
						<h3 class="text-xl font-bold text-center">Note Archives</h3>

						<div class="mx-auto w-full mt-5">
							<table
								class="w-full text-sm text-gray-500 dark:text-gray-400 table-fixed overflow-x-auto"
							>
								<thead
									class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
								>
									<tr>
										<th scope="col" class="pl-6 py-4 text-left">Date </th>
										<th scope="col" class="px-1 py-4 text-left">Note </th>
										<th scope="col" class="px-6 py-4 text-left">Status </th>
										<th scope="col" class="px-9 py-4 text-left"> Action </th>
									</tr>
								</thead>
								<tbody id="note-archive">

											<tr class="border-b bg-white">
												<!-- Display the data for each recitation item -->
												<td class="text-sm text-gray-500 font-medium px-6 py-4"
													></td
												>
												<td class="text-md text-gray-900 font-medium px- py-3"
													></td
												>
												<td class="text-sm text-gray-900 font-medium px-6 py-4">
													<select
														class=" border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
													>
														<option class="rounded-xl">Only Me</option>
														<option class="rounded-xl">Current Class</option>
													</select>
												</td>
												<td class="text-sm text-gray-900 font-medium px-6 py-4">
													<label
														for=""
														class="px-4 bg-yellow-500 border-transparent hover:bg-yellow-600 hover:border-none text-sm text-white rounded-3xl"
														>Undo</label
													>
												</td>
											</tr>
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
			<div id="notes-container">
				<div class="mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1">
					<h1 class="font-medium text-sm">· Present Lesson 1</h1>

					<div class="flex items-center">
						<select
							class=" border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
						>
							<option disabled selected hidden class="rounded-3xl">Share</option>
							<option class="rounded-xl">Only Me</option>
							<option class="rounded-xl">Current Class</option>
						</select>

						<button>
							<img
								src="delete.png"
								class="h-7 transform transition-transform focus:scale-100 active:scale-90"
								alt="..."
							/>
						</button>
						<button>
							<img
								src="done.png"
								class="h-7 transform transition-transform focus:scale-100 active:scale-90"
								alt="..."
							/>
						</button>
					</div>
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
				class="my-10 btn h-24 w-56 bg-[#EF5051] border-transparent hover:bg-red-600 hover:border-none text-lg rounded-3xl"
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
		<div class="w-2/5 pb-5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="group.png" class="h-7 mt-1 pl-6" alt="..." />
				<h1 class="pl-2 pt-2 font-medium text-md text-gray-700">Group Creator</h1>
			</div>

			<!--GRP CREATOR MODAL-->
			<label
				for="GroupCreator"
				class="my-10 btn h-24 w-56 bg-green-500 border-transparent hover:bg-green-700 hover:border-none text-lg rounded-3xl"
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
							id="groupSize"
						>
							<option disabled selected class="rounded-3xl">Select</option>
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
		<div class="w-2/5 pb-5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="jamboard.png" class="h-7 mt-1 pl-6" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Jamboard</h1>
			</div>

			<!--JAM MODAL-->
			<label
				for="Jamboard"
				class="my-10 btn h-24 w-56 bg-purple-500 hover:bg-purple-700 border-transparent hover:border-none text-lg rounded-3xl"
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
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Learning Materials</h1>
			</div>

			<label
				for="lessonplan"
				class="my-10 btn h-24 w-56 bg-blue-500 border-transparent hover:bg-blue-700 hover:border-none text-lg rounded-3xl"
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
						<div class="mx-auto w-4/5 mt-5">
							<!--WEEK-->
							<!--WEEK-->
							<div class="flex flex-row justify-center">
								<select
									class="w-40 border-gray-200 h-8 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
								>
									<option disabled selected class="rounded-3xl">Select Week</option>
									<option class="rounded-3xl">Week 1</option>
									<option class="rounded-3xl">Week 2</option>
								</select>

								<select
									class="w-32 border-gray-200 h-8 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
								>
									<option disabled selected class="rounded-3xl">Share</option>
									<option class="rounded-3xl">Only Me</option>
									<option class="rounded-3xl">Current Class</option>
								</select>
							</div>
							<div class="divider my-0 mt-3" />

							<h1 class="text-left mt-2 ml-5 text-sm">Day 1</h1>
							<div class="flex items-center mt-1 pl-4">
								<input
									id="day1input"
									bind:value={day1x}
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
									disabled="disabled"
								/>
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
								<input
									id="day2input"
									bind:value={day2x}
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
									disabled="disabled"
								/>
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
								<input
									id="day3input"
									bind:value={day3x}
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-11/12 focus.border-none cursor-pointer text-sm"
									disabled="disabled"
								/>
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
								<input
									id="day4input"
									bind:value={day4x}
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-11/12 focus:border-none cursor-pointer text-sm"
									disabled="disabled"
								/>
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
								<input
									id="day5input"
									bind:value={day5x}
									type="text"
									placeholder="www.googledrive.com/lesson1/"
									class="input input-bordered w-11/12 focus.border-none cursor-pointer text-sm"
									disabled="disabled"
								/>
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

						<div class="justify-end flex mt-8 mb-2">
							<button
								on:click={toggleEditButton}
								id="editButton"
								class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-6 ml-1 py-1 rounded-3xl"
							>
								Edit</button
							>
							<button
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
