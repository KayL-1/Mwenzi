 <!-- Header Logo Center -->
 <header class="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
    <div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">

    <nav class="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto">
    </nav>
    <p class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0">
        <img src="Mwenzi.png" class="w-30 h-20" alt="...">
    </p>
        <div class="inline-flex items-center h-full lg:w-2/5 lg:justify-end lg:ml-0">
            
            <button class="dropdown dropdown-end">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="green" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul tabindex="0" class="text-center mt-2 dropdown-content shadow bg-base-100 rounded-md w-40 h-20 ">
                <li class="rounded-md hover:bg-gray-200"><a href="/.." class="ml-12 py-2 flex align-center font-medium">Settings</a></li>
                <li class="rounded-md hover:bg-gray-200"><a href="/.." class="ml-12 py-2 flex text-center font-medium  ">Log out</a></li>
                </ul>
            </button>
        </div>
    </div>
</header>

<section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-wrap -m-4">
        <div class="p-4 lg:w-1/3">
          <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
            <!--ADD CLASS-->
            <div class="container mx-auto">
                <div class="max-w-md mx-auto">
                    <div class="text-center">
                    </div>
                    <div class="m-7">   
                        <form action="?/" method="POST">
                            <div class="mb-6">

                                <label for="class" class="block mb-2 text-md font-medium text-gray">Add Class</label>
                                <input type="name" name="gradelevel" id="grade" placeholder="Grade Level" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                                <input type="name" name="classname" id="classname" placeholder="Class Name" class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                            </div>
                                <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>

                        </form>
                    </div>
                </div>
            </div>
            <!--END-->
          </div>
        </div>
        <div class="p-4 lg:w-1/3">
          <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">

            <!--REGISTER STUDENT-->
            <div class="max-w-md mx-auto">
                <div class="text-center">
                </div>
                <div class="m-7">   
                    <form action="?/" method="POST">
                        <div class="mb-6">
                            <label for="student" class="block mb-2 text-md font-medium text-gray">Register Student</label>
                            <input type="name" name="fullname" id="studentfullname" placeholder="Full Name" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                            <input type="number" name="rfid" id="tag" placeholder="RFID Tag" class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                        </div>
    
                        <form action="?/" method="POST">
                            <div class="mb-6">
                                <label for="class" class="block mb-2 text-md font-medium text-gray">Select Class</label>
                                <select class="pl-2 py-2 w-full rounded-md border border-gray-300 focus:bg-white text-md">
                                    <option value="">Select Class</option>
                                  </select>
                            </div>
    
                            <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>
                    </form>
                </div>
            </div>
            <!--END-->
          </div>
        </div>

        <div class="p-4 lg:w-1/3">
          <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">

            <!--CREATE TEACHER'S ACCOUNT-->
            <div class="max-w-md mx-auto">
                <div class="text-center">
                </div>
                <div class="m-7">   
                    <form action="?/" method="POST">
                        <div class="mb-6">
                            <label for="teacher" class="block mb-2 text-md font-medium text-gray">Create Teacher's Account</label>
                            <input type="name" name="fullname" id="teacherfullname" placeholder="Full Name" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                            <input type="password" name="password" id="password" placeholder="Password" class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                            <input type="password" name="confpassword" id="confpassword" placeholder="Confirm Password" class="mt-3 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                        </div>
    
                        <form action="?/" method="POST">
                            <div class="mb-6">
                                <label for="teacherclass" class="block mb-2 text-md font-medium text-gray">Add Class to Teacher</label>
                                <select class="pl-2 py-2 w-full rounded-md border border-gray-300 focus:bg-white text-md">
                                    <option value="">Select Class</option>
                                  </select>
                            </div>
    
                            <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>
                    </form>
                </div>
            </div>
            <!--END-->
          </div>
        </div>
      </div>
    </div>
  </section>


<!--div class='flex items-center flex-col justify-center pt-20 bg-slate-white'>
    <div class="container mx-auto">
        <div class="max-w-md mx-auto">
            <div class="text-center">
            </div>
            <div class="m-7">   
                <form action="?/" method="POST">
                    <div class="mb-6">
                        <label for="username" class="block mb-2 text-md font-medium text-gray">Add Class</label>
                        <input type="username" name="username" id="username" placeholder="Add Student" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                    </div>
                        <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>
                </form>
            </div>
        </div>
    </div>

    <div class="container mx-auto">
        <div class="max-w-md mx-auto">
            <div class="text-center">
            </div>
            <div class="m-7">   
                <form action="?/" method="POST">
                    <div class="mb-6">
                        <label for="username" class="block mb-2 text-md font-medium text-gray">Register Student</label>
                        <input type="username" name="username" id="username" placeholder="Full Name" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                    </div>

                    <form action="?/" method="POST">
                        <div class="mb-6">
                            <label for="username" class="block mb-2 text-md font-medium text-gray">Select Class</label>
                            <input type="username" name="username" id="username" placeholder="Full Name" class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"/>
                        </div>

                        <button class=" w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none">Add</button>
                </form>
            </div>
        </div>
    </div>

</div-->
