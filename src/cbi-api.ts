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

export async function flagColor() {
  const response = await fetch('https://api.community-boating.org/api/flag')
  return parseFlagColor(await response.text())
}
