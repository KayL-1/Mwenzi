<body class="bg-gray-100 w-screen h-screen">
<header class="w-full text-gray-700 bg-gray-50 border-t border-gray-100 shadow-sm body-font">
	<div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">
		<button>
			<a href="/Admin-Dashboard" id="Teacher">
				<img src="back.png" class="w-8 h-8 ml-5" alt="..." />
			</a>
		</button>
		<nav class="flex flex-wrap items-center text-base lg:w-50 md:ml-auto" />
		<p
			class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0"
		>
			<img src="Mwenzi.png" class="w-30 h-20 pb-2" alt="..." />
		</p>

		<div class="inline-flex items-center h-full lg:w-2/5 lg:justify-start lg:ml-0" />
	</div>
</header>

<section class="text-gray-600 body-font">
	<div class="container px-5 py-24 mx-auto">
		<div class="flex flex-row m-4 justify-center">
			<div class="p-4 lg:w-2/5">
				<div
					class="h-full bg-white bg-opacity-75 px-8 pt-16 pb-24 rounded-2xl shadow-2xl overflow-hidden text-center relative"
				>
					<!--ADD CLASS-->
						<div class=" max-w-md mx-auto">
							<div class="text-center"/>
							<div class="m-7">
								<div class="mb-6">
									<label for="class" class="block mb-6 text-lg font-medium text-gray"
										>Update Student Data</label
									>
									<input
										type="name"
										name="gradelevel"
										id="grade"
										placeholder="Student Number"
										class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
									<input
										type="name"
										name="classname"
										id="classname"
										placeholder="RFID Tag"
										class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
									/>
								</div>
								<button
									class=" w-full px-3 py-4 text-white font-medium  rounded-2xl bg-[#2ea44f] focus:outline-none"
									>Update</button
								>
							</div>
						</div>
					<!--END-->
				</div>
			</div>
			<div class="p-4 lg:w-2/5">
				<div
					class="h-full bg-white shadow-2xl bg-opacity-75 px-8 pt-16 pb-24 rounded-2xl overflow-hidden text-center relative"
				>
					<!--REGISTER STUDENT-->
					<div class="max-w-md mx-auto">
						<div class="text-center" />
						<div class="m-7">
							<div class="mb-6">
								<label for="student" class="block mb-6 text-lg font-medium text-gray"
									>Update Teacher's Subject</label
								>
								<input
									type="name"
									name="fullname"
									id="studentfullname"
									placeholder="Teacher UID"
									class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
								/>
								<input
									type="email"
									name="studentEmail"
									id="studentEmail"
									placeholder="Class"
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
								/>
								<input
									type="text"
									name="rfidStudent"
									id="rfidStudent"
									placeholder="Subject"
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
								/>
							</div>

							<button
								class="mt-3 w-full px-3 py-4 text-white font-medium rounded-2xl bg-[#2ea44f] focus:outline-none"
								>Update</button
							>
						</div>
					</div>
					<!--END-->
				</div>
			</div>

			<div class="p-4 lg:w-2/5">
				<div
					class="h-full bg-white shadow-2xl bg-opacity-75 px-8 pt-16 pb-24 rounded-2xl overflow-hidden text-center relative"
				>
					<!--REGISTER STUDENT-->
					<div class="max-w-md mx-auto">
						<div class="text-center" />
						<div class="m-7">
							<div class="mb-6">
								<label for="student" class="block mb-6 text-lg font-medium text-gray"
									>Delete Data</label
								>
								<select
										id=""
										class="mb-3 pl-2 py-2 w-full rounded-2xl border placeholder-gray-300 border-gray-300 text-md"
										
									>
								</select>
								<input
									type="name"
									name="fullname"
									id="studentfullname"
									placeholder="UID"
									class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
								/>
								<input
									type="email"
									name="studentEmail"
									id="studentEmail"
									placeholder="Class"
									class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-2xl focus:outline-none"
								/>	
							</div>

							<button
								class="mt-3 w-full px-3 py-4 text-white font-medium rounded-2xl bg-red-500 focus:outline-none"
								>Delete</button
							>
						</div>
					</div>
					<!--END-->
				</div>
			</div>
		</div>
	</div>
</section>
</body>