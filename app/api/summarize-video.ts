// Install dependencies
// npm install axios
"use server"
import axios from 'axios';
import OpenAI from "openai";
import {test} from '../../test'
// Define your API keys
const SERPER_API_KEY = process.env.NEXT_PUBLIC_SERPER_API_KEY;
const TAVILY_API_KEY = process.env.NEXT_PUBLIC_TAVILY_API_KEY;
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function summarizeContent(content: string) {
 
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [ {role: "system", content: "Summarize" + content+"in one or two paragraphs, as markdown. add a section highlighting the main points and a section with up to four key words. Don't include any external links"}, {role: "user", content: content} ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

          console.log('response = ', response.choices[0].message.content);
        return response.choices[0].message.content;

    } catch (err) {
        console.log('err = ', err)
    }
}
// Function to search for a video using Serper API
async function searchVideo(query: string) {
    const response = await axios.get('https://google.serper.dev/videos', {
        headers: {
            'Authorization': `Bearer bee257e1c7454a06ddf62635193afd46f85ab000`
        },
        params: {
            q: query,
            type: 'video'
        }
    });

    const videoUrl = response.data.results[0].url;
    return videoUrl;
}

// Function to get video content using Tavily Search API
async function getVideoContent(videoUrl: string) {
    console.log('process.env.SERPER_API_KEY = ', process.env.SERPER_API_KEY)
    try {

        const response = await fetch('https://google.serper.dev/videos', {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.SERPER_API_KEY || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: videoUrl })
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        let searchResult = await response.json()
        return searchResult;
    } catch (err) {
        console.log('err = ', err);
    }
};

async function getVideoContentTavily(videoUrl: string) {
    const response = await axios.get('https://api.tavily.com/video', {
      headers: {
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      params: {
        url: videoUrl
      }
    });
  
    const videoContent = response.data.content;
    console.log('videoContent = ', videoContent)
    return videoContent;
  }

async function scrapeVideoContent(videoUrl: string) {
    var raw = JSON.stringify({
        "url": videoUrl
    });

    try {
        const response = await fetch('https://scrape.serper.dev', {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.SERPER_API_KEY || '',
                'Content-Type': 'application/json'
            },
            body: raw
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        let searchResult = await response.text()
        console.log('searchResult = ', searchResult)
        return searchResult;
    } catch (err) {
        console.log('err = ', err);
    }
}


// Function to summarize content using OpenAI
// async function summarizeContent(content: string) {
//     console.log('content = ', content)
//     try {
//         const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//             prompt: `Summarize the following content: ${content} in one or two paragraphs`,
//             max_tokens: 150
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${OPENAI_API_KEY}`
//             }
//         });

//         const summary = response.data.choices[0].text;
//         return summary;

//     } catch (err) {
//         console.log('err = ', err)
//     }
// }

// Main function to search and summarize a video
export async function searchAndSummarizeVideo(query: string) {
    try {
        //const videoUrl = await searchVideo(query);
        const videoContent = await getVideoContent(query);
        console.log(videoContent)
        const summary = await summarizeContent(videoContent);
        //return summary;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to search and summarize video');
    }
}

export async function scrapeAndSummarizeVideo(query: string) {
    try {
        const videoContent = JSON.stringify(test);
        let summary = undefined;
        if (videoContent) {
            summary = await summarizeContent(videoContent);
        }
        return summary;

        // return summary;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to scrape and summarize video');
    }
}

// Example usage
