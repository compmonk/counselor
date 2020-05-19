# Counselor

### Project Description

#### What is Counselor ?
We are building a platform similar to [Chegg](https://www.chegg.com/) or [Course Hero](https://www.coursehero.com/) using [Stellar Network](https://www.stellar.org/) which is a network API built on block chain which can perform real time monetary transactions and wallet services. The main idea is to learn and get rewards for the assignments and labs we solve for our courses. A User (Student) for this platform can integrate his the LMS his school uses and this platform would know what are the upcoming assignments and/or labs that are due. This platform would recommend Article (resources) to the User for each assignment/lab which would help him solve the assignment/lab. However to read the article the User has to unlock the Article by paying some tokens. These tokens are the native currency of this platform. These tokens would be transferred to the publisher of the Article after some fees deducted which would be given to the platform. A User can gain tokens by publishing Articles on the platform. Whenever a User submits an assignment/lab and its graded by the school via the LMS the platform would reward tokens to the User according to the grades. This way a User would be encouraged to learn and correctly submit his/her assignments/lab on time.

#### Why Counselor ?
- Since this platform uses Stellar which internally uses blockchain all the transactions would be public and there wouldn't be any discrepancy regarding any User's tokens
- The grades would be reported from the LMS and thus no User can manipulate his rewards.
- The grades would be used to score the Article the User has used for that particular lab/assignment which would help the platform to recommend it to other user.
- There is no third party involved and hence this platform would never be biased towards any User or any particular Article that promotes a specific technology like currently present platform.
- This platform would run on its own and thus would never need funding from a third party
- This platform gets the grades from LMS and scores the Articles based on those grades and thus won't need to pay to graders to grade the Articles, thus reducing the cost of the Platform.
- Stellar supports Asset Exchange which can help buy tokens by exchanging any currency from anywhere in the world, thus this platform can be used by anybody and is not specific to a particular geographical or economic segment.
- A high school kid can use this platform and learn and get rewarded just by completing his assignments and doesn't need to spend any money and similarly a researcher who just needs to learn and doesn't have time to publish articles can buy tokens using his native currency, thus this platform is open to a wide range of Users.
- The recommendation would be done based on the scores reported from the LMS and thus the recommendation would be data driven and thus accurate.

#### What features does Counselor has ?
- The User can integrate your LMS. Currently we are targetting [Canvas](https://canvas.instructure.com/doc/api/)
- The User can Buy tokens using some other currency the User has.
- The User can publish Articles.
- The User can unlock and read Articles.
- The platform would recommend Articles based on the User's upcoming labs/assignments.

##### Notes:
- The tokens used by this platform would be [Stellar Lumens (XLM)](https://www.stellar.org/lumens) which is the cryptocurrency used by the Stellar network.
- Whenever A User signs up the platform would create a wallet for him and credit him some amount of tokens.
- The reward for Publishing an Article and the cost of an Article would be fixed.
- The reward gained after an assignment/lab is graded would depend on the grades.
- The Article - assignment/lab matching and recommendation would be based on keywords which could be platform generated or reported by the User when publishing the Article.


### [React JS](https://reactjs.org/):
React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.

We will use React to create the signle page application as the primary user interface to access the platform.

### [Redis](https://redislabs.com/):
Redis is an in-memory data structure project implementing a distributed, in-memory key-value database with optional durability. Redis supports different kinds of abstract data structures, such as strings, lists, maps, sets, sorted sets, HyperLogLogs, bitmaps, streams, and spatial indexes.

We would use Redis to cache frequently used data to enhance user experience and speed of accessing the platform.

### [Firebase Authentication](https://firebase.google.com/products/auth):
Firebase Authentication is a framework that allows authentication via email/password credentials or other identity providers.

We will use Google's Firebase Authentication to signup and authenitcate user with email and password for the Platform.

### [Stellar Network](https://www.stellar.org/)
Stellar is an open-source network for currencies and payments. Stellar makes it possible to create, send and trade digital representations of all forms of money—dollars, pesos, bitcoin, pretty much anything. It’s designed so all the world’s financial systems can work together on a single network.
Stellar has no owner; if anything it’s owned by the public. The software runs across a decentralized, open network and handles millions of transactions each day. Like Bitcoin and Ethereum, Stellar relies on blockchain to keep the network in sync, but the end-user experience is more like cash—Stellar is much faster, cheaper, and more energy-efficient than typical blockchain-based systems.

We would use Stellar for Asset Exchange and payments and wallet service for the User

### [Canvas API](https://canvas.instructure.com/doc/api/)
The Canvas Learning Management Platform allows schools to build the digital learning environment that meets the unique challenges faced by their institution. Canvas simplifies teaching, elevates learning, and eliminates the headaches of supporting and growing traditional learning technologies.
Canvas is made up of a powerful set of highly integrated learning products that allow institutions to get all of the functionality they need and none that they don’t. Canvas LMS includes a REST API for accessing and modifying data externally from the main application.

We would use Canvas API to integrate the platform with the Users courses to make it a better user experience by automatically recommending resources for his assignments/labs.


## Steps to Run

### Build

`npm run build`

### Run

`npm run start`

### Run Server only

`npm run server`