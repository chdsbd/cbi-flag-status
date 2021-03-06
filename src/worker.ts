import { handleScheduled } from './handlers/schedule-handler'
import { handleRequest } from './handlers/request-handler'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event))
})

addEventListener('scheduled', (event) => {
  event.waitUntil(handleScheduled(event))
})
