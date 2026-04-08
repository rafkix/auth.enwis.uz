"use client"

export interface UnlockedTest {
  testId: string
  unlockedAt: string
}

const STORAGE_KEY = "ielts_unlocked_tests"

export function getUnlockedTests(): string[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const unlocked: UnlockedTest[] = JSON.parse(stored)
    return unlocked.map((t) => t.testId)
  } catch {
    return []
  }
}

export function unlockTest(testId: string): void {
  if (typeof window === "undefined") return

  const unlocked = getUnlockedTests()
  if (unlocked.includes(testId)) return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const existing: UnlockedTest[] = stored ? JSON.parse(stored) : []

    existing.push({
      testId,
      unlockedAt: new Date().toISOString(),
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch (error) {
    console.error("Failed to unlock test:", error)
  }
}

export function isTestUnlocked(testId: string, isFree: boolean): boolean {
  if (isFree) return true
  return getUnlockedTests().includes(testId)
}
