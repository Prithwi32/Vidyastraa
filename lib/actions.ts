export async function fetchQuestions(subject?: string) {
    const url = subject ? `/api/questions?subject=${subject}` : '/api/questions'
  
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return data.questions || []
  }
  