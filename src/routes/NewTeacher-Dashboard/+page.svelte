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
					class="select select-bordered focus:border-none border-gray-200 w-full h-5 max-w-xs rounded-3xl"
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
	<div class="flex flex-row card mx-10 mt-7">
		<!--ATTENDANCE-->
		<div class="w-3/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mx-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Attendance</h1>
			</div>
		</div>
        <!--RECITATION POINTS-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mx-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Recitation Points</h1>
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
		<div class="w-2/5 bg-white bg-opacity-75 rounded-3xl text-center shadow-lg mx-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Randomizer</h1>
			</div>
		</div>

        <!--GROUP CREATOR-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg mx-2">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Create Group</h1>
			</div>
		</div>

        <!--JAMBOARD-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">Jamboard</h1>
			</div>
		</div>

        <!--TO BE FOLLOWED-->
		<div class="w-2/5 bg-white bg-opacity-75 pb-12 rounded-3xl text-center shadow-lg">
			<div class="flex flex-row mt-2">
				<h1 class="pl-5 pt-2 font-medium text-md text-gray-700">To be followed</h1>
			</div>
		</div>
	</div>

</body>
