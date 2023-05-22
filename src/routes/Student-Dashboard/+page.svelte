 <!-- Header Logo Center -->
 <header class="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
    <div class="container flex flex-col flex-wrap items-center pt-2 mx-auto md:flex-row">

    <nav class="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto">
    </nav>
    <p class="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0">
        <img src="Mwenzi.png" class="w-30 h-24" alt="...">
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

<div class='flex mt-20 min-h-screen bg-slate-white'>
    <div class="container mx-auto">
        <div class="max-w-md mx-auto">
            <div class="text-center">
            </div>
            <div class="m-7">   
                <form action="?/" method="POST">
                    <div class="mb-6">
                        <label for="listofstudents" class="block mb-2 text-md font-medium text-gray">My Attendance</label>
                        <ul class="border border-gray-200 rounded overflow-hidden shadow-md">
                            <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Time | RFID Tag</li>
                            <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Time | RFID Tag</li>
                            <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Time | RFID Tag</li>
                            <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Time | RFID Tag</li>
                            <li class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">Time | RFID Tag</li>
                        </ul>
                </form>
            </div>
        </div>
    </div>
</div>

