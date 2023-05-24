<!-- Header Logo Center -->
<body class="bg-gray-100 w-screen h-screen">
<header class="w-full text-gray-700 bg-gray-50 border-t border-gray-100 shadow-sm body-font">
	<div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">
		<nav class="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto" />
		<p
			class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0"
		>
			<img src="Mwenzi.png" class="w-30 h-20 pb-2" alt="..." />
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

<div class="flex flex-row mx-20 my-20 justify-center">
    <div class="basis-1/2 container mt-2 pt-4 lg:w-3/6">
        <div class="h-full bg-white shadow-xl bg-opacity-75 pb-12 rounded-3xl">
            <div class="flex flex-row mt-2">
                <img src="addclass.png" class="h-10 mt-4 pl-8" alt="..." />
                <h1 class="pl-1 pt-5 pb-2 font-medium text-xl mb-5 text-gray-700">Attendance Logs</h1>
            </div>

            <!-- ADDED CLASS-->
            <div class="flex justify-center font-sans">
                <div class="flex scale-110 mt-3">
                    <div class="bg-white shadow-md rounded-xl h-64 overflow-y-scroll snap-y">
                        <table class="rounded-2xl w-full">
                            <thead>
                                <tr
                                    class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal sticky top-0"
                                >
                                    <th class="py-3 px-6 text-left">Student</th>
                                    <th class="py-3 px-6 text-center">RFID Tag</th>
                                    <th class="py-3 px-6 text-center">Time</th>
                                    <th class="py-3 px-6 text-center">Status</th>
                                </tr>
                            </thead>
                            <!--ROW 1-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Present
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 1-->

                            <!--ROW 2-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-red-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Absent
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 2-->

                            <!--ROW 3-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Present
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 3-->

                            <!--ROW 4-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Present
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 4-->

                            <!--ROW 5-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Present
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 5-->

                            <!--ROW 6-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Present
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 6-->

                            <!--ROW 7-->
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-1 px-6 text-left">
                                        <div class="flex items-center">
                                            <span>Eshal Rosas</span>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <div class="flex items-center justify-center">
                                            <p>12345678910</p>
                                        </div>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="">7:15</span>
                                    </td>
                                    <td class="py-1 px-6 text-center">
                                        <span class="bg-green-500 text-white py-1 px-3 rounded-full text-xs"
                                            >Present
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <!--END ROW 7-->
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="basis-1/2 ml-2 container mt-2 pt-4 lg:w-3/6">
        <div class="h-full bg-white shadow-lg bg-opacity-75 pb-12 rounded-3xl text-center">
            <div class="flex flex-row mt-2">
                <img src="leaderboard.png" class="h-10 mt-4 pl-9 pr-1" alt="..." />
                <h1 class="pl-1 pt-5 pb-4 font-medium text-xl text-gray-700">Leaderboards</h1>
                <div class="w-full flex flex-row-reverse items-center">
                    <h1 class="mr-12 font-medium text-xl text-gray-700">Your Rank: 4</h1>
                </div>
                <!--button class="btn">Sections</button-->
            </div>

            <!-- component -->
            <div class="flex flex-col">
                <div class="overflow-x-auto">
                    <div class="py-2 w-full sm:px-6 lg:px-8">
                        <div class=" overflow-y-scroll h-64 bg-white shadow-md rounded-xl">
                            <table class="w-full text-center">
                                <thead class="border-b sticky top-0 bg-gray-100">
                                    <tr>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                                            Rank
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                                            Name
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                                            Points
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!--RANK 1-->
                                    <tr class="border-b bg-white">
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            1
                                        </td>
                                        <td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
                                            Ace Dela Cuesta
                                        </td>
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            54
                                        </td>
                                    </tr>
                                    <!--END RANK 1-->

                                    <!--RANK 2-->
                                    <tr class="border-b bg-white">
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            2
                                        </td>
                                        <td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
                                            Kyle Dela Pena
                                        </td>
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            53
                                        </td>
                                    </tr>
                                    <!--END RANK 2-->

                                    <!--RANK 3-->
                                    <tr class="border-b bg-white">
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            3
                                        </td>
                                        <td class="text-MD text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
                                            Luis Santiago
                                        </td>
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            52
                                        </td>
                                    </tr>
                                    <!--END RANK 3-->

                                    <!--RANK 4-->
                                    <tr class="border-b bg-white">
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            4
                                        </td>
                                        <td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
                                            Lebron James
                                        </td>
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            52
                                        </td>
                                    </tr>
                                    <!--END RANK 4-->

                                    <!--RANK 5-->
                                    <tr class="border-b bg-white">
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            5
                                        </td>
                                        <td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
                                            Stephen Curry
                                        </td>
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            52
                                        </td>
                                    </tr>
                                    <!--END RANK 5-->

                                    <!--RANK 6-->
                                    <tr class="border-b">
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            6
                                        </td>
                                        <td class="text-md text-gray-900 font-medium px-6 py-3 whitespace-nowrap">
                                            Raffy T
                                        </td>
                                        <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            52
                                        </td>
                                    </tr>
                                    <!--END RANK 6-->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>