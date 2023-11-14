<script>
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

	let email = '';
	let password = '';
	let userUID = '';


	async function login() {
		if (email === '' || password === '') {
			console.log('Email or password is empty');
			toast.error('Email or Password is empty');
			return; // Exit the function
		}

		const q = query(collection(firestore, 'users'), where('email', '==', email));
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			if (doc.exists()) {
				console.log(doc.data());
				const userData = doc.data();
				console.log('Document data:', userData);

				if (userData.userRole === 'teacher') {
					if (userData.password === password) {
						console.log('User is a Teacher');
						toast.success('Log In Successful');
						const userUID = userData.UID;
						userId.set(userUID);
						const userUID1 = localStorage.getItem('userId');
						window.location.replace('../NewTeacher-Dashboard');
					} else {
						console.log('Wrong Password');
						toast.error('Wrong Password');
						// Handle case when user is not a teacher
					}
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

<div class="pb-5 flex items-center justify-center min-h-screen bg-gray-100">
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
						<label for="email" class="block mb-2 text-md font-medium text-gray">Email</label>
						<input
							bind:value={email}
							type="email"
							required
							name="email"
							id="email"
							placeholder="Email"
							class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-3xl focus:outline-none"
						/>
					</div>
					<div class="mb-5">
						<label for="password" class="block mb-2 text-md font-medium text-gray">Password</label>
						<input
							bind:value={password}
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-3xl focus:outline-none"
						/>
					</div>
					<button
						on:click={login}
						class=" w-full px-3 py-4 mt-1 text-white bg-[#2ea44f] focus:outline-none font-medium rounded-3xl hover:bg-[#1e7d3f] duration-300 hover:scale-105"
						>Log In</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
<Toaster />
