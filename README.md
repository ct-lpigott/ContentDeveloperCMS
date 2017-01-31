# ContentDeveloperCMS

## API
### Create
#### Structure
Send a request using the "POST" HTTP method to SITE_URL/feeds/1/books/ to create a new structure for a books array
Include the required structure in a "structure" property on the request body
Must be a valid logged in user
#### Content
Send a request using the "POST" HTTP method to SITE_URL/feeds/1/books/ create a new book
Include the required content in a "content" property on the request body
Must be a valid logged in user

### Read
#### Structure
Send a request using the "GET" HTTP method to SITE_URL/feeds/1/books/ to view the structure and content of the books array
Must be a valid logged in user
#### Content
Send a request using the "GET" HTTP method to SITE_URL/feeds/1/books/ to view the content of the books array
No login required

### Update
#### Content ONLY
Send a request using the "PUT" HTTP method to SITE_URL/feeds/1/books/0/title to update the title of the first book in the books array
Include the required content in a "content" property on the request body
Must be a valid logged in user

### Delete
#### Content ONLY
Send a request using the "DELETE" HTTP method to SITE_URL/feeds/1/books/0 to delete the first book from the books array
Must be a valid logged in user