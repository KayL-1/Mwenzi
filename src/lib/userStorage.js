import { writable, readable, derived } from 'svelte/store'
import { browser } from "$app/environment"

export const userId = writable(browser && localStorage.getItem("userId") || "webjeda")

userId.subscribe((val) => {
  if (browser) return (localStorage.userId = val)
})

export const subjectSelected1 = writable(browser && localStorage.getItem("subjectSelected1") || "webjeda")
export const timeFrom = writable(browser && localStorage.getItem("timeFrom") || "webjeda")
export const timeTo = writable(browser && localStorage.getItem("timeIn") || "webjeda")

subjectSelected1.subscribe((val) => {
  if (browser) return (localStorage.subjectSelected1 = val)
})

timeFrom.subscribe((val) => {
  if (browser) return (localStorage.timeFrom = val)
})

timeTo.subscribe((val) => {
  if (browser) return (localStorage.timeTo = val)
})

