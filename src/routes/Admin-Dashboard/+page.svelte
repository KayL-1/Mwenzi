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
		<div class="container mt-20 pt-4 lg:w-1/4 pr-2">
			<div class="h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden">
				<div class="flex flex-row mt-2 justify-center">
					<img src="register.png" class="h-10 mt-4" alt="..." />
					<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl mb-5 text-gray-700">REGISTER</h1>
				</div>

				<!-- ADDED CLASS-->
				<div class="flex flex-row justify-center">
					<a href="/Admin-Register">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label
							class="btn h-28 w-48 bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent text-xl"
							>REGISTER</label
						>
					</a>
				</div>
			</div>
		</div>
		<div class="container mt-20 pt-4 lg:w-1/4 pl-2">
			<div class="h-full bg-gray-100 bg-opacity-75 pb-16 rounded-lg overflow-hidden">
				<div class="flex flex-row mt-2 justify-center">
					<img src="update.png" class="h-10 mt-4" alt="..." />
					<h1 class="pl-1 pt-5 pb-2 font-medium text-2xl mb-5 text-gray-700">UPDATE</h1>
				</div>

				<!-- ADDED CLASS-->
				<div class="flex flex-row justify-center">
					<a href="/Admin-Update">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label
							class="btn h-28 w-48 bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent text-xl"
							>UPDATE</label
						>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
