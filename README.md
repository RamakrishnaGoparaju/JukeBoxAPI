# JukeBoxAPI
1.Install the node modules first.
-- npm install express

2.Run the API 
--Goto the app.js file location and run it into commandpromt.
-- API prot will be run in the localhost:9001(This will be declared in the app.js file)

3.The following are API calls Links.

--To create/update music albums 

CREATE

curl --location --request PUT 'localhost:9001/musicAlbums' \
--header 'Content-Type: application/json' \
--data-raw '{*****JSON BODY***********}'

Example JSON 
{"albumName":"A1express",
"dateOfRelease" : "2021-02-15", 
"price": 100,
"description":"A1 juke box",
"musicianName" : "Thaman"}
dateOfRelease : (Date should format like this - 2021-02-15)
price should be integer

UPDATE

curl --location --request POST 'localhost:9001/musicAlbums/***place your _id ************' \
--header 'Content-Type: application/json' \
--data-raw '{******upadete json*********}'


--To Create / update Musicians

CREATE

curl --location --request PUT 'localhost:9001/musicians' \
--header 'Content-Type: application/json' \
--data-raw '{"musicianName":"musicianname",
"musicianType":"musiciantype"}'


UPDATE

curl --location --request POST 'localhost:9001/musicians/6056223d1e8ffb2a2ce0ec85' \
--header 'Content-Type: application/json' \
--data-raw '{"musicianName":"musicianname"}'

--API to retrieve the list of Music albums sorted by Date of release in ascending order

curl --location --request GET 'localhost:9001/musicAlbums'


--API to retrieve the list of Music albums for a specified musician sorted by Price in
ascending 

curl --location --request GET 'localhost:9001/musicAlbums/****Musicain Name******'


--API to retrieve the list of musicians for a specified music album sorted by musician's
Name in ascending order.

curl --location --request GET 'localhost:9001/musicians/musicAlbumname'