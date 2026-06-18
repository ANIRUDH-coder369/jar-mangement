let currentToken: string | null = null

export function setToken(t: string | null) {
  currentToken = t
}

export function getToken() {
  return currentToken
}
