import { Request, Response } from 'express'
import { connect } from '../../database/database'
import { Configuration, OpenAIApi } from 'openai'

export async function askController(req: Request, res: Response): Promise<Response> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return res.status(400).send('❌ The API Key is required')

    const openAIHelper = new OpenAIHelper(apiKey)
    const { question } = req.body
    if (!question) return res.status(400).send('❌ The question is required')

    const querySentence = await openAIHelper.questionToSQL(question)
    if (!querySentence) return res.status(400).send("❌ Not possible to translate the question to SQL")

    const dbAnswerRows = await openAIHelper.dbQuery(querySentence)
    const humanReadableAnswer = await openAIHelper.explainDbAnswer(question, dbAnswerRows)

    return res.status(200).json({ querySentence, dbAnswerRows, humanReadableAnswer })
  } catch (e) {
    res.sendStatus(400)
    console.log('❌ Something bad happened')
  }
  return res.status(400)
}

class OpenAIHelper {
  private openai: OpenAIApi

  constructor(apiKey: string) {
    this.openai = new OpenAIApi(new Configuration({ apiKey }))
  }

  /**
   * This is the context needed by Chat GPT in order to translate human question to SQL
   * I'm putting this separately in case is needed somewhere else, just remember that GPT remembers 😉
   */
  private _getSchemaTextContext() {
    return `#MySQL schema table(...properties):
      #seller{id, name, branch_id}
      #branch{id, name, address}
      #customer{id, name}
      #invoice {id, created_at, seller_id, customer_id, branch_id, customer_feedback}
      #product {id, name, price}
      #invoice_item{id, invoice_id, product_id}`
  }

  /**
   * Creates an SQL query according to the user's question
   * @param question The question the user is asking to aut system
   * @param accurateButSlower Switch between davinci-002 and cushman-001 (almost as capable as Davinci, but slightly faster)
   * @returns An SQL query statement starting with `SELECT ...`
   */
  public async questionToSQL(question: string, accurateButSlower: boolean = false): Promise<string | undefined> {
    const prompt = `${this._getSchemaTextContext()}
      #Create an SQL query to: ${question}
      SELECT`
    const answer = await this.openai.createCompletion({
      model: accurateButSlower ? 'code-davinci-002' : 'code-cushman-001',
      prompt,
      temperature: 0,
      max_tokens: 200,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 2.0,
      stop: [";"]
    })
    const query = answer.data.choices[0].text

    return `SELECT ${query}` || undefined
  }
  /**
   * Gets real data accoring to an SQL query
   * @param querySentence The SQL query sentence starting with `SELECT ...`
   */
  public async dbQuery(querySentence: string): Promise<any> {
    try {
      const conn = await connect()
      const [rows] = await conn.query(querySentence)
      return rows
    } catch (e) {
      console.log(`❌ Something wrong happened with the query`, e)
      return []
    }
  }

  /**
   * Asks anything to Chat GPT
   * @param prompt The question to Chat GPT
   * @returns 
   */
  private async _ask(prompt: string): Promise<string> {
    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        max_tokens: 80,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      })
      return response.data.choices[0].text || 'Try something different'
    } catch (e) {
      console.log(`❌ Seems like there's something wrong with the question`, e)
    }
    return 'Try again'
  }

  /**
   * So, we have a structured answer like `{ "name": "John Smith", "total_sales": "61.49" }`
   * let's turn it into human readlable like `John Smith is the best seller with a total of 61.49 in sales.`
   * @param question 
   * @param sqlResult 
   * @returns 
   */
  public async explainDbAnswer(question: string, sqlResult: any): Promise<string> {
    const rowsAsText = JSON.stringify(sqlResult)
    const prompt = `Taking into consideration the following question "${question}". Give info according to the following data: ${rowsAsText}`
    const humanReadableAnswer = await this._ask(prompt)
    return humanReadableAnswer
  }
}
