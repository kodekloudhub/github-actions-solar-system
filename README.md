# Solar System NodeJS Application
## Using cache
- First time running cache :
![first-cache](ReadmeImages/first-cache.png)

- Cache craeted : 
![cache-created](ReadmeImages/cache-created.png)

- Cache found successfully :
![cache-ok](ReadmeImages/cache-ok.png)

### GHCR 
- GITHUB_TOKEN is automatically generated in the secrets (no need to manually put it) => secrets.GITHUB_TOKEN
- When creating a package on ghcr using docker further permissions can be demanded ``` permissions: packages: write ```

### Some best practices (Alice saw that the data base was more adn more sluggish)
- Database more sluggish beceause we are suing the production database with github actions and tests
- We do not use productiondatabase for testing or code coverage puposes.
=> **Solution :** Service Containers (ithub actions container to mock the database)

### About service containers
You can use service containers to connect databases, web services, memory caches, and other tools to your workflow.