import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = 'key=34871467-f144c0dca622e0cd08d0dd1ad';

export async function fetchPictures(request, pageNeed = 1) {
  const imageType = 'image_type=photo';
  const orientation = 'orientation=horizontal';
  const safeSearch = 'safesearch=true';
  const perPage = 'per_page=40';

  try {
    const response = await axios.get(
      `${BASE_URL}?${KEY}&q=${request}&${imageType}&${orientation}&${safeSearch}&${perPage}&page=${pageNeed}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

