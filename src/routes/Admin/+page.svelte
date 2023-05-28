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

					if (userData.userRole === 'admin') {
						console.log('User is a Student');
						userId.set(userID);
						userUID = localStorage.getItem('userId');
						toast.success('Log In Successful');
						window.location.replace('../Admin-Dashboard');
					} else {
						console.log('User is not an admin');
						toast.error('User is not an admin');
						// Handle case when user is not an admin
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

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="container mx-auto">
		<div class="max-w-md mx-auto">
			<div class="text-center">
				<a href="/Login">
					<img src="Mwenzi.png" class="h-auto max-w-full duration-500 hover:scale-105 hover:-translate-10" alt="..." />
				</a>
			</div>
			<div class="m-7">
				<form>
					<div class="mb-4">
						<label for="email" class="block mb-2 text-md font-medium text-gray">Username</label>
						<input
							bind:value={email}
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-3xl focus:outline-none"
							required
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
							required
						/>
					</div>
					<button
						on:click={login}
						type="submit"
						class="w-full px-3 py-4 text-white font-medium rounded-3xl bg-[#2ea44f] hover:bg-[#1e7d3f] focus:outline-none duration-300 hover:scale-105"
						>Log In</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
<Toaster />