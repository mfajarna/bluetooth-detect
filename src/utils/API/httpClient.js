export const ENDPOINT = 'https://gateway.telkomuniversity.ac.id/issueauth';

/**
 * make a request to api without token
 * @param {string} url
 * @param {('post' | 'get')} method
 * @param {object=} payload
 * @returns object
 */
export const useRequestLogin = async (url, method, payload) => {
  const request = await fetch(url, {
    method,
    headers: {
      Authorization: 'Basic ',
      'Content-Type': 'multipart/form-data',
    },
    body: payload,
    
  })
    .then((res) => res.json())
    .then((responseJson) => responseJson)
    .catch((err) => {
      console.log('error', err);
    });

  return Promise.resolve(request);
};

/**
 * make a request to api without token
 * @param {string} url
 * @param {('post' | 'get')} method
 * @param {object=} payload
 * @returns object
 */
export const useRequest = async (url, method, payload) => {
  const request = await fetch(url, {
    method,
    headers: {
      Authorization: 'Basic ',
      'Content-Type': 'application/json',
      redirect: 'follow',
      'Accept-Encoding' : 'gzip, deflate, br'
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((responseJson) => responseJson)
    .catch((err) => {
      console.log('error', err);
    });

  return Promise.resolve(request);
};

/**
 * make a request to api with token
 * @param {string} url
 * @param {string} token
 * @param {('post' | 'get')} method
 * @param {object=} payload
 * @returns object
 */
export const useRequestWithToken = async (url, token, method, payload) => {
    const request = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((responseJson) => responseJson)
    .catch((err) => {
      console.log('error', err);
    });

    
    return Promise.resolve(request);
};
