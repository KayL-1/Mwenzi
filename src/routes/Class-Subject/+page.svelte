<script>
	// Function to handle changes in the selected option
	function handleSelectChange(event) {
		const selectedOption = event.target.value;

		if (selectedOption === '/NewAdmin-Dashboard') {
			window.location.href = selectedOption;
		}
	}
</script>

<body class=" bg-gray-50 h-screen w-full">
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
					class="select select-bordered focus:border-none border-gray-200 w-full h-5 max-w-xs rounded-3xl shadow-sm"
					on:change={handleSelectChange}
				>
					<option disabled selected hidden class="rounded-3xl">Class Subject</option>
					<option value="/NewAdmin-Dashboard" id="NewAdmin-Dashboard" class="rounded-3xl"
						>Dashboard</option
					>
					<option class="rounded-xl">Students</option>
					<option class="rounded-xl">Teachers</option>
				</select>
			</a>
			<div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 ou">
				<p class="font-medium text-md mr-5 mt-1">Hi, Mwenzi Admin</p>
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
				<div />

				<!--RFID STATUS, DATE, SUBJECT TIME -->
				<div class="flex flex-row w-1/3 justify-end">
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
						<!-- svelte-ignore a11y-missing-content -->
						<a class="font-medium text-sm p-2">09/29/23</a>
					</div>
				</div>
				<!--END RFID STATUS, DATE, SUBJECT TIME -->
			</div>
		</div>
	</header>

	<div class="flex flex-row card h-3/4 w-full justify-center">
		<!--ATTENDANCE-->
		<div class="w-4/5 h-full bg-white bg-opacity-75 rounded-3xl pb-20 text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row">
					<img src="class.png" class="h-8 pl-6 mt-2" alt="..." />
					<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">Class Subject List</h1>
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-full max-h-5/6">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-center">Subject Class Name</th>
							<th scope="col" class="px-6 py-4 text-center">Total Students</th>
							<th scope="col" class="px-6 py-4 text-center">Teacher</th>
							<th scope="col" class="px-6 py-4 text-center">Time</th>
						</tr>
					</thead>
					<tbody>
						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<td class="text-center">Guyabano - Research</td>
							<td class="px-6 py-2 text-center">40</td>
							<td class="py-1 px-6 text-center">Ruffa May Monis</td>
							<td>8:00 AM - 10:00 AM</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

	</div>
</body>
