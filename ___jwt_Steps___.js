/**
 * JWT: Secure your api
 * ----------------------------------
 *              CREATE TOKEN
 * ----------------------------------
 * 1. after user login send user basic info to create token 
 * 2. in the serve side: install npm i jsonwebtoken
 * 3. import jsonwebtoken 
 * 4. jwt.sing(payload , secret , {expires})
 * 5. return token to the client side
 * 
 * 6. after receiving the token store it either httponly cookies or localstorage (second best solution)
 * 
 * 7. use a general space onAuthSateChange > AuthProvider
 * 
 * -------------------------------------
 *           SEND TOKEN TO SERVER
 * -------------------------------------
 * 1. for sensitive api call ( ) send authorization headers
 * {authorization: 'Bearer token'}
 * 
 * ------------------------------------
 *             VERIFY TOKEN
 * -----------------------------------=
 * 1. Create a function called verifyJWT (middleware)
 * 2. this function will have three params: req, res, next
 * 3. first check whether the authorization headers exists 
 * 4. if not send 401
 * 5. get the token out of the authorization header
 * 6. call jwt.verify(token, secret, (err, decoded))
 * 7. set decoded to the req object so that we can retrieve it later 
 * 9. call the next() to to to the next function
 * 
 * 
 * -----------------------------------
 *  1. check wether token has the email that matches whit the request email  
 * 
 * 
 * 
*/