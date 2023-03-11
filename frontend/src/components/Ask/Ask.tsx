import { useState } from "react"
import { ask } from "../../api/ask"
import { Answer as AnswerType } from "../../types/answer.type"
import Answer from "../Answer/Answer"
import './ask.module.css'

export default function Ask() {
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [answer, setAnswer] = useState<AnswerType>({ querySentence: '', dbAnswerRows: [], humanReadableAnswer: '' })

  const handleQuestion = async (e: any) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { querySentence, dbAnswerRows, humanReadableAnswer } = await ask(question)
      setAnswer({ querySentence, dbAnswerRows, humanReadableAnswer })
      setLoading(false)
    } catch (e) {
      console.error(e)
      alert('❌ Something bad happened')
      setLoading(false)
    }
  }

  return <>
    <h1>Ask My Data ᐛ</h1>

    {loading
      ? <p>Thinking about "{question}"...</p>
      : <form onSubmit={handleQuestion}>
        <input type='text' value={question} onChange={(e) => setQuestion(e.target.value)} autoComplete='off' />
        <input type='hidden' onClick={handleQuestion} />
      </form>
    }

    <Answer {...answer}></Answer>
  </>
}