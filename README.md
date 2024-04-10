# Docker Swarm Project

### Goal of the project

The goal of this project is to create a complete project and prepare to deploy it using Docker containers and Swarm to maintain it and make it scalable.

 

### What is this project is about

This project is chosen intentionally to be simple for demonstration purposes and to not over complicate things and focus on the core functionality of the Docker and Swarm implementation.

This project is an **Node.js/Express** app connected to **MySQL** database, and a **React** app fetching data from the Express server.

- **Project file tree:**
    
    https://github.com/jacerchetoui56/docker-swarm
    
    ```
    |
    |____ server
    				|__ server.js
    				|__ Dockerfile
    				|__ .dockerignore
    				|__ ...Other files
    				
    |____ frontend
    				|__ Dockerfile
    				|__ .dockerignore
    				|__ ...other files
    				
    |____ my-app-services.yml
    ```
    

### How we Implemented Docker

This section is divided to three parts:

1. **Dockerizing the Node.js/Express app**
    
    *Dockerfile:*
    
    ```docker
    FROM node:17-alpine
    
    RUN npm install -g nodemon 
    
    WORKDIR /app
    
    COPY package*.json .
    
    RUN npm install 
    
    COPY . .
    
    CMD ["npm","run", "dev"]
    
    EXPOSE 3000
    ```
    
    Then, to create the **Docker image**, in the terminal, the “server” as current directory:
    
    ```bash
    docker build -t myserver . 
    ```
    
2. **Dockerizing the Frontend app:**
    
    *Dockerfile:*
    
    ```docker
    FROM node:18-alpine
    
    WORKDIR /app
    
    COPY package.json .
    
    RUN npm install
    
    COPY . .
    
    RUN npm run build
    
    EXPOSE 4173
    
    CMD [ "npm", "run", "preview" ]
    ```
    
    Then, creating the Docker image of the frontend
    
    ```bash
    docker build -t frontend . 
    ```
    
3. **Pulling MySQL image from docker-hub**
    
    ```bash
    docker pull mysql
    ```
    
    Before proceeding, **we need to create the “*myblog*” database** inside the MySQL container:
    
    ```bash
    # in the terminal, we log to the container exec
    docker exec -it <mysql_container_id> bash
    
    # connect using credentials
    mysql -u root -p # hit enter and provide the password
    
    # create the database using sql
    CREATE DATABASE myblog;
    
    # exit
    exit
    ```
    
    ✅ **Note: Thank to Volumes, even when container restarts, the data created is still there because we mapped it to our local storage.**
    

---

### Integrating Swarm

To integrate swarm we need one place to identify the properties of our system, what are the services, how many containers for each, and any additional configuration.

So, to integrate swarm:

1. **We created a “*my-app-services.yml*” file with the following configuration:**
    
    ```yaml
    version: "3.8"
    services:
      server: # name of the container
        image: myserver # using the docker image "myserver"
        ports:
          - "5000:3000" # mapping the local port 5000 to container 3000
        volumes:
          - ./server:/app # linking local files and the container for development purposes
          - /app/node_modules
        environment: # defining env variables
          PORT: 3000
          DB_HOST: db
          DB_PASSWORD: password
        deploy:
          replicas: 3 # defining how many containers we want to launch for this service
      frontend:
        image: frontend
        ports:
          - "4173:4173"
        deploy:
          replicas: 2
      db:
        image: mysql
        ports:
          - "3306:3306" # make sure to stop your local mysql server
        environment:
          MYSQL_ROOT_PASSWORD: password
        volumes: # volumes are used to store the data we don't want to lose when container restarts
          - mysql_data:/var/lib/mysql
    
    volumes:
      mysql_data:
        driver: local
    
    ```
    
2. **Launch the services all in once:**
    
    ```bash
    docker deploy stack -c my-app-services.yml my-app
    ```
    
    → The stack name is “*my-app*” and it contains all the services mentioned in the Yaml file.
    
3. **Observe the working services instances (via Docker Desktop, or):**
    
    ```bash
    docker stats
    ```
    
4. **To stop all the stack at once:**
    
    ```bash
    docker stack rm my-app
    ```
    

**5. Experimenting with it**

To test the Swarm capabilities:

- we can hit the frontend at the *http://localhost:4173* and observe the stats, we will notice that the frontend containers all raise in memory/CPU usage.
    
    ⇒ that is thanks to **Swarm load balancing.**
    
- If we inject some intentional errors in the backend like follow:
    
    ```jsx
    app.get("/", async (req, res) => {
    
    	// ****** THROWING AN ERROR RANDOMLY *******
      if (Math.random() > 0.5) {
        throw new Error("Something went wrong");
      }
      
      const data = await Blog.findAll();
      res.json(data);
    });
    ```
    
    ⇒ We will notice that if one server crashes, Swarm will instantly redirect the traffic to the other replicas, and restarts the crashed container. That’s called **auto container recovery.**# docker-swarm
