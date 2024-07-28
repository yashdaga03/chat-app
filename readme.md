
# Chat Application

Chat Application which supports Groups and Private Messages (built using websockets), the messages are end to end encrypted, supports user authentication & password hashing, file upload, cluster module for scaling and winston loggers. Currently logs and files are stored in resources folder but ideally it should be in AWS S3. This application is containerized using Docker.

Features -
- 
- #### User and Common Features -
- ---
- Cluster module for vertical scaling.
- User Registration with sending Email consisting of create, update and get user (communication-service is present in proProjects repository).
- Passwords are hashed and stored in database.
- Production level addition of winston for logging in resources/logs (In prod, these logs will be stored in S3 or will be shared with some monitoring services).  
- The application is containerized using docker. Both Dockerfile and docker-compose are available for now.
- #### Chat Features -
-  ----
- Messages are end to end encrypted and encrypted text is stored in database.
- Users can send messages to another user privately and other user can instantly receive the message.
- As we are using web sockets, user need not reload to get the message, user will receive the message without any reloading.
- User can also share message to a group user is part of. Every member of the group will instantly receive the message, except the sender.
- User can also upload files using HTTP requests and get mediaUrl (ideally stored in S3, but currently in resources folder) in response, and use that URL while texting either in private messages or in group chats.

Installation -
- 
- Installation of chat-BE is fairly straight forward, you can either use docker or locally set it up:
	- docker compose up (or)
	- run npm install
	- run nodemon server.js
	- run npm test (test)
- Installation of communication-service is also straight forward, there is no docker file added here, just run:
	- npm install
	- npm run dev
- .gitignore file is added there due to which .env file is not visible, you'll have to add .env file and for communication-service, just add SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

- PORT number of service: communication(4000)
- PORT number of service: chat-BE(3000)
