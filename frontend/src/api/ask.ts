import axios from 'axios'
import { Answer } from '../types/answer.type'

const BASE_URL = 'http://localhost:3000'

export async function ask(question: string): Promise<Answer> {
  const response = await axios.post<Answer>(`${BASE_URL}/ask`, { question })
  if (response.status !== 200) throw new Error(`Request failed with status ${response.status}`)
  return response.data
}