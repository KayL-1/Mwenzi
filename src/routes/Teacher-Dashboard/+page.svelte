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

<div class="mt-20 pt-4 lg:w-1/3 mx-auto">
    <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
    <h1 class="font-medium text-xl mb-5 text-gray-700">ADD CLASS</h1>

    
    <!-- ADDED CLASS-->
    <label for="my-modal-3" class="btn btn-xl bg-[#2ea44f] border-transparent hover:bg-[#23853f] hover:border-transparent ">RAMBUTAN</label>
    <input type="checkbox" id="my-modal-3" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box w-full">
            <table class="table-fixed text-left flex-grow">
                <thead class="sticky top-0">
                    <label for="my-modal-3" class="btn btn-xs btn-circle absolute right-1">✕</label>
                    
                  <tr>
                    <th class="w-40">Student</th>
                    <th class="w-32">RFID</th>
                    <th class="w-32">Time</th>
                    <th class="pl-7 w-32">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Luis Santiago</td>
                    <td>6C 09 88 17</td>
                    <td>HH:MM:SS XM</td>
                    <td>
                        <div class="badge w-20 ml-5 bg-green-500 border-transparent">Present</div>
                    </td>
                  </tr>

                  <tr>
                    <td>Kyle Dela Pena</td>
                    <td>1A 01 32 43</td>
                    <td>HH:MM:SS XM</td>
                    <td>
                        <div class="badge w-20 ml-5 bg-yellow-500 border-transparent">Late</div>
                    </td>
                  </tr>

                  <tr>
                    <td>Ace Dela Cuesta</td>
                    <td>5E 08 47 12</td>
                    <td>HH:MM:SS XM</td>
                    <td>
                        <div class="badge w-20 ml-5 bg-red-500 border-transparent">Absent</div>
                    </td>
                  </tr>
            
                </tbody>
              </table>
        </div>
    </div>


    <!-- ADD/SELECT CLASS-->
    <label for="my-modal-4" class="btn btn-xl bg-gray-100 border-gray-300 border-2 hover:bg-gray-200 hover:border-transparent text-gray-400 pl-5">ADD CLASS
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
    </label>
    <input type="checkbox" id="my-modal-4" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box relative">
            <label for="my-modal-4" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
            <h1 class="font-medium text-l mb-5 text-gray-700">SELECT CLASS</h1>
            <select
            id="classSelect1"
            class="pl-2 py-2 w-full rounded-md border placeholder-gray-300 border-gray-300 text-md"
            >
            </select>
            <button
            class="mt-3 w-full px-3 py-4 text-white rounded-md bg-[#2ea44f] focus:outline-none"
            >Add</button>
               
           
        </div>
    </div>

    

    <!--ATTENDANCE LIST-->
    <!--div class='flex mt-20 min-h-screen bg-slate-white'>
        <div class="container mx-auto">
            <div class="max-w-md mx-auto">
                <div class="text-center">
                </div>
                <div class="m-7">   
                    <form action="?/" method="POST">
                        <div class="mb-6">
                            <label for="listofstudents" class="block mb-2 text-md font-medium text-gray">List of Students</label>
                            <ul class="border border-gray-200 rounded overflow-hidden shadow-md">
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 1 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 2 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 3 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 4 | RFID Tag</li>
                                <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Student 5 | RFID Tag</li>
                            </ul>
                    </form>
                </div>
            </div>
        </div>
    </div-->
    <!--ATTENDANCE LIST-->
</div>
</div>



