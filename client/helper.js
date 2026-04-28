const handleError = (message) => { //change this to handle errors in our own way
  console.log(message); //temporary! we'll handle it later
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }

  if(handler){
    handler(result);
  }
};

//to begin a game, i need each user to create a Player for themselves, using the account they're signed into
//meaning i need a current account looker, i can GET to account for that
//updated it to get any account (for enemies)
async function getAccount(accountId = ''){
  let url = '/account'
  if(accountId)
    {
      url += `?accountId=${accountId}`
    }
    const response = await fetch(url);
    const data = await response.json();
    if(!data) {
        handleError('Error retrieving account');
        return false;
    }
    return data;
}


module.exports = {
    handleError, 
    sendPost,
    getAccount,
}