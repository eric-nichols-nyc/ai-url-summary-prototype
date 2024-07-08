"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import Markdown from "react-markdown";
import { scrapeAndSummarizeVideo } from "./api/summarize-video";


const Home = () => {
  const [copy, setCopy] = React.useState<string | undefined | null>(undefined);

  const onSubmit = async (data: FormData) => {
    const url = data.get("url") as string;
    if (!url) {console.log('url is required'); return};
    const result = await scrapeAndSummarizeVideo(url);
    console.log(result)
    setCopy(result);
  };

  return (
    <div className="flex flex-col gap-3">
      <form action={onSubmit} className="flex flex-col gap-3">
        <Input type="text" name="url" placeholder="enter url here..." />
        <Button type="submit">Submit</Button>
      </form>
      {copy && <Markdown>{copy}</Markdown>}
    </div>
  );
};

export default Home;
