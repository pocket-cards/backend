import { Request } from 'express';
import { D001Response, D001Request } from 'typings/api';
import Axios, { AxiosResponse } from 'axios';
import { VisionRequest, VisionResponse } from 'typings/types';
import { Commons } from '@src/utils';

let visionUrl: string | undefined;
let visionApiKey: string | undefined;

export default async (req: Request<any, any, D001Request, any>): Promise<D001Response> => {
  const input = req.body;

  // check api key
  if (!visionApiKey || !visionUrl) {
    visionUrl = await Commons.getSSMValue(process.env.VISION_URL as string);
    visionApiKey = await Commons.getSSMValue(process.env.VISION_API_KEY as string);
  }

  // get image words
  const res = await Axios.post<VisionRequest, AxiosResponse<VisionResponse>>(`${visionUrl}/image2words?key=${visionApiKey}`, {
    content: input.content,
    language: input.language,
  });

  return {
    count: res.data.length,
    words: res.data,
  };
};
