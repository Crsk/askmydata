import { Answer as AnswerType } from "../../types/answer.type"
import './answer.module.css'

export default function Answer({ querySentence, dbAnswerRows, humanReadableAnswer }: AnswerType) {
  return <>
    <h3>{humanReadableAnswer}</h3>
    <code>
      {querySentence}
      <br />
      <table>
        <thead>
          <tr>{dbAnswerRows.map(row => Object.keys(row).map((key, i) => <th key={i}>{key}</th>))}</tr>
        </thead>
        <tbody>
          {dbAnswerRows.map((row, i) => <tr key={i}>{Object.values(row).map((value, j) => <td key={j}>{value}</td>)}</tr>)}
        </tbody>
      </table>
    </code>
  </>
}