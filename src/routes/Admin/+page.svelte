<script>
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import { firebase, firestore, functions } from "$lib/firebase";
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import { Firestore, doc, getDoc } from "firebase/firestore";

  let email = "";
  let password = "";

  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userID = userCredential.user.uid;
        console.log("User: " + userID);
        // ...

        const docRef = doc(firestore, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          window.location.replace("../Admin-Dashboard");
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-slate-white">
  <div class="container mx-auto">
    <div class="max-w-md mx-auto">
      <div class="text-center">
        <a href="/..    ">
          <img src="Mwenzi.png" class="h-auto max-w-full" alt="..." />
        </a>
      </div>
      <div class="m-7">
        <div class="mb-6">
          <label for="email" class="block mb-2 text-md font-medium text-gray"
            >Username</label
          >
          <input
            bind:value={email}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="text-md font-medium text-gray"
            >Password</label
          >
          <input
            bind:value={password}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <button
          on:click={login}
          class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
          >Log In</button
        >
      </div>
    </div>
  </div>
</div>
