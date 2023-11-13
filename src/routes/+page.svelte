

<body class="bg-gray-100 w-auto h-auto">
	<!--HEADER-->
	<header
		class="fixed top-0 w-full text-gray-700 bg-gray-50 border-t border-gray-100 shadow-sm body-font"
		style="z-index: 9999;"
	>
		<div class="container mx-auto flex justify-between">
			<div class="flex w-full flex-row items-center justify-start px-5">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="py-3">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img src="/Mwenzi5.png" class="w-full h-12" />
				</a>
				<div class="ml-[50px] hidden space-x-10 lg:block">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a class="text-primary py-[20px] text-sm font-medium" href="/..">Home</a>
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a class="py-[29px] text-sm hover:text-primary" href="/About-Us ">About Us</a>
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a class="false py-[29px] text-sm hover:text-primary" href="">Contact Us</a>
				</div>
			</div>
		</div>
	</header>
	<!--END HEADER-->

	<!--BODY1-->
	<section class="bg-gray-100 text-gray-600 body-font mt-10">
		<div class="mt-12 container mx-auto flex flex-start px-8 md:flex-row flex-col items-center">
			<div class="flex flex-col align-middle text-left mr-8 mt-36 w-9/12">
				<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
					Mwenzi Classroom Management Tool
					<br class="hidden lg:inline-block" />
				</h1>
				<p class="mb-8 leading-relaxed text-justify">
					Experience seamless classroom management with <a class="font-bold"> Mwenzi </a>:
					Revolutionize your teaching experience with our web-based application, designed
					exclusively for
					<a
						class="underline"
						href="https://www.facebook.com/coloongelementaryschoolvalenzuelacity/"
						>Coloong Elementary School</a
					>, that integrates

					<a class="font-bold"> RFID </a> for attendance tracking, points, notes taking, randomizer,
					group creation, jamboard, and learning materials feature.
				</p>
				<div class="flex justify-left">
					<a href="/Login">
						<button
							class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600
							rounded-3xl text-lg font-medium duration-500 hover:scale-105 hover:-translate-10"
							>Try Now
						</button>
					</a>
				</div>
			</div>

			<div class="w-full mt-24">
				<video autoplay muted loop class="background-video rounded-3xl ml-4 shadow-md w-full" >
					<source src="/Slideshows.mp4" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
	</section>
	<!--END BODY 1-->

	<!--BODY2-->
	<section class="bg-gray-100 text-gray-600 body-font">
		<div class="container px-5 py-10 mx-auto">
			<div class="divider pt-20" />
			<div class="text-center mb-20 pt-10">
				<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
					An Innovative Way To Manage Class
				</h1>
				<p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
					Unveils the power of RFID integration, offering a streamlined solution <br /> for effortless
					attendance tracking and efficient administrative tasks.
				</p>
			</div>

			<div class="flex flex-wrap justify-center mx-auto w-3/5">
				<div class="p-2 sm:w-1/2 w-1/3">
					<div class="bg-gray-200 rounded-lg flex p-4 h-full items-center">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
							viewBox="0 0 24 24"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<path d="M22 4L12 14.01l-3-3" />
						</svg>
						<span class="title-font font-medium">Attendance Management</span>
					</div>
				</div>
				<div class="p-2 sm:w-1/2 w-full">
					<div class="bg-gray-200 rounded-lg flex p-4 h-full items-center">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
							viewBox="0 0 24 24"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<path d="M22 4L12 14.01l-3-3" />
						</svg>
						<span class="title-font font-medium">Points</span>
					</div>
				</div>
				<div class="p-2 sm:w-1/2 w-full">
					<div class="bg-gray-200 rounded-lg flex p-4 h-full items-center">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
							viewBox="0 0 24 24"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<path d="M22 4L12 14.01l-3-3" />
						</svg>
						<span class="title-font font-medium">Notes</span>
					</div>
				</div>
				<div class="p-2 sm:w-1/2 w-full">
					<div class="bg-gray-200 rounded-lg flex p-4 h-full items-center">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
							viewBox="0 0 24 24"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<path d="M22 4L12 14.01l-3-3" />
						</svg>
						<span class="title-font font-medium">Randomizer</span>
					</div>
				</div>
				<div class="p-2 sm:w-1/2 w-full">
					<div class="bg-gray-200 rounded-lg flex p-4 h-full items-center">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
							viewBox="0 0 24 24"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<path d="M22 4L12 14.01l-3-3" />
						</svg>
						<span class="title-font font-medium">Group Creation</span>
					</div>
				</div>
				<div class="p-2 sm:w-1/2 w-full">
					<div class="bg-gray-200 rounded-lg flex p-4 h-full items-center">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
							viewBox="0 0 24 24"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<path d="M22 4L12 14.01l-3-3" />
						</svg>
						<span class="title-font font-medium">Jamboard</span>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!--END BODY2-->

	<!--SCREENSHOTS-->

	<!--ENDSCREENSHOTS-->

	<!--DEVS-->
	<section class="bg-gray-100 text-gray-600 body-font">
		<div class="container px-5 mx-auto">
			<div class="flex flex-col text-center w-full mb-20">
				<div class="divider pt-2" />
				<h1 class="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest pt-10">
					OUR TEAM
				</h1>
				<p class="lg:w-2/3 mx-auto leading-relaxed text-base">
					A passionate group of developers that wants to think and go out of the box.
				</p>
			</div>
			<div class="flex flex-wrap -m-4">
				<div class="p-4 lg:w-1/3">
					<a href="/About-Us">
						<div
							class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left"
						>
							<img
								alt="team"
								class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
								src="/ace.jpg"
							/>
							<div class="flex-grow sm:pl-8">
								<h2 class="title-font font-medium text-lg text-gray-900">Ace Dela Cuesta</h2>
								<h3 class="text-gray-500 mb-3">Project Manager</h3>
								<p class="mb-4">
									"Driving success through effective coordination and strategic planning"
								</p>
								<span class="inline-flex">
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
										</svg>
									</a>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="ml-2 text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
											/>
										</svg>
									</a>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="ml-2 text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
											/>
										</svg>
									</a>
								</span>
							</div>
						</div>
					</a>
				</div>

				<div class="p-4 lg:w-1/3">
					<a href="/About-Us">
						<div
							class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left"
						>
							<img
								alt="team"
								class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
								src="/kyle.jpg"
							/>

							<div class="flex-grow sm:pl-8">
								<h2 class="title-font font-medium text-lg text-gray-900">Kyle Dela Peña</h2>
								<h3 class="text-gray-500 mb-3">Back-End Developer</h3>
								<p class="mb-4">
									"Powering the unseen foundation that brings functionality to life"
								</p>
								<span class="inline-flex">
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
										</svg>
									</a>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="ml-2 text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
											/>
										</svg>
									</a>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="ml-2 text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
											/>
										</svg>
									</a>
								</span>
							</div>
						</div>
					</a>
				</div>

				<div class="p-4 lg:w-1/3">
					<a href="/About-Us">
						<div
							class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left"
						>
							<img
								alt="team"
								class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
								src="/wis.jpg"
							/>
							<div class="flex-grow sm:pl-8">
								<h2 class="title-font font-medium text-lg text-gray-900">Luis Santiago</h2>
								<h3 class="text-gray-500 mb-3">Front-End Developer</h3>
								<p class="mb-4">"Crafting immersive experiences that captivate and engage users"</p>
								<span class="inline-flex">
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
										</svg>
									</a>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="ml-2 text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
											/>
										</svg>
									</a>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a class="ml-2 text-gray-500">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											class="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
											/>
										</svg>
									</a>
								</span>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</section>
	<!--END DEVS-->

	<div class="bg-gray-100 h-36" />
	<!--FOOTER-->
	<footer class="bg-gray-50 shadow-sm text-gray-600 body-font">
		<div class="container px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
			>
				<span class="ml-3 text-xl">Mwenzi</span>
			</a>
			<p
				class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4"
			>
				© 2023
			</p>

			<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
				<!--VIEW OUR POLICY-->

				<!--TERMS AND CONDITION-->
				<label
					for="my-modal-3"
					class="btn-sm bg-gray-50 border-none text-gray-800 cursor-pointer normal-case"
				>
					Terms & Condition
				</label>
				<input type="checkbox" id="my-modal-3" class="modal-toggle" />
				<label for="my-modal-3" class="modal cursor-pointer">
					<label class="modal-box relative h-4/6 w-2/3" for="">
						<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2">✕</label>

						<h3 class="text-lg font-bold text-center items-center">Terms & Condition</h3>
						<p class="py-4" />
					</label>
				</label>
				<!--END TERMS AND CONDITION-->

				<!--PRIVACY POLICY-->
				<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
					<label
						for="my-modal-4"
						class="btn-sm bg-gray-50 border-none text-gray-800 cursor-pointer normal-case"
					>
						Privacy Policy
					</label>
					<input type="checkbox" id="my-modal-4" class="modal-toggle" />
					<label for="my-modal-4" class="modal cursor-pointer">
						<label class="modal-box relative h-4/6 w-2/3" for="">
							<label for="my-modal-4" class="btn btn-sm btn-circle absolute right-2">✕</label>

							<h3 class="text-lg font-bold text-center items-center">Privacy Policy</h3>
							<p class="py-4" />
							This Privacy Policy describes how we collect, use, and disclose your personal information
							when you use our web application.<br /> <br />

							<p class="font-bold">1. Information We Collect <br /></p>
							We may collect the following types of personal information:
							<br />
							<p class="pl-5">
								• Name: We may collect your name to personalize your experience within the web
								application.
								<br />
							</p>
							<p class="pl-5">
								• Email Address: We may collect your email address to communicate with you and
								provide important updates. <br />
							</p>
							<p class="pl-5">
								• User Role: If you register as a teacher, we may collect information about your
								role for authentication and access control purposes. <br />
							</p>
							<p class="font-bold">2. How We Use Your Information</p>
							We may use your personal information for the following purposes:
							<br />
							<p class="pl-5">
								• Providing and improving the web application: We use your information to deliver
								personalized features, enhance user experience, and optimize the performance of the
								web application.
								<br />
							</p>
							<p class="pl-5">
								• Communication: We may use your email address to send you important updates,
								notifications, and promotional materials related to the web application. <br />
							</p>
							<p class="pl-5">
								• Authentication and Access Control: If you register as a teacher, we may use your
								information to authenticate your identity and control access to specific features or
								content.
								<br />
							</p>
							<p class="font-bold">3. Information Sharing and Disclosure <br /></p>
							We do not sell, trade, or rent your personal information to third parties. However, we
							may share your information in the following circumstances:<br />
							<p class="pl-5">
								• Service Providers: We may engage trusted third-party service providers to assist
								us in operating and maintaining the web application. These service providers will
								have access to your personal information only to perform specific tasks on our
								behalf and are obligated not to disclose or use it for any other purpose. <br />
							</p>
							<p class="pl-5">
								• Legal Requirements: We may disclose your personal information if required to do so
								by law or in response to valid requests by public authorities (e.g., a court or
								government agency). <br />
							</p>
							<p class="font-bold">4. Data Security<br /></p>
							<p class="pl-5">
								• We implement reasonable security measures to protect your personal information
								against unauthorized access, alteration, disclosure, or destruction. However, please
								be aware that no method of transmission over the internet or electronic storage is
								100% secure and reliable, and we cannot guarantee absolute security. <br />
							</p>
							<p class="font-bold">5. Your Choices and Rights <br /></p>
							You have the right to access, correct, or delete your personal information.<br />
							<p class="pl-5">
								• If you wish to exercise any of these rights or have any questions or concerns
								about our privacy practices, please contact us using the contact information
								provided below.
								<br />
							</p>
							<p class="font-bold">6. Changes to This Privacy Policy <br /></p>
							<p class="pl-5">
								• We may update this Privacy Policy from time to time. We will notify you of any
								changes by posting the updated policy on this page. <br />
							</p>
							<p class="font-bold">7. Contact Us <br /></p>
							<p class="pl-5">
								• If you have any questions or suggestions regarding this Privacy Policy or our
								privacy practices, please contact us at ________________
							</p>
						</label>
					</label>
				</span>

				<!--COPYRIGHT INFORMATION-->
				<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
					<label
						for="my-modal-5"
						class="btn-sm bg-gray-50 border-none text-gray-800 cursor-pointer normal-case"
					>
						Copyright Information
					</label>
					<input type="checkbox" id="my-modal-5" class="modal-toggle" />
					<label for="my-modal-5" class="modal cursor-pointer">
						<label class="modal-box relative h-4/6 w-2/3" for="">
							<label for="my-modal-5" class="btn btn-sm btn-circle absolute right-2">✕</label>

							<h3 class="text-lg font-bold text-center items-center">Copyright Information</h3>
							<p class="py-4" />
						</label>
					</label>
				</span>
				<!--END COPYRIGHT INFORMATION-->
			</span>
		</div>
	</footer>
	<!--ENDFOOTER-->
</body>
