# OCR Scanner

I used the web-component on the microblink package library to handle uploads and get a response. I wrapped it with a React component and tied props to data types and event handlers. So you just upload the data and get the results.

For parsing the response, I have written a util called mrz, and within that I added my parsers, validators and other helper functions. Even though the task asked for 4 form fields, I am parsing and displaying almost everything in the fields. 

What I did basically is, I separated the raw MRZ string into lines. Later inside specific line parser methods, I run a simple extraction method (extractParts), which will further separate data blocks into arrays and get rid of machine placeholder char (<). After separating it, I get meaningful data with indices, ranges etc. Lines also check for specific rules that can be present in that specific line and validate check digits.

Speaking of check digit validation, it is very straightforward, following the rules from the provided link for the task.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
