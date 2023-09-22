<style>
/* Style for the toggle when it's checked (toggled) */
.toggle-success:checked {
    background-color: #10B981; /* Green color */
}

/* Default style for the toggle when it's not checked (not toggled) */
.toggle-success {
    background-color: #EF4444; /* Red color */
}
</style>


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
					class="select select-bordered focus:border-none border-gray-200 w-full h-5 max-w-xs rounded-3xl shadow-sm"
				>
					<option disabled selected class="rounded-3xl">Select Class</option>
					<option class="rounded-3xl">Math - Diamond</option>
					<option class="rounded-3xl">English - Ruby</option>
				</select>
			</a>
			<div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 ou">
				<p class="font-medium text-md mr-5 mt-1">Hi, Teacher Monis</p>
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
			<div class="mx-auto flex row-auto">
				<div
					class="containter h-8 mt-7 mx-2 border border-gray-200 rounded-3xl w-48 flex justify-center items-center"
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
				<div
					class="containter h-8 mt-7 mx-2 border border-gray-200 rounded-3xl w-48 flex justify-center items-center"
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
							stroke="#A3A3A3"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							transform="translate(3 2)"
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
					<a class="font-medium text-sm p-2">September 21, 2023 </a>
				</div>
			</div>
		</div>
	</header>

	<div class="flex flex-row card mx-10 mt-10">
		<!--ATTENDANCE-->
		<div class="w-3/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Attendance</h1>
			</div>

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
						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Luis Santiago
							</th>
							<td class="px-6 py-2 text-center">4AC3D4G6</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-green-500 text-white font-md py-1 px-3 rounded-full text-xs"
									>Present</span
								>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success h-6 pt-2" checked />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="" class="checkbox checkbox-warning" />
							</td>
						</tr>

						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Kyle Dela Pena
							</th>
							<td class="px-6 py-2 text-center">5AC3B8G0</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-red-500 text-white py-1 px-3 rounded-full text-xs">Absent</span>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success h-6 pt-2" />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="" class="checkbox checkbox-warning" />
							</td>
						</tr>

						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Ace Dela Cuesta
							</th>
							<td class="px-6 py-2 text-center">7BQ1D8L0</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-yellow-500 text-white py-1 px-5 rounded-full text-xs"
									>Late</span
								>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success h-6 pt-2" checked />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="checked" class="checkbox checkbox-warning" />
							</td>
						</tr>

						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Luis Santiago
							</th>
							<td class="px-6 py-2 text-center">4AC3D4G6</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-green-500 text-white font-md py-1 px-3 rounded-full text-xs"
									>Present</span
								>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success h-6 pt-2" checked />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="" class="checkbox checkbox-warning" />
							</td>
						</tr>

						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Luis Santiago
							</th>
							<td class="px-6 py-2 text-center">4AC3D4G6</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-green-500 text-white font-md py-1 px-3 rounded-full text-xs"
									>Present</span
								>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success h-6 pt-2" checked />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="" class="checkbox checkbox-warning" />
							</td>
						</tr>

						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Luis Santiago
							</th>
							<td class="px-6 py-2 text-center">4AC3D4G6</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-green-500 text-white font-md py-1 px-3 rounded-full text-xs"
									>Present</span
								>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success h-6 pt-2" checked />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="" class="checkbox checkbox-warning" />
							</td>
						</tr>

						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th scope="row" class="px-6 py-2 font-medium text-gray-900 dark:text-white text-left">
								Luis Santiago
							</th>
							<td class="px-6 py-2 text-center">4AC3D4G6</td>
							<td class="px-6 py-2 text-center"> 7:00 AM </td>
							<td class="px-6 py-2">
								<span class="bg-green-500 text-white font-md py-1 px-3 rounded-full text-xs"
									>Present</span
								>
							</td>
							<td class="px-6 py-2">
								<input type="checkbox" class="toggle toggle-success  h-6 pt-2" checked />
							</td>
							<td class="px-6 py-2 text-right">
								<input type="checkbox" checked="" class="checkbox checkbox-warning" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!--RECITATION POINTS-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Recitation Points</h1>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5  max-h-80">
				<table class="w-full text-sm text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
					>
						<tr>
							<th scope="col" class="px-6 py-4 text-left"> Rank </th>
							<th scope="col" class="px-6 py-4 text-left"> Name </th>
							<th scope="col" class="px-6 py-4 text-left"> Points </th>
							<th scope="col" class="px-6 py-4 text-left"> Update Points </th>
						</tr>
					</thead>
					<tbody>
						<!-- Table row for each recitation item -->
						<tr class="border-b bg-white">
							<!-- Display the data for each recitation item -->
							<td class="text-sm text-gray-500 font-medium px-6 py-4 whitespace-nowrap">1</td>
							<td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap"
								>Luis Santiago</td
							>
							<td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">5</td>
							<td class="flex mt-2 justify-center">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<img
									src="minus.png"
									class="btn btn-sm px-1 bg-transparent hover:bg-transparent border-none"
									alt="..."
								/>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<img
									src="add.png"
									class="btn btn-sm px-1 bg-transparent hover:bg-transparent border-none"
									alt="..."
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!--TO DO-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">To Do</h1>
			</div>
		</div>
	</div>

	<!--ACTIONS-->
	<div class="flex flex-row card mx-10 mt-7">

		<!--RANDOMIZER-->
		<div class="w-2/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2 my-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Randomizer</h1>
			</div>
			<button class="my-10 h-24 w-56 btn btn-lg rounded-3xl bg-red-500 border-0 hover:bg-red-700">Randomizer</button>
		</div>

		<!--GROUP CREATOR-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Create Group</h1>
			</div>
			<button class="my-10 h-24 w-56 btn btn-lg rounded-3xl bg-green-500 border-0 hover:bg-green-700">Create Group</button>
		</div>

		<!--JAMBOARD-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Jamboard</h1>
			</div>

			<button class="my-10 h-24 w-56 btn btn-lg rounded-3xl bg-violet-500 border-0 hover:bg-violet-700">Open</button>
		</div>

		<!--TO BE FOLLOWED-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">To be followed</h1>
			</div>
		</div>
	</div>
</body>
