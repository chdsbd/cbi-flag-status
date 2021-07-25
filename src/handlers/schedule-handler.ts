import * as t from 'io-ts'
import { isRight } from 'fp-ts/Either'

import * as CBI from '../cbi-api'

declare global {
  const FLAG_HISTORY: KVNamespace
  const PUSHOVER_APP_TOKEN: string
  const PUSHOVER_USER_ID: string
  const PUSHOVER_SUBSCRIPTION_CODE: string
}

async function getPreviousColor() {
  const previousColor = colorSchema.decode(
    await FLAG_HISTORY.get('last_status'),
  )
  if (isRight(previousColor)) {
    return previousColor.right
  }
  return null
}

const colorSchema = t.union([
  t.literal('green'),
  t.literal('yellow'),
  t.literal('red'),
])

type Color = t.TypeOf<typeof colorSchema>

const FLAG_EXPIRATION_SECONDS = 1 * 60 * 60

async function storeColor(color: Color) {
  await FLAG_HISTORY.put('last_status', color, {
    expirationTtl: FLAG_EXPIRATION_SECONDS,
  })
}

async function sendNotification(msg: string) {
  await fetch('https://api.pushover.net/1/messages.json', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: PUSHOVER_APP_TOKEN,
      user: PUSHOVER_USER_ID,
      message: msg,
    }),
  })
}

const COLOR_MESSAGES = {
  green: `🟢 Green flag raised. It's a calm day for sailing.`,
  yellow: `🟡 Yellow flag raised. It's breezy out there.`,
  red: `🔴 Red flag raised. Get ready for some wind!`,
}

export async function handleScheduled(event: ScheduledEvent): Promise<void> {
  const color = await CBI.flagColor()
  if (!color) {
    return
  }
  const previousColor = await getPreviousColor()
  if (color != previousColor) {
    await sendNotification(COLOR_MESSAGES[color])
  }
  await storeColor(color)
}
