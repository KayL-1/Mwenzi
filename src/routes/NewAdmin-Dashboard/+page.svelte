<body class=" bg-gray-50 h-screen">
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
					class=" border-gray-200 w-32 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
				>
					<option disabled selected hidden class="rounded-3xl">Dashboard</option>
					<option class="rounded-3xl">List</option>
					<option class="rounded-xl">Only Me</option>
					<option class="rounded-xl">Subject Class</option>
				</select></a
			>
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

	<div class="flex flex-row card mx-10 h-3/4">
		<!--ATTENDANCE-->
		<div class="w-3/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-row">
					<img src="addclass.png" class="h-8 pl-6 mt-2" alt="..." />
					<h1 class="pt-2 pl-1 mt-1 font-medium text-md text-gray-700">subject Class List</h1>
				</div>
			</div>

			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-5 h-96 max-h-96">
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

		<!--POINTS-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mr-2">
			<div class="flex flex-row mt-2">
				<img src="leaderboard.png" class="h-8 pl-6 pr-1 mt-1" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Points</h1>
			</div>
			<select
				class="mt-2 border-gray-200 w-56 h-6 font-medium text-sm text-center mr-3 border border-gray focus:none rounded-3xl shadow-sm"
			>
				<option disabled selected hidden class="rounded-3xl">Select Interval</option>
				<option class="rounded-xl">Daily</option>
				<option class="rounded-xl">Weekly</option>
				<option class="rounded-xl">Monthly</option>
			</select>
			<div class="relative overflow-y-auto shadow-sm rounded-xl mx-5 my-4 max-h-80">
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
							<td class="text-sm text-gray-500 font-medium px-6 py-4 whitespace-nowrap" />
							<td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap" />
							<td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap" />
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
				<img src="todo.png" class="h-7 pl-6 mt-2" alt="..." />
				<h1 class="pl-1 pt-2 font-medium text-md text-gray-700">Notes</h1>
			</div>
			<div class="flex flex-row items-center mt-2 justify-center">
				<input
					class="pl-4 border border-r-0 rounded-l-3xl focus:ring-0 text-sm block bg-white w-64 h-7 border-slate-300 shadow-sm focus:outline-none"
					placeholder="Add Notes"
					type="text"
					name="search"
				/>
				<button
					class="add-button w-12 h-7 border border-slate-300 rounded-r-3xl bg-blue-500 hover:bg-blue-700 border-none transform transition-transform focus:scale-100 active:scale-95"
				>
					<svg
						width="20px"
						height="20px"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						class="ml-3"
						><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						/><g id="SVGRepo_iconCarrier">
							<path
								fill="#f2f2f2"
								fill-rule="evenodd"
								d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"
							/>
						</g></svg
					>
				</button>
			</div>
			<div class="divider mb-1" />

			<!--TO DO LIST-->
			<div class="mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1">
				<h1 class="font-medium text-sm">· Study Lesson 1</h1>

				<div class="flex items-center">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label
						class=" border-gray-200 w-36 h-6 mr-1 font-medium text-sm text-center border border-gray focus:none rounded-3xl shadow-sm"
						>Notes from Teacher
					</label>

					<button>
						<img
							src="done.png"
							class="h-7 transform transition-transform focus:scale-100 active:scale-90"
							alt="..."
						/>
					</button>
					<button>
						<img
							src="delete.png"
							class="h-7 transform transition-transform focus:scale-100 active:scale-90"
							alt="..."
						/>
					</button>
				</div>
			</div>

			<div class="mt-2 flex flex-row justify-between w-full items-center px-7 border-b pb-1">
				<h1 class="font-medium text-sm">· Study Lesson 1</h1>

				<div class="flex items-center">
					<!-- svelte-ignore a11y-label-has-associated-control -->

					<button>
						<img
							src="done.png"
							class="h-7 transform transition-transform focus:scale-100 active:scale-90"
							alt="..."
						/>
					</button>
					<button>
						<img
							src="delete.png"
							class="h-7 transform transition-transform focus:scale-100 active:scale-90"
							alt="..."
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</body>
