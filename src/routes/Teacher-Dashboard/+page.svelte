<script>
	import { auth, database } from '$lib/firebase';
	import { doc, setDoc, query, where, getDocs, collection } from 'firebase/firestore';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getDatabase, ref, onValue } from 'firebase/database';
	import { onMount } from 'svelte';
	import { format } from 'date-fns';

	let dateArray = [];
	let studentArray = [];

	async function displayClasses() {
		const rtdbRef = ref(database, 'rfid');
		const usersCollection = collection(firestore, 'users');

		onValue(rtdbRef, async (snapshot) => {
			const rfidTagsData = snapshot.val();
			const rfidTagValues = Object.values(rfidTagsData).flat();

			console.log(rfidTagValues);

			const queryRef = query(usersCollection, where('studentRFID', 'in', rfidTagValues));
			const docSnap = await getDocs(queryRef);

			const updatedStudentArray = [];
			docSnap.forEach((doc) => {
				updatedStudentArray.push(doc.data());
			});

			studentArray = updatedStudentArray;
			console.log(studentArray);
		});
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
			<img src="Mwenzi.png" class="w-30 h-24" alt="..." />
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

<div class="mx-20 my-10 px-44">
	<div class="flex flex-row justify-center">
		<div class="basis-1/2 container mt-20 pt-4 lg:w-3/6">
			<div class="h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden">
				<div class="flex flex-row mt-2">
					<img src="addclass.png" class="h-10 mt-4 pl-8" alt="..." />
					<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl mb-5 text-gray-700">ADD CLASS</h1>
				</div>

				<!-- ADDED CLASS-->
				<div class="flex flex-row pl-8">
					<label
						for="my-modal-3"
						class="btn h-28 w-48 bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent text-xl"
						>RAMBUTAN</label
					>

					<input type="checkbox" id="my-modal-3" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box w-full">
							<table class="table-fixed text-left flex-grow">
								<thead class="sticky top-0">
									<label for="my-modal-3" class="btn btn-xs btn-circle absolute right-1">✕</label>

									<tr>
										<th class="w-40">Student</th>
										<th class="w-32">Student ID</th>
										<!-- <th class="w-32">Time</th> -->
										<th class="pl-7 w-32">Status</th>
									</tr>
								</thead>

								<tbody>
									{#each studentArray as student}
										<tr>
											<td>{student.Name}</td>
											<td>{student.studentID}</td>
											<td>
												<div class="badge w-20 ml-5 bg-green-500 border-transparent">Present</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>

					<!-- ADD/SELECT CLASS-->
					<label
						for="my-modal-4"
						class="mx-5 btn h-28 w-48 bg-gray-100 border-gray-300 border-2 hover:bg-gray-200 hover:border-transparent text-gray-400 pl-5 text-xl"
						>ADD CLASS
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-plus"
							viewBox="0 0 16 16"
						>
							<path
								d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
							/>
						</svg>
					</label>
				</div>
				<input type="checkbox" id="my-modal-4" class="modal-toggle" />
				<div class="modal">
					<div class="modal-box relative">
						<label for="my-modal-4" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
						<h1 class="font-medium text-l mb-5 text-gray-700">SELECT CLASS</h1>
						<select
							id="classSelect1"
							class="pl-2 py-2 w-full rounded-md border placeholder-gray-300 border-gray-300 text-md"
						/>
						<button
							class="mt-3 w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
							>Add</button
						>
					</div>
				</div>
			</div>
		</div>

		<div class="basis-1/2 ml-2 container mt-20 pt-4 lg:w-3/6">
			<div class="h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden text-center">
				<div class="flex flex-row mt-2">
					<img src="leaderboard.png" class="h-10 mt-4 pl-8" alt="..." />
					<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl text-gray-700">LEADERBOARDS</h1>
					<!--button class="btn">Sections</button-->
				</div>

				<div class="flex justify-center ">
					<table class="w-7/12">
						<!-- head -->
						<thead class="bg-transparent">
							<tr>
								<th />
								<th />
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							<!-- row 1 -->
							<tr>
								<th />
								<td class="font-medium text-2xl text-gray-700 text-left"
									>Ace Dela Cuesta</td
								>
								<td class="font-medium text-2xl">20</td>
							</tr>
							<!-- row 2 -->
							<tr>
								<th />
								<td class="font-medium text-2xl text-gray-700 text-left"
									>Kyle Dela Pena</td
								>
								<td class="font-medium text-2xl">20</td>
							</tr>
							<!-- row 3 -->
							<tr>
								<th />
								<td class="font-medium text-2xl text-gray-700 text-left"
									>Luis Santiago</td
								>
								<td class="font-medium text-2xl">20</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-row justify-center">
		<div class="basis-1/2 container mt-7 lg:w-1/4">
			<div
				class="h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden text-center"
			>
			<div class="flex flex-row mt-2">
				<img src="randomizer.png" class="h-10 mt-4 pl-8" alt="..." />
				<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl mb-5 text-gray-700">RANDOMIZER</h1>
			</div>
			<div>
				<button class="btn h-24 w-48 bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent text-xl">SELECT</button>
			</div>
			</div>
		</div>

		<div class="basis-1/2 container mt-7 lg:w-1/4">
			<div
				class="ml-2 h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden text-center"
			>
			<div class="flex flex-row mt-2">
				<img src="group.png" class="h-10 mt-4 pl-8" alt="..." />
				<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl mb-5 text-gray-700">CREATE GROUP</h1>
			</div>
			<div>
				<button class="btn h-24 w-48 bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent text-xl">CREATE</button>
			</div>
			</div>
		</div>

		<div class="basis-1/3 container mt-7 lg:w-96">
			<div
				class="ml-2 h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden text-center"
			>
			<div class="flex flex-row mt-2">
				<img src="timer.png" class="h-10 mt-4 pl-8" alt="..." />
				<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl mb-5 text-gray-700">TIMER</h1>
			</div>
			<div>
				<button class="btn h-24 w-48 bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent text-xl">START</button>
			</div>
			</div>
		</div>
	</div>
</div>
<!--ATTENDANCE LIST-->
<!--div class='flex mt-20 min-h-screen bg-slate-white'>
        <div class="container mx-auto">
            <div class="max-w-md mx-auto">
                <div class="text-center">
                </div>
                <div class="m-7">   
                    <form action="?/" method="POST">
                        <div class="mb-6">
                            <label for="listofstudents" class="block mb-2 text-md font-medium text-gray">List of Students</label>
                            <ul class="border border-gray-200 rounded overflow-hidden shadow-md">
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 1 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 2 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 3 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 4 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 5 | RFID Tag</li>
                            </ul>
                    </form>
                </div>
            </div>
        </div>
    	</div-->
<!--ATTENDANCE LIST-->
