import { searchAndSummarizeVideo, scrapeAndSummarizeVideo } from "./api/summarize-video";
import Home from './home';

export default async function Index() {
  // const query = 'https://www.youtube.com/watch?v=8bhp89AIsnc';
  // const summary = await scrapeAndSummarizeVideo(query);
  // console.log(summary);

  const getSummary = async (url:string) => {
    console.log('I was called')
    const summary = await scrapeAndSummarizeVideo(url);
    return summary
  }
  return(
    <div className="p-10"><Home /></div>
  )
}
 