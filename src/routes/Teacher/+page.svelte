<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { firebase, firestore, functions } from '$lib/firebase';
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
	import { Firestore, doc, getDoc } from 'firebase/firestore';
	import { userId } from '../../lib/userStorage';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import toast, { Toaster } from 'svelte-french-toast';

	let email = '';
	let password = '';
	let userUID = '';

	function login() {
		signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const userID = userCredential.user.uid;
				const docSnap = await getDoc(doc(firestore, 'users', userID));

				if (docSnap.exists()) {
					const userData = docSnap.data();
					console.log('Document data:', userData);

					if (userData.userRole === 'teacher') {
						console.log('User is a teacher');
						toast.success('Log In Successful');
						userId.set(userID);
						userUID = localStorage.getItem('userId');
						console.log(userUID);
						window.location.replace('../Teacher-Dashboard');
					} else {
						console.log('User is not a Teacher');
						toast.error('User is not a Teacher');
						// Handle case when user is not a teacher
					}
				} else {
					console.log('No such document!');
					toast.error('No such document!');
				}
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				toast.error('Wrong User Credentials');
			});
	}

	onMount(() => {
		userId.subscribe((val) => {
			if (browser) localStorage.userId = val;
		});
	});
</script>

<div class="flex items-center justify-center min-h-screen bg-slate-white">
	<div class="container mx-auto">
		<div class="max-w-md mx-auto">
			<div class="text-center">
				<a href="/Login">
					<img src="Mwenzi.png" class="h-auto max-w-full duration-500 hover:scale-105 hover:-translate-10" alt="..." />
				</a>
			</div>
			<div class="m-7">
				<div class="mb-4">
					<label for="email" class="block mb-2 text-md font-medium text-gray">Email</label>	
					<input
						bind:value={email}
						type="email" required
						name="email"
						id="email"
						placeholder="Email"
						class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-3xl focus:outline-none"
					/>
				</div>
				<div class="mb-6">
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
					class=" w-full px-3 py-4 text-white bg-[#2ea44f] focus:outline-none font-medium rounded-3xl hover:bg-[#1e7d3f] duration-300 hover:scale-105"
					>Log In</button
				>
			</div>
		</div>
	</div>
</div>
<Toaster />
