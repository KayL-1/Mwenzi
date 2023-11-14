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
	import { current_component, text } from 'svelte/internal';

	let subjectSelected;
	let timeFrom1;
	let timeTo1;
	let userID1;

	let attendanceDate = [];

	let elementCounts = {};
	let newData = [];

	async function getData(data) {
		const attendanceCollectionRef = collection(firestore, 'Subject', data, 'Attendance');

		// Use the getDocs function to retrieve all documents in the subcollection
		const querySnapshot = await getDocs(attendanceCollectionRef);

		querySnapshot.forEach((doc) => {
			const docId = doc.id;
			const documentData = doc.data();
			const documentWithId = { id: docId, data: documentData };
			attendanceDate.push(documentWithId);
		});

		const filteredAttendance = attendanceDate.filter((entry) => {
			const entryDate = entry.id; // Assuming entry.id is in the 'yyyy-mm-dd' format

			// Compare entryDate with the range [timeFrom1, timeTo1]
			return entryDate >= timeFrom1 && entryDate <= timeTo1;
		});

		// Iterate through each entry in filteredAttendance
		filteredAttendance.forEach((entry) => {
			const data = entry.data;

			// Iterate through the data property of each entry
			Object.keys(data).forEach((elementName) => {
				const status = data[elementName].status;

				// Increment the count for the current elementName and status
				if (!elementCounts[elementName]) {
					elementCounts[elementName] = { Absent: 0, Present: 0 };
				}

				if (status === 'Absent') {
					elementCounts[elementName].Absent += 1;
				} else if (status === 'Present') {
					elementCounts[elementName].Present += 1;
				}
			});
		});

		const usersData = {};

		// Iterate through each element name in elementCounts
		for (const elementName in elementCounts) {
			// Assuming elementName corresponds to the 'id' field in the 'users' collection
			const elementQueryRef = query(
				collection(firestore, 'users'),
				where('studentRFID', '==', elementName)
			);
			const elementQuerySnapshot = await getDocs(elementQueryRef);

			// Check if there are any matching documents
			if (!elementQuerySnapshot.empty) {
				// Assuming there is only one document for each elementName, use .docs[0]
				const userData = elementQuerySnapshot.docs[0].data();

				// Add 'Name' and 'StudentID' to the elementCounts object for the current elementName
				elementCounts[elementName].firstName = userData.firstName;
				elementCounts[elementName].lastName = userData.lastName;
				elementCounts[elementName].StudentID = userData.studentID;
			}
		}

		elementCounts = Object.keys(elementCounts).map((elementName) => ({
			firstName: elementCounts[elementName].firstName,
			lastName: elementCounts[elementName].lastName,
			StudentID: elementCounts[elementName].StudentID,
			Absent: elementCounts[elementName].Absent,
			Present: elementCounts[elementName].Present
		}));

		newData = elementCounts;
		console.log(newData);

		newData = students.sort((a, b) => {
			const lastNameA = a.lastName || ''; // Handle cases where lastName might be undefined
			const lastNameB = b.lastName || ''; // Handle cases where lastName might be undefined

			return lastNameA.localeCompare(lastNameB);
		});
	}

	function printDiv() {
		const printableDiv = document.getElementById('printableArea1');
		if (printableDiv) {
			const originalDisplay = printableDiv.style.display;
			printableDiv.style.display = 'block'; // Show the div
			window.print(); // Open the print dialog
			printableDiv.style.display = originalDisplay; // Restore the original display style
		}
	}

	async function getuserName(id) {
		const queryRef1 = collection(firestore, 'users');
		const queryRef2 = query(queryRef1, where('UID', '==', id));
		const querySnapshot = await getDocs(queryRef2);
		if (querySnapshot.docs.length > 0) {
			const doc = querySnapshot.docs[0];
			console.log(doc.data().Name);
			return doc.data().Name;
		} else {
			return 'Teacher not found';
		}
	}

	onMount(() => {
		userId.subscribe(async (val) => {
			if (typeof window !== 'undefined') {
				localStorage.userId = val;
			}
			userID1 = await getuserName(val);
		});

		subjectSelected1.subscribe((val) => {
			if (typeof window !== 'undefined') {
				localStorage.subjectSelected1 = val;
			}
			subjectSelected = val; // Assign the value directly to the variable
			getData(subjectSelected);
		});

		timeFrom.subscribe((val) => {
			if (typeof window !== 'undefined') {
				localStorage.timeFrom = val;
			}
			timeFrom1 = val; // Assign the value directly to the variable
		});

		timeTo.subscribe((val) => {
			if (typeof window !== 'undefined') {
				localStorage.timeTo = val;
			}
			timeTo1 = val; // Assign the value directly to the variable
			console.log(timeTo1);
		});
	});
</script>

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Page Title</title>

<body class="bg-gray-50 h-screen w-full">
	<div class="mx-12 flex pt-5 justify-between">
		<div>
			<a href="/NewTeacher-Dashboard">
				<img src="Mwenzi5.png" class="h-14 pb-2" alt="..." />
			</a>
		</div>
		<div class="flex items-end mb-2">
			<button
				class="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 px-10 ml-1 rounded-3xl transform transition-transform focus:scale-100 active:scale-95"
				on:click={printDiv}>Print</button
			>
		</div>
	</div>

	<div class="w-full flex flex-col items-center">
		<div class="w-2/4 bg-white pt-8 px-14 mb-8 pb-16 flex flex-col">
			<!-- PAPER 1 -->

			<!--PRINTABLE AREA 1 -->
			<div class="w-full" id="printableArea1">
				<div class="flex items-center flex-col mb-5 mt-2">
					<p class="text-center text-lg font-medium">Attendance Record</p>
					<p class="text-center text-md font-medium">{subjectSelected} | {userID1}</p>
					<p id="timeDuration" class="text-center text-md">{timeFrom1} to {timeTo1}</p>
				</div>
				<table class="w-full mt-3 border text-sm">
					<thead>
						<tr class="border border-black text-center text-sm" />
						<th class="border border-black px-1 w-24 text-sm">Student ID:</th>
						<th class="border border-black px-1 w-24 text-sm">Student Name:</th>
						<th class="border px-1 border-black w-28 text-sm">Total Absent:</th>
						<th class="border px-1 border-black w-24 text-sm">Total Present:</th>
					</thead>
					<tbody>
						{#each newData as data (data.StudentID)}
							<tr class="border border-black text-center text-sm">
								<td class="border border-black text-sm">{data.StudentID}</td>
								<td class="border border-black text-sm">{data.lastName}, {data.firstName}</td>
								<td class="border border-black text-sm">{data.Absent}</td>
								<td class="border border-black text-sm">{data.Present}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</body>

<!-- </html> -->

<style>
	@media print {
		/* Add print-specific styles here, e.g., hiding unwanted elements */
		body * {
			visibility: hidden;
		}
		#printableArea1,
		#printableArea1 * {
			visibility: visible;
		}
		#printableArea1 {
			position: absolute;
			left: 0;
			top: 0;
		}
	}
</style>
