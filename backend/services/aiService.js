import axios from "axios";

export const analyzeReport = async (imgURL) => {
  const HF_API = process.env.HF_API_URL;

  const response = await axios.post(HF_API, {
    image_url: imgURL
  });

  return response.data;
};
