import { writable, readable, derived } from 'svelte/store'
import { browser } from "$app/environment"

export const userId = writable(browser && localStorage.getItem("userId") || "webjeda")
userId.subscribe((val) => {
  if (browser) return (localStorage.userId = val)
})