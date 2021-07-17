function parseFlagColor(apiColor: string) {
  if (apiColor.includes('"G"')) {
    return 'green'
  }
  if (apiColor.includes('"Y"')) {
    return 'yellow'
  }
  if (apiColor.includes('"R"')) {
    return 'red'
  }
  return null
}

function responseBody(color: string | null) {
  return `
  <!DOCTYPE html>
  <head>
  <meta http-equiv="refresh" content="60">
  <title>flag color (${color})</title>
  </head>
  <body style="height: 100%; width: 100%; background-color: ${color}"></body>
  `
}

export async function handleRequest(request: Request): Promise<Response> {
  const response = await fetch('https://api.community-boating.org/api/flag')
  const color = parseFlagColor(await response.text())
  return new Response(responseBody(color), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
}
