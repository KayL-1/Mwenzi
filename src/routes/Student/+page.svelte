<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
	import { userId } from '../../lib/userStorage';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import toast, { Toaster } from 'svelte-french-toast';

	let studentID = '';

	async function login() {
		if (studentID == '') {
			toast.error('Student ID is empty');
			return; // Exit the function
		}

		const q = query(collection(firestore, 'users'), where('studentID', '==', studentID));
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			if (doc.exists()) {
				console.log(doc.data());
				const userData = doc.data();
				console.log('Document data:', userData);

				if (userData.userRole === 'student') {
					console.log('User is a Student');
					toast.success('Log In Successful');
					const userUID = userData.studentRFID;
					userId.set(userUID);
					const userUID1 = localStorage.getItem('userId');
					window.location.replace('../NewStudent-Dashboard');
				} else {
					console.log('User is not a Student');
					toast.error('User is not a Student');
					// Handle case when user is not a teacher
				}
			} else {
				console.log('Document not found');
			}
		});

		// if (querySnapshot.exists()) {
		// 	const userData = docSnap.data();
		// 	console.log('Document data:', userData);

		// 	if (userData.userRole === 'student') {
		// 		console.log('User is a Student');
		// 		toast.success('Log In Successful');
		// 		userId.set(userID);
		// 		userUID = localStorage.getItem('userId');
		// 		console.log(userUID);
		// 		window.location.replace('../Student-Dashboard');
		// 	} else {
		// 		console.log('User is not a Student');
		// 		toast.error('User is not a Student');
		// 		// Handle case when user is not a teacher
		// 	}
		// } else {
		// 	console.log('No such document!');
		// 	toast.error('No such document!');
		// }
	}

	onMount(() => {
		userId.subscribe((val) => {
			if (browser) localStorage.userId = val;
		});
	});
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="container mx-auto">
		<div class="max-w-md mx-auto">
			<div class="text-center">
				<a href="/Login">
					<img
						src="Mwenzi5.png"
						class="h-auto max-w-full duration-500 hover:scale-105 hover:-translate-10"
						alt="..."
					/>
				</a>
			</div>
			<div class="m-7">
				<form>
					<div class="mb-4">
						<label for="email" class="block mb-2 text-md font-medium text-gray">Student ID</label>
						<input
							bind:value={studentID}
							type="text"
							required
							name="email"
							id="email"
							placeholder="Student ID"
							class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-3xl focus:outline-none"
						/>
					</div>
					<div class="mb-6" hidden>
						<label for="password" class="block mb-2 text-md font-medium text-gray">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-3xl focus:outline-none"
						/>
					</div>
					<button
						on:click={login}
						class=" w-full px-3 py-4 text-white bg-[#2ea44f] focus:outline-none font-medium rounded-3xl hover:bg-[#1e7d3f] duration-300 hover:scale-105"
						>Log In</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
<Toaster />
