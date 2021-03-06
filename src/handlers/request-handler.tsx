import React from 'react'
import * as CBI from '../cbi-api'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import { differenceInCalendarDays, isBefore, isAfter } from 'date-fns'
import redImage from '../public/red.png'
import greenImage from '../public/green.png'
import yellowImage from '../public/yellow.png'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

function assertNever(arg: never): never {
  throw Error(`expected never, got: ${arg}`)
}

function PushoverButton() {
  // https://pushover.net/api/subscriptions#buttons
  return (
    <>
      <style type="text/css">
        {`
  .pushover_button {
    box-sizing: border-box !important;
    display: inline-block;
    background-color: #eee !important;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAycHgiIGhlaWdodD0iNjAycHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iNTcgNTcgNjAyIDYwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1OC45NjQgNTguODg4KSIgb3BhY2l0eT0iLjkxIj48ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgtLjY3NDU3IC43MzgyMSAtLjczODIxIC0uNjc0NTcgNTU2LjgzIDI0MS42MSkiIGN4PSIyMTYuMzEiIGN5PSIxNTIuMDgiIHJ4PSIyOTYuODYiIHJ5PSIyOTYuODYiIGZpbGw9IiMyNDlkZjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0ibTI4MC45NSAxNzIuNTFsNzQuNDgtOS44LTcyLjUyIDE2My42NmMxMi43NC0wLjk4IDI1LjIzMy01LjMwNyAzNy40OC0xMi45OCAxMi4yNTMtNy42OCAyMy41MjctMTcuMzE3IDMzLjgyLTI4LjkxIDEwLjI4Ny0xMS42IDE5LjE4Ny0yNC41MDMgMjYuNy0zOC43MSA3LjUxMy0xNC4yMTMgMTIuOTAzLTI4LjE4IDE2LjE3LTQxLjkgMS45Ni04LjQ5MyAyLjg2LTE2LjY2IDIuNy0yNC41LTAuMTY3LTcuODQtMi4yMS0xNC43LTYuMTMtMjAuNThzLTkuODgzLTEwLjYxNy0xNy44OS0xNC4yMWMtOC0zLjU5My0xOC44Ni01LjM5LTMyLjU4LTUuMzktMTYuMDA3IDAtMzEuNzcgMi42MTMtNDcuMjkgNy44NC0xNS41MTMgNS4yMjctMjkuODg3IDEyLjgyMy00My4xMiAyMi43OS0xMy4yMjcgOS45Ni0yNC43NCAyMi4zNzMtMzQuNTQgMzcuMjQtOS44IDE0Ljg2LTE2LjgyMyAzMS43NjMtMjEuMDcgNTAuNzEtMS42MzMgNi4yMDctMi42MTMgMTEuMTg3LTIuOTQgMTQuOTQtMC4zMjcgMy43Ni0wLjQwNyA2Ljg2My0wLjI0IDkuMzEgMC4xNiAyLjQ1MyAwLjQ4MyA0LjMzMyAwLjk3IDUuNjQgMC40OTMgMS4zMDcgMC45MDMgMi42MTMgMS4yMyAzLjkyLTE2LjY2IDAtMjguODMtMy4zNS0zNi41MS0xMC4wNS03LjY3My02LjY5My05LjU1LTE4LjM3LTUuNjMtMzUuMDMgMy45Mi0xNy4zMTMgMTIuODIzLTMzLjgxIDI2LjcxLTQ5LjQ5IDEzLjg4LTE1LjY4IDMwLjM3My0yOS40ODMgNDkuNDgtNDEuNDEgMTkuMTEzLTExLjkyIDQwLjAyLTIxLjM5IDYyLjcyLTI4LjQxIDIyLjcwNy03LjAyNyA0NC44NC0xMC41NCA2Ni40LTEwLjU0IDE4Ljk0NyAwIDM0Ljg3IDIuNjkzIDQ3Ljc3IDguMDggMTIuOTA3IDUuMzkzIDIyLjk1MyAxMi41IDMwLjE0IDIxLjMyczExLjY3NyAxOS4xMSAxMy40NyAzMC44N2MxLjggMTEuNzYgMS4yMyAyNC4wMS0xLjcxIDM2Ljc1LTMuNTkzIDE1LjM1My0xMC4zNzMgMzAuNzktMjAuMzQgNDYuMzEtOS45NiAxNS41MTMtMjIuNDUzIDI5LjU2LTM3LjQ4IDQyLjE0LTE1LjAyNyAxMi41NzMtMzIuMjYgMjIuNzgtNTEuNyAzMC42Mi0xOS40MzMgNy44NC00MC4wOTMgMTEuNzYtNjEuOTggMTEuNzZoLTIuNDVsLTYyLjIzIDEzOS42NWgtNzAuNTZsMTM4LjY3LTMxMS42NHoiIGZpbGw9IiNmZmYiIHN0eWxlPSJ3aGl0ZS1zcGFjZTpwcmUiLz48L2c+PC9zdmc+)
      3px 3px no-repeat;
    background-size: 15px 15px;
    border-bottom: 2px solid rgba(22, 22, 22, 0.25) !important;
    border-right: 2px solid rgba(22, 22, 22, 0.25) !important;
    box-shadow: 0pt 2px 0pt rgba(255, 255, 255, 0.2) inset,
      0pt 2px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 3px !important;
    color: #333 !important;
    display: inline-block !important;
    font: 11px/18px Helvetica, Arial, sans-serif !important;
    font-weight: bold !important;
    cursor: pointer !important;
    height: 22px !important;
    padding: 1px 6px 20px 22px !important;
    overflow: hidden !important;
    text-decoration: none !important;
    vertical-align: middle !important;
    height: 22px !important;
  }`}
      </style>
      <a
        className="pushover_button"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
        }}
        href={`https://pushover.net/subscribe/${PUSHOVER_SUBSCRIPTION_CODE}`}
      >
        Subscribe With Pushover
      </a>
    </>
  )
}

function MetaImage({ color }: { readonly color: Color }) {
  const metaUrl =
    color === 'green'
      ? greenImage
      : color === 'yellow'
      ? yellowImage
      : color === 'red'
      ? redImage
      : assertNever(color)
  return (
    <>
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image" content={metaUrl} />
    </>
  )
}

type Color = 'red' | 'green' | 'yellow'

function responseBody(color: Color | null) {
  const now = Date.now()
  const openingDay = new Date(new Date().getFullYear(), 3, 1) // April 1
  const closingDay = new Date(new Date().getFullYear(), 10, 1) // Nov 1
  const isOpen = isAfter(now, openingDay) && isBefore(now, closingDay)
  const daysUntil = differenceInCalendarDays(now, openingDay)
  const countDownText = `T${daysUntil} Days`

  const subtitle = isOpen ? color || 'closed' : countDownText

  const element = (
    <html
      style={{
        height: '100%',
        fontFamily: `BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;`,
      }}
    >
      <head>
        <meta http-equiv="refresh" content="60" />
        <title>{subtitle} | Flag Status</title>
        {color != null && <MetaImage color={color} />}
      </head>
      <body
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: color ?? undefined,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!isOpen && <h1>{countDownText}</h1>}
        <PushoverButton />
      </body>
    </html>
  )

  return `<!DOCTYPE html>` + renderToStaticMarkup(element)
}

// see: https://developers.cloudflare.com/workers/platform/sites/start-from-worker/
async function serveStaticFiles(event: FetchEvent) {
  try {
    return await getAssetFromKV(event)
  } catch (e) {
    const pathname = new URL(event.request.url).pathname
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: 'not found',
    })
  }
}

export async function handleRequest(event: FetchEvent): Promise<Response> {
  const request = event.request
  if (request.url.endsWith('.png')) {
    return serveStaticFiles(event)
  }
  const color = await CBI.flagColor()
  return new Response(responseBody(color), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
}
