import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, isResearch = false, fileContent } = await request.json()
    console.log('API received request:', { message, isResearch, hasFileContent: !!fileContent })

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Build the user message with file content if available
    let userMessage = message
    if (fileContent) {
      userMessage = `${message}\n\n--- File Content ---\n${fileContent}\n--- End File Content ---`
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: isResearch 
            ? 'You are Bizora AI conducting comprehensive research. Provide detailed, well-structured responses with key insights, important facts, and practical recommendations. Use markdown formatting with headers (##), bullet points (-), numbered lists (1.), **bold text**, *italics*, and code blocks when appropriate. Make your responses visually appealing and easy to scan. If file content is provided, analyze it thoroughly and reference specific parts of the document in your response.'
            : 'You are Bizora AI, a helpful assistant that can help with various tasks including research, project management, calendar scheduling, and analytics. Use markdown formatting to make your responses clear and visually appealing. Use headers (##), bullet points (-), **bold text**, *italics*, and code blocks when helpful. Be concise but comprehensive. If file content is provided, analyze it and incorporate the information into your response.'
        },
        {
          role: 'user',
          content: isResearch ? `Please conduct comprehensive research on: ${userMessage}` : userMessage
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || isResearch ? '1500' : '1000'),
      temperature: isResearch ? 0.3 : 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    console.log('OpenAI response:', response)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

