# FreeBirds
Microblogging website for anyone to use. It is an semi-anonymous website for people to make posts, likes, comments and make friends on FreeBird with other users. It is free-for-all to share their opinions on topics and have others to agree with them by "Liking" and/or discuss more about the post's details.

## <em>Live</em> 
[FreeBirds](https://freebirds.netlify.app/)

# Setting up
## Frontend
Open up your command prompt and direct into the 📁client folder and type the following:

#### <i>To install packages locally (or 1st time opening the application locally):</i>
``` npm install ```

#### To launch the Frontend locally
``` npm start ```

## Backend
Setting up backend requires a file called "config.js" in the root folder. 
<br />
Follow the code layout shown below:
```
module.exports = {
  MONGODB: MONGODB_CONNECTION_STRING_URI
  SECRET_KEY: CREATE_YOUR_OWN_SECRET_KEY
} 
```

Once the file is created, install the packages locally (especially if you are setting it up the 1st time)
Similarly to the frontend set up, open up your command prompt and direct into the root folder of the project and follow the instructions below:
#### <i>To install packages locally (or 1st time opening the application locally):</i>
``` npm install ```

#### To launch the Backend locally
``` npm run start ```

# Coming Updates
* Profile View (user's can click on each others profiles and maybe "follow" them)
* Profile Edits (users can upload information about themselves: email, website, "about me", etc.) 
* Reward/Ranking system (More posts/age of the account then user can up rank/get rewarded)
* Email integration (forgot password, confirm account) 
* Edit posts (users can delete their post, but not edit them. Add an "edit" feature.) 
* File uploads (allow users to upload images, maybe videos, etc.)
